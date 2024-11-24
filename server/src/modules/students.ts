import { JsonDB, Config } from "node-json-db";

export interface Student {
  name: string;
  lastname: string;
  nif: string;
  base_hr: number;
  base_systolic_pressure: number;
  heart_readings: (SamsungHeartBiometricReading | PolarHeartBiometricReading)[];
  blood_pressure_readings: BloodPressureBiometricReading[];
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

  detectFraud(data[0]);

  return data;
}

function detectFraud(student: Student) {
  const hr_readings = student.heart_readings;
  const base_hr = student.base_hr;
  const limit_hr = +base_hr * 1.3;
  console.log(
    `${student.name} ${student.lastname}, HR base=${base_hr}, HR limit =${limit_hr}, ${hr_readings.length}`
  );
  let hrStrike = 0; // a counter for the hr limit exceeds
  for (let i = 0; i < hr_readings.length; i++) {
    if ("payload" in hr_readings[i]) {
      const reading = (hr_readings[i] as SamsungHeartBiometricReading).payload
        .hr;
      if (reading > limit_hr) hrStrike++;
      else hrStrike = 0;
      console.log(reading + " " + limit_hr + "HR STRIKES=" + hrStrike);
    }
  }
}
