# DeepGuard AI

DeepGuard AI is a full-stack deepfake detection web app built with React + Tailwind, Flask, MongoDB Atlas, and PyTorch EfficientNet.

## Folder structure

```text
UNMASK/
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   │   ├── auth.py
│   │   │   ├── history.py
│   │   │   └── predict.py
│   │   ├── services/model_service.py
│   │   ├── utils/
│   │   │   ├── db.py
│   │   │   └── security.py
│   │   ├── __init__.py
│   │   └── config.py
│   ├── models/
│   ├── .env.example
│   ├── requirements.txt
│   └── run.py
├── frontend/
│   ├── src/
│   │   ├── api/client.js
│   │   ├── components/
│   │   ├── context/AuthContext.jsx
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
└── README.md
```

## Backend setup

1. `cd backend`
2. `python -m venv .venv && source .venv/bin/activate`
3. `pip install -r requirements.txt`
4. `cp .env.example .env` and fill MongoDB Atlas + JWT secret.
5. `python run.py`

Backend API:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/predict` (JWT protected)
- `GET /api/history` (JWT protected)

## Frontend setup

1. `cd frontend`
2. `npm install`
3. `cp .env.example .env`
4. `npm run dev`

## Production deployment

### Backend (Render)
- Build command: `pip install -r requirements.txt`
- Start command: `gunicorn run:app`
- Set environment variables from `backend/.env.example`

### Frontend (Vercel)
- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Set `VITE_API_URL` to Render API URL (`https://your-api.onrender.com/api`)

## Notes on ML model

- The backend loads EfficientNet-B0 and attempts to download deepfake weights from `MODEL_WEIGHTS_URL` into `MODEL_WEIGHTS_PATH`.
- Replace the URL/path with your own validated deepfake checkpoint for best production accuracy.
