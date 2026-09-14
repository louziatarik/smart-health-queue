import { Link } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  return (
    <div className="landing-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="landing-header">
        <div className="landing-container">
          <nav className="landing-nav">

            {/* Logo */}
            <Link to="/" className="landing-logo">

              <span className="landing-logo-mark">
                <span className="logo-cross-horizontal"></span>
                <span className="logo-cross-vertical"></span>

                <span className="logo-node logo-node-1"></span>
                <span className="logo-node logo-node-2"></span>
              </span>

              <span className="landing-logo-text">
                Smart <span>Health</span>
              </span>

            </Link>


            {/* Navigation */}
            <div className="landing-nav-links">
              <a href="#features">Features</a>
              <a href="#how-it-works">How it works</a>
              <a href="#about">About</a>
            </div>


            {/* Actions */}
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

          </nav>
        </div>
      </header>


      {/* =====================================================
          HERO
      ===================================================== */}

      <main>

        <section className="landing-hero">

          <div className="landing-container">

            <div className="landing-hero-grid">

              {/* Hero text */}

              <div className="landing-hero-content">

                <div className="landing-date-badge">
                  <span className="landing-date-dot"></span>
                  Digital healthcare experience
                </div>


                <h1>
                  Healthcare,
                  <span>without the waiting.</span>
                </h1>


                <p className="landing-hero-description">
                  Book appointments, follow your queue in real time,
                  and stay connected with your doctor through one
                  simple healthcare platform.
                </p>


                <div className="landing-hero-actions">

                  <Link
                    to="/register"
                    className="landing-button landing-button-primary landing-button-large"
                  >
                    Get started
                    <span>→</span>
                  </Link>

                  <a
                    href="#how-it-works"
                    className="landing-button landing-button-secondary landing-button-large"
                  >
                    See how it works
                  </a>

                </div>


                <div className="landing-hero-trust">

                  <span className="landing-trust-check">
                    ✓
                  </span>

                  Simple appointment management

                  <span className="landing-trust-separator">
                    •
                  </span>

                  Real-time queue updates

                </div>

              </div>


              {/* =================================================
                  QUEUE VISUAL
              ================================================= */}

              <div className="landing-visual-wrapper">

                <div className="landing-queue-card landing-queue-3d">

                  <div className="landing-queue-glow"></div>
                  <div className="landing-queue-highlight"></div>


                  {/* Floating badges */}

                  <div className="queue-floating-badge queue-floating-badge-top">

                    <span className="queue-floating-icon">
                      ✓
                    </span>

                    Appointment confirmed

                  </div>


                  <div className="queue-floating-badge queue-floating-badge-bottom">

                    <span className="queue-floating-icon">
                      ↗
                    </span>

                    Queue updated

                  </div>


                  {/* Queue header */}

                  <div className="landing-queue-top">

                    <div>

                      <span className="landing-eyebrow">
                        LIVE QUEUE
                      </span>

                      <div className="landing-queue-heading-row">

                        <h2>
                          Patient flow
                        </h2>

                        <span className="landing-live-badge landing-live-badge-animated">

                          <span className="landing-live-pulse"></span>

                          Live

                        </span>

                      </div>

                    </div>


                    <div className="queue-menu">

                      <span></span>
                      <span></span>
                      <span></span>

                    </div>

                  </div>


                  {/* Queue summary */}

                  <div className="landing-queue-summary">

                    <div className="landing-queue-metric">

                      <span>
                        Your position
                      </span>

                      <strong className="landing-gradient-number">
                        #03
                      </strong>

                      <div className="landing-position-progress">

                        <div className="landing-position-progress-track">
                          <div className="landing-position-progress-fill"></div>
                        </div>

                        <span>
                          66%
                        </span>

                      </div>

                      <div className="landing-metric-subtext">
                        Moving forward
                      </div>

                    </div>


                    <div className="landing-queue-metric">

                      <span>
                        Estimated wait
                      </span>

                      <strong className="landing-gradient-number">
                        18
                      </strong>

                      <div className="landing-metric-subtext">
                        minutes remaining
                      </div>

                    </div>

                  </div>


                  {/* Queue list */}

                  <div className="landing-queue-list">

                    <div className="landing-queue-item">

                      <div className="landing-queue-icon landing-queue-icon-called">
                        01
                      </div>

                      <div className="landing-patient">

                        <strong>
                          Patient
                        </strong>

                        <span>
                          Consultation
                        </span>

                      </div>

                      <span className="landing-status landing-status-called">

                        <span className="landing-status-dot"></span>

                        Called

                      </span>

                    </div>


                    <div className="landing-queue-item">

                      <div className="landing-queue-icon landing-queue-icon-waiting">
                        02
                      </div>

                      <div className="landing-patient">

                        <strong>
                          Patient
                        </strong>

                        <span>
                          Consultation
                        </span>

                      </div>

                      <span className="landing-status landing-status-waiting">

                        <span className="landing-status-dot"></span>

                        Waiting

                      </span>

                    </div>


                    <div className="landing-queue-item landing-queue-item-current">

                      <div className="landing-queue-icon landing-queue-icon-you">
                        03
                      </div>

                      <div className="landing-patient">

                        <strong>
                          You
                        </strong>

                        <span>
                          General consultation
                        </span>

                      </div>

                      <span className="landing-status landing-status-you">

                        <span className="landing-status-dot"></span>

                        You

                      </span>

                    </div>

                  </div>


                  {/* Queue footer */}

                  <div className="landing-queue-footer">

                    <div className="landing-queue-footer-label">

                      <span className="landing-footer-icon">
                        →
                      </span>

                      Patients ahead

                    </div>

                    <strong className="landing-ahead-number">
                      2
                    </strong>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            TRUST STRIP
        ===================================================== */}

        <section className="landing-trust-strip">

          <div className="landing-container">

            <div className="trust-strip-inner">

              <span>
                Designed for modern healthcare
              </span>

              <div className="trust-strip-items">

                <span>
                  Patients
                </span>

                <span>
                  Doctors
                </span>

                <span>
                  Appointments
                </span>

                <span>
                  Queue management
                </span>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            FEATURES — STEP 5
        ===================================================== */}

        <section
          className="landing-section landing-features-section"
          id="features"
        >

          <div className="landing-container">

            <div className="landing-section-title">

              <span className="landing-eyebrow">
                WHAT WE SOLVE
              </span>

              <h2>
                Everything needed for a smoother
                <span> patient experience.</span>
              </h2>

              <p>
                Smart Health connects patients, doctors and queue
                management in one simple digital experience.
              </p>

            </div>


            <div className="landing-feature-grid">


              {/* FEATURE 01 */}

              <article className="landing-feature-card feature-booking">

                <div className="landing-feature-top">

                  <span className="feature-number">
                    01
                  </span>

                  <div className="feature-icon">
                    +
                  </div>

                </div>


                <div className="feature-visual feature-calendar">

                  <div className="calendar-top">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>

                  <div className="calendar-grid">

                    <span></span>
                    <span></span>
                    <span className="active"></span>
                    <span></span>
                    <span></span>
                    <span></span>

                  </div>

                </div>


                <h3>
                  Smart Booking
                </h3>

                <p>
                  Book appointments quickly and keep your upcoming
                  visits organized in one place.
                </p>


                <div className="feature-arrow">
                  ↗
                </div>

              </article>


              {/* FEATURE 02 */}

              <article className="landing-feature-card feature-queue">

                <div className="landing-feature-top">

                  <span className="feature-number">
                    02
                  </span>

                  <div className="feature-icon">
                    ≋
                  </div>

                </div>


                <div className="feature-visual feature-queue-visual">

                  <div className="mini-queue-row">

                    <span className="mini-number">
                      01
                    </span>

                    <span className="mini-line"></span>

                    <span className="mini-dot"></span>

                  </div>


                  <div className="mini-queue-row">

                    <span className="mini-number">
                      02
                    </span>

                    <span className="mini-line"></span>

                    <span className="mini-dot"></span>

                  </div>


                  <div className="mini-queue-row active">

                    <span className="mini-number">
                      03
                    </span>

                    <span className="mini-line"></span>

                    <span className="mini-dot"></span>

                  </div>

                </div>


                <h3>
                  Live Queue
                </h3>

                <p>
                  See your position in the queue and know how many
                  patients are ahead of you.
                </p>


                <div className="feature-arrow">
                  ↗
                </div>

              </article>


              {/* FEATURE 03 */}

              <article className="landing-feature-card feature-doctor">

                <div className="landing-feature-top">

                  <span className="feature-number">
                    03
                  </span>

                  <div className="feature-icon">
                    ◉
                  </div>

                </div>


                <div className="feature-visual feature-doctor-visual">

                  <div className="doctor-avatar">
                    DR
                  </div>

                  <div className="doctor-info">

                    <strong>
                      Doctor
                    </strong>

                    <span>
                      Available today
                    </span>

                  </div>

                  <div className="doctor-status"></div>

                </div>


                <h3>
                  Doctor Dashboard
                </h3>

                <p>
                  Doctors can manage appointments, confirm patients
                  and control the queue in real time.
                </p>


                <div className="feature-arrow">
                  ↗
                </div>

              </article>


              {/* FEATURE 04 */}

              <article className="landing-feature-card feature-ai featured">

                <div className="landing-feature-top">

                  <span className="feature-number">
                    04
                  </span>

                  <div className="feature-icon">
                    ✦
                  </div>

                </div>


                <div className="feature-visual feature-ai-visual">

                  <div className="ai-orbit orbit-one"></div>

                  <div className="ai-orbit orbit-two"></div>

                  <div className="ai-core">
                    AI
                  </div>

                </div>


                <h3>
                  AI Prediction
                </h3>

                <p>
                  Intelligent predictions can estimate waiting times
                  using historical queue data.
                </p>


                <div className="feature-ai-label">
                  COMING NEXT
                </div>


                <div className="feature-arrow">
                  ↗
                </div>

              </article>

            </div>

          </div>

        </section>


        {/* =====================================================
            HOW IT WORKS
        ===================================================== */}

        <section
          className="landing-section landing-how-section"
          id="how-it-works"
        >

          <div className="landing-container">

            <div className="landing-section-title">

              <span className="landing-eyebrow">
                HOW IT WORKS
              </span>

              <h2>
                From booking to consultation.
              </h2>

              <p>
                A simple digital journey designed to reduce
                unnecessary waiting and make healthcare easier.
              </p>

            </div>


            <div className="landing-steps">


              {/* STEP 01 */}

              <div className="landing-step">

                <span className="landing-step-number">
                  01
                </span>

                <div className="step-content">

                  <div className="step-icon">
                    +
                  </div>

                  <h3>
                    Choose a doctor
                  </h3>

                  <p>
                    Find the right doctor and select an available
                    appointment.
                  </p>

                </div>

              </div>


              {/* STEP 02 */}

              <div className="landing-step">

                <span className="landing-step-number">
                  02
                </span>

                <div className="step-content">

                  <div className="step-icon">
                    ✓
                  </div>

                  <h3>
                    Book your visit
                  </h3>

                  <p>
                    Confirm your appointment and receive your queue
                    position.
                  </p>

                </div>

              </div>


              {/* STEP 03 */}

              <div className="landing-step">

                <span className="landing-step-number">
                  03
                </span>

                <div className="step-content">

                  <div className="step-icon">
                    ≋
                  </div>

                  <h3>
                    Follow the queue
                  </h3>

                  <p>
                    Monitor your position and see how many people
                    are ahead.
                  </p>

                </div>

              </div>


              {/* STEP 04 */}

              <div className="landing-step">

                <span className="landing-step-number">
                  04
                </span>

                <div className="step-content">

                  <div className="step-icon">
                    →
                  </div>

                  <h3>
                    See your doctor
                  </h3>

                  <p>
                    Arrive at the right time and complete your
                    consultation.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            AI — COMING NEXT
        ===================================================== */}

        <section className="landing-section">

          <div className="landing-container">

            <div className="landing-ai-section">

              <span className="landing-eyebrow">
                ✦ &nbsp; COMING NEXT
              </span>

              <h2>
                Smarter waiting with AI.
              </h2>

              <p>
                The next stage of Smart Health will use historical
                queue and appointment data to estimate waiting times
                and help patients plan their visits more efficiently.
              </p>

              <div className="landing-ai-badge">
                Coming soon
              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            ABOUT / CTA
        ===================================================== */}

        <section
          className="landing-section landing-cta-section"
          id="about"
        >

          <div className="landing-container">

            <div className="landing-cta">

              <div>

                <span className="landing-eyebrow">
                  SMARTER HEALTHCARE
                </span>

                <h2>
                  Spend less time waiting.
                </h2>

                <p>
                  A simpler way to manage appointments, queues
                  and the patient journey.
                </p>

              </div>


              <Link
                to="/register"
                className="landing-button landing-cta-button"
              >
                Get Started →
              </Link>

            </div>

          </div>

        </section>

      </main>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="landing-footer">

        <div className="landing-container">

          <div className="landing-footer-inner">

            <div className="landing-footer-brand">

              <Link
                to="/"
                className="landing-logo"
              >

                <span className="landing-logo-mark">

                  <span className="logo-cross-horizontal"></span>
                  <span className="logo-cross-vertical"></span>

                  <span className="logo-node logo-node-1"></span>
                  <span className="logo-node logo-node-2"></span>

                </span>

                <span className="landing-logo-text">
                  Smart <span>Health</span>
                </span>

              </Link>

              <p>
                Digital healthcare, simplified.
              </p>

            </div>


            <div className="landing-footer-links">

              <a href="#features">
                Features
              </a>

              <a href="#how-it-works">
                How it works
              </a>

              <a href="#about">
                About
              </a>

            </div>


            <div className="landing-footer-copy">
              © 2026 Smart Health
            </div>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default LandingPage;