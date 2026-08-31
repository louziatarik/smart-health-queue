# System Architecture

The Smart Health Queue system will use a three-layer architecture.

## Frontend

React will provide the user interface.

The frontend will communicate with the backend through REST APIs.

## Backend

Node.js and Express.js will provide the REST API.

The backend will handle:

- Authentication
- Business logic
- Appointments
- Queues
- Users
- Doctors
- Patients

## Database

PostgreSQL will store application data.

## Architecture

React Frontend
        |
        | REST API
        |
Node.js + Express Backend
        |
        | SQL
        |
PostgreSQL Database