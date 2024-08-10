import "./index.css";
import picture from "./Picture1.png";
import { useRef, useState } from "react";
import axios from "axios";

function Signup({ navigate }) {
  const username = useRef();
  const password = useRef();
  const [error, setError] = useState("");
  const handleSignup = async () => {
    const credential = {
      username: username.current.value,
      password: password.current.value,
    };
    try {
      const res = await axios.post(
        "http://localhost:8080/user/signup",
        JSON.stringify(credential),
        {
          headers: {
            "content-type": "application/json",
          }
        }
      );

      if (res.status === 200) {
        navigate("/login");
      }
    } catch (error) {
      setError(error.response.data);
    }
  };

  return (
    <div id="signup-page">
        <img src={picture} alt=""/>
        <div id="signup-div">
            <img src="./logo.png" alt=""/>
            <em>{error}</em>
            <label htmlFor="username">Username</label>
            <input id="username" type="text" ref={username} />
            <label htmlFor="password">Password</label>
            <input id="password" type="password" ref={password} />
            <button onClick={handleSignup}>Signup</button>
        </div>
    </div>
  );
}

export default Signup;
