import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data.result));
  }, []);

  if (!users) {
    return <h1>Loading</h1>;
  }
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Usuarios</h1>
      <div className="card">
        {users.map((user) => (
          <div key={user._id}>
            <p>Nombre: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Rol: {user.rol}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;