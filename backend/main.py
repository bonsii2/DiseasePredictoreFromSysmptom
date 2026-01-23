from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 
from pydantic import BaseModel
import joblib
import numpy as np

# Load trained components
model = joblib.load("model.pkl")
mlb = joblib.load("mlb.pkl")
le_disease = joblib.load("le_desease.pkl")
le_gender = joblib.load("le_gender.pkl")

app = FastAPI(title="EMP Disease Detection API")

# allow requests from your frontend
app.add_middleware(
    CORSMiddleware,
    # Later you can restrict this to ["http://localhost:3000"]
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Input schema


class PatientInput(BaseModel):
    age: int
    gender: str
    symptoms: list[str]


# Example diagnosis tools mapping
diagnosis_tools = {
    "Malaria": ["Blood test", "Microscopy"],
    "Flu": ["Rapid influenza test", "Clinical examination"],
    "Heart Disease": ["ECG", "Echocardiogram", "Blood test"],
    "Diabetes": ["Blood sugar test", "HbA1c"],
    "Pneumonia": ["Chest X-ray", "Blood test"],
    "Stroke": ["CT Scan", "MRI"],
    "Allergy": ["Skin test", "Blood test"],
    "Kidney Disease": ["Urine test", "Ultrasound", "Blood test"],
    "Thyroid Disorder": ["TSH blood test", "Ultrasound"],
    "Tuberculosis": ["Sputum test", "Chest X-ray"]
}


@app.get("/")
def home():
    return {"message": "EMP Disease Detection API is running"}


@app.post("/predict")
def predict(data: PatientInput):
    # Encode gender
    gender_encoded = le_gender.transform([data.gender])[0]

    # Encode symptoms
    symptoms_encoded = mlb.transform([data.symptoms])

    # Build final feature vector
    symptom_count = len(data.symptoms)
    X_other = np.array([[data.age, gender_encoded, symptom_count]])
    X = np.hstack([X_other, symptoms_encoded])

    # Prediction
    pred = model.predict(X)
    disease = le_disease.inverse_transform(pred)[0]

    # Diagnosis tools
    tools = diagnosis_tools.get(disease, ["Consult doctor"])

    return {
        "predicted_disease": disease,
        "diagnosis_tools": tools
    }
