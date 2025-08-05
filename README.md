# NutriChain - Warehouse Microservice

This microservice is part of the NutriChain Logistics ecosystem. It is responsible for managing product stock and tracking all inventory movements (entries and exits).

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Database Seeding](#database-seeding)
- [Running the Application](#running-the-application)
  - [Development Mode](#development-mode)
  - [Production Mode](#production-mode)
- [Running with Docker](#running-with-docker)
- [API Documentation](#api-documentation)
- [Running Tests](#running-tests)
- [Environment Variables](#environment-variables)

## Features

- **Stock Management**: Track quantity for each product.
- **Movement Tracking**: Log every entry and exit of products.
- **API Versioning**: Endpoints are versioned under `/api/v1`.
- **JWT Authentication**: Endpoints are secured using JSON Web Tokens.
- **Production-Ready CORS**: Configurable Cross-Origin Resource Sharing.
- **Rate Limiting**: Protection against brute-force and DDoS attacks.
- **Idempotency**: Safe retries for `POST` requests via an `Idempotency-Key` header.
- **Internationalization (i18n)**: API responses are translated based on `Accept-Language` header (supports `en` and `es`).
- **Structured Logging**: Detailed logging with Winston.
- **Clean Architecture**: Follows SOLID principles with a clear separation of concerns (Controllers, Services, DTOs, Entities).

## Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL (managed via Supabase)
- **ORM**: TypeORM
- **Containerization**: Docker
- **API Documentation**: Swagger/OpenAPI

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- A Supabase account to host the PostgreSQL database.

## Getting Started

### Installation

1.  **Clone this repository:**

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Copy the example file and fill in your details.
    ```bash
    cp .env.example .env
    ```
    You need to get your database connection details from your Supabase project dashboard (Settings > Database).

### Database Seeding

To populate the database with initial test data, run the seed script. This will create some sample stock records.

```bash
npm run seed
```

## Running the Application
Development Mode
This command starts the server using ts-node-dev, which provides hot-reloading.
```bash
npm run dev
```

## Production Mode
First, build the TypeScript code into JavaScript, then start the application.
```bash
npm run build
npm start
```

## Running with Docker

1 - Build the Docker image:
```bash
docker build -t nutrichain-warehouse .
```
2 - Run the container:
Make sure your .env file is populated.
```bash
docker run --rm -p 3001:3001 --env-file .env --name warehouse-service nutrichain-warehouse
```

This service is also designed to be run as part of a larger docker-compose.yml file for the entire NutriChain system.
## API Documentation
Once the server is running, you can access the interactive Swagger/OpenAPI documentation at:
http://localhost:3001/api-docs

## Running Tests
To run the Jest test suite:
```bash
npm test
```