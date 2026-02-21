import os
import tempfile
from functools import lru_cache
from urllib.request import urlretrieve

import cv2
import numpy as np
import torch
from PIL import Image
from torchvision import models, transforms


class DeepfakeEfficientNet(torch.nn.Module):
    def __init__(self):
        super().__init__()
        self.backbone = models.efficientnet_b0(weights=models.EfficientNet_B0_Weights.DEFAULT)
        in_features = self.backbone.classifier[1].in_features
        self.backbone.classifier[1] = torch.nn.Linear(in_features, 1)

    def forward(self, x):
        return self.backbone(x)


@lru_cache(maxsize=1)
def load_model(weights_path: str, weights_url: str | None):
    model = DeepfakeEfficientNet()
    if not os.path.exists(weights_path) and weights_url:
        os.makedirs(os.path.dirname(weights_path), exist_ok=True)
        urlretrieve(weights_url, weights_path)

    if os.path.exists(weights_path):
        state_dict = torch.load(weights_path, map_location="cpu")
        if isinstance(state_dict, dict) and "state_dict" in state_dict:
            state_dict = {k.replace("module.", ""): v for k, v in state_dict["state_dict"].items()}
        model.load_state_dict(state_dict, strict=False)

    model.eval()
    return model


def _transform_pipeline():
    return transforms.Compose(
        [
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ]
    )


def predict_image(file_storage, model, threshold=0.5):
    image = Image.open(file_storage.stream).convert("RGB")
    tensor = _transform_pipeline()(image).unsqueeze(0)
    with torch.no_grad():
        logits = model(tensor)
        prob_fake = torch.sigmoid(logits).item()
    label = "Fake" if prob_fake >= threshold else "Real"
    confidence = prob_fake if label == "Fake" else 1 - prob_fake
    return label, float(confidence), float(prob_fake)


def predict_video(file_storage, model, threshold=0.5, max_frames=16):
    with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as tmp:
        temp_path = tmp.name
    file_storage.save(temp_path)

    capture = cv2.VideoCapture(temp_path)
    frame_count = int(capture.get(cv2.CAP_PROP_FRAME_COUNT))
    step = max(1, frame_count // max_frames)

    probs = []
    frame_idx = 0
    transform = _transform_pipeline()

    while capture.isOpened() and len(probs) < max_frames:
        ret, frame = capture.read()
        if not ret:
            break
        if frame_idx % step == 0:
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            pil_frame = Image.fromarray(rgb)
            tensor = transform(pil_frame).unsqueeze(0)
            with torch.no_grad():
                logits = model(tensor)
                probs.append(torch.sigmoid(logits).item())
        frame_idx += 1

    capture.release()

    if os.path.exists(temp_path):
        os.remove(temp_path)

    if not probs:
        raise ValueError("Unable to extract frames from video.")

    prob_fake = float(np.mean(probs))
    label = "Fake" if prob_fake >= threshold else "Real"
    confidence = prob_fake if label == "Fake" else 1 - prob_fake
    return label, float(confidence), prob_fake
