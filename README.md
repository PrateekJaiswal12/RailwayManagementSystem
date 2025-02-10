# IRCTC Railway Management System

## Problem Statement

Hey there, Mr. X. You have been appointed to design a railway management system like IRCTC, where users can come on the platform and
check if there are any trains available between 2 stations.
The app will also display how many seats are available between any 2 stations and the user can book a seat if the availability > 0 after
logging in.
Since this has to be real-time and multiple users can book seats simultaneously, your code must be optimized enough to handle large traffic and should not fail while doing any bookings.
If more than 1 users simultaneously try to book seats, only either one of the users should be able to book. Handle such race conditions
while booking.

## Features

1. User login and register/signup
2. JWT-based authentication
3. Check available trains from source to a destination
4. Book train seats with race condition handling
5. Admin functionalities: add new trains, update seat availability, etc.
6. Role-based access (admin/user)
7. Error handling with input validation

---


## Project Setup

### Environment variables

``` bash
DBHOST='127.0.0.1'
DBPASSWORD='4163'
DBUSER='root'
DBNAME='irctc_api'
PORT=3000
JWTSECRET='myverysecuresecret'
APIKEY='6f4a8c3d0b12e5f9a7d6b1c4f3e2a8d9'
```


### Installation

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/PrateekJaiswal12/IRCTC-workindia
   cd IRCTC
   ```
   
2. Install all necessary dependencies using npm:
   
   ```bash
    npm install
   ```
4. Set up your MySQL database:
  * Create a MySQL database named irctc_api.
  * Run the SQL scripts in database/schema.sql to create necessary tables (users, trains, bookings).

 Example:
 ``` bash
 CREATE DATABASE irctc_api;
USE irctc_api;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE trains (
    id INT AUTO_INCREMENT PRIMARY KEY,
    train_number VARCHAR(50) NOT NULL,
    source VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    total_seats INT NOT NULL,
    available_seats INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    train_id INT,
    seats INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (train_id) REFERENCES trains(id)
);
```


### API Endpoints

#### User Routes

 1. Register a new user
       * HTTP Method :- POST
       * Endpoint :- http://localhost:3000/user/register

 2. Login
       * HTTP Method :- POST
       * Endpoint :- http://localhost:3000/user/login

 3. Check train availability
   
       * HTTP Method :- GET
       * Endpoint :- http://localhost:3000/user/availability?source=Ranchi&destination=Delhi
       * Query Parameters
          * source: Source station (e.g., "Ranchi")
          * destination: Destination station (e.g., "Delhi")

 4. Book Seats
       * HTTP Method :- POST
       * Endpoint :- http://localhost:3000/user/book

 5.  Booking Details
       * HTTP Method :- GET
       * Endpoint :- http://localhost:3000/user/getAllbookings


#### Admin Routes

 1.   Add a new train
       * HTTP Method :- POST
       * Endpoint :- http://localhost:3000/admin/addTrain

 2. Update seat availability
       * HTTP Method :- PUT
       * Endpoint :- http://localhost:3000/admin/update-seats/10