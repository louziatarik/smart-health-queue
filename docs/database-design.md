# Database Design

## Main Tables

The system will initially contain the following tables:

1. Users
2. Patients
3. Doctors
4. Departments
5. Appointments
6. Queues
7. Schedules

## Users

Stores login and account information.

Fields:

- id
- name
- email
- password
- role
- created_at

## Patients

Stores patient information.

Fields:

- id
- user_id
- phone
- date_of_birth

## Doctors

Stores doctor information.

Fields:

- id
- user_id
- department_id
- specialization

## Departments

Stores healthcare departments.

Fields:

- id
- name
- description

## Appointments

Stores appointment information.

Fields:

- id
- patient_id
- doctor_id
- appointment_date
- appointment_time
- status
- created_at

## Queues

Stores patient queue information.

Fields:

- id
- appointment_id
- queue_number
- status
- created_at

## Schedules

Stores doctor availability.

Fields:

- id
- doctor_id
- day_of_week
- start_time
- end_time