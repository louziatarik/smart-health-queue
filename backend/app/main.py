from datetime import datetime

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from sqlalchemy import inspect, text
from pwdlib import PasswordHash

from .database import Base, engine, get_db
from . import models
from .schemas import (
    PatientRegister,
    PatientLogin,
    DoctorRegister,
    AppointmentCreate,
    AppointmentResponse,
    DoctorResponse
)
from .auth import create_access_token, decode_access_token
from .ai_model import train_model, predict_waiting_time

# ============================================================
# DATABASE
# ============================================================

# Create any missing tables
Base.metadata.create_all(bind=engine)


# ============================================================
# DATABASE MIGRATION
# ============================================================

def update_queue_table():
    """
    Add the timestamp columns required for waiting-time
    prediction to an existing SQLite database.
    """

    inspector = inspect(engine)

    if "queue" not in inspector.get_table_names():
        return

    existing_columns = {
        column["name"]
        for column in inspector.get_columns("queue")
    }

    new_columns = {
        "called_at": "DATETIME",
        "started_at": "DATETIME",
        "completed_at": "DATETIME",
    }

    with engine.begin() as connection:
        for column_name, column_type in new_columns.items():

            if column_name not in existing_columns:
                connection.execute(
                    text(
                        f"ALTER TABLE queue "
                        f"ADD COLUMN {column_name} {column_type}"
                    )
                )


update_queue_table()


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="Smart Health Queue API",
    description="Patient Appointment and Queue Management System",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# SECURITY
# ============================================================

password_hash = PasswordHash.recommended()
security = HTTPBearer()


# ============================================================
# DOCTORS
# ============================================================

@app.get(
    "/doctors",
    response_model=list[DoctorResponse]
)
def get_doctors(
    db: Session = Depends(get_db)
):
    doctors = db.query(models.Doctor).all()

    return [
        DoctorResponse(
            id=doctor.id,
            name=doctor.user.name,
            email=doctor.user.email,
            specialization=doctor.specialization,
            department=doctor.department,
            available=doctor.available,
        )
        for doctor in doctors
    ]


# ============================================================
# HOME
# ============================================================

