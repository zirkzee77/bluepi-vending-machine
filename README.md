Vending Machine Application

Overview
A digital vending machine application built with React and Node.js. The system handles product selection, cash transactions, and provides an admin interface for stock and cash inventory management.

Technology Stack
- Frontend
    - React with TypeScript
    - Ant Design (UI Components)
    - TanStack Query (Data Fetching & Cache)
    - CSS Modules (Styling)

- Backend
    - Node.js with TypeScript
    - Express.js (Server Framework)
    - Prisma (ORM)
    - PostgreSQL (Database)
    - Jest (Testing)

Features

- Product display and selection
- Cash insertion and change calculation
- Admin panel for:
    - Stock management
    - Cash inventory management
- Real-time inventory updates
- Transaction handling

Setup and Installation
- Prerequisites
    - Node.js (v18+)
    - pnpm
    - PostgreSQL
    - Docker

Running with Docker
- docker compose up --build

Testing
- Run backend tests with pnpm test command

Design Decisions & Assumptions
- Architecture
    - RESTful API design
    - Repository pattern for data access
    - Service layer for business logic
    - Input validation using express-validator
    - ype safety with TypeScript

- Data Models
    - Products with stock tracking
    - Cash inventory for coins and notes
    - Transaction history
    - Timestamps for auditing

- Business Rules
    - Cash Handling
    - Accepts Thai Baht denominations
    - Validates sufficient funds
    - Calculates optimal change
    - Maintains cash inventory
- Stock Management
    - Real-time stock updates
    - Stock validation before purchase
    - Admin stock adjustment

Current Limitations & Future Improvements

- Limitations
    - No new product creation (hardcoded product list)
    - Limited cash denomination management
    - Basic admin functionalities
    - No user authentication
    - Limited transaction history
    - Frontend testing not implemented

- Potential Improvements
    - Functionality
      - Product management (CRUD operations)
      - Cash denomination management
      - Transaction history and analytics
      - User authentication and roles
      - Bulk operations for stock/cash updates
    - UI/UX
      - Product filtering and sorting
      - Search functionality
      - Transaction dashboard
      - Stock alerts
    - Technical
      - Frontend testing implementation
      - Increase backend test coverage
      - API documentation
      - Error tracking
      - Logging system

Testing Coverage

- Backend controller tests
- Backend service tests
- Focus on core business logic validation

API Endpoints
- GET    /api/products
- GET    /api/products/:id
- PATCH  /api/products/:id
- GET    /api/cash-inventory
- PATCH  /api/cash-inventory/:id
- POST   /api/transactions

Project Structure
```
├── be/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   └── middleware/
│   └── tests/
└── fe/
    └── src/
        ├── components/
        ├── hooks/
        └── utils/
```

Time Constraints & Trade-offs
Due to time limitations, several features were deprioritized:
- Frontend testing
- Full CRUD operations for products and cash
- Advanced admin features
- Extended test coverage
- User authentication system

These limitations were accepted to deliver a functional MVP within the timeframe while maintaining core functionality.
