import pandas as pd
from sklearn.ensemble import IsolationForest
import joblib

def train_and_save_model():
    print("Loading synthetic_bids.csv...")
    df = pd.read_csv("synthetic_bids.csv")
    
    # Features for training
    X = df[['jump_percentage', 'bids_in_last_minute', 'is_self_outbidding']]
    
    # Contamination represents the expected proportion of outliers (fraud)
    # Since we know our dataset is 10% fraud, we can set contamination=0.10
    print("Training Isolation Forest Anomaly Detection model...")
    model = IsolationForest(contamination=0.10, random_state=42, n_estimators=100)
    model.fit(X.values) # Training on values to avoid warnings on prediction without column names later
    
    # Evaluate loosely
    predictions = model.predict(X.values)
    # IsolationForest outputs: -1 for anomaly, 1 for normal
    predicted_fraud = (predictions == -1).astype(int)
    from sklearn.metrics import classification_report
    print("\nModel Training Report (against naive ground truth):")
    print(classification_report(df['is_fraud'], predicted_fraud))

    # Save model
    joblib.dump(model, 'model.joblib')
    print("Model saved to 'model.joblib' successfully!")

if __name__ == "__main__":
    train_and_save_model()
