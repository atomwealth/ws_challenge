import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useState } from "react";
import {
  ChartData,
  DerivedData,
  SimplifiedBiometricReading,
  StudentResult,
} from "../interfaces/common";

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

interface StudentDetailsProps {
  student: StudentResult;
}

function StudentDetail({ student }: StudentDetailsProps) {
  const [chartOptions, setChartOptions] = useState(CHART_CONFIG);
  const [derivedData, setDerivedData] = useState<DerivedData[]>([]);

  useEffect(() => {}, [student]);
  useEffect(() => {
    const derivedData: DerivedData[] = [];
    const hrChartData: ChartData[] = [];
    const spChartData: ChartData[] = [];
    student.biometric_readings.map((reading: SimplifiedBiometricReading) => {
      derivedData.push({
        ts: reading.ts,
        systolic_pressure: reading.sp,
        heart_rate: reading.hr,
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
      <div className="mt-4">
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>
      <table className="table-auto bg-white border border-blue-200 rounded-lg mt-4">
        <thead>
          <tr className="bg-blue-400 text-white">
            <th className="px-6 py-2 text-md uppercase">Timestamp</th>
            <th className="px-6 py-2 text-md uppercase">SYS blood pressure</th>
            <th className="px-6 py-2 text-md uppercase">Heart rate</th>
            <th className="px-6 py-2  text-md uppercase">Fraud status</th>
          </tr>
        </thead>
        <tbody>
          {derivedData.map((reading: DerivedData) => (
            <tr key={reading.ts} className="border-b">
              <td className="px-6 py-2 text-sm">{reading.ts}</td>
              <td className="px-6 py-2 text-sm">
                {reading.systolic_pressure}mm Hg
              </td>
              <td className="px-6 py-2 text-sm ">{reading.heart_rate} bpm</td>
              <td className="px-6 py-2 text-sm ">{reading.fraud_status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default StudentDetail;
