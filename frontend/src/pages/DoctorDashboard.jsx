import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./DoctorDashboard.css";

function DoctorDashboard() {
  const navigate = useNavigate();

  const [queue, setQueue] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("smartHealthToken");
  const role = localStorage.getItem("smartHealthRole");

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!token || role !== "doctor") {
      navigate("/login", { replace: true });
      return;
    }

    loadDashboard();
  }, [apiUrl, navigate, role, token]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const headers = {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      };

      const [queueResponse, appointmentsResponse] =
        await Promise.all([
          fetch(`${apiUrl}/queue/doctor`, {
            headers,
          }),

          fetch(`${apiUrl}/appointments/doctor`, {
            headers,
          }),
        ]);

      if (
        queueResponse.status === 401 ||
        appointmentsResponse.status === 401
      ) {
        localStorage.removeItem("smartHealthToken");
        localStorage.removeItem("smartHealthRole");

        navigate("/login", { replace: true });
        return;
      }

      if (!queueResponse.ok) {
        throw new Error(
          "Unable to load the doctor queue."
        );
      }

      if (!appointmentsResponse.ok) {
        throw new Error(
          "Unable to load appointments."
        );
      }

      const queueData =
        await queueResponse.json();

      const appointmentsData =
        await appointmentsResponse.json();

      setQueue(
        Array.isArray(queueData)
          ? queueData
          : []
      );

      setAppointments(
        Array.isArray(appointmentsData)
          ? appointmentsData
          : []
      );
    } catch (err) {
      console.error(
        "Doctor dashboard error:",
        err
      );

      setError(
        err.message ||
          "Unable to load the doctor dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  const performQueueAction = async (
    endpoint,
    successMessage
  ) => {
    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${apiUrl}${endpoint}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("smartHealthToken");
        localStorage.removeItem("smartHealthRole");

        navigate("/login", {
          replace: true,
        });

        return;
      }

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Queue action failed."
        );
      }

      setSuccess(successMessage);

      await loadDashboard();
    } catch (err) {
      console.error(
        "Queue action error:",
        err
      );

      setError(
        err.message ||
          "Unable to update the queue."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleCallNext = () => {
    performQueueAction(
      "/queue/doctor/call-next",
      "Next patient called successfully."
    );
  };

  const handleStart = (queueId) => {
    performQueueAction(
      `/queue/doctor/${queueId}/start`,
      "Consultation started."
    );
  };

  const handleComplete = (queueId) => {
    performQueueAction(
      `/queue/doctor/${queueId}/complete`,
      "Consultation completed."
    );
  };

  const handleSkip = (queueId) => {
    performQueueAction(
      `/queue/doctor/${queueId}/skip`,
      "Patient skipped."
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("smartHealthToken");
    localStorage.removeItem("smartHealthRole");

    navigate("/login", {
      replace: true,
    });
  };

  const waitingCount = queue.filter(
    (item) => item.status === "WAITING"
  ).length;

  const calledCount = queue.filter(
    (item) => item.status === "CALLED"
  ).length;

  const completedCount = queue.filter(
    (item) => item.status === "COMPLETED"
  ).length;

  const currentPatient =
    queue.find(
      (item) =>
        item.status === "CALLED" ||
        item.status === "IN_PROGRESS"
    ) || null;

  return (
    <div className="doctor-dashboard">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="doctor-sidebar">

        <Link
          to="/"
          className="doctor-dashboard-logo"
        >
          <div className="logo-mark">
            +
          </div>

          <span>
            Smart Health
          </span>
        </Link>

        <nav className="doctor-nav">

          <a
            href="#overview"
            className="doctor-nav-item active"
          >
            <span>⌂</span>
            Overview
          </a>

          <a
            href="#appointments"
            className="doctor-nav-item"
          >
            <span>◷</span>
            Appointments
          </a>

          <a
            href="#queue"
            className="doctor-nav-item"
          >
            <span>#</span>
            Live Queue
          </a>

        </nav>

        <button
          type="button"
          className="doctor-logout"
          onClick={handleLogout}
        >
          <span>↪</span>
          Log out
        </button>

      </aside>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main
        className="doctor-main"
        id="overview"
      >

        {/* HEADER */}

        <header className="doctor-header">

          <div>
            <small>
              Doctor portal
            </small>

            <h1>
              Today's overview
            </h1>
          </div>

          <div className="doctor-status">
            <span className="doctor-status-dot"></span>
            Clinic online
          </div>

        </header>

        {/* ALERTS */}

        {error && (
          <div className="doctor-alert error">
            <span>!</span>
            {error}
          </div>
        )}

        {success && (
          <div className="doctor-alert success">
            <span>✓</span>
            {success}
          </div>
        )}

        {/* LOADING */}

        {loading ? (
          <div className="doctor-loading">

            <div className="doctor-spinner"></div>

            <p>
              Loading your dashboard...
            </p>

          </div>
        ) : (
          <>

            {/* =================================================
                STATS
            ================================================= */}

            <section className="doctor-stats">

              <div className="doctor-stat-card">

                <div className="doctor-stat-icon">
                  ◷
                </div>

                <div>
                  <span>
                    Today's appointments
                  </span>

                  <strong>
                    {appointments.length}
                  </strong>
                </div>

              </div>

              <div className="doctor-stat-card">

                <div className="doctor-stat-icon">
                  #
                </div>

                <div>
                  <span>
                    Waiting patients
                  </span>

                  <strong>
                    {waitingCount}
                  </strong>
                </div>

              </div>

              <div className="doctor-stat-card">

                <div className="doctor-stat-icon">
                  !
                </div>

                <div>
                  <span>
                    Currently called
                  </span>

                  <strong>
                    {calledCount}
                  </strong>
                </div>

              </div>

              <div className="doctor-stat-card">

                <div className="doctor-stat-icon">
                  ✓
                </div>

                <div>
                  <span>
                    Completed
                  </span>

                  <strong>
                    {completedCount}
                  </strong>
                </div>

              </div>

            </section>

            {/* =================================================
                QUEUE CONTROL
            ================================================= */}

            <section
              className="doctor-content-grid"
              id="queue"
            >

              <div className="doctor-panel live-queue-panel">

                <div className="doctor-panel-header">

                  <div>
                    <span>
                      LIVE QUEUE
                    </span>

                    <h2>
                      Patient flow
                    </h2>
                  </div>

                  <span className="live-badge">
                    ● Live
                  </span>

                </div>

                <div className="queue-control">

                  <div className="current-patient-card">

                    <span>
                      CURRENT PATIENT
                    </span>

                    {currentPatient ? (
                      <>
                        <strong>
  {currentPatient.patient_name ||
    "Unknown Patient"}
</strong>

<small>
  Queue #{currentPatient.queue_number}
  {" • "}
  Appointment #{currentPatient.appointment_id}
</small>

                        <span className="current-status">
                          {currentPatient.status}
                        </span>
                      </>
                    ) : (
                      <>
                        <strong>
                          No patient called
                        </strong>

                        <small>
                          Call the next patient when ready.
                        </small>
                      </>
                    )}

                  </div>

                  <button
                    type="button"
                    className="call-next-button"
                    onClick={handleCallNext}
                    disabled={
                      actionLoading ||
                      waitingCount === 0
                    }
                  >
                    <span>
                      {actionLoading
                        ? "Updating..."
                        : "Call next patient"}
                    </span>

                    <span>
                      →
                    </span>
                  </button>

                </div>

                {/* QUEUE LIST */}

                <div className="queue-list">

                  {queue.length === 0 ? (
                    <div className="queue-empty">
                      <div>✓</div>

                      <strong>
                        Queue is empty
                      </strong>

                      <span>
                        There are no patients waiting.
                      </span>
                    </div>
                  ) : (
                    queue.map((item) => (
                      <div
                        className="queue-row"
                        key={item.queue_id}
                      >

                        <div className="queue-number">
                          #{item.queue_number}
                        </div>

                        <div className="queue-patient-info">

 <strong>
  {item.patient_name || "Unknown Patient"}
</strong>

<span>
  Queue #{item.queue_number}
  {" • "}
  Appointment #{item.appointment_id}
</span>

<small>
  {item.appointment_date}
  {" • "}
  {item.appointment_time}
</small>

                        </div>

                        <div className="queue-actions">

                          <span
                            className={`queue-status status-${item.status.toLowerCase()}`}
                          >
                            {item.status}
                          </span>

                          {item.status === "CALLED" && (
                            <button
                              type="button"
                              onClick={() =>
                                handleStart(
                                  item.queue_id
                                )
                              }
                              disabled={
                                actionLoading
                              }
                            >
                              Start
                            </button>
                          )}

                          {item.status === "IN_PROGRESS" && (
                            <button
                              type="button"
                              onClick={() =>
                                handleComplete(
                                  item.queue_id
                                )
                              }
                              disabled={
                                actionLoading
                              }
                            >
                              Complete
                            </button>
                          )}

                          {item.status === "WAITING" && (
                            <button
                              type="button"
                              onClick={() =>
                                handleSkip(
                                  item.queue_id
                                )
                              }
                              disabled={
                                actionLoading
                              }
                            >
                              Skip
                            </button>
                          )}

                        </div>

                      </div>
                    ))
                  )}

                </div>

              </div>

              {/* =================================================
                  TODAY'S APPOINTMENTS
              ================================================= */}

              <div
                className="doctor-panel today-panel"
                id="appointments"
              >

                <div className="doctor-panel-header">

                  <div>
                    <span>
                      SCHEDULE
                    </span>

                    <h2>
                      Today's appointments
                    </h2>
                  </div>

                  <span className="appointment-count">
                    {appointments.length}
                  </span>

                </div>

                <div className="doctor-appointment-list">

                  {appointments.length === 0 ? (
                    <div className="queue-empty">
                      <div>◷</div>

                      <strong>
                        No appointments
                      </strong>

                      <span>
                        Your appointment list is empty.
                      </span>
                    </div>
                  ) : (
                    appointments.map(
                      (appointment, index) => (
                        <div
                          className="doctor-appointment-row"
                          key={
                            appointment.id ||
                            appointment.appointment_id ||
                            index
                          }
                        >

                          <div className="appointment-time">
                            {appointment.appointment_time ||
                              appointment.time ||
                              "—"}
                          </div>

                          <div>
                            <strong>
  {appointment.patient_name ||
    "Unknown Patient"}
</strong>

<span>
  Appointment #
  {appointment.id ||
    appointment.appointment_id ||
    "—"}
</span>
                          </div>

                          <span className="appointment-status">
                            {appointment.status ||
                              "SCHEDULED"}
                          </span>

                        </div>
                      )
                    )
                  )}

                </div>

              </div>

            </section>

            {/* =================================================
                QUEUE SUMMARY
            ================================================= */}

            <section className="doctor-bottom-panel">

              <div>
                <span>
                  WORKFLOW
                </span>

                <h2>
                  Manage every patient smoothly.
                </h2>

                <p>
                  Call the next patient, start the
                  consultation, then complete or skip
                  the queue entry directly from one screen.
                </p>
              </div>

              <div className="workflow-steps">

                <div className="workflow-step">
                  <span>01</span>
                  <strong>Waiting</strong>
                </div>

                <div className="workflow-arrow">
                  →
                </div>

                <div className="workflow-step">
                  <span>02</span>
                  <strong>Called</strong>
                </div>

                <div className="workflow-arrow">
                  →
                </div>

                <div className="workflow-step">
                  <span>03</span>
                  <strong>In progress</strong>
                </div>

                <div className="workflow-arrow">
                  →
                </div>

                <div className="workflow-step">
                  <span>04</span>
                  <strong>Completed</strong>
                </div>

              </div>

            </section>

          </>
        )}

      </main>
    </div>
  );
}

export default DoctorDashboard;