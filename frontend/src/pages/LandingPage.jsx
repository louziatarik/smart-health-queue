import { Link } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="landing-page">
      {/* ================= HEADER ================= */}
      <header className="landing-header">
        <div className="landing-container landing-nav">
          <Link to="/" className="landing-logo">
           <span className="landing-logo-mark">
  <span className="logo-cross-horizontal"></span>
  <span className="logo-cross-vertical"></span>
  <span className="logo-node logo-node-1"></span>
  <span className="logo-node logo-node-2"></span>
</span>
            <span className="landing-logo-text">Smart Health</span>
          </Link>

          <nav className="landing-nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#about">About</a>
          </nav>

          <div className="landing-nav-actions">
            <Link
              to="/login"
              className="landing-button landing-button-outline"
            >
              Log in
            </Link>

            <Link
              to="/register"
              className="landing-button landing-button-primary"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* ================= HERO ================= */}
        <section className="landing-hero">
          <div className="landing-container landing-hero-grid">
            <div className="landing-hero-content">
              <div className="landing-date-badge">
                <span className="landing-date-dot"></span>
                {formattedDate}
              </div>

              <h1>
                Smarter healthcare.
                <span> Less waiting.</span>
              </h1>

              <p className="landing-hero-description">
                Book appointments, follow your queue, and stay connected
                with your healthcare provider through one simple experience.
              </p>

              <div className="landing-hero-actions">
                <Link
                  to="/register"
                  className="landing-button landing-button-primary landing-button-large"
                >
                  Get Started <span>→</span>
                </Link>

                <a
                  href="#how-it-works"
                  className="landing-button landing-button-secondary landing-button-large"
                >
                  See how it works
                </a>
              </div>

              <div className="landing-hero-trust">
                <span className="landing-trust-check">✓</span>
                Simple appointment management
                <span className="landing-trust-separator">•</span>
                Live queue tracking
              </div>
            </div>

            {/* ================= QUEUE PREVIEW ================= */}
            <div className="landing-queue-card landing-queue-3d">
              <div className="landing-queue-glow"></div>
              <div className="landing-queue-highlight"></div>

              <div className="landing-queue-top">
                <div>
                  <span className="landing-eyebrow">LIVE QUEUE</span>

                  <div className="landing-queue-heading-row">
                    <h2>Patient flow</h2>

                    <span className="landing-live-badge landing-live-badge-animated">
                      <span className="landing-live-pulse"></span>
                      Live
                    </span>
                  </div>
                </div>
              </div>

              <div className="landing-queue-summary landing-queue-summary-3d">
                <div className="landing-queue-metric">
                  <span>Current position</span>

                  <strong className="landing-gradient-number">#03</strong>

                  <div className="landing-position-progress">
                    <div className="landing-position-progress-track">
                      <div
                        className="landing-position-progress-fill"
                        style={{ width: "66%" }}
                      ></div>
                    </div>

                    <span>2 ahead</span>
                  </div>
                </div>

                <div className="landing-queue-metric">
                  <span>Estimated wait</span>

                  <strong className="landing-gradient-number">—</strong>

                  <div className="landing-metric-subtext">
                    Waiting for live data
                  </div>
                </div>
              </div>

              <div className="landing-queue-list">
                <div className="landing-queue-item landing-queue-item-3d">
                  <div className="landing-queue-icon landing-queue-icon-called">
                    <span>01</span>
                  </div>

                  <div className="landing-patient">
                    <strong>Patient</strong>
                    <span>Appointment</span>
                  </div>

                  <span className="landing-status landing-status-called landing-status-glow">
                    <span className="landing-status-dot"></span>
                    Called
                  </span>
                </div>

                <div className="landing-queue-item landing-queue-item-3d">
                  <div className="landing-queue-icon landing-queue-icon-waiting">
                    <span>02</span>
                  </div>

                  <div className="landing-patient">
                    <strong>Patient</strong>
                    <span>Appointment</span>
                  </div>

                  <span className="landing-status landing-status-waiting landing-status-glow">
                    <span className="landing-status-dot"></span>
                    Waiting
                  </span>
                </div>

                <div className="landing-queue-item landing-queue-item-3d landing-queue-item-current">
                  <div className="landing-queue-icon landing-queue-icon-you">
                    <span>03</span>
                  </div>

                  <div className="landing-patient">
                    <strong>Your position</strong>
                    <span>You're in the queue</span>
                  </div>

                  <span className="landing-status landing-status-you landing-status-glow">
                    <span className="landing-status-dot"></span>
                    You
                  </span>
                </div>
              </div>

              <div className="landing-queue-footer landing-queue-footer-3d">
                <div className="landing-queue-footer-label">
                  <span className="landing-footer-icon">↗</span>
                  <span>Patients ahead</span>
                </div>

                <strong className="landing-ahead-number">2</strong>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FEATURES ================= */}
        <section
          className="landing-section landing-features-section"
          id="features"
        >
          <div className="landing-container">
            <div className="landing-section-heading">
              <span className="landing-eyebrow">SMARTER CARE</span>

              <h2>
                Everything you need
                <br />
                for a better patient journey.
              </h2>

              <p>
                From booking to queue tracking, Smart Health keeps the
                experience simple for patients and healthcare providers.
              </p>
            </div>

            <div className="landing-feature-grid">
              <div className="landing-feature-card">
                <div className="landing-feature-icon">▣</div>

                <span className="landing-feature-number">01</span>

                <h3>Smart Appointments</h3>

                <p>
                  Find doctors, choose a convenient time, and book your
                  appointment without unnecessary steps.
                </p>

                <span className="landing-feature-link">
                  Easy booking →
                </span>
              </div>

              <div className="landing-feature-card">
                <div className="landing-feature-icon">◉</div>

                <span className="landing-feature-number">02</span>

                <h3>Live Queue Tracking</h3>

                <p>
                  Know your position in the queue and see how many patients
                  are ahead of you.
                </p>

                <span className="landing-feature-link">
                  Stay updated →
                </span>
              </div>

              <div className="landing-feature-card">
                <div className="landing-feature-icon">♙</div>

                <span className="landing-feature-number">03</span>

                <h3>Patient Management</h3>

                <p>
                  Healthcare providers can manage appointments, patients,
                  schedules, and queues from one place.
                </p>

                <span className="landing-feature-link">
                  Manage simply →
                </span>
              </div>

              <div className="landing-feature-card">
                <div className="landing-feature-icon">✦</div>

                <span className="landing-feature-number">04</span>

                <h3>Intelligent Insights</h3>

                <p>
                  Use healthcare queue data to understand patient flow and
                  improve the overall waiting experience.
                </p>

                <span className="landing-feature-link">
                  Smarter insights →
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section
          className="landing-section landing-how-section"
          id="how-it-works"
        >
          <div className="landing-container">
            <div className="landing-section-heading landing-section-heading-center">
              <span className="landing-eyebrow">HOW IT WORKS</span>

              <h2>A simpler journey for every patient.</h2>

              <p>
                Four simple steps from finding a doctor to completing your
                appointment.
              </p>
            </div>

            <div className="landing-steps">
              <div className="landing-step">
                <span className="landing-step-number">01</span>

                <div className="landing-step-icon">⌕</div>

                <h3>Find a doctor</h3>

                <p>
                  Browse available doctors and discover the right specialist
                  for your needs.
                </p>
              </div>

              <div className="landing-step">
                <span className="landing-step-number">02</span>

                <div className="landing-step-icon">▣</div>

                <h3>Book your appointment</h3>

                <p>
                  Choose an available time and confirm your appointment in a
                  few simple steps.
                </p>
              </div>

              <div className="landing-step">
                <span className="landing-step-number">03</span>

                <div className="landing-step-icon">◉</div>

                <h3>Track your queue</h3>

                <p>
                  Follow your position in real time so you always know what is
                  happening.
                </p>
              </div>

              <div className="landing-step">
                <span className="landing-step-number">04</span>

                <div className="landing-step-icon">✓</div>

                <h3>See your doctor</h3>

                <p>
                  Arrive at the right time and complete your healthcare
                  appointment with less waiting.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= AI SECTION ================= */}
        <section className="landing-ai-section" id="about">
          <div className="landing-container">
            <div className="landing-ai-card">
              <div className="landing-ai-content">
                <span className="landing-ai-label">
                  ✦ COMING NEXT
                </span>

                <h2>Smarter waiting with AI.</h2>

                <p>
                  Smart Health is being designed to use historical appointment
                  and queue data to provide more intelligent waiting-time
                  predictions and help healthcare providers understand patient
                  flow.
                </p>

                <span className="landing-ai-badge">
                  Coming soon
                </span>
              </div>

              <div className="landing-ai-visual">
                <div className="landing-ai-orb">
                  <span>AI</span>
                </div>

                <div className="landing-ai-line landing-ai-line-1"></div>
                <div className="landing-ai-line landing-ai-line-2"></div>
                <div className="landing-ai-line landing-ai-line-3"></div>

                <div className="landing-ai-dot landing-ai-dot-1"></div>
                <div className="landing-ai-dot landing-ai-dot-2"></div>
                <div className="landing-ai-dot landing-ai-dot-3"></div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="landing-footer">
        <div className="landing-container landing-footer-inner">
          <div className="landing-footer-brand">
            <Link to="/" className="landing-logo">
              <span className="landing-logo-mark">+</span>
              <span className="landing-logo-text">Smart Health</span>
            </Link>

            <p>Smarter healthcare. Less waiting.</p>
          </div>

          <div className="landing-footer-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#about">About</a>
          </div>

          <div className="landing-footer-copy">
            © {new Date().getFullYear()} Smart Health
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;