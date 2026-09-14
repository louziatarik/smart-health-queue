
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

  const apiUrl =
    import.meta.env.VITE_API_URL ||
    "http://127.0.0.1:8000";

  /* =========================
     DATE / TIME HELPERS
  ========================== */

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) return "—";

    const [hours, minutes] = time.split(":");

    if (
      hours === undefined ||
      minutes === undefined
    ) {
      return time;
    }

    const date = new Date();

    date.setHours(
      Number(hours),
      Number(minutes),
      0,
      0
    );

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  /* =========================
     LOAD DASHBOARD
  ========================== */

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
          localStorage.removeItem(
            "smartHealthToken"
          );

          localStorage.removeItem(
            "smartHealthRole"
          );

          navigate("/login", {
            replace: true,
          });

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
           
           404 means no active queue.
        ========================== */

        let queueData = null;

        if (queueResponse.ok) {
          queueData =
            await queueResponse.json();
        } else if (
          queueResponse.status !== 404
        ) {
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
  }, [
    apiUrl,
    navigate,
    role,
    token,
  ]);

  /* =========================
     CANCEL APPOINTMENT
  ========================== */

  const handleCancelAppointment = async (
    appointmentId
  ) => {
    if (!appointmentId) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `${apiUrl}/appointments/${appointmentId}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const data =
        await response.json();

      if (response.status === 401) {
        localStorage.removeItem(
          "smartHealthToken"
        );

        localStorage.removeItem(
          "smartHealthRole"
        );

        navigate("/login", {
          replace: true,
        });

        return;
      }

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Unable to cancel appointment."
        );
      }

      window.location.reload();
    } catch (err) {
      console.error(
        "Cancel appointment error:",
        err
      );

      setError(
        err.message ||
          "Unable to cancel the appointment."
      );
    }
  };

  /* =========================
     LOGOUT
  ========================== */

  const handleLogout = () => {
    localStorage.removeItem(
      "smartHealthToken"
    );

    localStorage.removeItem(
      "smartHealthRole"
    );

    navigate("/login", {
      replace: true,
    });
  };

  /* =========================
     DATA HELPERS
  ========================== */

  const firstName =
    profile?.name?.split(" ")[0] ||
    "there";

  const upcomingAppointments =
    appointments.filter(
      (appointment) =>
        appointment.status !== "COMPLETED" &&
        appointment.status !== "CANCELLED"
    );

  const nextAppointment =
    upcomingAppointments.length > 0
      ? upcomingAppointments[0]
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
  const peopleAhead =
    queue?.people_ahead ?? 0;

  const estimatedWait =
    queue?.estimated_waiting_time ??
    queue?.predicted_waiting_time ??
    queue?.waiting_time ??
    null;

  const queueDoctor =
    queue?.doctor_specialization ||
    "Healthcare";

  const queueDepartment =
    queue?.department ||
    "";
  return (
    <div className="patient-dashboard">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="patient-sidebar">

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
            href="/profile"
            className="dashboard-nav-item"
          >
            <span>♙</span>
            Profile
          </a>

        </nav>

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
                {profile?.name ||
                  "Patient"}
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
                    {nextAppointment
                      ? formatTime(
                          nextAppointment.time ||
                            nextAppointment.appointment_time
                        )
                      : "—"}
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
                          "Unknown Doctor"}
                      </strong>

                      <span>
                        {nextAppointment.specialization ||
                          "Healthcare appointment"}
                      </span>

                      <small className="appointment-department">
                        {nextAppointment.department ||
                          ""}
                      </small>

                    </div>

                    <div className="appointment-date">

                      <strong>
                        {formatDate(
                          nextAppointment.date ||
                            nextAppointment.appointment_date
                        )}
                      </strong>

                      <span>
                        {formatTime(
                          nextAppointment.time ||
                            nextAppointment.appointment_time
                        )}
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

                  {queue && (
                    <span className="queue-live-badge">
                      ● Live
                    </span>
                  )}

                </div>

                {queue ? (
                  <>
                    <div className="queue-main-display">

                      <div>
                        <span className="queue-number-label">
                          YOUR NUMBER
                        </span>

                        <div className="big-queue-number">
                          #{queueNumber}
                        </div>

                        <p className="queue-position-label">
                          Current position in queue
                        </p>
                      </div>

                      <div className="queue-wait-card">

                        <span>
                          ESTIMATED WAIT
                        </span>

                        <strong>
                          {estimatedWait !== null
                            ? `${estimatedWait} min`
                            : "Calculating..."}
                        </strong>

                        <small>
                          AI-powered estimate
                        </small>

                      </div>

                    </div>

                    <div className="queue-details">

                      <div className="queue-detail-item">

                        <span>
                          Status
                        </span>

                        <strong
                          className={`queue-status-${queueStatus.toLowerCase()}`}
                        >
                          {queueStatus}
                        </strong>

                      </div>

                      <div className="queue-detail-item">

                        <span>
                          Patients ahead
                        </span>

                        <strong>
                          {peopleAhead}
                        </strong>

                      </div>

                      <div className="queue-detail-item">

                        <span>
                          Appointment
                        </span>

                        <strong>
                          {formatTime(
                            queue.appointment_time
                          )}
                        </strong>

                      </div>

                    </div>

                    <div className="queue-doctor-info">

                      <div className="queue-doctor-icon">
                        +
                      </div>

                      <div>
                        <span>
                          Your appointment
                        </span>

                        <strong>
                          {queueDoctor}
                        </strong>

                        {queueDepartment && (
                          <small>
                            {queueDepartment}
                          </small>
                        )}
                      </div>

                    </div>

                  </>
                ) : (
                  <div className="empty-state">

                    <div>
                      #
                    </div>

                    <strong>
                      No active queue
                    </strong>

                    <span>
                      When you book an appointment,
                      your queue position will appear here.
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
                        (
                          appointment,
                          index
                        ) => (
                          <tr
                            key={
                              appointment.id ||
                              appointment.appointment_id ||
                              index
                            }
                          >

                            <td>
                              {formatDate(
                                appointment.date ||
                                  appointment.appointment_date
                              )}
                            </td>

                            <td>
                              {formatTime(
                                appointment.time ||
                                  appointment.appointment_time
                              )}
                            </td>

                            <td>

                              <strong className="table-doctor-name">
                                {appointment.doctor_name ||
                                  "Unknown Doctor"}
                              </strong>

                              <small className="table-doctor-specialization">
                                {appointment.specialization ||
                                  ""}
                              </small>

                            </td>

                            <td>

                              <div className="appointment-actions">

                                <span className="appointment-status">
                                  {appointment.status ||
                                    "Scheduled"}
                                </span>

                                {appointment.status !==
                                  "COMPLETED" &&
                                  appointment.status !==
                                    "CANCELLED" &&
                                  appointment.id && (
                                    <button
                                      type="button"
                                      className="appointment-cancel-button"
                                      onClick={() =>
                                        handleCancelAppointment(
                                          appointment.id
                                        )
                                      }
                                    >
                                      Cancel
                                    </button>
                                  )}

                              </div>

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

            
          </>
        )}

      </main>

    </div>
  );
}

export default PatientDashboard;

