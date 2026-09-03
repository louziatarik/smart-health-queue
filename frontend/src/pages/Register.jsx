import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

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
    <div className="register-page">

      {/* =====================================================
          LEFT BRAND PANEL
      ===================================================== */}

      <section className="register-brand-panel">

        <div className="register-brand-top">

          <Link to="/" className="register-logo">
            <span className="register-logo-mark">+</span>

            <span className="register-logo-text">
              Smart Health
            </span>
          </Link>

          <Link
            to="/"
            className="register-back-link register-back-link-desktop"
          >
            Back to website
            <span>↗</span>
          </Link>

        </div>


        <div className="register-brand-content">

          <span className="register-eyebrow">
            JOIN SMART HEALTH
          </span>

          <h1>
            Healthcare,
            <span> made simpler.</span>
          </h1>

          <p>
            Create your Smart Health account and manage appointments,
            queue information, and your healthcare journey from one
            simple platform.
          </p>


          <div className="register-preview-card">

            <div className="register-preview-top">

              <div>
                <span className="register-preview-label">
                  SMART HEALTH
                </span>

                <h3>
                  Your healthcare,
                  <br />
                  in one place.
                </h3>
              </div>

              <span className="register-preview-live">
                <span></span>
                Connected
              </span>

            </div>


            <div className="register-preview-grid">

              <div className="register-preview-stat">

                <span>Appointments</span>

                <strong>
                  24/7
                </strong>

                <small>
                  Easy scheduling
                </small>

              </div>


              <div className="register-preview-stat">

                <span>Queue tracking</span>

                <strong>
                  LIVE
                </strong>

                <small>
                  Stay updated
                </small>

              </div>

            </div>


            <div className="register-preview-flow">

              <div className="register-flow-heading">
                <span>
                  Patient journey
                </span>

                <span>
                  Simple
                </span>
              </div>

              <div className="register-flow-track">
                <div className="register-flow-fill"></div>
              </div>

              <div className="register-flow-steps">
                <span>Book</span>
                <span>Track</span>
                <span>Visit</span>
              </div>

            </div>

          </div>

        </div>


        <div className="register-brand-footer">
          <span className="register-footer-dot"></span>
          Secure healthcare management
        </div>

      </section>


      {/* =====================================================
          FORM PANEL
      ===================================================== */}

      <section className="register-form-panel">

        <div className="register-form-wrapper">

          <Link
            to="/"
            className="register-back-link register-back-link-mobile"
          >
            ← Back to website
          </Link>


          <div className="register-heading">

            <span className="register-eyebrow">
              CREATE ACCOUNT
            </span>

            <h2>
              Join Smart Health
            </h2>

            <p>
              Create your account to begin your healthcare journey.
            </p>

          </div>


          {/* =================================================
              ROLE SELECTOR
          ================================================= */}

          <div className="register-role-selector">

            <button
              type="button"
              className={
                role === "patient"
                  ? "register-role-button active"
                  : "register-role-button"
              }
              onClick={() => {
                setRole("patient");
                setError("");
              }}
            >
              <span className="register-role-icon">
                ◉
              </span>

              <span>
                <strong>Patient</strong>
                <small>Manage your care</small>
              </span>

              {role === "patient" && (
                <span className="register-role-check">
                  ✓
                </span>
              )}
            </button>


            <button
              type="button"
              className={
                role === "doctor"
                  ? "register-role-button active"
                  : "register-role-button"
              }
              onClick={() => {
                setRole("doctor");
                setError("");
              }}
            >
              <span className="register-role-icon">
                +
              </span>

              <span>
                <strong>Doctor</strong>
                <small>Manage your patients</small>
              </span>

              {role === "doctor" && (
                <span className="register-role-check">
                  ✓
                </span>
              )}
            </button>

          </div>


          {/* =================================================
              ALERTS
          ================================================= */}

          {error && (
            <div className="register-alert register-alert-error">

              <span className="register-alert-icon">
                !
              </span>

              <p>
                {error}
              </p>

            </div>
          )}


          {success && (
            <div className="register-alert register-alert-success">

              <span className="register-alert-icon">
                ✓
              </span>

              <p>
                {success}
              </p>

            </div>
          )}


          {/* =================================================
              FORM
          ================================================= */}

          <form
            className="register-form"
            onSubmit={handleSubmit}
          >

            <div className="register-form-row">

              <div className="register-field">

                <label htmlFor="register-name">
                  Full name
                </label>

                <div className="register-input-wrap">

                  <span className="register-input-icon">
                    ◯
                  </span>

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

              </div>


              <div className="register-field">

                <label htmlFor="register-email">
                  Email address
                </label>

                <div className="register-input-wrap">

                  <span className="register-input-icon">
                    @
                  </span>

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

              </div>

            </div>


            <div className="register-form-row">

              <div className="register-field">

                <label htmlFor="register-phone">
                  Phone number
                </label>

                <div className="register-input-wrap">

                  <span className="register-input-icon">
                    #
                  </span>

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

              </div>


              <div className="register-field">

                <label htmlFor="register-date">
                  Date of birth
                </label>

                <div className="register-input-wrap">

                  <span className="register-input-icon">
                    ◷
                  </span>

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

              </div>

            </div>


            <div className="register-field">

              <label htmlFor="register-password">
                Password
              </label>

              <div className="register-input-wrap">

                <span className="register-input-icon">
                  •
                </span>

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

              <small className="register-helper">
                Use at least 6 characters.
              </small>

            </div>


            <button
              type="submit"
              className="register-submit"
              disabled={loading}
            >

              <span>
                {loading
                  ? "Creating account..."
                  : `Create ${role} account`}
              </span>

              <span className="register-submit-arrow">
                {loading ? "..." : "→"}
              </span>

            </button>

          </form>


          <div className="register-login-row">

            <span>
              Already have an account?
            </span>

            <Link to="/login">
              Sign in
            </Link>

          </div>


          <div className="register-security-note">

            <span>✓</span>

            <span>
              Your information is handled securely.
            </span>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Register;