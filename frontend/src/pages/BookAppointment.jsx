import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./BookAppointment.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

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

  const getToday = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const getCurrentTime = () => {
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
  };

  const today = getToday();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const loadDoctors = async () => {
      try {
        setLoadingDoctors(true);
        setError("");

        const response = await fetch(`${API_URL}/doctors`);

        if (!response.ok) {
          throw new Error("Failed to load doctors");
        }

        const data = await response.json();

        setDoctors(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load doctors. Please try again.");
      } finally {
        setLoadingDoctors(false);
      }
    };

    loadDoctors();
  }, [navigate, token]);

  const selectedDoctor = doctors.find(
    (doctor) => doctor.id === Number(doctorId)
  );

  const handleDoctorChange = (event) => {
    setDoctorId(event.target.value);
    setError("");
    setSuccess("");
  };

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;

    setAppointmentDate(selectedDate);

    // Reset time when date changes
    setAppointmentTime("");

    setError("");
    setSuccess("");
  };

  const handleTimeChange = (event) => {
    const selectedTime = event.target.value;

    setAppointmentTime(selectedTime);

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
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

    // Prevent booking in the past
    if (appointmentDate < today) {
      setError("Please select today or a future date.");
      return;
    }

    // If booking today, prevent selecting a past/current time
    if (
      appointmentDate === today &&
      appointmentTime <= getCurrentTime()
    ) {
      setError(
        "Please choose a future time for today's appointment."
      );
      return;
    }

    try {
      setBooking(true);

      const response = await fetch(`${API_URL}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          doctor_id: Number(doctorId),
          appointment_date: appointmentDate,
          appointment_time: appointmentTime,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("smartHealthToken");
        localStorage.removeItem("smartHealthRole");

        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to book appointment."
        );
      }

      setSuccess("Appointment booked successfully!");

      setDoctorId("");
      setAppointmentDate("");
      setAppointmentTime("");

      setTimeout(() => {
        navigate("/patient-dashboard");
      }, 1200);
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setBooking(false);
    }
  };

  const availableDoctors = doctors.filter(
    (doctor) => doctor.available === 1
  );

  return (
    <div className="book-page">
      <aside className="book-sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">+</div>
          <div>
            <h2>Smart Health</h2>
            <span>Queue System</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <Link to="/patient-dashboard" className="nav-item">
            <span>▣</span>
            Dashboard
          </Link>

          <Link
            to="/book-appointment"
            className="nav-item active"
          >
            <span>＋</span>
            Book Appointment
          </Link>
        </nav>

        <div className="sidebar-bottom">
          <Link to="/patient-dashboard" className="back-link">
            ← Back to Dashboard
          </Link>
        </div>
      </aside>

      <main className="book-main">
        <header className="book-header">
          <div>
            <p className="header-label">PATIENT PORTAL</p>
            <h1>Book an Appointment</h1>
            <p className="header-subtitle">
              Choose a doctor, date, and time for your visit.
            </p>
          </div>
        </header>

        <section className="booking-content">
          <div className="booking-card">
            <div className="booking-card-header">
              <div>
                <h2>Appointment Details</h2>
                <p>
                  Select your preferred doctor and appointment
                  time.
                </p>
              </div>
            </div>

            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="doctor">
                  Select Doctor
                </label>

                <select
                  id="doctor"
                  value={doctorId}
                  onChange={handleDoctorChange}
                  disabled={loadingDoctors || booking}
                  required
                >
                  <option value="">
                    {loadingDoctors
                      ? "Loading doctors..."
                      : "Choose a doctor"}
                  </option>

                  {availableDoctors.map((doctor) => (
                    <option
                      key={doctor.id}
                      value={doctor.id}
                    >
                      Dr. {doctor.name}
                      {doctor.specialization
                        ? ` — ${doctor.specialization}`
                        : ""}
                    </option>
                  ))}
                </select>

                {!loadingDoctors &&
                  availableDoctors.length === 0 && (
                    <p className="form-help">
                      No doctors are currently available.
                    </p>
                  )}
              </div>

              {selectedDoctor && (
                <div className="selected-doctor">
                  <div className="doctor-avatar">
                    {selectedDoctor.name
                      ? selectedDoctor.name
                          .charAt(0)
                          .toUpperCase()
                      : "D"}
                  </div>

                  <div>
                    <strong>
                      Dr. {selectedDoctor.name}
                    </strong>

                    {selectedDoctor.specialization && (
                      <span>
                        {selectedDoctor.specialization}
                      </span>
                    )}

                    <small>
                      Available for appointments
                    </small>
                  </div>
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="appointment-date">
                    Appointment Date
                  </label>

                  <input
                    id="appointment-date"
                    type="date"
                    value={appointmentDate}
                    onChange={handleDateChange}
                    min={today}
                    disabled={booking}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="appointment-time">
                    Appointment Time
                  </label>

                  <input
                    id="appointment-time"
                    type="time"
                    value={appointmentTime}
                    onChange={handleTimeChange}
                    min={
                      appointmentDate === today
                        ? getCurrentTime()
                        : undefined
                    }
                    disabled={booking}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="book-submit-btn"
                disabled={
                  booking ||
                  loadingDoctors ||
                  !selectedDoctor
                }
              >
                {booking
                  ? "Booking Appointment..."
                  : "Book Appointment"}
              </button>
            </form>
          </div>

          <div className="booking-info">
            <div className="info-card">
              <div className="info-icon">✓</div>
              <div>
                <h3>Choose your doctor</h3>
                <p>
                  Select from doctors currently available
                  for appointments.
                </p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">◷</div>
              <div>
                <h3>Select a convenient time</h3>
                <p>
                  Pick a date and future time that works
                  for you.
                </p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">+</div>
              <div>
                <h3>Join the queue</h3>
                <p>
                  After booking, your appointment will
                  receive a queue number automatically.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default BookAppointment;