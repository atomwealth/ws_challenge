import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useState } from "react";

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
  student: any;
}

function StudentDetail({ student }: StudentDetailsProps) {
  const [chartOptions, setChartOptions] = useState(CHART_CONFIG);
  const [derivedData, setDerivedData] = useState([]);

  useEffect(() => {}, [student]);
  useEffect(() => {
    const derivedData: any = [];
    const chartData: any = [];
    student.biometric_readings.map((reading: any) => {
      derivedData.push({
        ts: reading.heart_rate.ts,
        systolic_pressure: reading.systolic_blood_pressure.payload.bp_sys,
        heart_rate: reading.heart_rate.payload.hr,
        fraud_status: false,
      });
      chartData.push({
        x: Number.parseInt(reading.heart_rate.ts),
        y: Number.parseInt(reading.heart_rate.payload.hr),
      });
    });
    setDerivedData(derivedData);
    setChartOptions({
      ...chartOptions,
      series: [{ name: "Heart rate", data: chartData }],
    });
  }, [student]);

  return (
    <>
      <div className="mt-4">
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>
      <table className="table-auto bg-white border border-gray-300 rounded-lg mt-4">
        <thead>
          <tr className="bg-gray-400 text-white">
            <th className="px-6 py-2 text-md uppercase">Timestamp</th>
            <th className="px-6 py-2 text-md uppercase">SYS blood pressure</th>
            <th className="px-6 py-2 text-md uppercase">Heart rate</th>
            <th className="px-6 py-2  text-md uppercase">Fraud status</th>
          </tr>
        </thead>
        <tbody>
          {derivedData.map((reading: any) => (
            <tr key={reading.ts}>
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
