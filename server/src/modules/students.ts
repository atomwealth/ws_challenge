import { JsonDB, Config } from "node-json-db";

export interface Student {
  name: string;
  lastname: string;
  nif: string;
  base_hr: number;
  base_systolic_pressure: number;
  biometric_readings: BiometricReading[];
}
interface BiometricReading {
  heart_rate: SamsungHeartBiometricReading | PolarHeartBiometricReading;
  systolic_blood_pressure: BloodPressureBiometricReading;
}

interface SamsungHeartBiometricReading {
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
interface PolarHeartBiometricReading {
  type: "polar";
  eui: string; //universally unique identifier
  fw: string; // device model and version
  pulse: number; // heart rate, pulse per second
  ts: number; // timestamp
}

interface BloodPressureBiometricReading {
  eui: string; // universally unique identifier
  model: string; // device model
  version: string; // fw version
  payload: {
    bp_sys: number; // systolic blood pressure, in mm Hg
    bp_dia: number; // diastolic blood pressure, in mm Hg
  };
  ts: number; // timestamp
}

var db = new JsonDB(new Config("data/db", true, true, "/"));

export async function fetchStudents() {
  var data = await db.getData("/students");

  detectFraud(data[1]);

  return data;
}

function detectFraud(student: Student) {
  const hr_readings = student.biometric_readings;
  const base_hr = student.base_hr;
  const limit_hr = +base_hr * 1.3;
  const base_sp = student.base_systolic_pressure;
  const limit_sp = +base_sp * 1.2;
  console.log(
    `${student.name} ${student.lastname}, HR base=${base_hr}, HR limit =${limit_hr}, ${hr_readings.length}`
  );
  let hrStrike = 0; // a counter for the hr limit exceeds
  let spStrike = 0; // a counter for the sp limit exceeds
  let fraud = false;
  for (let i = 0; i < hr_readings.length; i++) {
    const currentReading = hr_readings[i];
    const pressureReading =
      currentReading.systolic_blood_pressure.payload.bp_sys;
    let hearRateReading;
    if ("payload" in currentReading.heart_rate) {
      hearRateReading = (
        currentReading.heart_rate as SamsungHeartBiometricReading
      ).payload.hr;
    } else {
      hearRateReading =
        +(currentReading.heart_rate as PolarHeartBiometricReading).pulse * 60; // adjust from second to minute
    }
    if (pressureReading >= limit_sp) spStrike++;
    else {
      spStrike = 0;
      hrStrike = 0;
    }
    if (hearRateReading >= limit_hr && spStrike > 1) hrStrike++;
    else hrStrike = 0;

    fraud = spStrike > 3 && hrStrike > 4;

    console.log(
      "SP" +
        pressureReading +
        " " +
        limit_sp +
        "SP STRIKES=" +
        spStrike +
        ", HR" +
        hearRateReading +
        " " +
        limit_hr +
        "HR STRIKES=" +
        hrStrike +
        ", FRAUD " +
        fraud
    );
  }
}
