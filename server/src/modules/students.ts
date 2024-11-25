import { JsonDB, Config } from "node-json-db";
import {
  Student,
  SamsungHeartBiometricReading,
  PolarHeartBiometricReading,
  FraudResult,
  BiometricReading,
} from "./interfaces";

var db = new JsonDB(new Config("data/db", true, true, "/"));

export async function fetchStudents() {
  var data = await db.getData("/students");
  const results = data.map((student: Student) => detectFraud(student));
  return results;
}

export function detectDevices(readings: BiometricReading) {
  const bpDevice = "Samsung BPA";
  const hrDevice =
    "payload" in readings.heart_rate ? "Samsung X1-S" : "Polar MX2";
  return { bpDevice, hrDevice };
}

export function detectFraud(student: Student) {
  const hr_readings = student.biometric_readings;
  const base_hr = student.base_hr;
  const limit_hr = +base_hr * 1.3;
  let fraud_starting_at = 0;
  const normalizedReadings = [];
  const base_sp = student.base_systolic_pressure;
  const limit_sp = +base_sp * 1.2;
  const { bpDevice, hrDevice } = detectDevices(student.biometric_readings[0]);
  /*console.log(
    `${student.name} ${student.lastname}, HR base=${base_hr}, HR limit =${limit_hr}, ${hr_readings.length}`
  );*/
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

    normalizedReadings.push({
      ts: currentReading.systolic_blood_pressure.ts,
      hr: hearRateReading,
      sp: pressureReading,
    });

    fraud = spStrike > 3 && hrStrike > 4;
    if (fraud) {
      fraud_starting_at = currentReading.systolic_blood_pressure.ts;
      console.log(
        "Fraud detected for " + student.name + " " + student.lastname
      );
      // TODO store evidence somewhere
      console.log(
        "TS:" +
          currentReading.systolic_blood_pressure.ts +
          "SP:" +
          pressureReading +
          " " +
          limit_sp +
          "SP STRIKES=" +
          spStrike +
          ", HR:" +
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

  const result: FraudResult = {
    name: student.name,
    lastname: student.lastname,
    nif: student.nif,
    base_hr,
    base_sp,
    hr_device: hrDevice,
    sp_device: bpDevice,
    biometric_readings: normalizedReadings,
    fraud_results: {
      possible_fraud: fraud,
      fraud_starting_at,
    },
  };
  return result;
}
