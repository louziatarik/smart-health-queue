import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;

      const endpoint =
        role === "patient"
          ? "/patients/login"
          : "/doctors/login";

      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Invalid email or password."
        );
      }

      const token =
        data.access_token ||
        data.token ||
        data.accessToken;

      if (!token) {
        throw new Error(
          "Login succeeded, but the server did not return an access token."
        );
      }

      localStorage.setItem("smartHealthToken", token);
      localStorage.setItem("smartHealthRole", role);

      if (role === "patient") {
        navigate("/patient-dashboard");
      } else {
        navigate("/doctor-dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);

      setError(
        err.message ||
          "Unable to connect to the Smart Health server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* =====================================================
          BRAND PANEL
      ===================================================== */}

      <section className="login-brand-panel">

        <div className="login-brand-top">

          <Link to="/" className="login-logo">
            <span className="login-logo-mark">
              +
            </span>

            <span className="login-logo-text">
              Smart Health
            </span>
          </Link>

          <Link
            to="/"
            className="login-back-link login-back-desktop"
          >
            Back to website
            <span>↗</span>
          </Link>

        </div>


        <div className="login-brand-content">

          <span className="login-eyebrow">
            SMART HEALTH
          </span>

          <h1>
            Better healthcare
            <span> starts here.</span>
          </h1>

          <p>
            Access your appointments, follow your queue,
            and stay connected with your healthcare team
            through one simple experience.
          </p>


          {/* PREVIEW */}

          <div className="login-preview-card">

            <div className="login-preview-top">

              <div>
                <span className="login-preview-label">
                  TODAY'S OVERVIEW
                </span>

                <h3>
                  Your healthcare,
                  <br />
                  in one place.
                </h3>
              </div>

              <span className="login-preview-live">
                <span></span>
                Live
              </span>

            </div>


            <div className="login-preview-grid">

              <div className="login-preview-stat">

                <span>
                  Next appointment
                </span>

                <strong>
                  13:00
                </strong>

                <small>
                  Appointment scheduled
                </small>

              </div>


              <div className="login-preview-stat">

                <span>
                  Queue position
                </span>

                <strong>
                  #03
                </strong>

                <small>
                  2 patients ahead
                </small>

              </div>

            </div>


            <div className="login-preview-progress">

              <div className="login-progress-heading">

                <span>
                  Queue progress
                </span>

                <strong>
                  65%
                </strong>

              </div>

              <div className="login-progress-track">
                <div className="login-progress-fill"></div>
              </div>

            </div>

          </div>

        </div>


        <div className="login-brand-footer">

          <span className="login-footer-dot"></span>

          Secure healthcare management

        </div>

      </section>


      {/* =====================================================
          LOGIN PANEL
      ===================================================== */}

      <section className="login-form-panel">

        <div className="login-form-wrapper">

          <Link
            to="/"
            className="login-back-link login-back-mobile"
          >
            ← Back to website
          </Link>


          <div className="login-heading">

            <span className="login-eyebrow">
              WELCOME BACK
            </span>

            <h2>
              Sign in to Smart Health
            </h2>

            <p>
              Enter your credentials to access your account.
            </p>

          </div>


          {/* =================================================
              ROLE SELECTOR
          ================================================= */}

          <div className="login-role-selector">

            <button
              type="button"
              className={
                role === "patient"
                  ? "login-role-button active"
                  : "login-role-button"
              }
              onClick={() => {
                setRole("patient");
                setError("");
              }}
            >

              <span className="login-role-icon">
                ◉
              </span>

              <span className="login-role-text">
                <strong>
                  Patient
                </strong>

                <small>
                  Manage your appointments
                </small>
              </span>

              {role === "patient" && (
                <span className="login-role-check">
                  ✓
                </span>
              )}

            </button>


            <button
              type="button"
              className={
                role === "doctor"
                  ? "login-role-button active"
                  : "login-role-button"
              }
              onClick={() => {
                setRole("doctor");
                setError("");
              }}
            >

              <span className="login-role-icon">
                +
              </span>

              <span className="login-role-text">

                <strong>
                  Doctor
                </strong>

                <small>
                  Manage your patients
                </small>

              </span>

              {role === "doctor" && (
                <span className="login-role-check">
                  ✓
                </span>
              )}

            </button>

          </div>


          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="login-alert">

              <span className="login-alert-icon">
                !
              </span>

              <p>
                {error}
              </p>

            </div>
          )}


          {/* =================================================
              FORM
          ================================================= */}

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >

            <div className="login-field">

              <label htmlFor="email">
                Email address
              </label>

              <div className="login-input-wrapper">

                <span className="login-input-icon">
                  @
                </span>

                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  autoComplete="email"
                  required
                />

              </div>

            </div>


            <div className="login-field">

              <div className="login-password-heading">

                <label htmlFor="password">
                  Password
                </label>

                <button
                  type="button"
                  className="login-forgot"
                  onClick={() =>
                    setError(
                      "Password recovery will be added later."
                    )
                  }
                >
                  Forgot password?
                </button>

              </div>

              <div className="login-input-wrapper">

                <span className="login-input-icon">
                  •
                </span>

                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  autoComplete="current-password"
                  required
                />

              </div>

            </div>


            <label className="login-remember">

              <input
                type="checkbox"
              />

              <span>
                Remember me
              </span>

            </label>


            <button
              type="submit"
              className="login-submit-button"
              disabled={loading}
            >

              <span>
                {loading
                  ? "Signing in..."
                  : `Sign in as ${
                      role === "patient"
                        ? "patient"
                        : "doctor"
                    }`}
              </span>

              <span className="login-submit-arrow">
                {loading ? "..." : "→"}
              </span>

            </button>

          </form>


          {/* =================================================
              REGISTER
          ================================================= */}

          <div className="login-register-row">

            <span>
              Don't have an account?
            </span>

            <Link to="/register">
              Create account
            </Link>

          </div>


          <div className="login-security-note">

            <span>
              ✓
            </span>

            <span>
              Your account information is handled securely.
            </span>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Login;