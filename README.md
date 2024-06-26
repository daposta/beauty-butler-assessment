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
- Logging: The application uses morgan for HTTP request logging. Logs are displayed in the console in the 'dev' format.
- Rate Limiting: The application uses express-rate-limit to limit the number of requests a client can make to the server within a specified timeframe. The rate limiting window is set to 15 minutes. Each IP address is limited to 100 requests per window.

## Getting Started

### Prerequisites

- Docker

## Installation

1. **Clone the repository**:

```bash
git clone https://github.com/daposta/beauty-butler-assessment.git
cd beauty-butler-assessment
```

2. **Set up environment variables**:

Create a .env file in the root directory and add the following variables:

env

```bash
MONGO_URI=mongodb+srv://dapolawore:iLbOPSFwCO8go4js@cluster0.oshmyhx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
PORT=3000
EXPIRY=7d

```

3. **Run the application**:

```bash
docker build -t beauty-butler:latest .
docker run  -p 3000:3000 beauty-butler

```

### API Endpoints

### Authentication

- Register: POST /api/auth/register
- Login: POST /api/auth/login
- Logout: POST /api/auth/logout

### Merchant Management

- Create Schedule: POST /api/merchants/schedules(only merchants can do this)
- Get Schedules: GET /api/merchants/schedules(only merchants can do this)

### Appointment Booking

- Create Appointment: POST /api/customers/appointments(only customers can do this)
- Get Appointments: GET /api/merchants/appointments(only merchants can do this)
- Complete Appointment: PUT /api/merchants/appointments/:id/complete(only merchants can do this)
- Cancel Appointment: PUT /api/merchants/appointments/:id/cancel (only merchants can do this)
- Get Available Merchants: /api/customers/merchants(only customers can do this)

## Data Models

### User

- Fields: name, email, password, role

### Schedule

- Fields: merchantId, scheduleDate, startTime, endTime

### Appointment

- Fields: customerId, merchantId, appointmentDate, startTime, endTime, status

### Blacklist
- Fields: token, expiry

### Validation

Validation is handled using express-validator. The validators ensure that data is correctly formatted and that there are no conflicting schedules or appointments.

### Token Blacklisting

Tokens are blacklisted upon logout to prevent further use. The blacklist is stored in MongoDB and checked during token verification.

### Deployed Application
You can access the deployed application at https://beauty-butler-assessment.onrender.com/.

## API Documentation

You can find the API documentation and test the endpoints using Postman by clicking the link below:

[![Run in Postman](https://run.pstmn.io/button.svg)](https://www.postman.com/planetary-desert-737843/workspace/beauty-butler/request/31662146-fca7cd30-5dad-464c-8f17-96c0ae45d366)


### Running Tests

Unit tests with coverage can be run using the following command:

```bash
npm test -- --coverage   

```