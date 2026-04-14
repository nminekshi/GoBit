from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI(title="Bid Fraud Detection ML API")

try:
    print("Loading model.joblib...")
    model = joblib.load("model.joblib")
    print("Model loaded successfully.")
except Exception as e:
    print("Warning: Could not load model.joblib on startup. Please ensure it is generated.")

class BidFeatureRequest(BaseModel):
    jump_percentage: float
    bids_in_last_minute: int
    is_self_outbidding: int

@app.post("/predict")
async def predict_fraud(req: BidFeatureRequest):
    try:
        # Prepare feature array format
        features = np.array([[
            req.jump_percentage,
            req.bids_in_last_minute,
            req.is_self_outbidding
        ]])
        
        # Isolation forest returns 1 for normal, -1 for anomaly
        prediction = model.predict(features)[0]
        # raw score: lower means more anomalous (usually negative)
        anomaly_score = model.score_samples(features)[0] 
        
        risk_score = 0
        if prediction == -1:
            base_risk = 50
            # Just an illustrative scaling
            extra_risk = abs(anomaly_score) * 100 
            risk_score = min(100, int(base_risk + extra_risk))
        else:
            risk_score = min(49, int(abs(anomaly_score) * 50))
            
        # Populate flags so frontend can explain it cleanly
        flags = []
        if req.jump_percentage > 50:
            flags.append(f"Huge jump ({req.jump_percentage:.1f}%)")
        if req.bids_in_last_minute >= 5:
            flags.append("High bid velocity")
        if req.is_self_outbidding == 1:
            flags.append("Self-outbidding")
            
        return {
            "isSuspicious": bool(prediction == -1),
            "riskScore": risk_score,
            "flags": flags,
            "rawAnomalyScore": float(anomaly_score)
        }
    except Exception as e:
        print(f"Prediction Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
