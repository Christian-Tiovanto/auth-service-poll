# Auth Service for Mata Kuliah DevOps

### 👥 Team Members
* **Jason** - 221111572
* **Cecilia Ongso** - 221111729
* **Willy Halim** - 221110079
* **Devon Marvelous Loen** - 221110226
* **Christian Tiovanto** - 221111153

Welcome to the Auth Service repository. This project serves as the dedicated backend infrastructure for handling user identity and access management.

---

## 📖 Service Functionality

This service operates as a dedicated backend server focused on security and user management. Currently, its primary functionalities include:

* **User Registration:** Handling new user sign-ups and account creation.
* **User Login:** Authenticating existing users and issuing access tokens.

## 🛠️ Tech Stack
<img width="1364" height="585" alt="image" src="https://github.com/user-attachments/assets/17188e8d-1330-4d84-8f93-67ceafdf4395" />
<img width="906" height="568" alt="image" src="https://github.com/user-attachments/assets/7ab7b47f-403b-48d8-ac31-6a31b1159d30" />

This project utilizes a modern, robust technology stack designed for scalability and reliability:

* **[Node.js](https://nodejs.org/)**: Runtime environment for executing JavaScript server-side.
* **[NestJS](https://nestjs.com/)**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
* **[PostgreSQL](https://www.postgresql.org/)**: The primary relational database for persistently storing user credentials and profile data.
* **[RabbitMQ](https://www.rabbitmq.com/)**: A message broker used for handling asynchronous tasks and inter-service communication.

---

## 🌐 Live Demo

The service is currently deployed and accessible at:
**[https://polbro-devops.duckdns.org](https://polbro-devops.duckdns.org)**

---

## 🚀 Getting Started Locally

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

Before you begin, ensure you have the following:

1.  **[Docker](https://www.docker.com/get-started)** installed and running.
2.  **Polling Service Running:** This service depends on the [Polling Service](https://github.com/Christian-Tiovanto/polling-service.git). Ensure it is running locally before proceeding.

### Installation & Run

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/Christian-Tiovanto/auth-service-poll.git
    cd auth-service-poll
    ```

2.  **Set Up Environment Variables**
    Copy the sample environment file to create your local configuration.
    ```bash
    cp .env.sample .env
    ```

3.  **Start the Application**
    Use Docker Compose to spin up the entire stack.
    ```bash
    docker compose up -d
    ```

### ✅ Verification

To confirm the service is running correctly, check the port defined in your `.env` file and navigate to the API documentation:
**http://localhost:4000/api-docs**

If successful, you will see the Swagger API documentation for the Auth service. 🎉
