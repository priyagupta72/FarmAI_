

// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";

// const SignUp = () => {
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//   });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

//     try {
//   const res = await fetch(`${BACKEND_URL}/api/register`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(formData),
//   });

//       const data = await res.json();
//       setLoading(false);

//       if (data.success) {
//         alert("Registration successful! Please log in.");
//         navigate("/login");
//       } else {
//         setError(data.message || "Registration failed");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Server error. Please try again later.");
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       style={{
//         fontFamily: "Arial, sans-serif",
//         background: "url('/background.jpg') no-repeat center center fixed",
//         backgroundSize: "cover",
//         minHeight: "100vh",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         padding: "20px",
//       }}
//     >
//       <div
//         style={{
//           width: "360px",
//           background: "rgba(255, 255, 255, 0.05)",
//           backdropFilter: "blur(12px)",
//           borderRadius: "15px",
//           padding: "40px 30px",
//           boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
//           textAlign: "center",
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//         }}
//       >
//         <h2 style={{ marginBottom: "20px" }}>Sign Up</h2>
//         <form style={{ width: "100%" }} onSubmit={handleSubmit}>
//           <input
//             type="text"
//             name="firstName"
//             placeholder="First Name"
//             value={formData.firstName}
//             onChange={handleChange}
//             required
//             style={inputStyle}
//           />
//           <input
//             type="text"
//             name="lastName"
//             placeholder="Last Name"
//             value={formData.lastName}
//             onChange={handleChange}
//             required
//             style={inputStyle}
//           />
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             style={inputStyle}
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//             style={inputStyle}
//           />
//           <button type="submit" style={buttonStyle} disabled={loading}>
//             {loading ? "Registering..." : "Register"}
//           </button>
//         </form>
//         {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
//         <p style={{ marginTop: "15px" }}>
//           Already have an account?{" "}
//           <Link to="/login" style={{ color: "#4CAF50", textDecoration: "none" }}>
//             LogIn
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// // Input styles
// const inputStyle = {
//   width: "100%",
//   maxWidth: "300px",
//   padding: "12px 15px",
//   margin: "12px 0",
//   borderRadius: "10px",
//   border: "2px solid rgba(0,0,0,0.4)",
//   background: "rgba(255,255,255,0.1)",
//   color: "#000",
//   fontSize: "16px",
// };

// // Button styles
// const buttonStyle = {
//   background: "#4CAF50",
//   color: "white",
//   width: "100%",
//   maxWidth: "335px",
//   padding: "12px 15px",
//   border: "none",
//   borderRadius: "10px",
//   cursor: "pointer",
//   fontSize: "16px",
//   marginTop: "20px",
//   transition: "background 0.3s ease",
// };

// export default SignUp;










import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    try {
      const response = await fetch(`${BACKEND_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setLoading(false);

      if (data.success) {
        alert("Registration successful! Please log in.");
        navigate("/login");
      } else {
        setError(data.message || "Registration failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.formContainer}>
        <h2 style={styles.heading}>Sign Up</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        <p style={{ marginTop: "15px" }}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

// Styles
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
  },
  link: { color: "#4CAF50", textDecoration: "none" },
};

export default SignUp;
