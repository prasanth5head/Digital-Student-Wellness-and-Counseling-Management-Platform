"""
Feature Attribution and Explainability for AuraWell Wellness Risk Model
Provides human-readable, evidence-based contributing factors without medical diagnosis.
"""

from typing import Dict, List, Any

# Baseline references based on training distribution
FEATURE_BENCHMARKS = {
    'Academic_Pressure': {'mean': 5.0, 'higher_is_risk': True, 'label': 'Academic Pressure'},
    'Study_Workload': {'mean': 5.0, 'higher_is_risk': True, 'label': 'Study Workload'},
    'Stress_Level': {'mean': 4.6, 'higher_is_risk': True, 'label': 'Stress Level'},
    'Sleep_Quality_Hours': {'mean': 6.0, 'higher_is_risk': False, 'label': 'Sleep Duration & Quality'},
    'Anxiety_Score': {'mean': 44.6, 'higher_is_risk': True, 'label': 'Anxiety Symptoms'},
    'Depression_Indicator': {'mean': 0.13, 'higher_is_risk': True, 'label': 'Depressive Indicators'},
    'Social_Connectedness': {'mean': 5.3, 'higher_is_risk': False, 'label': 'Social Connectedness'},
    'Physical_Activity_Hrs': {'mean': 3.5, 'higher_is_risk': False, 'label': 'Physical Activity'},
    'Previous_Counseling': {'mean': 0.37, 'higher_is_risk': True, 'label': 'Previous Counseling History'},
    'Wellness_Score': {'mean': 49.7, 'higher_is_risk': False, 'label': 'Overall Wellness Score'}
}

def compute_contributing_factors(features: Dict[str, float], feature_importances: Dict[str, float]) -> List[Dict[str, Any]]:
    """
    Computes top contributing factors to the predicted wellness risk level.
    Returns a sorted list of contributing factors with impact scores and descriptions.
    """
    contributions = []
    
    for feat, val in features.items():
        if feat not in FEATURE_BENCHMARKS:
            continue
            
        bench = FEATURE_BENCHMARKS[feat]
        importance = feature_importances.get(feat, 0.05)
        
        # Calculate risk strain (0.0 to 1.0)
        if bench['higher_is_risk']:
            # Higher value = higher risk (e.g. stress, anxiety)
            if feat == 'Depression_Indicator' or feat == 'Previous_Counseling':
                strain = 1.0 if val >= 1.0 else 0.0
            elif feat == 'Anxiety_Score':
                strain = min(1.0, max(0.0, (val - 10.0) / 80.0))
            else:
                strain = min(1.0, max(0.0, (val - 1.0) / 9.0))
        else:
            # Lower value = higher risk (e.g. sleep, social connectedness, wellness score)
            if feat == 'Physical_Activity_Hrs':
                strain = max(0.0, min(1.0, (7.0 - val) / 7.0))
            elif feat == 'Wellness_Score':
                strain = max(0.0, min(1.0, (80.0 - val) / 60.0))
            elif feat == 'Sleep_Quality_Hours':
                strain = max(0.0, min(1.0, (8.0 - val) / 7.0))
            else:
                strain = max(0.0, min(1.0, (10.0 - val) / 9.0))
                
        # Total impact is strain weighted by global model importance
        impact = round(float(strain * importance * 100), 2)
        
        contributions.append({
            "feature": feat,
            "label": bench['label'],
            "value": val,
            "impactScore": impact,
            "isElevatedRisk": strain > 0.45
        })
        
    # Sort descending by impactScore
    contributions.sort(key=lambda x: x['impactScore'], reverse=True)
    return contributions[:5]
