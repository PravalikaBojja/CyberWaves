interface RiskAssessmentData {
    amount: number;
    frequency: number;
    geographicalLocation: string;
    pastTransactionBehavior: string;
  }
  
export function calculateRisk(data: RiskAssessmentData): number {
    let riskScore = 0;
  
    // Amount-based risk assessment
    if (data.amount > 1000) {
      riskScore += 0.3; // High amount, higher risk
    } else if (data.amount > 500) {
      riskScore += 0.2; // Medium amount, medium risk
    } else {
      riskScore += 0.1; // Low amount, low risk
    }
  
    // Frequency-based risk assessment
    if (data.frequency > 5) {
      riskScore += 0.4; // High frequency, higher risk
    } else if (data.frequency > 2) {
      riskScore += 0.2; // Medium frequency, medium risk
    } else {
      riskScore += 0.1; // Low frequency, low risk
    }
  
    // Geographical location-based risk assessment
    const highRiskLocations = ["New York", "Los Angeles", "Chicago"];
    if (highRiskLocations.includes(data.geographicalLocation)) {
      riskScore += 0.3; // High-risk location, higher risk
    } else {
      riskScore += 0.1; // Low-risk location, low risk
    }
  
    // Past transaction behavior-based risk assessment
    const highRiskBehaviors = ["High risk", "Suspicious"];
    if (highRiskBehaviors.includes(data.pastTransactionBehavior)) {
      riskScore += 0.4; // High-risk behavior, higher risk
    } else {
      riskScore += 0.1; // Low-risk behavior, low risk
    }
  
    // Normalize the risk score to a value between 0 and 1
    riskScore = riskScore / 2;
  
    return riskScore;
  }