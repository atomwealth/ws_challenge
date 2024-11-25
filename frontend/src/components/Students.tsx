import axios from "axios";
import { useState, useEffect } from "react";
import StudentDetail from "./StudentDetail";
import { StudentResult } from "../interfaces/common";
import "./Students.scss";
import { getToken } from "../common/jwt";

function Students() {
  const [students, setStudents] = useState<StudentResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentResult | null>(
    null
  );

  useEffect(() => {
    const getStudents = async (jwt: string) => {
      try {
        setLoading(true);
        const { data } = await axios.get("http://localhost:3000/students", {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        setStudents(data);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    const token = getToken();
    if (token) getStudents(token);
  }, []);

  function viewDetail(student: StudentResult) {
    setSelectedStudent(student);
  }

  return (
    <>
      <div className="flex flex-col text-center ">
        <div
          className="font-bold text-xl uppercase border border-gray-300 bg-blue-400 text-white p-1"
          data-test-id="student_list_title"
        >
          Fraud detection screener
        </div>

        <div className="flex flex-row justify-between items-start px-2 ">
          {students.length > 0 && (
            <table className="student_list flex-grow-0 flex-shrink-0">
              <thead>
                <tr>
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
                  <tr key={student.nif} onClick={() => viewDetail(student)}>
                    <td>{student.name}</td>
                    <td>{student.lastname}</td>
                    <td>{student.nif}</td>
                    <td>
                      {student.fraud_results.possible_fraud
                        ? "POSSIBLE FRAUD"
                        : "NO FRAUD DETECTED"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="flex-1 ml-2">
            {selectedStudent ? (
              <StudentDetail student={selectedStudent} />
            ) : (
              <>{loading ? <div>Loading</div> : <div>{error}</div>}</>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Students;
