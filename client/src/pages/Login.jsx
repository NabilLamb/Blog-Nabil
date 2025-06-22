import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

const Login = () => {
  const { login, error } = useContext(AuthContext);
  const [inputs, setInputs] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(inputs);
    if (success) navigate("/");
  };

  return (
    <div className="auth">
      <div className="container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            onChange={handleChange}
            required
            type="email"
            placeholder="email"
            name="email"
          />
          <input
            onChange={handleChange}
            required
            type="password"
            name="password"
            placeholder="password"
          />
          <button type="submit">Login</button>
          {error && <p className="error">{error}</p>}
          <span>
            Don't have an account? <Link to="/register">Register</Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Login;
