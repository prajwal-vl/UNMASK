from flask import Flask, g
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from .config import Config

jwt = JWTManager()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, resources={r"/api/*": {"origins": app.config["FRONTEND_ORIGIN"]}})
    jwt.init_app(app)

    from .routes.auth import auth_bp
    from .routes.predict import predict_bp
    from .routes.history import history_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(predict_bp, url_prefix="/api")
    app.register_blueprint(history_bp, url_prefix="/api")

    @app.teardown_appcontext
    def teardown_db(exception):
        _ = exception
        client = g.pop("mongo_client", None)
        if client:
            client.close()

    @app.get("/api/health")
    def health():
        return {"status": "ok", "service": "DeepGuard AI"}, 200

    return app
