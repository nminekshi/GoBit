const detectBidFraud = async (auction, newBidAmount, bidderId) => {
    let riskScore = 0;
    let isSuspicious = false;
    let flags = [];
    const now = new Date();

    const currentBid = auction.currentBid || 0;
    let lastBid = null;
    if (auction.bids && auction.bids.length > 0) {
        lastBid = auction.bids[auction.bids.length - 1];
    }

    // Calculate features for ML
    let jumpPercentage = 0;
    if (currentBid > 0) {
        jumpPercentage = ((newBidAmount - currentBid) / currentBid) * 100;
    } else if (auction.startPrice) {
        jumpPercentage = ((newBidAmount - auction.startPrice) / auction.startPrice) * 100;
    }

    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
    const recentBidsByUser = (auction.bids || []).filter(bid => 
        bid.bidderId && bid.bidderId.toString() === bidderId.toString() &&
        new Date(bid.timestamp) >= oneMinuteAgo
    );
    const bids_in_last_minute = recentBidsByUser.length;
    
    let is_self_outbidding = 0;
    if (lastBid && lastBid.bidderId && lastBid.bidderId.toString() === bidderId.toString()) {
        is_self_outbidding = 1;
    }

    // Try hitting the ML Python Service
    try {
        const mlResponse = await fetch("http://localhost:8000/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Connection": "close" },
            body: JSON.stringify({
                jump_percentage: jumpPercentage,
                bids_in_last_minute: bids_in_last_minute,
                is_self_outbidding: is_self_outbidding
            }),
            signal: AbortSignal.timeout(1500) // Fail fast so bidding isn't slowed down
        });

        if (mlResponse.ok) {
            const mlData = await mlResponse.json();
            // Prefix flags array with "ML" so we know it came from the Python service
            return {
                riskScore: mlData.riskScore,
                isSuspicious: mlData.isSuspicious,
                flags: mlData.flags.map(f => "[ML] " + f)
            };
        } else {
            console.warn("ML Service returned non-200, falling back to heuristics");
        }
    } catch (err) {
        console.warn("ML Service unreachable, falling back to heuristics:", err.message);
    }

    // --- FALLBACK HEURISTICS ---
    if (is_self_outbidding === 1) {
        riskScore += 20;
        flags.push("Self-outbidding");
    }

    if (jumpPercentage > 50) {
        riskScore += 50;
        flags.push(`Large bid jump (${jumpPercentage.toFixed(1)}%)`);
    }

    if (bids_in_last_minute >= 5) {
        riskScore += 30;
        flags.push(`High velocity (${bids_in_last_minute} bids in 1 min)`);
    }

    if (riskScore >= 50) {
        isSuspicious = true;
    }

    return { riskScore, isSuspicious, flags };
};

module.exports = { detectBidFraud };

