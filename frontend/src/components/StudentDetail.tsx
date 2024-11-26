import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useState } from "react";
import {
  ChartData,
  DerivedData,
  SimplifiedBiometricReading,
  StudentResult,
} from "../interfaces/common";
import "./StudentDetail.scss";

const CHART_CONFIG = {
  chart: {
    type: "line",
  },
  title: {
    text: "FRAUD DETECTION",
  },
  xAxis: {
    type: "datetime",
  },
  series: [
    {
      name: "Heart rate",
      data: [{ x: 1, y: 2 }],
    },
  ],
};

function formatDate(ts: number) {
  const date = new Date(ts);
  const formatted = date.toLocaleDateString("es-ES", {
    // you can use undefined as first argument
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return formatted;
}

interface StudentDetailsProps {
  student: StudentResult;
}

function StudentDetail({ student }: StudentDetailsProps) {
  const [chartOptions, setChartOptions] = useState(CHART_CONFIG);
  const [derivedData, setDerivedData] = useState<DerivedData[]>([]);

  useEffect(() => {
    Highcharts.setOptions({
      global: {
        timezoneOffset: -60, // Fix the timezone difference
      },
    });

    const derivedData: DerivedData[] = [];
    const hrChartData: ChartData[] = [];
    const spChartData: ChartData[] = [];
    student.biometric_readings.map((reading: SimplifiedBiometricReading) => {
      derivedData.push({
        ts: reading.ts,
        formated_date: formatDate(reading.ts),
        systolic_pressure: reading.sp,
        heart_rate: reading.hr,
        sp_limit_exceeded: reading.sp >= student.base_sp * 1.2,
        hr_limit_exceeded: reading.hr >= student.base_hr * 1.3,
        fraud_status: false,
      });
      hrChartData.push({
        x: reading.ts,
        y: reading.hr,
      });
      spChartData.push({
        x: reading.ts,
        y: reading.sp,
      });
    });
    setDerivedData(derivedData);
    setChartOptions({
      ...chartOptions,
      series: [
        { name: "Heart rate", data: hrChartData },
        { name: "Systolic Blood Pressure", data: spChartData },
      ],
    });
  }, [student]);

  return (
    <>
      <div className="mt-3" data-testId="student_chart">
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>
      <div className="flex items-start">
        <table className="student_detail_table" data-testId="student_detail">
          <thead>
            <tr className="field_label">
              <th className="uppercase">Timestamp</th>
              <th className="uppercase">SYS blood pressure</th>
              <th className="uppercase">Heart rate</th>
              <th className="uppercase">Fraud status</th>
            </tr>
          </thead>
          <tbody>
            {derivedData.map((reading: DerivedData) => (
              <tr
                key={reading.ts}
                className={`${
                  student.fraud_results.possible_fraud &&
                  reading.ts >= student.fraud_results.fraud_starting_at
                    ? "bg-red-200"
                    : ""
                }`}
              >
                <td>{reading.formated_date}</td>
                <td
                  className={`${reading.sp_limit_exceeded ? "bg-red-200" : ""}`}
                >
                  {Math.floor(reading.systolic_pressure)}mm Hg
                </td>
                <td
                  className={`${reading.hr_limit_exceeded ? "bg-red-200" : ""}`}
                >
                  {Math.floor(reading.heart_rate)} bpm
                </td>
                <td className="">
                  {student.fraud_results.possible_fraud &&
                  reading.ts >= student.fraud_results.fraud_starting_at ? (
                    <div>POSSIBLE FRAUD</div>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <table className="student_detail_table">
          <tbody>
            <tr>
              <td className="field_label">Student info</td>
              <td>
                {student.name} {student.lastname} ({student.nif})
              </td>
            </tr>
            <tr>
              <td className="field_label">Device info</td>
              <td>
                HR:{student.hr_device} / BP:{student.sp_device}
              </td>
            </tr>
            <tr>
              <td className="field_label">Base HR</td>
              <td>{Math.floor(student.base_hr)} bpm</td>
            </tr>
            <tr>
              <td className="field_label">Base SBP</td>
              <td>{Math.floor(student.base_sp)}mm Hg</td>
            </tr>
            <tr>
              <td className="field_label">Treshold HR (+30%)</td>
              <td>{Math.floor(student.base_hr * 1.3)} bpm</td>
            </tr>
            <tr>
              <td className="field_label">Treshold SBP (+20)</td>
              <td>{Math.floor(student.base_sp * 1.2)}mm Hg</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default StudentDetail;
