import swaggerUi from "swagger-ui-express"
import { Express } from "express"

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Finance Dashboard API",
    version: "1.0.0",
    description: "REST API for a finance dashboard system with role-based access control",
  },
  servers: [
    {
      url: "http://localhost:8000",
      description: "Local development server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      ApiResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
          data: { type: "object" },
        },
      },
      ApiError: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string" },
          errors: { type: "array", items: { type: "string" } },
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          email: { type: "string" },
          role: { type: "string", enum: ["admin", "analyst", "viewer"] },
          status: { type: "string", enum: ["active", "inactive"] },
          created_at: { type: "string", format: "date-time" },
        },
      },
      FinancialRecord: {
        type: "object",
        properties: {
          id: { type: "integer" },
          created_by: { type: "integer" },
          amount: { type: "number" },
          type: { type: "string", enum: ["income", "expense"] },
          category: { type: "string" },
          date: { type: "string", format: "date" },
          notes: { type: "string", nullable: true },
          is_deleted: { type: "boolean" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
    },
  },
  paths: {
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  name: { type: "string", example: "John Doe" },
                  email: { type: "string", example: "john@example.com" },
                  password: { type: "string", example: "password123" },
                  role: {
                    type: "string",
                    enum: ["admin", "analyst", "viewer"],
                    default: "viewer",
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "User registered successfully" },
          "400": { description: "Validation failed" },
          "409": { description: "Email already registered" },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login and receive JWT token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", example: "admin@finance.com" },
                  password: { type: "string", example: "password123" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Login successful, returns JWT token" },
          "401": { description: "Invalid credentials" },
          "403": { description: "Account deactivated" },
        },
      },
    },
    "/users": {
      get: {
        tags: ["Users"],
        summary: "Get all users (admin only)",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "List of all users" },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
        },
      },
    },
    "/users/{id}": {
      get: {
        tags: ["Users"],
        summary: "Get user by ID (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "User found" },
          "404": { description: "User not found" },
        },
      },
      patch: {
        tags: ["Users"],
        summary: "Update user role or status (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  role: {
                    type: "string",
                    enum: ["admin", "analyst", "viewer"],
                  },
                  status: {
                    type: "string",
                    enum: ["active", "inactive"],
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "User updated successfully" },
          "404": { description: "User not found" },
        },
      },
    },
    "/records": {
      post: {
        tags: ["Records"],
        summary: "Create a financial record (admin only)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["amount", "type", "category", "date"],
                properties: {
                  amount: { type: "number", example: 5000 },
                  type: { type: "string", enum: ["income", "expense"] },
                  category: { type: "string", example: "salary" },
                  date: { type: "string", format: "date", example: "2026-04-01" },
                  notes: { type: "string", example: "April salary" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Record created successfully" },
          "400": { description: "Validation failed" },
          "403": { description: "Forbidden" },
        },
      },
      get: {
        tags: ["Records"],
        summary: "Get all records with filters (admin, analyst)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "type",
            in: "query",
            schema: { type: "string", enum: ["income", "expense"] },
          },
          {
            name: "category",
            in: "query",
            schema: { type: "string" },
          },
          {
            name: "from",
            in: "query",
            schema: { type: "string", format: "date" },
          },
          {
            name: "to",
            in: "query",
            schema: { type: "string", format: "date" },
          },
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 10, maximum: 100 },
          },
        ],
        responses: {
          "200": { description: "Records fetched successfully" },
          "403": { description: "Forbidden" },
        },
      },
    },
    "/records/{id}": {
      patch: {
        tags: ["Records"],
        summary: "Update a financial record (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  amount: { type: "number" },
                  type: { type: "string", enum: ["income", "expense"] },
                  category: { type: "string" },
                  date: { type: "string", format: "date" },
                  notes: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Record updated successfully" },
          "404": { description: "Record not found" },
        },
      },
      delete: {
        tags: ["Records"],
        summary: "Soft delete a financial record (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Record deleted successfully" },
          "404": { description: "Record not found" },
        },
      },
    },
    "/dashboard/summary": {
      get: {
        tags: ["Dashboard"],
        summary: "Get total income, expenses and net balance (all roles)",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Summary fetched successfully" },
        },
      },
    },
    "/dashboard/by-category": {
      get: {
        tags: ["Dashboard"],
        summary: "Get totals grouped by category (admin, analyst)",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Category breakdown fetched successfully" },
        },
      },
    },
    "/dashboard/trends": {
      get: {
        tags: ["Dashboard"],
        summary: "Get monthly income and expense trends (admin, analyst)",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Monthly trends fetched successfully" },
        },
      },
    },
    "/dashboard/recent": {
      get: {
        tags: ["Dashboard"],
        summary: "Get last 10 financial records (admin, analyst)",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Recent activity fetched successfully" },
        },
      },
    },
  },
}

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  console.log("API docs available at http://localhost:8000/api-docs")
}