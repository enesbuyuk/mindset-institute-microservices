# Mindset Institute Microservices API Project for Back-End Developer Position
![image](https://github.com/user-attachments/assets/069f9bd4-ee73-464b-907a-9c8ec34f5cda)

## Overview
This project follows a microservices architecture with multiple services running in isolated containers. It uses Nginx as the API Gateway and integrates multiple microservices with separate databases.

## Features
- API Gateway with Nginx
- Authentication Service with JWT support
- Customer Management Service
- Sales Management Service
- Containerized with Docker and Docker Compose
- Uses MongoDB and PostgreSQL for data storage

## Usage
### Prerequisites
- Docker
- Node.js (for local development)

### Installation
Clone the repository:
```bash
git clone https://github.com/enesbuyuk/mindset-institute-microservices.git
cd mindset-institute-microservices
```

### Configuration
Modify the `.env` file in the root directory to set up the necessary environment variables such as database URLs and JWT secret keys.

### Running the Services
To start all services using Docker Compose, run:
```bash
docker-compose up -d
```
This command will start the API Gateway, microservices, and databases.

### Stopping the Services
To stop the services, run:
```bash
docker-compose down
```

## Swagger API Documentation (Aggregated Swagger Documentation)
![image](https://github.com/user-attachments/assets/55e3ebf1-2661-4a71-95d1-f27c6d2d16e6)
The API is documented using Swagger. Once the services are running, you can access the API documentation at:
```
http://localhost/api-docs/
```

## Running Tests
Each microservice includes unit tests. To run the tests, navigate to the respective service directory and execute:
```bash
npm test
```

## Contributing
Contributions are welcome! Please follow the guidelines in `CONTRIBUTING.md`.

## License
This project is licensed under the MIT License.

For any inquiries, contact: [contact@enesbuyuk.com](mailto:contact@enesbuyuk.com)
