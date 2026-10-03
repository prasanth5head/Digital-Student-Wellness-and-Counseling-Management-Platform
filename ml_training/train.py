"""
AuraWell ML Training & Evaluation Pipeline
This script trains and validates the student wellness risk prediction model
using 5-Fold Stratified Cross Validation, performs hyperparameter tuning,
and outputs a unified Scikit-learn Pipeline (preprocessing + model).
"""

import os
import json
import datetime
import numpy as np
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split, StratifiedKFold, cross_validate, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.svm import SVC
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, f1_score, precision_score, recall_score

def run_training():
    data_path = os.path.join(os.path.dirname(__file__), 'data', 'student_mental_health_dataset.csv')
    print(f"Loading training dataset from: {data_path}")
    df = pd.read_csv(data_path)
    
    print(f"Dataset Shape: {df.shape}")
    print(f"Columns: {list(df.columns)}")
    
    # Check missing and duplicates
    missing = df.isnull().sum().to_dict()
    duplicates = int(df.duplicated().sum())
    print(f"Duplicates: {duplicates}")
    print(f"Missing values: {sum(missing.values())}")
    
    # Define features and target
    # Exclude Student_ID (identifier) and demographics if desired, retain wellness dimensions
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
    
    X = df[feature_cols].copy()
    y = df[target_col].copy()
    
    classes = sorted(list(y.unique()))
    print(f"Target Classes ({len(classes)}): {classes}")
    print("Class Distribution:")
    print(y.value_counts())
    
    # Stratified Train/Test Split (80/20)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    print(f"Train samples: {len(X_train)}, Test samples: {len(X_test)}")
    
    # Define Candidate Models with Scaler in Pipeline
    candidate_models = {
        "Logistic Regression": LogisticRegression(class_weight='balanced', max_iter=1000, random_state=42),
        "Decision Tree": DecisionTreeClassifier(class_weight='balanced', max_depth=6, random_state=42),
        "Random Forest": RandomForestClassifier(class_weight='balanced', n_estimators=100, max_depth=6, random_state=42),
        "Gradient Boosting": GradientBoostingClassifier(n_estimators=100, max_depth=4, random_state=42),
        "Support Vector Classifier (SVC)": SVC(class_weight='balanced', probability=True, random_state=42)
    }
    
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    scoring = {
        'accuracy': 'accuracy',
        'macro_f1': 'f1_macro',
        'weighted_f1': 'f1_weighted',
        'macro_precision': 'precision_macro',
        'macro_recall': 'recall_macro'
    }
    
    comparison_results = {}
    print("\n" + "="*80)
    print("5-FOLD STRATIFIED CROSS-VALIDATION RESULTS")
    print("="*80)
    print(f"{'Model':<35} | {'CV Acc':<10} | {'Macro F1':<10} | {'Macro Rec':<10} | {'Macro Prec':<10}")
    print("-" * 80)
    
    for name, clf in candidate_models.items():
        pipe = Pipeline([
            ('scaler', StandardScaler()),
            ('classifier', clf)
        ])
        scores = cross_validate(pipe, X_train, y_train, cv=cv, scoring=scoring)
        acc_mean = scores['test_accuracy'].mean()
        acc_std = scores['test_accuracy'].std()
        f1_mean = scores['test_macro_f1'].mean()
        f1_std = scores['test_macro_f1'].std()
        rec_mean = scores['test_macro_recall'].mean()
        prec_mean = scores['test_macro_precision'].mean()
        
        comparison_results[name] = {
            'cv_accuracy_mean': round(float(acc_mean), 4),
            'cv_accuracy_std': round(float(acc_std), 4),
            'cv_macro_f1_mean': round(float(f1_mean), 4),
            'cv_macro_f1_std': round(float(f1_std), 4),
            'cv_macro_recall_mean': round(float(rec_mean), 4),
            'cv_macro_precision_mean': round(float(prec_mean), 4),
        }
        print(f"{name:<35} | {acc_mean:.4f}±{acc_std:.3f} | {f1_mean:.4f}±{f1_std:.3f} | {rec_mean:.4f}     | {prec_mean:.4f}")

    # Hyperparameter Tuning on Top Performing Model
    print("\n" + "="*80)
    print("HYPERPARAMETER TUNING (Random Forest)")
    print("="*80)
    
    param_grid = {
        'classifier__n_estimators': [50, 100, 150],
        'classifier__max_depth': [4, 6, 8, None],
        'classifier__min_samples_split': [2, 5, 10]
    }
    
    base_pipe = Pipeline([
        ('scaler', StandardScaler()),
        ('classifier', RandomForestClassifier(class_weight='balanced', random_state=42))
    ])
    
    grid = GridSearchCV(base_pipe, param_grid, cv=cv, scoring='f1_macro', n_jobs=-1)
    grid.fit(X_train, y_train)
    
    best_pipe = grid.best_estimator_
    print(f"Best Parameters: {grid.best_params_}")
    print(f"Best CV Macro F1: {grid.best_score_:.4f}")
    
    # Train Best Pipeline on Full Training Set and Evaluate on Untouched Test Set
    best_pipe.fit(X_train, y_train)
    y_pred = best_pipe.predict(X_test)
    y_proba = best_pipe.predict_proba(X_test)
    
    test_acc = accuracy_score(y_test, y_pred)
    test_macro_f1 = f1_score(y_test, y_pred, average='macro')
    test_weighted_f1 = f1_score(y_test, y_pred, average='weighted')
    test_macro_precision = precision_score(y_test, y_pred, average='macro')
    test_macro_recall = recall_score(y_test, y_pred, average='macro')
    
    print("\n" + "="*80)
    print("FINAL TEST SET EVALUATION")
    print("="*80)
    print(f"Test Accuracy:          {test_acc:.4f}")
    print(f"Test Macro F1:          {test_macro_f1:.4f}")
    print(f"Test Weighted F1:       {test_weighted_f1:.4f}")
    print(f"Test Macro Precision:   {test_macro_precision:.4f}")
    print(f"Test Macro Recall:      {test_macro_recall:.4f}")
    
    print("\nClassification Report:")
    report_dict = classification_report(y_test, y_pred, output_dict=True)
    print(classification_report(y_test, y_pred))
    
    cm = confusion_matrix(y_test, y_pred, labels=best_pipe.classes_)
    print("Confusion Matrix (Classes: {}):".format(list(best_pipe.classes_)))
    print(cm)
    
    # Extract Feature Importances
    classifier = best_pipe.named_steps['classifier']
    feature_importances = {}
    if hasattr(classifier, 'feature_importances_'):
        for f, imp in zip(feature_cols, classifier.feature_importances_):
            feature_importances[f] = round(float(imp), 4)
        # Sort descending
        feature_importances = dict(sorted(feature_importances.items(), key=lambda x: x[1], reverse=True))
    
    print("\nFeature Importances:")
    for f, imp in feature_importances.items():
        print(f"  {f:<25}: {imp:.4f}")
        
    # Save Pipeline and Metadata to ml_service/models/
    output_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'ml_service', 'models')
    os.makedirs(output_dir, exist_ok=True)
    
    model_filename = 'wellness_risk_pipeline.joblib'
    model_path = os.path.join(output_dir, model_filename)
    joblib.dump(best_pipe, model_path)
    print(f"\n[OK] Saved unified ML pipeline to: {model_path}")
    
    metadata = {
        "modelName": "AuraWell-RiskClassifier",
        "version": "1.0",
        "algorithm": "Random Forest (Tuned)",
        "pipelineType": "StandardScaler + RandomForestClassifier",
        "trainedAt": datetime.datetime.now().isoformat(),
        "dataset": "AuraWell Student Mental Health & Academic Stress Dataset",
        "features": feature_cols,
        "classes": list(best_pipe.classes_),
        "metrics": {
            "test_accuracy": round(float(test_acc), 4),
            "test_macro_f1": round(float(test_macro_f1), 4),
            "test_weighted_f1": round(float(test_weighted_f1), 4),
            "test_macro_precision": round(float(test_macro_precision), 4),
            "test_macro_recall": round(float(test_macro_recall), 4),
            "cv_best_score": round(float(grid.best_score_), 4),
            "class_metrics": {c: {k: round(float(v), 4) for k, v in report_dict[c].items()} for c in best_pipe.classes_ if c in report_dict}
        },
        "allModelComparisons": comparison_results,
        "featureImportances": feature_importances,
        "bestHyperparameters": grid.best_params_,
        "status": "ACTIVE"
    }
    
    metadata_path = os.path.join(output_dir, 'model_metadata.json')
    with open(metadata_path, 'w') as f:
        json.dump(metadata, f, indent=2)
    print(f"[OK] Saved model metadata to: {metadata_path}")
    
    # Clean up old single files if present
    old_files = ['wellness_risk_model.joblib', 'wellness_scaler.joblib']
    for old_file in old_files:
        old_path = os.path.join(output_dir, old_file)
        if os.path.exists(old_path):
            try:
                os.remove(old_path)
                print(f"[OK] Removed old standalone file: {old_file}")
            except Exception as e:
                print(f"Warning: could not remove {old_file}: {e}")

if __name__ == '__main__':
    run_training()
