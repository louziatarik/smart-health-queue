import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date_of_birth: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

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

    loadProfile();
  }, [token, role, navigate, apiUrl]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${apiUrl}/patients/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("smartHealthToken");
        localStorage.removeItem("smartHealthRole");
        navigate("/login", { replace: true });
        return;
      }

      if (!response.ok) {
        throw new Error("Unable to load your profile.");
      }

      const data = await response.json();

      setProfile(data);

      setFormData({
        name: data.name || "",
        phone: data.phone || "",
        date_of_birth: data.date_of_birth || "",
      });
    } catch (err) {
      console.error("Profile error:", err);
      setError(err.message || "Unable to load your profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setError("");
    setSuccess("");

    setFormData({
      name: profile?.name || "",
      phone: profile?.phone || "",
      date_of_birth: profile?.date_of_birth || "",
    });

    setEditing(true);
  };

  const handleCancel = () => {
    setError("");
    setSuccess("");

    setFormData({
      name: profile?.name || "",
      phone: profile?.phone || "",
      date_of_birth: profile?.date_of_birth || "",
    });

    setEditing(false);
  };

  const handleSave = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch(`${apiUrl}/patients/me`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 401) {
        localStorage.removeItem("smartHealthToken");
        localStorage.removeItem("smartHealthRole");
        navigate("/login", { replace: true });
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to update your profile."
        );
      }

      setProfile(data);

      setFormData({
        name: data.name || "",
        phone: data.phone || "",
        date_of_birth: data.date_of_birth || "",
      });

      setEditing(false);
      setSuccess("Your profile has been updated successfully.");
    } catch (err) {
      console.error("Profile update error:", err);
      setError(err.message || "Unable to update your profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("smartHealthToken");
    localStorage.removeItem("smartHealthRole");
    navigate("/login", { replace: true });
  };

  const getInitials = (name) => {
    if (!name) return "P";

    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("");
  };

  return (
    <div className="profile-page">
      <aside className="profile-sidebar">
        <Link to="/" className="profile-logo">
          <div className="profile-logo-mark">+</div>
          <span>Smart Health</span>
        </Link>

        <nav className="profile-nav">
          <Link to="/patient-dashboard" className="profile-nav-item">
            <span>⌂</span>
            Overview
          </Link>

          <Link to="/book-appointment" className="profile-nav-item">
            <span>+</span>
            Book Appointment
          </Link>

          <Link
            to="/patient-dashboard#appointments"
            className="profile-nav-item"
          >
            <span>◷</span>
            Appointments
          </Link>

          <Link
            to="/patient-dashboard#queue"
            className="profile-nav-item"
          >
            <span>#</span>
            My Queue
          </Link>

          <Link
            to="/profile"
            className="profile-nav-item active"
          >
            <span>◉</span>
            Profile
          </Link>
        </nav>

        <button
          type="button"
          className="profile-logout"
          onClick={handleLogout}
        >
          <span>↪</span>
          Log out
        </button>
      </aside>

      <main className="profile-main">
        <header className="profile-header">
          <div>
            <small>Patient portal</small>
            <h1>My Profile</h1>
            <p>
              Manage and view your personal information.
            </p>
          </div>
        </header>

        {error && (
          <div className="profile-alert">
            <span>!</span>
            {error}
          </div>
        )}

        {success && (
          <div className="profile-success">
            <span>✓</span>
            {success}
          </div>
        )}

        {loading ? (
          <div className="profile-loading">
            <div className="profile-spinner"></div>
            <p>Loading your profile...</p>
          </div>
        ) : profile ? (
          <section className="profile-card">
            <div className="profile-card-header">
              <div className="profile-avatar">
                {getInitials(profile.name)}
              </div>

              <div className="profile-card-heading">
                <span>ACCOUNT</span>
                <h2>{profile.name || "Patient"}</h2>
                <p>{profile.email || "No email available"}</p>
              </div>

              {!editing && (
                <button
                  type="button"
                  className="profile-edit-button"
                  onClick={handleEdit}
                >
                  Edit Profile
                </button>
              )}
            </div>

            {editing ? (
              <form
                className="profile-edit-form"
                onSubmit={handleSave}
              >
                <div className="profile-form-grid">
                  <div className="profile-form-group">
                    <label htmlFor="name">Full name</label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="profile-form-group">
                    <label htmlFor="email">Email</label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={profile.email || ""}
                      disabled
                    />

                    <small>
                      Email cannot be changed here.
                    </small>
                  </div>

                  <div className="profile-form-group">
                    <label htmlFor="phone">Phone</label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="profile-form-group">
                    <label htmlFor="date_of_birth">
                      Date of birth
                    </label>

                    <input
                      id="date_of_birth"
                      name="date_of_birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="profile-form-actions">
                  <button
                    type="button"
                    className="profile-cancel-button"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="profile-save-button"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-details">
                <div className="profile-detail">
                  <span>Full name</span>
                  <strong>{profile.name || "—"}</strong>
                </div>

                <div className="profile-detail">
                  <span>Email</span>
                  <strong>{profile.email || "—"}</strong>
                </div>

                <div className="profile-detail">
                  <span>Phone</span>
                  <strong>{profile.phone || "—"}</strong>
                </div>

                <div className="profile-detail">
                  <span>Date of birth</span>
                  <strong>
                    {profile.date_of_birth || "—"}
                  </strong>
                </div>
              </div>
            )}
          </section>
        ) : (
          <div className="profile-empty">
            <strong>No profile information found.</strong>
          </div>
        )}
      </main>
    </div>
  );
}

export default Profile;