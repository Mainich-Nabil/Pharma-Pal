import { useState } from "react";
import "./sign_up.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Sign_Up = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userData = {
      username: username,
      password: password,
      email: email,
      number: number,
    };
    
    try {
      const response = await axios.post("http://localhost:5000/api/sign-up", userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      setMessage(response.data.message);
      setCategory(response.data.category);

      if (response.data.category === "success") {
        setTimeout(() => {
          navigate("/Login");
        }, 2000);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred");
      setCategory("error");
    }
  };

  return (
    <div className="signup-form">
      <div className="signup-icon">&#127973;</div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            placeholder="Username"
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="tel"
            id="number"
            value={number}
            placeholder="Phone"
            onChange={(e) => setNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            placeholder="Email"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            placeholder="Password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {message && <div className={`flash-message ${category}`}>{message}</div>}
    </div>
  );
};

export default Sign_Up;