@app.get("/")
def root():
    return {
        "message": "Smart Health Queue API is running"
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


# ============================================================
# PATIENT REGISTRATION
# ============================================================

@app.post("/patients/register")
def register_patient(
    patient_data: PatientRegister,
    db: Session = Depends(get_db)
):
    existing_user = db.query(models.User).filter(
        models.User.email == patient_data.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    hashed_password = password_hash.hash(
        patient_data.password
    )

    user = models.User(
        name=patient_data.name,
        email=patient_data.email,
        password_hash=hashed_password,
        role="PATIENT"
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    patient = models.Patient(
        user_id=user.id,
        phone=patient_data.phone,
        date_of_birth=patient_data.date_of_birth
    )

    db.add(patient)
    db.commit()
    db.refresh(patient)

    return {
        "message": "Patient registered successfully",
        "user_id": user.id,
        "patient_id": patient.id,
        "name": user.name,
        "email": user.email,
        "role": user.role
    }


# ============================================================
# PATIENT LOGIN
# ============================================================

@app.post("/patients/login")
def login_patient(
    login_data: PatientLogin,
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(
        models.User.email == login_data.email
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not password_hash.verify(
        login_data.password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if user.role != "PATIENT":
        raise HTTPException(
            status_code=403,
            detail="This account is not a patient account"
        )

    access_token = create_access_token({
        "user_id": user.id,
        "role": user.role
    })

    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role
    }


# ============================================================
# CURRENT USER AUTHENTICATION
# ============================================================

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials

    payload = decode_access_token(token)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    user_id = payload.get("user_id")

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    user = db.query(models.User).filter(
        models.User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    return user


# ============================================================
# PATIENT PROFILE
# ============================================================

@app.get("/patients/me")
def get_my_profile(
    current_user: models.User = Depends(get_current_user)
):
    return {
        "user_id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role
    }


# ============================================================
# DOCTOR REGISTRATION
# ============================================================

@app.post("/doctors/register")
def register_doctor(
    doctor_data: DoctorRegister,
    db: Session = Depends(get_db)
):
    existing_user = db.query(models.User).filter(
        models.User.email == doctor_data.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    hashed_password = password_hash.hash(
        doctor_data.password
    )

    user = models.User(
        name=doctor_data.name,
        email=doctor_data.email,
        password_hash=hashed_password,
        role="DOCTOR"
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    doctor = models.Doctor(
        user_id=user.id,
        specialization=doctor_data.specialization,
        department=doctor_data.department,
        available=1
    )

    db.add(doctor)
    db.commit()
    db.refresh(doctor)

    return {
        "message": "Doctor registered successfully",
        "user_id": user.id,
        "doctor_id": doctor.id,
        "name": user.name,
        "email": user.email,
        "specialization": doctor.specialization,
        "department": doctor.department,
        "available": doctor.available
    }


# ============================================================
# DOCTOR LOGIN
# ============================================================

@app.post("/doctors/login")
def login_doctor(
    login_data: PatientLogin,
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(
        models.User.email == login_data.email
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not password_hash.verify(
        login_data.password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if user.role != "DOCTOR":
        raise HTTPException(
            status_code=403,
            detail="This account is not a doctor account"
        )

    doctor = db.query(models.Doctor).filter(
        models.Doctor.user_id == user.id
    ).first()

    if not doctor:
        raise HTTPException(
            status_code=404,
            detail="Doctor profile not found"
        )

    access_token = create_access_token({
        "user_id": user.id,
        "role": user.role
    })

    return {
        "message": "Doctor login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id,
        "doctor_id": doctor.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "specialization": doctor.specialization,
        "department": doctor.department,
        "available": doctor.available
    }


# ============================================================
# CREATE APPOINTMENT
# ============================================================

@app.post(
    "/appointments",
    response_model=AppointmentResponse
)
def create_appointment(
    appointment_data: AppointmentCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "PATIENT":
        raise HTTPException(
            status_code=403,
            detail="Only patients can create appointments"
        )

    patient = db.query(models.Patient).filter(
        models.Patient.user_id == current_user.id
    ).first()

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient profile not found"
        )

    doctor = db.query(models.Doctor).filter(
        models.Doctor.id == appointment_data.doctor_id
    ).first()

    if not doctor:
        raise HTTPException(
            status_code=404,
            detail="Doctor not found"
        )

    if not doctor.available:
        raise HTTPException(
            status_code=400,
            detail="Doctor is not currently available"
        )

    existing_appointment = db.query(
        models.Appointment
    ).filter(
        models.Appointment.doctor_id == appointment_data.doctor_id,
        models.Appointment.appointment_date == appointment_data.appointment_date,
        models.Appointment.appointment_time == appointment_data.appointment_time,
        models.Appointment.status != "CANCELLED"
    ).first()

    if existing_appointment:
        raise HTTPException(
            status_code=400,
            detail="This appointment time is already booked"
        )

    appointment = models.Appointment(
        patient_id=patient.id,
        doctor_id=appointment_data.doctor_id,
        appointment_date=appointment_data.appointment_date,
        appointment_time=appointment_data.appointment_time,
        status="PENDING"
    )

    db.add(appointment)
    db.commit()
    db.refresh(appointment)

    # ========================================================
    # AUTOMATIC QUEUE NUMBER
    # ========================================================

    last_queue = db.query(
        models.Queue
    ).join(
        models.Appointment
    ).filter(
        models.Appointment.doctor_id == appointment.doctor_id
    ).order_by(
        models.Queue.queue_number.desc()
    ).first()

    if last_queue:
        next_queue_number = last_queue.queue_number + 1
    else:
        next_queue_number = 1

    queue = models.Queue(
        appointment_id=appointment.id,
        queue_number=next_queue_number,
        status="WAITING"
    )

    db.add(queue)
    db.commit()

    return {
        "id": appointment.id,
        "patient_id": appointment.patient_id,
        "doctor_id": appointment.doctor_id,
        "patient_name": current_user.name,
        "doctor_name": doctor.user.name,
        "specialization": doctor.specialization,
        "department": doctor.department,
        "appointment_date": appointment.appointment_date,
        "appointment_time": appointment.appointment_time,
        "status": appointment.status
    }


# ============================================================
# GET MY APPOINTMENTS
# ============================================================

@app.get(
    "/appointments/my",
    response_model=list[AppointmentResponse]
)
def get_my_appointments(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "PATIENT":
        raise HTTPException(
            status_code=403,
            detail="Only patients can view their appointments"
        )

    patient = db.query(models.Patient).filter(
        models.Patient.user_id == current_user.id
    ).first()

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient profile not found"
        )

    appointments = db.query(
        models.Appointment
    ).filter(
        models.Appointment.patient_id == patient.id
    ).order_by(
        models.Appointment.appointment_date.asc(),
        models.Appointment.appointment_time.asc()
    ).all()

    return [
        {
            "id": appointment.id,
            "patient_id": appointment.patient_id,
            "doctor_id": appointment.doctor_id,
            "patient_name": current_user.name,
            "doctor_name": (
                appointment.doctor.user.name
                if appointment.doctor
                and appointment.doctor.user
                else "Unknown Doctor"
            ),
            "specialization": (
                appointment.doctor.specialization
                if appointment.doctor
                else "Unknown"
            ),
            "department": (
                appointment.doctor.department
                if appointment.doctor
                else "Unknown"
            ),
            "appointment_date": appointment.appointment_date,
            "appointment_time": appointment.appointment_time,
            "status": appointment.status
        }
        for appointment in appointments
    ]


# ============================================================
# GET DOCTOR APPOINTMENTS
# ============================================================

@app.get(
    "/appointments/doctor",
    response_model=list[AppointmentResponse]
)
def get_doctor_appointments(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "DOCTOR":
        raise HTTPException(
            status_code=403,
            detail="Only doctors can view doctor appointments"
        )

    doctor = db.query(models.Doctor).filter(
        models.Doctor.user_id == current_user.id
    ).first()

    if not doctor:
        raise HTTPException(
            status_code=404,
            detail="Doctor profile not found"
        )

    appointments = db.query(
        models.Appointment
    ).filter(
        models.Appointment.doctor_id == doctor.id
    ).order_by(
        models.Appointment.appointment_date.asc(),
        models.Appointment.appointment_time.asc()
    ).all()

    return [
        {
            "id": appointment.id,
            "patient_id": appointment.patient_id,
            "doctor_id": appointment.doctor_id,
            "patient_name": (
                appointment.patient.user.name
                if appointment.patient
                and appointment.patient.user
                else "Unknown Patient"
            ),
            "doctor_name": (
                appointment.doctor.user.name
                if appointment.doctor
                and appointment.doctor.user
                else "Unknown Doctor"
            ),
            "specialization": (
                appointment.doctor.specialization
                if appointment.doctor
                else "Unknown"
            ),
            "department": (
                appointment.doctor.department
                if appointment.doctor
                else "Unknown"
            ),
            "appointment_date": appointment.appointment_date,
            "appointment_time": appointment.appointment_time,
            "status": appointment.status
        }
        for appointment in appointments
    ]


# ============================================================
# CONFIRM APPOINTMENT
# ============================================================

@app.put(
    "/appointments/{appointment_id}/confirm",
    response_model=AppointmentResponse
)
def confirm_appointment(
    appointment_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "DOCTOR":
        raise HTTPException(
            status_code=403,
            detail="Only doctors can confirm appointments"
        )

    doctor = db.query(models.Doctor).filter(
        models.Doctor.user_id == current_user.id
    ).first()

    if not doctor:
        raise HTTPException(
            status_code=404,
            detail="Doctor profile not found"
        )

    appointment = db.query(
        models.Appointment
    ).filter(
        models.Appointment.id == appointment_id
    ).first()

    if not appointment:
        raise HTTPException(
            status_code=404,
            detail="Appointment not found"
        )

    if appointment.doctor_id != doctor.id:
        raise HTTPException(
            status_code=403,
            detail="You can only confirm your own appointments"
        )

    if appointment.status == "CANCELLED":
        raise HTTPException(
            status_code=400,
            detail="Cancelled appointment cannot be confirmed"
        )

    appointment.status = "CONFIRMED"

    db.commit()
    db.refresh(appointment)

    return {
        "id": appointment.id,
        "patient_id": appointment.patient_id,
        "doctor_id": appointment.doctor_id,
        "patient_name": (
            appointment.patient.user.name
            if appointment.patient
            and appointment.patient.user
            else "Unknown Patient"
        ),
        "appointment_date": appointment.appointment_date,
        "appointment_time": appointment.appointment_time,
        "status": appointment.status
    }


# ============================================================
# CANCEL APPOINTMENT
# ============================================================

@app.put(
    "/appointments/{appointment_id}/cancel",
    response_model=AppointmentResponse
)
def cancel_appointment(
    appointment_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    appointment = db.query(
        models.Appointment
    ).filter(
        models.Appointment.id == appointment_id
    ).first()

    if not appointment:
        raise HTTPException(
            status_code=404,
            detail="Appointment not found"
        )

    if current_user.role == "PATIENT":

        patient = db.query(models.Patient).filter(
            models.Patient.user_id == current_user.id
        ).first()

        if not patient or appointment.patient_id != patient.id:
            raise HTTPException(
                status_code=403,
                detail="You can only cancel your own appointments"
            )

    elif current_user.role == "DOCTOR":

        doctor = db.query(models.Doctor).filter(
            models.Doctor.user_id == current_user.id
        ).first()

        if not doctor or appointment.doctor_id != doctor.id:
            raise HTTPException(
                status_code=403,
                detail="You can only cancel appointments belonging to you"
            )

    else:
        raise HTTPException(
            status_code=403,
            detail="Not authorized"
        )

    appointment.status = "CANCELLED"

    queue = db.query(models.Queue).filter(
        models.Queue.appointment_id == appointment.id
    ).first()

    if queue and queue.status == "WAITING":
        queue.status = "CANCELLED"

    db.commit()
    db.refresh(appointment)

    return {
        "id": appointment.id,
        "patient_id": appointment.patient_id,
        "doctor_id": appointment.doctor_id,
        "patient_name": (
            appointment.patient.user.name
            if appointment.patient
            and appointment.patient.user
            else "Unknown Patient"
        ),
        "appointment_date": appointment.appointment_date,
        "appointment_time": appointment.appointment_time,
        "status": appointment.status
    }


# ============================================================
# GET MY QUEUE
# ============================================================

@app.get("/queue/my")
def get_my_queue(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "PATIENT":
        raise HTTPException(
            status_code=403,
            detail="Only patients can view their queue"
        )

    patient = db.query(models.Patient).filter(
        models.Patient.user_id == current_user.id
    ).first()

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient profile not found"
        )

    queue = (
        db.query(models.Queue)
        .join(models.Appointment)
        .filter(
            models.Appointment.patient_id == patient.id,
            models.Queue.status.in_(
                ["WAITING", "CALLED", "IN_PROGRESS"]
            )
        )
        .order_by(
            models.Queue.created_at.desc()
        )
        .first()
    )

    if not queue:
        raise HTTPException(
            status_code=404,
            detail="No active queue found"
        )

    appointment = queue.appointment

    doctor = db.query(models.Doctor).filter(
        models.Doctor.id == appointment.doctor_id
    ).first()

    people_ahead = (
        db.query(models.Queue)
        .join(models.Appointment)
        .filter(
            models.Appointment.doctor_id == appointment.doctor_id,
            models.Queue.status.in_(
                ["WAITING", "CALLED", "IN_PROGRESS"]
            ),
            models.Queue.queue_number < queue.queue_number
        )
        .count()
    )

    return {
        "queue_id": queue.id,
        "appointment_id": queue.appointment_id,
        "queue_number": queue.queue_number,
        "status": queue.status,
        "people_ahead": people_ahead,
        "doctor_id": doctor.id if doctor else None,
        "doctor_specialization": (
            doctor.specialization
            if doctor
            else None
        ),
        "department": (
            doctor.department
            if doctor
            else None
        ),
        "appointment_date": appointment.appointment_date,
        "appointment_time": appointment.appointment_time
    }


# ============================================================
# GET DOCTOR QUEUE
# ============================================================

@app.get("/queue/doctor")
def get_doctor_queue(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "DOCTOR":
        raise HTTPException(
            status_code=403,
            detail="Only doctors can view the queue"
        )

    doctor = db.query(models.Doctor).filter(
        models.Doctor.user_id == current_user.id
    ).first()

    if not doctor:
        raise HTTPException(
            status_code=404,
            detail="Doctor profile not found"
        )

    queue_items = (
        db.query(models.Queue)
        .join(models.Appointment)
        .filter(
            models.Appointment.doctor_id == doctor.id
        )
        .order_by(
            models.Queue.queue_number.asc()
        )
        .all()
    )

    return [
        {
            "queue_id": queue.id,
            "appointment_id": queue.appointment_id,
            "patient_id": queue.appointment.patient_id,

            "patient_name": (
                queue.appointment.patient.user.name
                if queue.appointment.patient
                and queue.appointment.patient.user
                else "Unknown Patient"
            ),

            "queue_number": queue.queue_number,
            "status": queue.status,

            "appointment_date": (
                queue.appointment.appointment_date
            ),

            "appointment_time": (
                queue.appointment.appointment_time
            )
        }
        for queue in queue_items
    ]


# ============================================================
# CALL NEXT PATIENT
# ============================================================

@app.put("/queue/doctor/call-next")
def call_next_patient(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "DOCTOR":
        raise HTTPException(
            status_code=403,
            detail="Only doctors can call the next patient"
        )

    doctor = db.query(models.Doctor).filter(
        models.Doctor.user_id == current_user.id
    ).first()

    if not doctor:
        raise HTTPException(
            status_code=404,
            detail="Doctor profile not found"
        )

    # Check if the doctor already has an active patient
    active_patient = (
        db.query(models.Queue)
        .join(models.Appointment)
        .filter(
            models.Appointment.doctor_id == doctor.id,
            models.Queue.status.in_([
                "CALLED",
                "IN_PROGRESS"
            ])
        )
        .first()
    )

    if active_patient:
        raise HTTPException(
            status_code=400,
            detail=(
                "Please finish the current patient "
                "before calling the next one"
            )
        )

    # Find the next waiting patient
    queue_entry = (
        db.query(models.Queue)
        .join(models.Appointment)
        .filter(
            models.Appointment.doctor_id == doctor.id,
            models.Queue.status == "WAITING"
        )
        .order_by(
            models.Queue.queue_number.asc()
        )
        .first()
    )

    if not queue_entry:
        raise HTTPException(
            status_code=404,
            detail="No patients are waiting"
        )

    # Record when the patient was called
    queue_entry.status = "CALLED"
    queue_entry.called_at = datetime.utcnow()

    db.commit()
    db.refresh(queue_entry)

    return {
        "message": "Next patient called",
        "queue_id": queue_entry.id,
        "appointment_id": queue_entry.appointment_id,
        "queue_number": queue_entry.queue_number,
        "status": queue_entry.status,
        "called_at": queue_entry.called_at
    }


# ============================================================
# START CONSULTATION
# ============================================================

@app.put("/queue/doctor/{queue_id}/start")
def start_consultation(
    queue_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "DOCTOR":
        raise HTTPException(
            status_code=403,
            detail="Only doctors can start consultations"
        )

    doctor = db.query(models.Doctor).filter(
        models.Doctor.user_id == current_user.id
    ).first()

    if not doctor:
        raise HTTPException(
            status_code=404,
            detail="Doctor profile not found"
        )

    queue_entry = (
        db.query(models.Queue)
        .join(models.Appointment)
        .filter(
            models.Queue.id == queue_id,
            models.Appointment.doctor_id == doctor.id
        )
        .first()
    )

    if not queue_entry:
        raise HTTPException(
            status_code=404,
            detail="Queue entry not found"
        )

    if queue_entry.status != "CALLED":
        raise HTTPException(
            status_code=400,
            detail="Only a CALLED patient can start consultation"
        )

    # Record when the consultation starts
    queue_entry.status = "IN_PROGRESS"
    queue_entry.started_at = datetime.utcnow()

    db.commit()
    db.refresh(queue_entry)

    return {
        "message": "Consultation started",
        "queue_id": queue_entry.id,
        "appointment_id": queue_entry.appointment_id,
        "queue_number": queue_entry.queue_number,
        "status": queue_entry.status,
        "started_at": queue_entry.started_at
    }


# ============================================================
# COMPLETE CONSULTATION
# ============================================================

@app.put("/queue/doctor/{queue_id}/complete")
def complete_consultation(
    queue_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "DOCTOR":
        raise HTTPException(
            status_code=403,
            detail="Only doctors can complete consultations"
        )

    doctor = db.query(models.Doctor).filter(
        models.Doctor.user_id == current_user.id
    ).first()

    if not doctor:
        raise HTTPException(
            status_code=404,
            detail="Doctor profile not found"
        )

    queue_entry = (
        db.query(models.Queue)
        .join(models.Appointment)
        .filter(
            models.Queue.id == queue_id,
            models.Appointment.doctor_id == doctor.id
        )
        .first()
    )

    if not queue_entry:
        raise HTTPException(
            status_code=404,
            detail="Queue entry not found"
        )

    if queue_entry.status != "IN_PROGRESS":
        raise HTTPException(
            status_code=400,
            detail=(
                "Only an IN_PROGRESS consultation "
                "can be completed"
            )
        )

    # Record when the consultation finishes
    queue_entry.status = "COMPLETED"
    queue_entry.completed_at = datetime.utcnow()

    appointment = queue_entry.appointment
    appointment.status = "COMPLETED"

    db.commit()
    db.refresh(queue_entry)

    return {
        "message": "Consultation completed",
        "queue_id": queue_entry.id,
        "appointment_id": queue_entry.appointment_id,
        "queue_number": queue_entry.queue_number,
        "status": queue_entry.status,
        "completed_at": queue_entry.completed_at
    }


# ============================================================
# SKIP PATIENT
# ============================================================

@app.put("/queue/doctor/{queue_id}/skip")
def skip_patient(
    queue_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "DOCTOR":
        raise HTTPException(
            status_code=403,
            detail="Only doctors can skip patients"
        )

    doctor = db.query(models.Doctor).filter(
        models.Doctor.user_id == current_user.id
    ).first()

    if not doctor:
        raise HTTPException(
            status_code=404,
            detail="Doctor profile not found"
        )

    queue_entry = (
        db.query(models.Queue)
        .join(models.Appointment)
        .filter(
            models.Queue.id == queue_id,
            models.Appointment.doctor_id == doctor.id
        )
        .first()
    )

    if not queue_entry:
        raise HTTPException(
            status_code=404,
            detail="Queue entry not found"
        )

    if queue_entry.status not in [
        "WAITING",
        "CALLED"
    ]:
        raise HTTPException(
            status_code=400,
            detail=(
                "Only WAITING or CALLED patients "
                "can be skipped"
            )
        )

    queue_entry.status = "SKIPPED"

    db.commit()
    db.refresh(queue_entry)

    return {
        "message": "Patient skipped",
        "queue_id": queue_entry.id,
        "appointment_id": queue_entry.appointment_id,
        "queue_number": queue_entry.queue_number,
        "status": queue_entry.status
    }
# ============================================================
# AI WAITING-TIME MODEL TRAINING
# ============================================================

@app.post("/ai/train")
def train_waiting_time_model(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "DOCTOR":
        raise HTTPException(
            status_code=403,
            detail="Only doctors can train the waiting-time model"
        )

    # Get completed queue records
    completed_queues = (
        db.query(models.Queue)
        .join(models.Appointment)
        .filter(
            models.Queue.status == "COMPLETED",
            models.Queue.created_at.isnot(None),
            models.Queue.started_at.isnot(None),
            models.Queue.completed_at.isnot(None)
        )
        .all()
    )

    if len(completed_queues) < 2:
        raise HTTPException(
            status_code=400,
            detail=(
                "Not enough completed consultations. "
                "At least 2 completed consultations are required."
            )
        )

    training_records = []

    for queue in completed_queues:

        # Calculate how many patients were ahead
        # when this patient entered the queue.
        people_ahead = (
            db.query(models.Queue)
            .join(models.Appointment)
            .filter(
                models.Appointment.doctor_id ==
                queue.appointment.doctor_id,

                models.Queue.queue_number <
                queue.queue_number,

                models.Queue.created_at <=
                queue.created_at
            )
            .count()
        )

        training_records.append({
            "created_at": queue.created_at,
            "started_at": queue.started_at,
            "completed_at": queue.completed_at,
            "people_ahead": people_ahead
        })

    # ========================================================
    # DEBUG: SHOW TRAINING DATA
    # ========================================================

    print("\n===== AI TRAINING DATA =====")

    for record in training_records:

        consultation_minutes = (
            record["completed_at"] -
            record["started_at"]
        ).total_seconds() / 60

        waiting_minutes = (
            record["started_at"] -
            record["created_at"]
        ).total_seconds() / 60

        print(
            "people_ahead:", record["people_ahead"],
            "| consultation:", round(consultation_minutes, 2),
            "| waiting:", round(waiting_minutes, 2)
        )

    print("============================\n")

    # ========================================================
    # TRAIN MODEL
    # ========================================================

    trained = train_model(training_records)

    if not trained:
        raise HTTPException(
            status_code=400,
            detail="Unable to train the model with the available data"
        )

    return {
        "message": "Waiting-time model trained successfully",
        "training_records": len(training_records)
    }


# ============================================================
# AI WAITING-TIME PREDICTION
# ============================================================

@app.get("/queue/predict-wait-time")
def get_waiting_time_prediction(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "PATIENT":
        raise HTTPException(
            status_code=403,
            detail="Only patients can request waiting-time predictions"
        )

    patient = db.query(models.Patient).filter(
        models.Patient.user_id == current_user.id
    ).first()

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient profile not found"
        )

    queue = (
        db.query(models.Queue)
        .join(models.Appointment)
        .filter(
            models.Appointment.patient_id == patient.id,
            models.Queue.status.in_([
                "WAITING",
                "CALLED",
                "IN_PROGRESS"
            ])
        )
        .order_by(
            models.Queue.created_at.desc()
        )
        .first()
    )

    if not queue:
        raise HTTPException(
            status_code=404,
            detail="No active queue found"
        )

    appointment = queue.appointment
    doctor_id = appointment.doctor_id

    # ========================================================
    # Calculate people ahead
    # ========================================================

    people_ahead = (
        db.query(models.Queue)
        .join(models.Appointment)
        .filter(
            models.Appointment.doctor_id == doctor_id,
            models.Queue.status.in_([
                "WAITING",
                "CALLED",
                "IN_PROGRESS"
            ]),
            models.Queue.queue_number < queue.queue_number
        )
        .count()
    )

    # ========================================================
    # Calculate doctor's average consultation duration
    # ========================================================

    completed_queues = (
        db.query(models.Queue)
        .join(models.Appointment)
        .filter(
            models.Appointment.doctor_id == doctor_id,
            models.Queue.status == "COMPLETED",
            models.Queue.started_at.isnot(None),
            models.Queue.completed_at.isnot(None)
        )
        .all()
    )

    consultation_times = []

    for completed_queue in completed_queues:

        duration = (
            completed_queue.completed_at
            - completed_queue.started_at
        ).total_seconds() / 60

        if duration > 0:
            consultation_times.append(duration)

    # Use historical average.
    # If there is no history, use 10 minutes.
    if consultation_times:
        average_consultation = (
            sum(consultation_times)
            / len(consultation_times)
        )
    else:
        average_consultation = 10.0

    # ========================================================
    # Prediction
    # ========================================================

    now = datetime.utcnow()

    prediction = predict_waiting_time(
        people_ahead=people_ahead,
        hour=now.hour,
        day_of_week=now.weekday(),
        consultation_minutes=average_consultation
    )

    # If the model doesn't exist, use a simple fallback.
    if prediction is None:
        prediction = round(
            people_ahead * average_consultation
        )

        model_status = "fallback"

    else:
        model_status = "ml_model"

    return {
        "queue_id": queue.id,
        "queue_number": queue.queue_number,
        "people_ahead": people_ahead,
        "estimated_wait_minutes": prediction,
        "average_consultation_minutes": round(
            average_consultation,
            1
        ),
        "model_status": model_status
    }
# ============================================================
# AI WAITING-TIME PREDICTION
# ============================================================

@app.get("/queue/predict-wait-time")
def get_waiting_time_prediction(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "PATIENT":
        raise HTTPException(
            status_code=403,
            detail="Only patients can request waiting-time predictions"
        )

    patient = db.query(models.Patient).filter(
        models.Patient.user_id == current_user.id
    ).first()

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient profile not found"
        )

    queue = (
        db.query(models.Queue)
        .join(models.Appointment)
        .filter(
            models.Appointment.patient_id == patient.id,
            models.Queue.status.in_([
                "WAITING",
                "CALLED",
                "IN_PROGRESS"
            ])
        )
        .order_by(
            models.Queue.created_at.desc()
        )
        .first()
    )

    if not queue:
        raise HTTPException(
            status_code=404,
            detail="No active queue found"
        )

    appointment = queue.appointment
    doctor_id = appointment.doctor_id

    # --------------------------------------------------------
    # Calculate people ahead
    # --------------------------------------------------------

    people_ahead = (
        db.query(models.Queue)
        .join(models.Appointment)
        .filter(
            models.Appointment.doctor_id == doctor_id,
            models.Queue.status.in_([
                "WAITING",
                "CALLED",
                "IN_PROGRESS"
            ]),
            models.Queue.queue_number < queue.queue_number
        )
        .count()
    )

    # --------------------------------------------------------
    # Calculate doctor's average consultation duration
    # --------------------------------------------------------

    completed_queues = (
        db.query(models.Queue)
        .join(models.Appointment)
        .filter(
            models.Appointment.doctor_id == doctor_id,
            models.Queue.status == "COMPLETED",
            models.Queue.started_at.isnot(None),
            models.Queue.completed_at.isnot(None)
        )
        .all()
    )

    consultation_times = []

    for completed_queue in completed_queues:

        duration = (
            completed_queue.completed_at
            - completed_queue.started_at
        ).total_seconds() / 60

        if duration > 0:
            consultation_times.append(duration)

    # Use the doctor's historical average.
    # If there is not enough history yet,
    # use a reasonable initial estimate.
    if consultation_times:
        average_consultation = (
            sum(consultation_times)
            / len(consultation_times)
        )
    else:
        average_consultation = 10.0

    # --------------------------------------------------------
    # Prediction
    # --------------------------------------------------------

    now = datetime.utcnow()

    prediction = predict_waiting_time(
        people_ahead=people_ahead,
        hour=now.hour,
        day_of_week=now.weekday(),
        consultation_minutes=average_consultation
    )

    # The model may not exist yet.
    if prediction is None:

        # Simple fallback until enough historical
        # data exists to train the ML model.
        prediction = round(
            people_ahead * average_consultation
        )

        model_status = "fallback"

    else:
        model_status = "ml_model"

    return {
        "queue_id": queue.id,
        "queue_number": queue.queue_number,
        "people_ahead": people_ahead,
        "estimated_wait_minutes": prediction,
        "average_consultation_minutes": round(
            average_consultation,
            1
        ),
        "model_status": model_status
    }