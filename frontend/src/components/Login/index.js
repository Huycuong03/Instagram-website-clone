import "./index.css";
import picture from "./Picture1.png";
import { useRef, useState } from "react";
import axios from "axios";
import {Link} from "react-router-dom";

function Login({ setUser, navigate }) {
  const username = useRef();
  const password = useRef();
  const [error, setError] = useState("");
  async function handleLogin() {
    const credential = {
      username: username.current.value,
      password: password.current.value,
    };
    try {
      const res = await axios.post(
        "http://localhost:8080/user/login",
        JSON.stringify(credential),
        {
          headers: {
            "content-type": "application/json",
          }
        }
      );

      if (res.status === 200) {
        setUser(res.data);
        navigate("/");
      }
    } catch (error) {
      setError(error.response.data);
    }
  };

  return (
    <div id="login-page">
        <img src={picture} alt=""/>
        <div id="login-div">
            <img src="./logo.png" alt=""/>
            <em>{error}</em>
            <label htmlFor="username">Username</label>
            <input id="username" type="text" ref={username}/>
            <label htmlFor="password">Password</label>
            <input id="password" type="password" ref={password} />
            <button onClick={handleLogin}>Login</button>
            <p>Don't have an account? {<Link to="/signup">Sign up</Link>} here.</p>
        </div>
    </div>
  );
}

export default Login;
