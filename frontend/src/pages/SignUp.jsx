// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";

// const SignUp = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

//     try {
//       const response = await fetch(`${BACKEND_URL}/api/register`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) {
//         throw new Error(`Server error: ${response.status}`);
//       }

//       const data = await response.json();
//       setLoading(false);

//       if (data.success) {
//         alert("Registration successful! Please log in.");
//         navigate("/login");
//       } else {
//         setError(data.message || "Registration failed.");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Server error. Please try again later.");
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={styles.body}>
//       <div style={styles.formContainer}>
//         <h2 style={styles.heading}>Sign Up</h2>
//         <form onSubmit={handleSubmit} style={styles.form}>
//           <input
//             type="text"
//             name="firstName"
//             placeholder="First Name"
//             value={formData.firstName}
//             onChange={handleChange}
//             required
//             style={styles.input}
//           />
//           <input
//             type="text"
//             name="lastName"
//             placeholder="Last Name"
//             value={formData.lastName}
//             onChange={handleChange}
//             required
//             style={styles.input}
//           />
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             style={styles.input}
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//             style={styles.input}
//           />
//           <button type="submit" style={styles.button} disabled={loading}>
//             {loading ? "Registering..." : "Register"}
//           </button>
//         </form>
//         {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
//         <p style={{ marginTop: "15px" }}>
//           Already have an account?{" "}
//           <Link to="/login" style={styles.link}>
//             Log In
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// // Styles
// const styles = {
//   body: {
//     fontFamily: "Arial, sans-serif",
//     backgroundImage: 'url("/images/bg.jpg")',
//     backgroundRepeat: "no-repeat",
//     backgroundPosition: "center",
//     backgroundSize: "cover",
//     height: "100vh",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     margin: 0,
//   },
//   formContainer: {
//     width: "360px",
//     background: "rgba(255, 255, 255, 0.05)",
//     backdropFilter: "blur(12px)",
//     borderRadius: "15px",
//     padding: "40px 30px",
//     boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
//     textAlign: "center",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//   },
//   heading: { marginBottom: "20px", color: "#000" },
//   form: { width: "100%" },
//   input: {
//     width: "100%",
//     maxWidth: "300px",
//     padding: "12px 15px",
//     margin: "12px 0",
//     borderRadius: "10px",
//     border: "2px solid rgba(0,0,0,0.4)",
//     background: "rgba(255,255,255,0.1)",
//     color: "#000",
//     fontSize: "16px",
//   },
//   button: {
//     background: "#4CAF50",
//     color: "white",
//     width: "100%",
//     maxWidth: "335px",
//     padding: "12px 15px",
//     border: "none",
//     borderRadius: "10px",
//     cursor: "pointer",
//     fontSize: "16px",
//     marginTop: "20px",
//   },
//   link: { color: "#4CAF50", textDecoration: "none" },
// };

// export default SignUp;


import { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";

// ─── Validators ───────────────────────────────────────────────────────────────

const NAME_REGEX = /^[a-zA-Z\s'-]{2,50}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,72}$/;

const fieldValidators = {
  firstName: (v) =>
    !v ? "First name is required." : !NAME_REGEX.test(v) ? "2–50 letters only." : "",
  lastName: (v) =>
    !v ? "Last name is required." : !NAME_REGEX.test(v) ? "2–50 letters only." : "",
  email: (v) =>
    !v ? "Email is required." : !EMAIL_REGEX.test(v) ? "Enter a valid email address." : "",
  password: (v) =>
    !v
      ? "Password is required."
      : !PASSWORD_REGEX.test(v)
      ? "8+ chars with uppercase, lowercase, number & special character (@$!%*?&)."
      : "",
};

const INITIAL_FORM = { firstName: "", lastName: "", email: "", password: "" };
const INITIAL_ERRORS = { firstName: "", lastName: "", email: "", password: "" };

// ─── Password strength ────────────────────────────────────────────────────────

const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: "", color: "#e5e7eb" };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[@$!%*?&]/.test(password)) score++;
  if (score <= 2) return { score, label: "Weak", color: "#ef4444" };
  if (score === 3) return { score, label: "Fair", color: "#f59e0b" };
  if (score === 4) return { score, label: "Good", color: "#3b82f6" };
  return { score, label: "Strong", color: "#4CAF50" };
};

// ─── Spinner keyframe (injected once) ─────────────────────────────────────────
if (!document.getElementById("__su-spin")) {
  const s = document.createElement("style");
  s.id = "__su-spin";
  s.textContent = `@keyframes __su_spin { to { transform: rotate(360deg); } }`;
  document.head.appendChild(s);
}

