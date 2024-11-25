export interface StudentResult {
  name: string;
  lastname: string;
  nif: string;
  base_hr: number;
  base_sp: number;
  hr_device: string; // Brand and model of the Heart rate device
  sp_device: string; // Brand and name of the Blood pressure device
  biometric_readings: SimplifiedBiometricReading[];
  fraud_results: {
    possible_fraud: boolean;
    fraud_starting_at: number; // Timestamp of the first Fraud detection occurance
  };
}
// In this interface we have all the relevant info of the biometrical readings and normalised too
export interface SimplifiedBiometricReading {
  ts: number; // Timestamp;
  hr: number; // Heart rate per minute
  sp: number; // Systloic blood pressure
}

export interface DerivedData {
  ts: number;
  formated_date: string;
  systolic_pressure: number;
  heart_rate: number;
  sp_limit_exceeded: boolean;
  hr_limit_exceeded: boolean;
  fraud_status: boolean;
}

export interface ChartData {
  x: number;
  y: number;
}
