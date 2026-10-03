"""
AuraWell ML Prediction Service Engine
Loads the unified trained pipeline, executes inference, and generates explainable output.
"""

import os
import json
import joblib
import pandas as pd
from typing import Dict, Any
from .explain import compute_contributing_factors

class WellnessRiskPredictor:
    def __init__(self, model_dir: str = None):
        if model_dir is None:
            model_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'models')
            
        self.model_dir = model_dir
        self.pipeline_path = os.path.join(model_dir, 'wellness_risk_pipeline.joblib')
        self.metadata_path = os.path.join(model_dir, 'model_metadata.json')
        
        self.pipeline = None
        self.metadata = {}
        self.is_loaded = False
        self.version = "1.0"
        self.feature_names = []
        self.classes = []
        self.feature_importances = {}
        
        self.load_model()
        
    def load_model(self):
        try:
            if not os.path.exists(self.pipeline_path):
                raise FileNotFoundError(f"Pipeline file not found at {self.pipeline_path}")
                
            self.pipeline = joblib.load(self.pipeline_path)
            
            if os.path.exists(self.metadata_path):
                with open(self.metadata_path, 'r') as f:
                    self.metadata = json.load(f)
                    self.version = self.metadata.get('version', '1.0')
                    self.feature_names = self.metadata.get('features', [])
                    self.classes = self.metadata.get('classes', [])
                    self.feature_importances = self.metadata.get('featureImportances', {})
            else:
                self.classes = list(getattr(self.pipeline, 'classes_', []))
                
            self.is_loaded = True
            print(f"[OK] WellnessRiskPredictor loaded successfully (v{self.version}). Classes: {self.classes}")
        except Exception as e:
            self.is_loaded = False
            print(f"[ERROR] Failed to load wellness risk model: {e}")
            raise e

    def predict(self, raw_features: Dict[str, Any]) -> Dict[str, Any]:
        """
        Executes ML prediction on the input feature dictionary.
        Does NOT rely on any CSV file.
        """
        if not self.is_loaded or self.pipeline is None:
            raise RuntimeError("ML model is not loaded or unavailable.")
            
        # Ensure feature order matches trained model
        input_data = {}
        for feat in self.feature_names:
            if feat not in raw_features:
                raise ValueError(f"Missing required feature: {feat}")
            try:
                input_data[feat] = [float(raw_features[feat])]
            except (ValueError, TypeError):
                raise ValueError(f"Feature '{feat}' must be a valid numeric value.")
                
        df_input = pd.DataFrame(input_data)
        
        # ML Inference
        prediction = self.pipeline.predict(df_input)[0]
        
        # Probability estimates
        probability = 1.0
        class_probabilities = {}
        
        if hasattr(self.pipeline, "predict_proba"):
            probs = self.pipeline.predict_proba(df_input)[0]
            pipeline_classes = list(self.pipeline.classes_)
            for cls_name, prob in zip(pipeline_classes, probs):
                class_probabilities[str(cls_name)] = round(float(prob), 4)
            if prediction in class_probabilities:
                probability = class_probabilities[prediction]
            else:
                probability = round(float(max(probs)), 4)
        else:
            class_probabilities[prediction] = 1.0
            
        # Feature attribution explainability
        feature_dict = {f: float(raw_features[f]) for f in self.feature_names}
        contributing_factors = compute_contributing_factors(feature_dict, self.feature_importances)
        
        return {
            "prediction": str(prediction),
            "probability": round(float(probability), 4),
            "classProbabilities": class_probabilities,
            "modelVersion": f"v{self.version}",
            "contributingFactors": contributing_factors,
            "screeningDisclaimer": "Screening Disclaimer: This evaluation is generated exclusively by the AuraWell ML screening model for academic wellness support. It does not constitute a clinical or psychiatric diagnosis."
        }

# Global singleton predictor
predictor = WellnessRiskPredictor()
