import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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

      /*
        Save the JWT returned by FastAPI.
        We keep the token in localStorage so it can be used
        for authenticated API requests later.
      */
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

      // Temporary dashboard routes.
      // We will create these pages next.
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
      {/* =========================================
          LEFT SIDE
      ========================================== */}
      <div className="login-visual">
        <div className="login-brand">
          <div className="logo-mark">+</div>
          <span>Smart Health</span>
        </div>

        <div className="login-visual-content">
          <span className="section-label">
            SMART HEALTH
          </span>

          <h1>
            Better healthcare
            <span> starts here.</span>
          </h1>

          <p>
            Access your appointments, follow your queue,
            and stay connected with your healthcare team.
          </p>

          <div className="login-preview">
            <div className="login-preview-header">
              <span>Today's overview</span>

              <span className="preview-live">
                ● Live
              </span>
            </div>

            <div className="login-preview-stat">
              <div>
                <small>Next appointment</small>
                <strong>13:00</strong>
              </div>

              <div className="preview-icon">
                ◷
              </div>
            </div>

            <div className="login-preview-stat">
              <div>
                <small>Queue position</small>
                <strong>#03</strong>
              </div>

              <div className="preview-icon">
                #
              </div>
            </div>

            <div className="preview-progress">
              <div className="preview-progress-label">
                <span>Queue progress</span>
                <span>65%</span>
              </div>

              <div className="preview-progress-bar">
                <div></div>
              </div>
            </div>
          </div>
        </div>

        <div className="login-visual-footer">
          Secure healthcare management
        </div>
      </div>

      {/* =========================================
          RIGHT SIDE
      ========================================== */}
      <div className="login-form-area">
        <div className="login-form-container">

          <Link to="/" className="login-back">
            ← Back to website
          </Link>

          <div className="login-form-heading">
            <span className="section-label">
              WELCOME BACK
            </span>

            <h2>Sign in to Smart Health</h2>

            <p>
              Enter your credentials to access your account.
            </p>
          </div>

          {/* =====================================
              ROLE SELECTOR
          ====================================== */}
          <div className="role-selector">
            <button
              type="button"
              className={
                role === "patient"
                  ? "role-button active"
                  : "role-button"
              }
              onClick={() => {
                setRole("patient");
                setError("");
              }}
            >
              <span>♙</span>
              Patient
            </button>

            <button
              type="button"
              className={
                role === "doctor"
                  ? "role-button active"
                  : "role-button"
              }
              onClick={() => {
                setRole("doctor");
                setError("");
              }}
            >
              <span>♙</span>
              Doctor
            </button>
          </div>

          {/* =====================================
              ERROR MESSAGE
          ====================================== */}
          {error && (
            <div className="login-error">
              <span>!</span>
              <p>{error}</p>
            </div>
          )}

          {/* =====================================
              LOGIN FORM
          ====================================== */}
          <form
            className="login-form"
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <label htmlFor="email">
                Email address
              </label>

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

            <div className="form-group">
              <div className="password-label">
                <label htmlFor="password">
                  Password
                </label>

                <button
                  type="button"
                  className="forgot-password"
                  onClick={() =>
                    setError(
                      "Password recovery will be added later."
                    )
                  }
                >
                  Forgot password?
                </button>
              </div>

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

            <label className="remember-me">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>

            <button
              type="submit"
              className="login-submit"
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

              <span>
                {loading ? "..." : "→"}
              </span>
            </button>
          </form>

          <div className="login-divider">
            <span></span>
            <small>or</small>
            <span></span>
          </div>

          <div className="login-register">
            <span>
              Don't have an account?
            </span>

            <Link to="/register">
              Create account
            </Link>
          </div>

          <p className="login-note">
            Your account information is handled through
            the Smart Health backend.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;