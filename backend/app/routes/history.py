from flask import Blueprint
from flask_jwt_extended import get_jwt_identity, jwt_required

from ..utils.db import get_db

history_bp = Blueprint("history", __name__)


@history_bp.get("/history")
@jwt_required()
def history():
    user_id = get_jwt_identity()
    db = get_db()

    rows = list(
        db.predictions.find({"userId": user_id}, {"_id": 0}).sort("timestamp", -1).limit(50)
    )

    total = len(rows)
    fake_count = sum(1 for row in rows if row["result"] == "Fake")
    real_count = total - fake_count

    return {
        "history": rows,
        "stats": {
            "total": total,
            "fake": fake_count,
            "real": real_count,
            "fakeRate": round((fake_count / total) * 100, 2) if total else 0,
        },
    }, 200
