import pandas as pd
import numpy as np
import random

def generate_synthetic_bids(n_samples=10000):
    np.random.seed(42)
    random.seed(42)
    
    # Normal bids: small jump, 1-2 bids in 60s, rarely self-outbidding
    n_normal = int(n_samples * 0.90)
    
    # Fraud bids: large jumps, high velocity, self-outbidding
    n_fraud = n_samples - n_normal
    
    data = []
    
    # Generate Normal
    for _ in range(n_normal):
        jump_pct = np.random.uniform(0.5, 10.0) # 0.5% to 10% jump
        bids_60s = np.random.randint(1, 4)      # 1 to 3 bids in last 60s
        self_outbid = np.random.choice([0, 1], p=[0.99, 0.01]) # Very rare
        is_fraud = 0
        data.append([jump_pct, bids_60s, self_outbid, is_fraud])
        
    # Generate Fraud (Sniper Bots, Shilling, Huge Inflations)
    for _ in range(n_fraud):
        fraud_type = random.choice(['huge_jump', 'high_velocity', 'self_bidding'])
        
        if fraud_type == 'huge_jump':
            jump_pct = np.random.uniform(50.0, 300.0)
            bids_60s = np.random.randint(1, 3)
            self_outbid = 0
        elif fraud_type == 'high_velocity':
            jump_pct = np.random.uniform(1.0, 5.0)
            bids_60s = np.random.randint(6, 20)
            self_outbid = 0
        else:
            jump_pct = np.random.uniform(1.0, 20.0)
            bids_60s = np.random.randint(1, 5)
            self_outbid = 1
            
        data.append([jump_pct, bids_60s, self_outbid, 1])
        
    df = pd.DataFrame(data, columns=['jump_percentage', 'bids_in_last_minute', 'is_self_outbidding', 'is_fraud'])
    
    # Shuffle
    df = df.sample(frac=1).reset_index(drop=True)
    
    df.to_csv("synthetic_bids.csv", index=False)
    print(f"Generated {n_samples} bid records at 'synthetic_bids.csv'. Fraud ratio: {n_fraud/n_samples*100}%")

if __name__ == "__main__":
    generate_synthetic_bids()
