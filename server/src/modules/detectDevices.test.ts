// Importing the function to test
import { BiometricReading } from "./interfaces";
import { detectDevices } from "./students";

describe("detectDevices helper function", () => {
  it("should detect Samsung X1-S when payload is present in heart_rate", () => {
    const readings: BiometricReading = {
      heart_rate: {
        type: "samsung",
        eui: "",
        model: "",
        version: "",
        payload: {
          hr: 95,
          hrt: 1200,
        },
        ts: 1732376970000,
      },
      systolic_blood_pressure: {
        eui: "",
        model: "",
        version: "",
        payload: {
          bp_sys: 150,
          bp_dia: 123,
        },
        ts: 1732376970000,
      },
    };

    const result = detectDevices(readings);
    expect(result.bpDevice).toBe("Samsung BPA");
    expect(result.hrDevice).toBe("Samsung X1-S");
  });

  it("shoulddetect Polar MX2 to hrDevice when payload is not present in heart_rate", () => {
    const readings: BiometricReading = {
      heart_rate: {
        type: "polar",
        eui: "",
        fw: "",
        pulse: 10,
        ts: 1732376970000,
      },
      systolic_blood_pressure: {
        eui: "",
        model: "",
        version: "",
        payload: {
          bp_sys: 150,
          bp_dia: 123,
        },
        ts: 1732376970000,
      },
    };

    const result = detectDevices(readings);
    expect(result.bpDevice).toBe("Samsung BPA");
    expect(result.hrDevice).toBe("Polar MX2");
  });
});
