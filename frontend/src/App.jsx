import DoctorDashboard from "./pages/DoctorDashboard";
import "./App.css";

import { Routes, Route, Link } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import PatientDashboard from "./pages/PatientDashboard";
import BookAppointment from "./pages/BookAppointment";
/* =========================================================
   HOME PAGE
========================================================= */

function Home() {
  return (
    <div className="app">
      {/* =========================
          NAVBAR
      ========================== */}
      <header className="navbar">
        <div className="nav-logo">
          <div className="logo-mark">+</div>
          <span>Smart Health</span>
        </div>

        <nav className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#about">About</a>
        </nav>

        <div className="nav-actions">
          <Link to="/login" className="login-link">
            Log in
          </Link>

          <Link to="/login" className="nav-cta">
            Get Started
          </Link>
        </div>
      </header>

      {/* =========================
          HERO
      ========================== */}
      <section className="hero" id="home">
        <div className="hero-background">
          <div className="hero-glow glow-one"></div>
          <div className="hero-glow glow-two"></div>
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            Smart healthcare management
          </div>

          <h1>
            Healthcare,
            <span> reimagined.</span>
          </h1>

          <p className="hero-subtitle">
            Smarter healthcare.
            <br />
            Less waiting.
          </p>

          <p className="hero-description">
            Smart Health helps patients book appointments, track their
            position in real-time, and connect with healthcare providers
            through one simple platform.
          </p>

          <div className="hero-actions">
            <Link to="/login" className="btn-primary">
              Get Started
              <span>→</span>
            </Link>

            <a href="#how-it-works" className="btn-secondary">
              See how it works
            </a>
          </div>

          <div className="hero-trust">
            <div className="trust-avatars">
              <div className="avatar">👨‍⚕️</div>
              <div className="avatar">👩‍⚕️</div>
              <div className="avatar">👨‍💻</div>
              <div className="avatar">+</div>
            </div>

            <div>
              <strong>Built for modern healthcare</strong>
              <span>Patients • Doctors • Clinics</span>
            </div>
          </div>
        </div>

        {/* =========================
            DASHBOARD PREVIEW
        ========================== */}
        <div className="hero-dashboard">
          <div className="dashboard-window">
            <div className="window-topbar">
              <div className="window-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div className="window-title">
                Smart Health Dashboard
              </div>

              <div className="window-status">
                ● Live
              </div>
            </div>

            <div className="dashboard-body">
              <aside className="dashboard-sidebar">
                <div className="mini-logo">
                  <span>+</span>
                </div>

                <div className="sidebar-item active">
                  <span>⌂</span>
                  Dashboard
                </div>

                <div className="sidebar-item">
                  <span>◷</span>
                  Appointments
                </div>

                <div className="sidebar-item">
                  <span>♧</span>
                  Queue
                </div>

                <div className="sidebar-item">
                  <span>♡</span>
                  Patients
                </div>

                <div className="sidebar-item">
                  <span>⚙</span>
                  Settings
                </div>
              </aside>

              <main className="dashboard-main">
                <div className="dashboard-heading">
                  <div>
                    <small>Wednesday, September 2</small>
                    <h3>Good morning 👋</h3>
                  </div>

                  <div className="profile-circle">U</div>
                </div>

                <div className="dashboard-stats">
                  <div className="stat-card">
                    <span className="stat-icon">◷</span>

                    <div>
                      <small>Next appointment</small>
                      <strong>13:00</strong>
                    </div>
                  </div>

                  <div className="stat-card">
                    <span className="stat-icon">#</span>

                    <div>
                      <small>Queue position</small>
                      <strong>#3</strong>
                    </div>
                  </div>

                  <div className="stat-card">
                    <span className="stat-icon">✓</span>

                    <div>
                      <small>Status</small>
                      <strong>Waiting</strong>
                    </div>
                  </div>
                </div>

                <div className="dashboard-grid">
                  <div className="dashboard-card appointment-card">
                    <div className="card-header">
                      <div>
                        <small>Next appointment</small>
                        <h4>Dr. Sarah Chen</h4>
                      </div>

                      <span className="status-pill">
                        Confirmed
                      </span>
                    </div>

                    <div className="doctor-row">
                      <div className="doctor-avatar">
                        SC
                      </div>

                      <div>
                        <strong>General Medicine</strong>
                        <span>Today • 13:00</span>
                      </div>
                    </div>

                    <div className="appointment-progress">
                      <div className="progress-label">
                        <span>Your appointment</span>
                        <span>65%</span>
                      </div>

                      <div className="progress-bar">
                        <div></div>
                      </div>
                    </div>
                  </div>

                  <div className="dashboard-card queue-card">
                    <div className="card-header">
                      <div>
                        <small>Live queue</small>
                        <h4>Current position</h4>
                      </div>

                      <span className="live-dot">
                        ● Live
                      </span>
                    </div>

                    <div className="queue-number">
                      <strong>03</strong>
                      <span>your position</span>
                    </div>

                    <div className="queue-info">
                      <span>2 patients ahead</span>
                      <span>~15 min</span>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>

          <div className="floating-card floating-card-one">
            <span className="floating-icon">✓</span>

            <div>
              <strong>Appointment confirmed</strong>
              <small>Today at 13:00</small>
            </div>
          </div>

          <div className="floating-card floating-card-two">
            <span className="floating-icon queue-icon">
              #
            </span>

            <div>
              <strong>Queue updated</strong>
              <small>You're now #3</small>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          FEATURES
      ========================== */}
      <section className="features-section" id="features">
        <div className="section-heading">
          <div>
            <span className="section-label">
              SMART HEALTH
            </span>

            <h2>
              Everything you need to
              <br />
              manage patient flow.
            </h2>
          </div>

          <p>
            From appointment booking to live queue tracking,
            Smart Health brings the entire patient journey
            into one simple experience.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card feature-large">
            <div className="feature-top">
              <div className="feature-icon">◷</div>
              <span>01</span>
            </div>

            <h3>Smart Appointments</h3>

            <p>
              Patients can discover available doctors,
              choose a convenient time, and manage
              appointments without unnecessary waiting.
            </p>

            <div className="mini-calendar">
              <div className="calendar-header">
                <strong>September 2026</strong>
                <span>•••</span>
              </div>

              <div className="calendar-days">
                <span>M</span>
                <span>T</span>
                <span>W</span>
                <span>T</span>
                <span>F</span>
                <span>S</span>
                <span>S</span>
              </div>

              <div className="calendar-grid">
                <span></span>
                <span>1</span>
                <span className="calendar-active">2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
                <span>6</span>

                <span>7</span>
                <span>8</span>
                <span>9</span>
                <span>10</span>
                <span>11</span>
                <span>12</span>
                <span>13</span>
              </div>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-top">
              <div className="feature-icon">#</div>
              <span>02</span>
            </div>

            <h3>Live Queue Tracking</h3>

            <p>
              See your current position and follow
              queue progress in real time.
            </p>

            <div className="queue-preview">
              <div className="queue-preview-number">
                <strong>#03</strong>
                <span>Your position</span>
              </div>

              <div className="queue-line">
                <div className="queue-person done">01</div>
                <div className="queue-person done">02</div>
                <div className="queue-person active">03</div>
                <div className="queue-person">04</div>
                <div className="queue-person">05</div>
              </div>

              <div className="queue-estimate">
                <span>Estimated wait</span>
                <strong>~15 min</strong>
              </div>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-top">
              <div className="feature-icon">♧</div>
              <span>03</span>
            </div>

            <h3>Patient Management</h3>

            <p>
              Keep patient information, appointment history,
              and queue activity organized in one place.
            </p>

            <div className="patient-preview">
              <div className="patient-row">
                <div className="patient-avatar">AM</div>

                <div>
                  <strong>Amine M.</strong>
                  <span>General Medicine</span>
                </div>

                <b>✓</b>
              </div>

              <div className="patient-row">
                <div className="patient-avatar">SK</div>

                <div>
                  <strong>Sarah K.</strong>
                  <span>Cardiology</span>
                </div>

                <b>✓</b>
              </div>

              <div className="patient-row">
                <div className="patient-avatar">YT</div>

                <div>
                  <strong>Youssef T.</strong>
                  <span>Dermatology</span>
                </div>

                <b>✓</b>
              </div>
            </div>
          </div>

          <div className="feature-card feature-dark">
            <div className="feature-top">
              <div className="feature-icon dark-icon">
                ✦
              </div>

              <span>04</span>
            </div>

            <h3>Intelligent Insights</h3>

            <p>
              Turn appointment and queue activity into
              meaningful operational insights.
            </p>

            <div className="insights-preview">
              <div className="insight-stat">
                <span>Today's patients</span>
                <strong>128</strong>
              </div>

              <div className="insight-stat">
                <span>Avg. wait time</span>
                <strong>14m</strong>
              </div>

              <div className="insight-chart">
                <span style={{ height: "35%" }}></span>
                <span style={{ height: "50%" }}></span>
                <span style={{ height: "42%" }}></span>
                <span style={{ height: "72%" }}></span>
                <span style={{ height: "60%" }}></span>
                <span style={{ height: "88%" }}></span>
                <span style={{ height: "75%" }}></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          HOW IT WORKS
      ========================== */}
      <section
        className="how-it-works-section"
        id="how-it-works"
      >
        <div className="section-heading">
          <div>
            <span className="section-label">
              HOW IT WORKS
            </span>

            <h2>
              A simpler journey
              <br />
              for every patient.
            </h2>
          </div>

          <p>
            Smart Health connects patients and healthcare
            providers through a simple digital workflow.
          </p>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">01</div>
            <div className="step-icon">⌕</div>

            <h3>Find a doctor</h3>

            <p>
              Discover doctors and available appointment
              times based on your needs.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">02</div>
            <div className="step-icon">◷</div>

            <h3>Book your appointment</h3>

            <p>
              Select a convenient time and receive your
              appointment confirmation instantly.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">03</div>
            <div className="step-icon">#</div>

            <h3>Track your queue</h3>

            <p>
              Follow your position in real time and know
              when your turn is getting closer.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">04</div>
            <div className="step-icon">✓</div>

            <h3>See your doctor</h3>

            <p>
              Arrive at the right time and avoid unnecessary
              waiting inside the clinic.
            </p>
          </div>
        </div>
      </section>

      {/* =========================
          AI PREVIEW
      ========================== */}
      <section className="ai-section" id="about">
        <div className="ai-content">
          <span className="section-label">
            COMING NEXT
          </span>

          <h2>
            Smarter waiting with
            <span> AI.</span>
          </h2>

          <p>
            Smart Health will eventually use historical
            appointment and queue data to estimate waiting
            times more intelligently.
          </p>

          <div className="ai-status">
            <span className="ai-status-dot"></span>
            AI prediction engine — coming soon
          </div>
        </div>

        <div className="ai-preview-card">
          <div className="ai-card-top">
            <div>
              <small>Predicted waiting time</small>
              <strong>~15 min</strong>
            </div>

            <div className="ai-chip">
              AI
            </div>
          </div>

          <div className="prediction-line">
            <span></span>
          </div>

          <div className="prediction-labels">
            <span>Now</span>
            <span>10 min</span>
            <span>20 min</span>
            <span>30 min</span>
          </div>
        </div>
      </section>

      {/* =========================
          FOOTER
      ========================== */}
      <footer className="footer">
        <div className="footer-brand">
          <div className="nav-logo">
            <div className="logo-mark">+</div>
            <span>Smart Health</span>
          </div>

          <p>
            Smarter healthcare. Less waiting.
          </p>
        </div>

        <div className="footer-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#home">Back to top ↑</a>
        </div>

        <div className="footer-bottom">
          © 2026 Smart Health. Healthcare management platform.
        </div>
      </footer>
    </div>
  );
}

/* =========================================================
   APP ROUTER
========================================================= */

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/patient-dashboard"
        element={<PatientDashboard />}
      />

      <Route
        path="/book-appointment"
        element={<BookAppointment />}
      />

      <Route
        path="/doctor-dashboard"
        element={<DoctorDashboard />}
      />
    </Routes>
  );
}

export default App;