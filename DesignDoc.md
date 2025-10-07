# Design Document — Users + Orders microservices
**Author:** your_registered_email_id  
**Date:** <put today's date>

## 1. Overview
This submission implements two small microservices:
- **Users service** (port 3001) — CRUD for users (in-memory store).
- **Orders service** (port 3002) — Orders creation & retrieval; **POST /orders** validates user by calling Users service.

All services are HTTP REST microservices using Node.js + Express. Inter-service communication is via HTTP (axios). The system is intentionally minimal so it can be run offline for evaluation.

## 2. Folder structure
(See the provided tree in the submission root)

## 3. Schemas (simple)
**User**
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "balance": "number"
}
