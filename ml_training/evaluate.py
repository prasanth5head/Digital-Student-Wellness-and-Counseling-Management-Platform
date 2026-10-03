"""
AuraWell ML Evaluation Script
Evaluates the trained wellness_risk_pipeline.joblib against test data
"""

import os
import json
import joblib
import pandas as pd
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, f1_score

def evaluate():
    base_dir = os.path.dirname(os.path.dirname(__file__))
    model_path = os.path.join(base_dir, 'ml_service', 'models', 'wellness_risk_pipeline.joblib')
    data_path = os.path.join(os.path.dirname(__file__), 'data', 'student_mental_health_dataset.csv')
    metadata_path = os.path.join(base_dir, 'ml_service', 'models', 'model_metadata.json')
    
    if not os.path.exists(model_path):
        print(f"Error: Model pipeline not found at {model_path}. Run train.py first.")
        return
        
    pipeline = joblib.load(model_path)
    df = pd.read_csv(data_path)
    
    feature_cols = [
        'Academic_Pressure',
        'Study_Workload',
        'Stress_Level',
        'Sleep_Quality_Hours',
        'Anxiety_Score',
        'Depression_Indicator',
        'Social_Connectedness',
        'Physical_Activity_Hrs',
        'Previous_Counseling',
        'Wellness_Score'
    ]
    target_col = 'Risk_Level'
    
    X = df[feature_cols]
    y = df[target_col]
    
    y_pred = pipeline.predict(X)
    
    print("="*60)
    print("SAVED PIPELINE VERIFICATION ON FULL BENCHMARK DATASET")
    print("="*60)
    print(f"Accuracy: {accuracy_score(y, y_pred):.4f}")
    print(f"Macro F1: {f1_score(y, y_pred, average='macro'):.4f}")
    print("\nClassification Report:")
    print(classification_report(y, y_pred))
    print("Confusion Matrix:")
    print(confusion_matrix(y, y_pred, labels=pipeline.classes_))
    print(f"Classes: {pipeline.classes_}")

if __name__ == '__main__':
    evaluate()
