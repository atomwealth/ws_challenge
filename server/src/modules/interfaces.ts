export interface Student {
  name: string;
  lastname: string;
  nif: string;
  base_hr: number;
  base_systolic_pressure: number;
  biometric_readings: BiometricReading[];
}
export interface BiometricReading {
  heart_rate: SamsungHeartBiometricReading | PolarHeartBiometricReading;
  systolic_blood_pressure: BloodPressureBiometricReading;
}

export interface SamsungHeartBiometricReading {
  type: "samsung";
  eui: string; // universally unique identifier
  model: string; // device model
  version: string; // fe version
  payload: {
    hr: number; // heart rate, pulse per minute
    hrt: number; // tendency of the heart rate, derivative of the curve
  };
  ts: number; // timestamp
}
export interface PolarHeartBiometricReading {
  type: "polar";
  eui: string; //universally unique identifier
  fw: string; // device model and version
  pulse: number; // heart rate, pulse per second
  ts: number; // timestamp
}

export interface BloodPressureBiometricReading {
  eui: string; // universally unique identifier
  model: string; // device model
  version: string; // fw version
  payload: {
    bp_sys: number; // systolic blood pressure, in mm Hg
    bp_dia: number; // diastolic blood pressure, in mm Hg
  };
  ts: number; // timestamp
}
// This interface is where we store the unified and normalized data for a student fraud analysis
export interface FraudResult {
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
