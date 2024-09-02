import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './login.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userData = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post("/api/login", userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setMessage(response.data.message);
      setCategory(response.data.category);
      if (response.data.category === "success") {
        setTimeout(() => {
          navigate("/Chat");
        }, 2000);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred");
      setCategory("error");
    }
  };

  return (
    <div class="login-form">
      <div class="login-icon">&#128138;</div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} method="POST">
        <input
          type="email"
          placeholder="Email"
          value={email}
          id="email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Access Medical Chatbot</button>
      </form>
      {message && <div className={`flash-message ${category}`}>{message}</div>}
    </div>
  );
};

export default Login;