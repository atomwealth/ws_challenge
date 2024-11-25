import { useState } from "react";
import { removeToken, setToken } from "../common/jwt";
import axios, { AxiosError } from "axios";

interface FormData {
  username: string;
  password: string;
}
interface LoginProps {
  onLogChange: () => void;
}

function Login({ onLogChange }: LoginProps) {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });
  const [error, setError] = useState();
  const [loggedIn, setLoggedIn] = useState(false);

  function handleNameChange(
    field: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setFormData((prevData: FormData) => {
      return { ...prevData, [field]: event.target.value };
    });
  }

  function handleLogin() {
    const login = async () => {
      try {
        setError(undefined);
        const { data } = await axios.post("http://localhost:3000/login", {
          username: formData.username,
          password: formData.password,
        });
        setToken(data.token);
        setLoggedIn(true);
        onLogChange();
      } catch (err: any) {
        setError(err);
      }
    };
    login();
  }

  function handleLogout() {
    removeToken();
    setLoggedIn(false);
    setFormData({ username: "", password: "" });
    onLogChange();
  }

  return (
    <>
      {!loggedIn && (
        <div className="flex p-1">
          <div className="mx-2 p-1">Username</div>
          <input
            type="text"
            value={formData["username"]}
            className="mx-2 px-2"
            onChange={(event) => handleNameChange("username", event)}
          />
          <div className="mx-2 p-1">Password</div>
          <input
            type="text"
            value={formData["password"]}
            className="mx-2 px-2"
            onChange={(event) => handleNameChange("password", event)}
          />
          <button
            onClick={handleLogin}
            className="mx-2 bg-gray-700 p-1 text-white"
          >
            Login
          </button>
          {error && <div>Bad credentials. Try again</div>}
        </div>
      )}
      {loggedIn && (
        <div className="flex p-1 justify-end">
          <button
            onClick={handleLogout}
            className="mx-2 bg-gray-700 p-1 text-white"
          >
            Logout
          </button>
        </div>
      )}
    </>
  );
}

export default Login;
