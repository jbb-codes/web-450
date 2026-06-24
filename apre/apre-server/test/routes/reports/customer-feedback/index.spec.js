/**
 * Author: Professor Krasso
 * Date: 10 September 2024
 * Modified: Jarren Bess, 6/24/2026
 * File: index.spec.js
 * Description: Test the customer feedback API
 *
 * Changes (Jarren Bess, 6/24/2026):
 * - Added tests for GET /feedback-by-channel to verify the endpoint's HTTP
 *   contract independently of database availability. The mongo utility is mocked
 *   to isolate route logic from infrastructure, keeping tests deterministic
 *   without a live connection.
 */

// Require the modules
const request = require("supertest");
const app = require("../../../../src/app");
const { mongo } = require("../../../../src/utils/mongo");

jest.mock("../../../../src/utils/mongo");

// Test the customer feedback API
describe("Apre Customer Feedback API", () => {
  beforeEach(() => {
    mongo.mockClear();
  });

  // Test the channel-rating-by-month endpoint
  it("should fetch average customer feedback ratings by channel for a specified month", async () => {
    mongo.mockImplementation(async (callback) => {
      const db = {
        collection: jest.fn().mockReturnThis(),
        aggregate: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([
            {
              channels: ["Email", "Phone"],
              ratingAvg: [4.5, 3.8],
            },
          ]),
        }),
      };
      await callback(db);
    });

    const response = await request(app).get(
      "/api/reports/customer-feedback/channel-rating-by-month?month=1",
    ); // Send a GET request to the channel-rating-by-month endpoint

    // Expect a 200 status code
    expect(response.status).toBe(200);

    // Expect the response body to match the expected data
    expect(response.body).toEqual([
      {
        channels: ["Email", "Phone"],
        ratingAvg: [4.5, 3.8],
      },
    ]);
  });

  // Test the channel-rating-by-month endpoint with missing parameters
  it("should return 400 if the month parameter is missing", async () => {
    const response = await request(app).get(
      "/api/reports/customer-feedback/channel-rating-by-month",
    ); // Send a GET request to the channel-rating-by-month endpoint with missing month
    expect(response.status).toBe(400); // Expect a 400 status code

    // Expect the response body to match the expected data
    expect(response.body).toEqual({
      message: "month and channel are required",
      status: 400,
      type: "error",
    });
  });

  // Test the channel-rating-by-month endpoint with an invalid month
  it("should return 404 for an invalid endpoint", async () => {
    // Send a GET request to an invalid endpoint
    const response = await request(app).get(
      "/api/reports/customer-feedback/invalid-endpoint",
    );
    expect(response.status).toBe(404); // Expect a 404 status code

    // Expect the response body to match the expected data
    expect(response.body).toEqual({
      message: "Not Found",
      status: 404,
      type: "error",
    });
  });

  describe("GET /feedback-by-channel", () => {
    // Test 1: happy path — the database has records and the endpoint returns
    // them as an array of objects with the expected shape.
    it("should return 200 with an array of channel feedback data", async () => {
      mongo.mockImplementation(async (callback) => {
        const db = {
          collection: jest.fn().mockReturnThis(),
          aggregate: jest.fn().mockReturnValue({
            toArray: jest.fn().mockResolvedValue([
              { channel: "Email", feedbackCount: 45, ratingAvg: 3.84 },
              { channel: "Phone", feedbackCount: 32, ratingAvg: 4.2 },
            ]),
          }),
        };
        await callback(db);
      });

      const response = await request(app).get(
        "/api/reports/customer-feedback/feedback-by-channel",
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        { channel: "Email", feedbackCount: 45, ratingAvg: 3.84 },
        { channel: "Phone", feedbackCount: 32, ratingAvg: 4.2 },
      ]);
    });

    // Test 2: empty-data case — the database has no feedback records yet, so
    // the endpoint should return 200 with an empty array rather than an error.
    it("should return 200 with an empty array when no feedback records exist", async () => {
      mongo.mockImplementation(async (callback) => {
        const db = {
          collection: jest.fn().mockReturnThis(),
          aggregate: jest.fn().mockReturnValue({
            toArray: jest.fn().mockResolvedValue([]),
          }),
        };
        await callback(db);
      });

      const response = await request(app).get(
        "/api/reports/customer-feedback/feedback-by-channel",
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    // Test 3: database error case — when the mongo utility signals a failure,
    // the error handler should respond with 500 so the client knows something
    // went wrong on the server rather than receiving misleading empty data.
    it("should return 500 when the database throws an error", async () => {
      mongo.mockImplementation(async (callback, next) => {
        const error = new Error("Database connection failed");
        error.status = 500;
        next(error);
      });

      const response = await request(app).get(
        "/api/reports/customer-feedback/feedback-by-channel",
      );

      expect(response.status).toBe(500);
      expect(response.body).toEqual(
        expect.objectContaining({ type: "error", status: 500 }),
      );
    });
  });
});
