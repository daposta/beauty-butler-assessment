## Appointment Booking System

###

This is a Node.js/Express-based RESTful API for an appointment booking system that allows customers to schedule appointments with merchants based on their availability and schedule. The system includes user authentication and authorization using JWT, merchant management, appointment booking, and validation to ensure data integrity and consistency.

Features

- User Authentication: Register, login, and logout with JWT authentication.
- Merchant Management: Merchants can manage their availability and schedules.
- Customer Booking: Customers can view available merchants and book appointments.
- Appointment Management: Merchants can view, complete, and cancel appointments.
- Data Validation: Ensure no duplicate schedules or appointments, and enforce correct time formats.
- Role-Based Access: Only authenticated users and merchants can access specific routes.
- Token Blacklisting: Invalidate JWT tokens upon logout to enhance security.

Getting Started
Prerequisites
Node.js (version 14.x or higher)
MongoDB (local instance or a cloud-based MongoDB service)
npm (Node package manager)
Installation
Clone the repository:

````bash
git clone https://github.com/your-username/appointment-booking-system.git
cd appointment-booking-system

Install dependencies:

```bash
Copy code
npm install
Set up environment variables:

Create a .env file in the root directory and add the following variables:

env
Copy code
PORT=5000
DB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
Run the application:

bash
Copy code
npm start
The server will start on the port specified in the .env file (default is 5000).

API Endpoints
Authentication
Register: POST /api/auth/register
Login: POST /api/auth/login
Logout: POST /api/auth/logout
Merchant Management
Create Schedule: POST /api/schedules
Get Schedules: GET /api/schedules
Update Schedule: PUT /api/schedules/:id
Delete Schedule: DELETE /api/schedules/:id
Appointment Booking
Create Appointment: POST /api/appointments
Get Appointments: GET /api/appointments
Complete Appointment: PUT /api/appointments/:id/complete
Cancel Appointment: PUT /api/appointments/:id/cancel
Data Models
User
Fields: name, email, password, role
Schedule
Fields: merchantId, scheduleDate, startTime, endTime
Appointment
Fields: customerId, merchantId, appointmentDate, startTime, endTime, status
Validation
Validation is handled using express-validator. The validators ensure that data is correctly formatted and that there are no conflicting schedules or appointments.

Token Blacklisting
Tokens are blacklisted upon logout to prevent further use. The blacklist is stored in MongoDB and checked during token verification.

Running Tests
Unit tests can be run using the following command:

bash
````
