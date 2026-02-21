from flask import current_app, g
from pymongo import MongoClient


def get_db():
    if "db" not in g:
        client = MongoClient(current_app.config["MONGO_URI"])
        g.mongo_client = client
        g.db = client.get_default_database()
    return g.db
