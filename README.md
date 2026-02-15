🩺 Disease Prediction from Symptoms

A Machine Learning model that predicts possible diseases based on user-provided symptoms. This project demonstrates end-to-end ML development — from data preprocessing to model deployment via API.

⚠️ For educational purposes only. Not a substitute for professional medical advice.

🚀 Features

Predict disease from multiple symptoms

Trained ML classification model

REST API support (FastAPI/Flask)

Easy integration with web or mobile apps

🧠 Tech Stack

Python

Scikit-learn

Pandas & NumPy

FastAPI / Flask

Joblib / Pickle

📂 Project Structure
disease-prediction/
│
├── dataset/
├── model/
├── train_model.py
├── main.py
├── requirements.txt
└── README.md

▶️ How to Run
git clone https://github.com/your-username/disease-prediction.git
cd disease-prediction
pip install -r requirements.txt
python train_model.py
uvicorn main:app --reload

📡 API Example

POST /predict

{
  "fever": 1,
  "cough": 1,
  "fatigue": 1
}


Response

{
  "predicted_disease": "Flu"
}

📊 Model

Classification algorithms (Random Forest / Decision Tree / etc.)

Evaluated using Accuracy, Precision, Recall, F1-score

👨‍💻 Author

Machine Learning Healthcare Project 🚀
