import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./PatientDashboard.css";

function PatientDashboard() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [queue, setQueue] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("smartHealthToken");
  const role = localStorage.getItem("smartHealthRole");

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!token || role !== "patient") {
      navigate("/login", { replace: true });
      return;
    }

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const headers = {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        };

        const [
          profileResponse,
          appointmentsResponse,
          queueResponse,
        ] = await Promise.all([
          fetch(`${apiUrl}/patients/me`, {
            headers,
          }),

          fetch(`${apiUrl}/appointments/my`, {
            headers,
          }),

          fetch(`${apiUrl}/queue/my`, {
            headers,
          }),
        ]);

        /* =========================
           AUTHENTICATION CHECK
        ========================== */

        if (
          profileResponse.status === 401 ||
          appointmentsResponse.status === 401 ||
          queueResponse.status === 401
        ) {
          localStorage.removeItem("smartHealthToken");
          localStorage.removeItem("smartHealthRole");

          navigate("/login", { replace: true });
          return;
        }

        /* =========================
           PROFILE
        ========================== */

        if (!profileResponse.ok) {
          throw new Error(
            "Unable to load your profile."
          );
        }

        /* =========================
           APPOINTMENTS
        ========================== */

        if (!appointmentsResponse.ok) {
          throw new Error(
            "Unable to load your appointments."
          );
        }

        /* =========================
           READ DATA
        ========================== */

        const profileData =
          await profileResponse.json();

        const appointmentsData =
          await appointmentsResponse.json();

        /* =========================
           QUEUE
           
           404 is allowed because
           it means no active queue.
        ========================== */

        let queueData = null;

        if (queueResponse.ok) {
          queueData = await queueResponse.json();
        } else if (queueResponse.status !== 404) {
          throw new Error(
            "Unable to load your queue."
          );
        }

        setProfile(profileData);

        setAppointments(
          Array.isArray(appointmentsData)
            ? appointmentsData
            : []
        );

        setQueue(queueData);
      } catch (err) {
        console.error(
          "Dashboard error:",
          err
        );

        setError(
          err.message ||
            "Unable to load your dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [apiUrl, navigate, role, token]);

  /* =========================
     LOGOUT
  ========================== */

  const handleLogout = () => {
    localStorage.removeItem("smartHealthToken");
    localStorage.removeItem("smartHealthRole");

    navigate("/login", {
      replace: true,
    });
  };

  /* =========================
     DATA HELPERS
  ========================== */

  const firstName =
    profile?.name?.split(" ")[0] || "there";

  const nextAppointment =
    appointments.length > 0
      ? appointments[0]
      : null;

  const queueNumber =
    queue?.queue_number ??
    queue?.number ??
    queue?.position ??
    "—";

  const queueStatus =
    queue?.status ||
    queue?.queue_status ||
    "No active queue";

  return (
    <div className="patient-dashboard">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="patient-sidebar">

        {/* LOGO */}
        <Link
          to="/"
          className="dashboard-logo"
        >
          <div className="logo-mark">
            +
          </div>

          <span>
            Smart Health
          </span>
        </Link>

        {/* NAVIGATION */}
        <nav className="dashboard-nav">

          <a
            href="#overview"
            className="dashboard-nav-item active"
          >
            <span>⌂</span>
            Overview
          </a>

          <Link
            to="/book-appointment"
            className="dashboard-nav-item"
          >
            <span>＋</span>
            Book Appointment
          </Link>

          <a
            href="#appointments"
            className="dashboard-nav-item"
          >
            <span>◷</span>
            Appointments
          </a>

          <a
            href="#queue"
            className="dashboard-nav-item"
          >
            <span>#</span>
            My Queue
          </a>

          <a
            href="#profile"
            className="dashboard-nav-item"
          >
            <span>♙</span>
            Profile
          </a>

        </nav>

        {/* LOGOUT */}
        <button
          type="button"
          className="dashboard-logout"
          onClick={handleLogout}
        >
          <span>↪</span>
          Log out
        </button>

      </aside>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main
        className="patient-main"
        id="overview"
      >

        {/* =========================
            HEADER
        ========================== */}

        <header className="patient-header">

          <div>
            <small>
              Patient portal
            </small>

            <h1>
              Good morning, {firstName} 👋
            </h1>
          </div>

          <div className="patient-profile">

            <div className="patient-profile-avatar">
              {firstName
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <strong>
                {profile?.name || "Patient"}
              </strong>

              <span>
                {profile?.email || ""}
              </span>
            </div>

          </div>

        </header>

        {/* =========================
            ERROR
        ========================== */}

        {error && (
          <div className="dashboard-alert">
            <span>!</span>
            {error}
          </div>
        )}

        {/* =========================
            LOADING
        ========================== */}

        {loading ? (
          <div className="dashboard-loading">

            <div className="loading-spinner"></div>

            <p>
              Loading your dashboard...
            </p>

          </div>
        ) : (
          <>

            {/* =================================================
                STAT CARDS
            ================================================= */}

            <section className="patient-stats">

              <div className="patient-stat-card">

                <div className="patient-stat-icon">
                  ◷
                </div>

                <div>
                  <span>
                    Next appointment
                  </span>

                  <strong>
                    {nextAppointment?.time ||
                      nextAppointment?.appointment_time ||
                      "—"}
                  </strong>
                </div>

              </div>

              <div className="patient-stat-card">

                <div className="patient-stat-icon">
                  #
                </div>

                <div>
                  <span>
                    Queue position
                  </span>

                  <strong>
                    {queueNumber !== "—"
                      ? `#${queueNumber}`
                      : "—"}
                  </strong>
                </div>

              </div>

              <div className="patient-stat-card">

                <div className="patient-stat-icon">
                  ✓
                </div>

                <div>
                  <span>
                    Queue status
                  </span>

                  <strong>
                    {queueStatus}
                  </strong>
                </div>

              </div>

              <div className="patient-stat-card">

                <div className="patient-stat-icon">
                  +
                </div>

                <div>
                  <span>
                    Total appointments
                  </span>

                  <strong>
                    {appointments.length}
                  </strong>
                </div>

              </div>

            </section>

            {/* =================================================
                MAIN PANELS
            ================================================= */}

            <section className="patient-content-grid">

              {/* =============================
                  NEXT APPOINTMENT
              ============================== */}

              <div
                className="patient-panel appointment-panel"
                id="appointments"
              >

                <div className="panel-header">

                  <div>
                    <span>
                      UPCOMING
                    </span>

                    <h2>
                      Next appointment
                    </h2>
                  </div>

                  <Link
                    to="/book-appointment"
                    className="panel-action"
                  >
                    + Book
                  </Link>

                </div>

                {nextAppointment ? (
                  <div className="next-appointment-content">

                    <div className="appointment-doctor-avatar">
                      {(
                        nextAppointment.doctor_name ||
                        "DR"
                      )
                        .substring(0, 2)
                        .toUpperCase()}
                    </div>

                    <div className="appointment-doctor-info">

                      <strong>
                        {nextAppointment.doctor_name ||
                          `Doctor #${
                            nextAppointment.doctor_id ||
                            "—"
                          }`}
                      </strong>

                      <span>
                        {nextAppointment.department ||
                          nextAppointment.specialization ||
                          "Healthcare appointment"}
                      </span>

                    </div>

                    <div className="appointment-date">

                      <strong>
                        {nextAppointment.date ||
                          nextAppointment.appointment_date ||
                          "—"}
                      </strong>

                      <span>
                        {nextAppointment.time ||
                          nextAppointment.appointment_time ||
                          "—"}
                      </span>

                    </div>

                  </div>
                ) : (
                  <div className="empty-state">

                    <div>
                      ◷
                    </div>

                    <strong>
                      No upcoming appointments
                    </strong>

                    <span>
                      Your future appointments
                      will appear here.
                    </span>

                    <Link
                      to="/book-appointment"
                      className="empty-book-button"
                    >
                      Book an appointment →
                    </Link>

                  </div>
                )}

              </div>

              {/* =============================
                  LIVE QUEUE
              ============================== */}

              <div
                className="patient-panel queue-panel"
                id="queue"
              >

                <div className="panel-header">

                  <div>
                    <span>
                      LIVE
                    </span>

                    <h2>
                      My queue
                    </h2>
                  </div>

                  <span className="queue-live-badge">
                    ● Live
                  </span>

                </div>

                <div className="big-queue-number">
                  {queueNumber !== "—"
                    ? `#${queueNumber}`
                    : "—"}
                </div>

                <p className="queue-position-label">
                  Current position
                </p>

                <div className="queue-details">

                  <div>
                    <span>
                      Status
                    </span>

                    <strong>
                      {queueStatus}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Patients ahead
                    </span>

                    <strong>
                      {queue?.patients_ahead ??
                        "—"}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Estimated wait
                    </span>

                    <strong>
                      {queue?.estimated_wait_time ??
                        queue?.estimated_wait ??
                        "—"}
                    </strong>
                  </div>

                </div>

              </div>

            </section>

            {/* =================================================
                APPOINTMENTS TABLE
            ================================================= */}

            <section
              className="patient-panel appointments-table-panel"
            >

              <div className="panel-header">

                <div>
                  <span>
                    HISTORY
                  </span>

                  <h2>
                    My appointments
                  </h2>
                </div>

                <span className="appointment-count">
                  {appointments.length} total
                </span>

              </div>

              {appointments.length > 0 ? (
                <div className="appointments-table-wrapper">

                  <table className="appointments-table">

                    <thead>
                      <tr>
                        <th>
                          Date
                        </th>

                        <th>
                          Time
                        </th>

                        <th>
                          Doctor
                        </th>

                        <th>
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody>

                      {appointments.map(
                        (appointment, index) => (
                          <tr
                            key={
                              appointment.id ||
                              appointment.appointment_id ||
                              index
                            }
                          >

                            <td>
                              {appointment.date ||
                                appointment.appointment_date ||
                                "—"}
                            </td>

                            <td>
                              {appointment.time ||
                                appointment.appointment_time ||
                                "—"}
                            </td>

                            <td>
                              {appointment.doctor_name ||
                                `Doctor #${
                                  appointment.doctor_id ||
                                  "—"
                                }`}
                            </td>

                            <td>

                              <span className="appointment-status">
                                {appointment.status ||
                                  "Scheduled"}
                              </span>

                            </td>

                          </tr>
                        )
                      )}

                    </tbody>

                  </table>

                </div>
              ) : (
                <div className="empty-table">

                  No appointments found.

                </div>
              )}

            </section>

            {/* =================================================
                PROFILE
            ================================================= */}

            <section
              className="patient-panel profile-panel"
              id="profile"
            >

              <div className="panel-header">

                <div>
                  <span>
                    ACCOUNT
                  </span>

                  <h2>
                    My profile
                  </h2>
                </div>

              </div>

              <div className="profile-grid">

                <div>
                  <span>
                    Full name
                  </span>

                  <strong>
                    {profile?.name || "—"}
                  </strong>
                </div>

                <div>
                  <span>
                    Email
                  </span>

                  <strong>
                    {profile?.email || "—"}
                  </strong>
                </div>

                <div>
                  <span>
                    Phone
                  </span>

                  <strong>
                    {profile?.phone || "—"}
                  </strong>
                </div>

                <div>
                  <span>
                    Date of birth
                  </span>

                  <strong>
                    {profile?.date_of_birth || "—"}
                  </strong>
                </div>

              </div>

            </section>

          </>
        )}

      </main>

    </div>
  );
}

export default PatientDashboard;