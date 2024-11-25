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

  function handleLoggedChange() {
    const authToken = getToken();
    setLoggedIn(authToken !== null);
  }

  return (
    <>
      <Login onLogChange={handleLoggedChange} />
      {loggedIn && <Students />}
    </>
  );
}

export default App;
