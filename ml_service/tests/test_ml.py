"""
Comprehensive Tests for AuraWell ML Microservice
"""

import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from fastapi.testclient import TestClient
from main import app
from src.predict import predictor

class TestMLService(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_health_endpoint(self):
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "UP")
        self.assertTrue(data["modelLoaded"])
        self.assertIn("v1.0", data["modelVersion"])
        self.assertEqual(len(data["classes"]), 4)

    def test_predict_endpoint_high_risk(self):
        payload = {
            "studentId": "test_stu_001",
            "assessmentId": "test_assess_001",
            "features": {
                "Academic_Pressure": 9.0,
                "Study_Workload": 8.0,
                "Stress_Level": 9.0,
                "Sleep_Quality_Hours": 4.0,
                "Anxiety_Score": 85.0,
                "Depression_Indicator": 1.0,
                "Social_Connectedness": 2.0,
                "Physical_Activity_Hrs": 1.0,
                "Previous_Counseling": 1.0,
                "Wellness_Score": 32.0
            }
        }
        response = self.client.post("/predict", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn(data["prediction"], ["CRITICAL", "HIGH"])
        self.assertGreater(data["probability"], 0.5)
        self.assertIn("classProbabilities", data)
        self.assertEqual(len(data["classProbabilities"]), 4)
        self.assertIn("v1.0", data["modelVersion"])
        self.assertTrue(len(data["contributingFactors"]) > 0)
        self.assertIn("disclaimer", data["screeningDisclaimer"].lower())

    def test_predict_endpoint_low_risk(self):
        payload = {
            "studentId": "test_stu_002",
            "assessmentId": "test_assess_002",
            "features": {
                "Academic_Pressure": 2.0,
                "Study_Workload": 3.0,
                "Stress_Level": 2.0,
                "Sleep_Quality_Hours": 8.0,
                "Anxiety_Score": 15.0,
                "Depression_Indicator": 0.0,
                "Social_Connectedness": 9.0,
                "Physical_Activity_Hrs": 6.0,
                "Previous_Counseling": 0.0,
                "Wellness_Score": 82.0
            }
        }
        response = self.client.post("/predict", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["prediction"], "LOW")
        self.assertGreater(data["probability"], 0.5)

    def test_predict_validation_error_missing_field(self):
        payload = {
            "studentId": "test_stu_003",
            "features": {
                "Academic_Pressure": 5.0
                # missing other fields
            }
        }
        response = self.client.post("/predict", json=payload)
        self.assertEqual(response.status_code, 422)

    def test_predict_validation_error_out_of_bounds(self):
        payload = {
            "studentId": "test_stu_004",
            "features": {
                "Academic_Pressure": 55.0,  # Invalid: > 10
                "Study_Workload": 5.0,
                "Stress_Level": 5.0,
                "Sleep_Quality_Hours": 6.0,
                "Anxiety_Score": 50.0,
                "Depression_Indicator": 0.0,
                "Social_Connectedness": 5.0,
                "Physical_Activity_Hrs": 3.0,
                "Previous_Counseling": 0.0,
                "Wellness_Score": 50.0
            }
        }
        response = self.client.post("/predict", json=payload)
        self.assertEqual(response.status_code, 422)

if __name__ == '__main__':
    unittest.main()
