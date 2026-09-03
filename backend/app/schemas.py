from pydantic import BaseModel, EmailStr


# ============================================================
# PATIENT REGISTRATION
# ============================================================

class PatientRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: str
    date_of_birth: str


# ============================================================
# PATIENT LOGIN
# ============================================================

class PatientLogin(BaseModel):
    email: EmailStr
    password: str


# ============================================================
# DOCTOR REGISTRATION
# ============================================================

class DoctorRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    specialization: str
    department: str


# ============================================================
# APPOINTMENT CREATION
# ============================================================

class AppointmentCreate(BaseModel):
    doctor_id: int
    appointment_date: str
    appointment_time: str


# ============================================================
# APPOINTMENT RESPONSE
# ============================================================

class AppointmentResponse(BaseModel):
    id: int
    patient_id: int
    doctor_id: int
    patient_name: str
    appointment_date: str
    appointment_time: str
    status: str

    class Config:
        from_attributes = True


# ============================================================
# DOCTOR RESPONSE
# ============================================================

class DoctorResponse(BaseModel):
    id: int
    name: str
    email: str
    specialization: str
    department: str
    available: int