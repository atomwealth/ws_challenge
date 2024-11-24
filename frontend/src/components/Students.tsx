import axios from "axios";
import { useState, useEffect } from "react";

function Students() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

  useEffect(() => {
    const getStudents = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("http://localhost:3000/students");
        setStudents(data);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    getStudents();
  }, []);

  function viewDetail(student: any) {
    setSelectedStudent(student);
  }

  return (
    <>
      <div className="flex flex-col text-center">
        <div className="font-bold text-xl uppercase border border-gray-600 bg-gray-400 text-white p-4">
          List of Students
        </div>
        <div className="flex flex-row justify-around">
          <table className="table-auto bg-white border border-gray-300 rounded-lg mt-4">
            <thead>
              <tr className="bg-gray-400 text-white">
                <th className="px-6 py-2 font-medium uppercase">Name</th>
                <th className="px-6 py-2 font-medium uppercase">Last Name</th>
                <th className="px-6 py-2 font-medium uppercase">NIF</th>
                <th className="px-6 py-2 font-medium uppercase">
                  Fraud status
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr
                  key={student.nif}
                  className="border-b border-gray-300 hover:cursor-pointer hover:bg-teal-400 hover:text-white"
                  onClick={() => viewDetail(student)}
                >
                  <td className="px-6 py-2 text-gray-900">{student.name}</td>
                  <td className="px-6 py- text-gray-900">{student.lastname}</td>
                  <td className="px-6 py-2 text-gray-900">{student.nif}</td>
                  <td className="px-6 py-2 text-gray-900">
                    {student.fraud_status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            {selectedStudent && <StudentDetail student={selectedStudent} />}
          </div>
        </div>
      </div>
    </>
  );
}
interface StudentDetailsProps {
  student: any;
}

function StudentDetail({ student }: StudentDetailsProps) {
  const derivedData: any = [];
  student.biometric_readings.map((reading: any) => {
    derivedData.push({
      ts: reading.heart_rate.ts,
      systolic_pressure: reading.systolic_blood_pressure.payload.bp_sys,
      heart_rate: reading.heart_rate.payload.hr,
      fraud_status: false,
    });
  });
  return (
    <>
      <table className="table-auto bg-white border border-gray-300 rounded-lg mt-4">
        <thead>
          <tr className="bg-gray-400 text-white">
            <th className="px-6 py-2 font-medium uppercase">Timestamp</th>
            <th className="px-6 py-2 font-medium uppercase">
              SYS blood pressure
            </th>
            <th className="px-6 py-2 font-medium uppercase">Heart rate</th>
            <th className="px-6 py-2  font-medium uppercase">Fraud status</th>
          </tr>
        </thead>
        <tbody>
          {derivedData.map((reading: any) => (
            <tr key={reading.ts}>
              <td>{reading.ts}</td>
              <td>{reading.systolic_pressure}mm Hg</td>
              <td>{reading.heart_rate} bpm</td>
              <td>{reading.fraud_status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Students;
