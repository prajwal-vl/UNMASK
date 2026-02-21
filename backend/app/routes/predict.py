from datetime import datetime

from flask import Blueprint, current_app, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from ..services.model_service import load_model, predict_image, predict_video
from ..utils.db import get_db

predict_bp = Blueprint("predict", __name__)


@predict_bp.post("/predict")
@jwt_required()
def predict():
    if "file" not in request.files:
        return {"error": "No file uploaded"}, 400

    uploaded_file = request.files["file"]
    file_name = uploaded_file.filename or "unknown"
    extension = file_name.rsplit(".", 1)[-1].lower() if "." in file_name else ""

    is_image = extension in {"png", "jpg", "jpeg", "webp"}
    is_video = extension in {"mp4", "mov", "avi", "mkv", "webm"}

    if not (is_image or is_video):
        return {"error": "Unsupported file type"}, 400

    model = load_model(current_app.config["MODEL_WEIGHTS_PATH"], current_app.config["MODEL_WEIGHTS_URL"])

    try:
        if is_image:
            label, confidence, probability = predict_image(uploaded_file, model)
            file_type = "image"
        else:
            label, confidence, probability = predict_video(uploaded_file, model)
            file_type = "video"
    except Exception as exc:
        return {"error": f"Inference failed: {exc}"}, 500

    prediction = {
        "userId": get_jwt_identity(),
        "fileType": file_type,
        "fileName": file_name,
        "result": label,
        "confidence": round(confidence, 4),
        "probabilityFake": round(probability, 4),
        "timestamp": datetime.utcnow(),
    }

    db = get_db()
    db.predictions.insert_one(prediction)

    return {
        "result": label,
        "confidence": round(confidence, 4),
        "probabilityFake": round(probability, 4),
    }, 200
