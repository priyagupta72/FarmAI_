import { useState } from "react";
import { Link } from "react-router-dom";

const EMAIL_REGEX    = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,72}$/;

// inject spinner keyframe once
if (!document.getElementById("__fp-spin")) {
  const s = document.createElement("style");
  s.id = "__fp-spin";
  s.textContent = `@keyframes __fp_spin { to { transform: rotate(360deg); } }`;
  document.head.appendChild(s);
}

const ForgotPassword = () => {
  const [step, setStep]           = useState(1); // 1 = enter email, 2 = enter new password
  const [email, setEmail]         = useState("");
  const [emailError, setEmailError] = useState("");

  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [showPass, setShowPass]   = useState(false);
  const [passError, setPassError] = useState("");

  const [loading, setLoading]     = useState(false);
  const [done, setDone]           = useState(false);

  // ── Step 1: just validate email format, then move to step 2
  const handleEmailNext = (e) => {
    e.preventDefault();
    if (!EMAIL_REGEX.test(email.trim())) {
      setEmailError("Enter a valid email address."); return;
    }
    setEmailError("");
    setStep(2);
  };

  // ── Step 2: submit new password
  const handleReset = async (e) => {
    e.preventDefault();
    setPassError("");

    if (!PASSWORD_REGEX.test(password)) {
      setPassError("Password must be 8–72 chars with uppercase, lowercase, number & special character (@$!%*?&)."); return;
    }
    if (password !== confirm) {
      setPassError("Passwords do not match."); return;
    }

    setLoading(true);
    try {
      const res  = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const data = await res.json();
      if (data.success) setDone(true);
      else setPassError(data.message || "Something went wrong.");
    } catch {
      setPassError("Unable to connect. Please check your internet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.formContainer}>

        {/* ── Success screen ── */}
        {done ? (
          <>
            <h2 style={styles.heading}>Password Updated!</h2>
            <p style={{ color: "#555", fontSize: "14px", marginBottom: "20px" }}>
              Your password has been reset successfully.
            </p>
            <Link to="/login" style={styles.button}>Go to Sign In</Link>
          </>
        ) : step === 1 ? (
          <>
            {/* ── Step 1: Email ── */}
            <h2 style={styles.heading}>Forgot Password</h2>
            <p style={{ color: "#555", fontSize: "14px", marginBottom: "20px" }}>
              Enter your registered email to continue.
            </p>
            <form onSubmit={handleEmailNext} style={{ width: "100%" }} noValidate>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                style={{ ...styles.input, border: emailError ? "2px solid #ef4444" : "2px solid rgba(0,0,0,0.4)" }}
              />
              {emailError && <p style={styles.fieldError}>{emailError}</p>}
              <button type="submit" style={styles.button}>Continue</button>
            </form>
            <p style={{ marginTop: "15px" }}>
              <Link to="/login" style={styles.link}>← Back to Sign In</Link>
            </p>
          </>
        ) : (
          <>
            {/* ── Step 2: New Password ── */}
            <h2 style={styles.heading}>Set New Password</h2>
            
            <form onSubmit={handleReset} style={{ width: "100%" }} noValidate>

              {/* New password */}
              <div style={styles.passwordWrap}>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setPassError(""); }}
                  style={{
                    ...styles.input, margin: 0, width: "100%", maxWidth: "100%",
                    paddingRight: "44px",
                    border: passError ? "2px solid #ef4444" : "2px solid rgba(0,0,0,0.4)",
                  }}
                />
                <button type="button" onClick={() => setShowPass(p => !p)} style={styles.eyeBtn} aria-label="Toggle password">
                  {showPass ? (
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

              {/* Confirm password */}
              <input
                type={showPass ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirm}
                onChange={(e) => { setConfirm(e.target.value); setPassError(""); }}
                style={{
                  ...styles.input, marginTop: "12px",
                  border: passError ? "2px solid #ef4444" : "2px solid rgba(0,0,0,0.4)",
                }}
              />

              {passError && <p style={styles.fieldError}>{passError}</p>}

              <button
                type="submit"
                disabled={loading}
                style={{ ...styles.button, opacity: loading ? 0.75 : 1, cursor: loading ? "not-allowed" : "pointer" }}
              >
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    <span style={styles.spinner} />
                    Updating...
                  </span>
                ) : "Reset Password"}
              </button>
            </form>

            <p style={{ marginTop: "15px" }}>
              <button onClick={() => setStep(1)} style={{ background: "none", border: "none", cursor: "pointer", color: "#4CAF50", fontSize: "14px" }}>
                ← Change email
              </button>
            </p>
          </>
        )}

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
    background: "rgba(255,255,255,0.05)",
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
    position: "absolute", right: "12px",
    background: "none", border: "none", cursor: "pointer",
    display: "flex", alignItems: "center", padding: 0,
  },
  fieldError: {
    color: "#ef4444", fontSize: "12px",
    margin: "4px 0 0 0", textAlign: "left",
    width: "100%", maxWidth: "300px",
  },
  button: {
    background: "#4CAF50", color: "white",
    width: "100%", maxWidth: "335px",
    padding: "12px 15px", border: "none",
    borderRadius: "10px", cursor: "pointer",
    fontSize: "16px", marginTop: "20px",
    textDecoration: "none", display: "block",
    boxSizing: "border-box",
  },
  spinner: {
    display: "inline-block", width: "14px", height: "14px",
    border: "2px solid rgba(255,255,255,0.35)", borderTopColor: "#fff",
    borderRadius: "50%", animation: "__fp_spin 0.7s linear infinite",
  },
  link: { color: "#4CAF50", textDecoration: "none" },
};

export default ForgotPassword;