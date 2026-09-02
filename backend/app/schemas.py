from datetime import date
from pydantic import BaseModel, EmailStr
from pydantic import BaseModel
from pydantic import BaseModel

class DoctorResponse(BaseModel):
    id: int
    name: str
    email: str
    specialization: str
    department: str
    available: int

# ============================================================
# PATIENT
# ============================================================

class PatientRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: str
    date_of_birth: date


class PatientLogin(BaseModel):
    email: EmailStr
    password: str


# ============================================================
# DOCTOR
# ============================================================

class DoctorRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    specialization: str
    department: str


# ============================================================
# APPOINTMENTS
# ============================================================

class AppointmentCreate(BaseModel):
    doctor_id: int
    appointment_date: str
    appointment_time: str


class AppointmentResponse(BaseModel):
    id: int
    patient_id: int
    doctor_id: int
    appointment_date: str
    appointment_time: str
    status: str

    class Config:
        from_attributes = True