// ─── Component ────────────────────────────────────────────────────────────────

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState(INITIAL_ERRORS);
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const strength = getPasswordStrength(formData.password);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (touched[name]) {
        setFieldErrors((prev) => ({ ...prev, [name]: fieldValidators[name](value) }));
      }
      setServerError("");
    },
    [touched]
  );

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setFieldErrors((prev) => ({ ...prev, [name]: fieldValidators[name](value) }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const allTouched = Object.keys(INITIAL_FORM).reduce((acc, k) => ({ ...acc, [k]: true }), {});
    setTouched(allTouched);
    const allErrors = Object.keys(fieldValidators).reduce(
      (acc, k) => ({ ...acc, [k]: fieldValidators[k](formData[k]) }),
      {}
    );
    setFieldErrors(allErrors);
    if (Object.values(allErrors).some(Boolean)) return;

    setLoading(true);
    setServerError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
      } else {
        setServerError(data.message || "Registration failed. Please try again.");
      }
    } catch {
      setServerError("Unable to connect. Please check your internet and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Dynamic border color per field
  const inputBorder = (name) => {
    if (fieldErrors[name]) return "2px solid #ef4444";
    if (touched[name] && !fieldErrors[name] && formData[name]) return "2px solid #4CAF50";
    return "2px solid rgba(0,0,0,0.4)";
  };

  return (
    <div style={styles.body}>
      <div style={styles.formContainer}>
        <h2 style={styles.heading}>Sign Up</h2>

        <form onSubmit={handleSubmit} style={styles.form} noValidate>

          {/* First Name */}
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="given-name"
            style={{ ...styles.input, border: inputBorder("firstName") }}
            aria-invalid={!!fieldErrors.firstName}
          />
          {fieldErrors.firstName && (
            <p style={styles.fieldError} role="alert">{fieldErrors.firstName}</p>
          )}

          {/* Last Name */}
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="family-name"
            style={{ ...styles.input, border: inputBorder("lastName") }}
            aria-invalid={!!fieldErrors.lastName}
          />
          {fieldErrors.lastName && (
            <p style={styles.fieldError} role="alert">{fieldErrors.lastName}</p>
          )}

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="email"
            style={{ ...styles.input, border: inputBorder("email") }}
            aria-invalid={!!fieldErrors.email}
          />
          {fieldErrors.email && (
            <p style={styles.fieldError} role="alert">{fieldErrors.email}</p>
          )}

          {/* Password */}
          <div style={styles.passwordWrap}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="new-password"
              style={{
                ...styles.input,
                margin: 0,
                width: "100%",
                maxWidth: "100%",
                paddingRight: "44px",
                border: inputBorder("password"),
              }}
              aria-invalid={!!fieldErrors.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              style={styles.eyeBtn}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>

          {/* Password strength meter */}
          {formData.password && (
            <div style={styles.strengthWrap} aria-live="polite">
              <div style={styles.strengthBars}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <div
                    key={n}
                    style={{
                      ...styles.strengthBar,
                      background: n <= strength.score ? strength.color : "#e5e7eb",
                    }}
                  />
                ))}
              </div>
              <span style={{ ...styles.strengthLabel, color: strength.color }}>
                {strength.label}
              </span>
            </div>
          )}

          {fieldErrors.password && (
            <p style={styles.fieldError} role="alert">{fieldErrors.password}</p>
          )}

          {/* Server error */}
          {serverError && (
            <p style={styles.serverError} role="alert">{serverError}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            style={{ ...styles.button, opacity: loading ? 0.75 : 1, cursor: loading ? "not-allowed" : "pointer" }}
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <span style={styles.spinner} aria-hidden="true" />
                Registering...
              </span>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <p style={{ marginTop: "15px" }}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>Log In</Link>
        </p>
      </div>
    </div>
  );
};

// ─── Styles (original preserved exactly) ─────────────────────────────────────

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
    margin: "12px 0 0 0",
    borderRadius: "10px",
    border: "2px solid rgba(0,0,0,0.4)",
    background: "rgba(255,255,255,0.1)",
    color: "#000",
    fontSize: "16px",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
    outline: "none",
  },
  passwordWrap: {
    position: "relative",
    width: "100%",
    maxWidth: "300px",
    margin: "12px auto 0",
    display: "flex",
    alignItems: "center",
  },
  eyeBtn: {
    position: "absolute",
    right: "12px",
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    padding: 0,
  },
  strengthWrap: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    width: "100%",
    maxWidth: "300px",
    margin: "6px auto 0",
  },
  strengthBars: {
    display: "flex",
    gap: "3px",
    flex: 1,
  },
  strengthBar: {
    height: "3px",
    flex: 1,
    borderRadius: "2px",
    transition: "background 0.3s",
  },
  strengthLabel: {
    fontSize: "11px",
    fontWeight: "500",
    minWidth: "40px",
    textAlign: "right",
  },
  fieldError: {
    color: "#ef4444",
    fontSize: "12px",
    margin: "4px 0 0 0",
    textAlign: "left",
    width: "100%",
    maxWidth: "300px",
  },
  serverError: {
    color: "#dc2626",
    fontSize: "13px",
    background: "rgba(254,226,226,0.85)",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    padding: "8px 12px",
    marginTop: "10px",
    textAlign: "left",
    width: "100%",
    maxWidth: "300px",
    boxSizing: "border-box",
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
    transition: "opacity 0.2s",
  },
  spinner: {
    display: "inline-block",
    width: "14px",
    height: "14px",
    border: "2px solid rgba(255,255,255,0.35)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "__su_spin 0.7s linear infinite",
  },
  link: { color: "#4CAF50", textDecoration: "none" },
};

export default SignUp;