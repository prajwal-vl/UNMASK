import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    MONGO_URI = os.getenv("MONGO_URI")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "change-me")
    MODEL_WEIGHTS_URL = os.getenv("MODEL_WEIGHTS_URL")
    MODEL_WEIGHTS_PATH = os.getenv("MODEL_WEIGHTS_PATH", "./models/efficientnet_b0_deepfake.pt")
    FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
