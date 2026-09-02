import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState("patient");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;

      const endpoint =
        role === "patient"
          ? "/patients/register"
          : "/doctors/register";

      const body = {
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim(),
        date_of_birth: dateOfBirth,
      };

      const response = await fetch(
        `${apiUrl}${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        let message = "Registration failed.";

        if (typeof data.detail === "string") {
          message = data.detail;
        } else if (Array.isArray(data.detail)) {
          message = data.detail
            .map((item) => item.msg)
            .join(", ");
        }

        throw new Error(message);
      }

      setSuccess(
        "Account created successfully. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      console.error(err);

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
      {/* LEFT */}
      <div className="login-visual">
        <div className="login-brand">
          <div className="logo-mark">+</div>
          <span>Smart Health</span>
        </div>

        <div className="login-visual-content">
          <span className="section-label">
            JOIN SMART HEALTH
          </span>

          <h1>
            Healthcare
            <span> made simpler.</span>
          </h1>

          <p>
            Create your Smart Health account and manage
            appointments and healthcare information from
            one place.
          </p>

          <div className="login-preview">
            <div className="login-preview-header">
              <span>Smart Health</span>
              <span className="preview-live">
                ● Connected
              </span>
            </div>

            <div className="login-preview-stat">
              <div>
                <small>Appointments</small>
                <strong>24/7</strong>
              </div>

              <div className="preview-icon">◷</div>
            </div>

            <div className="login-preview-stat">
              <div>
                <small>Queue tracking</small>
                <strong>Live</strong>
              </div>

              <div className="preview-icon">#</div>
            </div>

            <div className="preview-progress">
              <div className="preview-progress-label">
                <span>Healthcare journey</span>
                <span>Simple</span>
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

      {/* RIGHT */}
      <div className="login-form-area">
        <div className="login-form-container">

          <Link to="/" className="login-back">
            ← Back to website
          </Link>

          <div className="login-form-heading">
            <span className="section-label">
              CREATE ACCOUNT
            </span>

            <h2>Join Smart Health</h2>

            <p>
              Create your account to start your healthcare
              journey.
            </p>
          </div>

          {/* ROLE */}
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

          {/* ERROR */}
          {error && (
            <div className="login-error">
              <span>!</span>
              <p>{error}</p>
            </div>
          )}

          {/* SUCCESS */}
          {success && (
            <div className="register-success">
              <span>✓</span>
              <p>{success}</p>
            </div>
          )}

          {/* FORM */}
          <form
            className="login-form"
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <label htmlFor="register-name">
                Full name
              </label>

              <input
                id="register-name"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="register-email">
                Email address
              </label>

              <input
                id="register-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="register-phone">
                Phone number
              </label>

              <input
                id="register-phone"
                type="tel"
                placeholder="+212 600000000"
                value={phone}
                onChange={(event) =>
                  setPhone(event.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="register-date">
                Date of birth
              </label>

              <input
                id="register-date"
                type="date"
                value={dateOfBirth}
                onChange={(event) =>
                  setDateOfBirth(event.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="register-password">
                Password
              </label>

              <input
                id="register-password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              <span>
                {loading
                  ? "Creating account..."
                  : `Create ${role} account`}
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
            <span>Already have an account?</span>

            <Link to="/login">
              Sign in
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Register;