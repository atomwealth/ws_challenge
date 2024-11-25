import { FRAUDULENT_MOCK_DATA } from "./mock.data";
import { detectFraud } from "./students";

describe("detectFraud over a student data", () => {
  it("It should detect a fraud in a fraudulent case", () => {
    const fraudulentStudent = FRAUDULENT_MOCK_DATA;
    const results = detectFraud(fraudulentStudent as any);
    expect(results.fraud_results.possible_fraud).toBeTruthy();
    expect(results.fraud_results.fraud_starting_at).toBeGreaterThan(0);
  });
  it("It should return the correct values for the devices, biometric base_measures and student info", () => {
    const fraudulentStudent = FRAUDULENT_MOCK_DATA;
    const results = detectFraud(fraudulentStudent as any);
    expect(results.base_hr).toEqual(fraudulentStudent.base_hr);
    expect(results.base_sp).toEqual(fraudulentStudent.base_systolic_pressure);
    expect(results.name).toEqual(fraudulentStudent.name);
    expect(results.lastname).toEqual(fraudulentStudent.lastname);
    expect(results.nif).toEqual(fraudulentStudent.nif);
    expect(results.hr_device).toEqual("Samsung X1-S");
    expect(results.sp_device).toEqual("Samsung BPA");
  });
});
