from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False, default="PATIENT")
    created_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship(
        "Patient",
        back_populates="user",
        uselist=False
    )

    doctor = relationship(
        "Doctor",
        back_populates="user",
        uselist=False
    )


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        unique=True
    )
    phone = Column(String, nullable=True)
    date_of_birth = Column(String, nullable=True)

    user = relationship(
        "User",
        back_populates="patient"
    )


class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        unique=True
    )
    specialization = Column(
        String,
        nullable=False
    )
    department = Column(
        String,
        nullable=False
    )
    available = Column(
        Integer,
        default=1
    )

    user = relationship(
        "User",
        back_populates="doctor"
    )


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    patient_id = Column(
        Integer,
        ForeignKey("patients.id"),
        nullable=False
    )

    doctor_id = Column(
        Integer,
        ForeignKey("doctors.id"),
        nullable=False
    )

    appointment_date = Column(
        String,
        nullable=False
    )

    appointment_time = Column(
        String,
        nullable=False
    )

    status = Column(
        String,
        nullable=False,
        default="PENDING"
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    patient = relationship("Patient")

    doctor = relationship("Doctor")

    queue = relationship(
        "Queue",
        back_populates="appointment",
        uselist=False
    )


class Queue(Base):
    __tablename__ = "queue"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    appointment_id = Column(
        Integer,
        ForeignKey("appointments.id"),
        unique=True,
        nullable=False
    )

    queue_number = Column(
        Integer,
        nullable=False
    )

    status = Column(
        String,
        nullable=False,
        default="WAITING"
    )

    # Patient enters the queue
    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    # Doctor calls the patient
    called_at = Column(
        DateTime,
        nullable=True
    )

    # Doctor starts the appointment
    started_at = Column(
        DateTime,
        nullable=True
    )

    # Appointment is completed
    completed_at = Column(
        DateTime,
        nullable=True
    )

    appointment = relationship(
        "Appointment",
        back_populates="queue"
    )