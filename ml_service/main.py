"""
AuraWell Machine Learning Microservice
Production FastAPI application for Student Wellness Risk Prediction
"""

import time
import logging
from typing import Dict, Any, List
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

from src.predict import predictor

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] AuraWell-ML: %(message)s"
)
logger = logging.getLogger("aurawell-ml")

app = FastAPI(
    title="AuraWell ML Prediction Service",
    version="1.0.0",
    description="Microservice providing machine learning wellness risk classification for AuraWell platform."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class WellnessFeatures(BaseModel):
    Academic_Pressure: float = Field(..., ge=1, le=10, description="Academic pressure rating (1-10)")
    Study_Workload: float = Field(..., ge=1, le=10, description="Study workload rating (1-10)")
    Stress_Level: float = Field(..., ge=1, le=10, description="Stress level rating (1-10)")
    Sleep_Quality_Hours: float = Field(..., ge=0, le=24, description="Sleep duration / quality hours (1-10)")
    Anxiety_Score: float = Field(..., ge=0, le=100, description="Anxiety metric (0-100)")
    Depression_Indicator: float = Field(..., ge=0, le=1, description="Binary depression indicator (0 or 1)")
    Social_Connectedness: float = Field(..., ge=1, le=10, description="Social connectedness rating (1-10)")
    Physical_Activity_Hrs: float = Field(..., ge=0, le=50, description="Physical activity hours per week")
    Previous_Counseling: float = Field(..., ge=0, le=1, description="Previous counseling experience (0 or 1)")
    Wellness_Score: float = Field(..., ge=0, le=100, description="Overall wellness score (0-100)")

class PredictRequest(BaseModel):
    studentId: str = Field(default="anonymous", description="Student ID reference")
    assessmentId: str = Field(default="temp", description="Assessment response ID reference")
    features: WellnessFeatures

class ContributingFactor(BaseModel):
    feature: str
    label: str
    value: float
    impactScore: float
    isElevatedRisk: bool

class PredictResponse(BaseModel):
    prediction: str
    probability: float
    classProbabilities: Dict[str, float]
    modelVersion: str
    contributingFactors: List[ContributingFactor]
    screeningDisclaimer: str

@app.get("/health")
def health_check():
    """
    Model Health Check endpoint for Spring Boot backend and monitoring.
    """
    if predictor.is_loaded:
        return {
            "status": "UP",
            "modelLoaded": True,
            "modelVersion": f"v{predictor.version}",
            "features": predictor.feature_names,
            "classes": predictor.classes
        }
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={"status": "DOWN", "modelLoaded": False, "error": "ML pipeline not loaded"}
    )

@app.post("/predict", response_model=PredictResponse)
def predict_wellness_risk(request: PredictRequest):
    """
    ML Prediction endpoint. Accepts structured assessment features and
    returns ML-predicted risk category, confidence probability, class breakdown,
    and explainability factors.
    """
    start_time = time.time()
    if not predictor.is_loaded:
        logger.error("Prediction request rejected: ML model pipeline is not loaded.")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Machine Learning model is currently unavailable."
        )
        
    try:
        raw_features = request.features.model_dump()
        result = predictor.predict(raw_features)
        
        duration_ms = round((time.time() - start_time) * 1000, 2)
        logger.info(
            f"Prediction completed in {duration_ms}ms | Student: {request.studentId} | "
            f"Result: {result['prediction']} (Conf: {result['probability']*100:.1f}%) | "
            f"Model: {result['modelVersion']}"
        )
        return result
    except ValueError as ve:
        logger.warning(f"Validation error in prediction request: {ve}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        logger.error(f"Internal prediction error: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while evaluating machine learning prediction."
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
