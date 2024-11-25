import { useEffect, useState } from "react";
import { getToken } from "./common/jwt";
import Login from "./components/Login";
import Students from "./components/Students";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const authToken = getToken();
    setLoggedIn(authToken !== null);
  }, []);

  function handleLoggedIn() {
    const authToken = getToken();
    setLoggedIn(authToken !== null);
  }

  return (
    <>
      <Login onLogged={handleLoggedIn} />
      {loggedIn && <Students />}
    </>
  );
}

export default App;
