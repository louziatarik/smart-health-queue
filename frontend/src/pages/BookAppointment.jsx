import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function BookAppointment() {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");

  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [booking, setBooking] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("smartHealthToken");
  const role = localStorage.getItem("smartHealthRole");

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!token || role !== "patient") {
      navigate("/login", { replace: true });
      return;
    }

    const loadDoctors = async () => {
      try {
        setLoadingDoctors(true);
        setError("");

        const response = await fetch(`${apiUrl}/doctors`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail || "Unable to load doctors."
          );
        }

        setDoctors(
          Array.isArray(data) ? data : []
        );
      } catch (err) {
        console.error("Doctors error:", err);

        setError(
          err.message ||
            "Unable to load available doctors."
        );
      } finally {
        setLoadingDoctors(false);
      }
    };

    loadDoctors();
  }, [apiUrl, navigate, role, token]);

  const handleBooking = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!doctorId) {
      setError("Please select a doctor.");
      return;
    }

    if (!appointmentDate) {
      setError("Please select an appointment date.");
      return;
    }

    if (!appointmentTime) {
      setError("Please select an appointment time.");
      return;
    }

    try {
      setBooking(true);

      const response = await fetch(
        `${apiUrl}/appointments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify({
            doctor_id: Number(doctorId),
            appointment_date: appointmentDate,
            appointment_time: appointmentTime,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("smartHealthToken");
        localStorage.removeItem("smartHealthRole");

        navigate("/login", { replace: true });
        return;
      }

      if (!response.ok) {
        let message = "Unable to book appointment.";

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
        "Appointment booked successfully!"
      );

      setTimeout(() => {
        navigate("/patient-dashboard");
      }, 1200);
    } catch (err) {
      console.error("Booking error:", err);

      setError(
        err.message ||
          "Unable to connect to the Smart Health server."
      );
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="booking-page">

      {/* SIDEBAR */}
      <aside className="booking-sidebar">
        <Link to="/" className="dashboard-logo">
          <div className="logo-mark">+</div>
          <span>Smart Health</span>
        </Link>

        <nav className="dashboard-nav">
          <Link
            to="/patient-dashboard"
            className="dashboard-nav-item"
          >
            <span>⌂</span>
            Overview
          </Link>

          <Link
            to="/book-appointment"
            className="dashboard-nav-item active"
          >
            <span>◷</span>
            Book Appointment
          </Link>
        </nav>

        <Link
          to="/patient-dashboard"
          className="booking-back-dashboard"
        >
          ← Back to dashboard
        </Link>
      </aside>

      {/* MAIN */}
      <main className="booking-main">

        <div className="booking-header">
          <span className="section-label">
            APPOINTMENTS
          </span>

          <h1>Book an appointment</h1>

          <p>
            Choose a doctor, date, and time that works
            for you.
          </p>
        </div>

        <div className="booking-layout">

          {/* FORM */}
          <section className="booking-card">

            {error && (
              <div className="login-error">
                <span>!</span>
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="register-success">
                <span>✓</span>
                <p>{success}</p>
              </div>
            )}

            <form
              className="booking-form"
              onSubmit={handleBooking}
            >

              {/* DOCTOR */}
              <div className="booking-field">
                <label htmlFor="doctor">
                  Choose doctor
                </label>

                {loadingDoctors ? (
                  <div className="booking-loading">
                    Loading doctors...
                  </div>
                ) : (
                  <select
                    id="doctor"
                    value={doctorId}
                    onChange={(event) =>
                      setDoctorId(event.target.value)
                    }
                    required
                  >
                    <option value="">
                      Select a doctor
                    </option>

                    {doctors
                      .filter(
                        (doctor) =>
                          doctor.available === 1
                      )
                      .map((doctor) => (
                        <option
                          key={doctor.id}
                          value={doctor.id}
                        >
                          {doctor.name} —{" "}
                          {doctor.specialization}
                        </option>
                      ))}
                  </select>
                )}
              </div>

              {/* SELECTED DOCTOR PREVIEW */}
              {doctorId && (
                <div className="selected-doctor">
                  {(() => {
                    const selectedDoctor =
                      doctors.find(
                        (doctor) =>
                          doctor.id ===
                          Number(doctorId)
                      );

                    if (!selectedDoctor) {
                      return null;
                    }

                    return (
                      <>
                        <div className="selected-doctor-avatar">
                          {selectedDoctor.name
                            .replace("Dr. ", "")
                            .substring(0, 2)
                            .toUpperCase()}
                        </div>

                        <div>
                          <strong>
                            {selectedDoctor.name}
                          </strong>

                          <span>
                            {selectedDoctor.specialization}
                          </span>

                          <small>
                            {selectedDoctor.department}
                          </small>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* DATE */}
              <div className="booking-field">
                <label htmlFor="appointment-date">
                  Appointment date
                </label>

                <input
                  id="appointment-date"
                  type="date"
                  value={appointmentDate}
                  onChange={(event) =>
                    setAppointmentDate(
                      event.target.value
                    )
                  }
                  min={
                    new Date()
                      .toISOString()
                      .split("T")[0]
                  }
                  required
                />
              </div>

              {/* TIME */}
              <div className="booking-field">
                <label htmlFor="appointment-time">
                  Appointment time
                </label>

                <input
                  id="appointment-time"
                  type="time"
                  value={appointmentTime}
                  onChange={(event) =>
                    setAppointmentTime(
                      event.target.value
                    )
                  }
                  required
                />
              </div>

              <button
                type="submit"
                className="booking-submit"
                disabled={
                  booking || loadingDoctors
                }
              >
                {booking
                  ? "Booking appointment..."
                  : "Book appointment"}

                <span>
                  {booking ? "..." : "→"}
                </span>
              </button>
            </form>
          </section>

          {/* SIDE INFORMATION */}
          <aside className="booking-info">

            <div className="booking-info-card">
              <span className="booking-info-icon">
                ◷
              </span>

              <h3>
                Choose a convenient time
              </h3>

              <p>
                Select a date and time that fits your
                schedule.
              </p>
            </div>

            <div className="booking-info-card">
              <span className="booking-info-icon">
                #
              </span>

              <h3>
                Join the queue
              </h3>

              <p>
                Once your appointment is created,
                your queue information can be tracked
                from your dashboard.
              </p>
            </div>

            <div className="booking-info-card booking-info-dark">
              <span className="booking-info-icon">
                ✓
              </span>

              <h3>
                Stay updated
              </h3>

              <p>
                Your appointment will appear in your
                Smart Health patient dashboard.
              </p>
            </div>

          </aside>

        </div>
      </main>
    </div>
  );
}

export default BookAppointment;