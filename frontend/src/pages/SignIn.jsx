import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://farmai-backend.onrender.com/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (data.success) {
        // ✅ Save token in localStorage
        localStorage.setItem("token", data.token);

        alert("Login successful!");
        navigate("/home"); // ✅ Redirect to homepage
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Login failed!");
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.formContainer}>
        <h2 style={styles.heading}>Sign In</h2>
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Log In
          </button>
        </form>
        <p style={styles.text}>
  Don't have an account?{" "}
  <Link to="/register" style={styles.link}>
    Sign Up
  </Link>
</p>
      </div>
    </div>
  );
};

const styles = {
  body: {
    fontFamily: "Arial, sans-serif",
    backgroundImage: 'url("/images/bg.jpg")',
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
  },
  formContainer: {
    width: "360px",
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(12px)",
    borderRadius: "15px",
    padding: "40px 30px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    animation: "fadeIn 0.8s ease",
  },
  heading: { marginBottom: "20px", color: "#000" },
  form: { width: "100%" },
  input: {
    width: "100%",
    maxWidth: "300px",
    padding: "12px 15px",
    margin: "12px 0",
    borderRadius: "10px",
    border: "2px solid rgba(0,0,0,0.4)",
    background: "rgba(255,255,255,0.1)",
    color: "#000",
    fontSize: "16px",
  },
  button: {
    background: "#4CAF50",
    color: "white",
    width: "100%",
    maxWidth: "335px",
    padding: "12px 15px",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "20px",
    transition: "background 0.3s ease",
  },
  text: { marginTop: "15px", color: "#000" },
  link: { color: "#4CAF50", textDecoration: "none" },
};

export default SignIn;

