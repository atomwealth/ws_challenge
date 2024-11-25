import axios from "axios";
import { useState, useEffect } from "react";
import StudentDetail from "./StudentDetail";
import { StudentResult } from "../interfaces/common";

function Students() {
  const [students, setStudents] = useState<StudentResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentResult | null>(
    null
  );

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

  function viewDetail(student: StudentResult) {
    setSelectedStudent(student);
  }

  return (
    <>
      <div className="flex flex-col text-center">
        <div className="font-bold text-xl uppercase border border-gray-300 bg-blue-400 text-white p-1">
          List of Students
        </div>

        <div className="flex flex-row justify-around items-start">
          <table className="table-auto bg-white border border-gray-300 rounded-lg mt-4 flex-grow-0">
            <thead>
              <tr className="bg-blue-400 text-white">
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
                  className="border-b border-gray-300 hover:cursor-pointer hover:bg-blue-200 hover:text-white"
                  onClick={() => viewDetail(student)}
                >
                  <td className="px-6 py-2 text-gray-900">{student.name}</td>
                  <td className="px-6 py-2 text-gray-900">
                    {student.lastname}
                  </td>
                  <td className="px-6 py-2 text-gray-900">{student.nif}</td>
                  <td className="px-6 py-2 text-gray-900">
                    {student.fraud_results.possible_fraud}
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

export default Students;
