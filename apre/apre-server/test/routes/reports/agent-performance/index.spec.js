/**
 * Author: Professor Krasso
 * Date: 10 September 2024
 * File: index.spec.js
 * Description: Tests for the agent performance API, covering call duration by date
 * range and agent performance by region endpoints. Each test mocks the mongo utility
 * to isolate route logic from the database layer.
 *
 * Changes:
 * - Added tests for GET /regions to verify distinct region list is returned.
 * - Added tests for GET /regions/:region to verify per-agent average call duration
 *   aggregation and empty-result handling.
 * - Reorganized tests into nested describe blocks grouped by endpoint.
 */

// Require the modules
const request = require("supertest");
const app = require("../../../../src/app");
const { mongo } = require("../../../../src/utils/mongo");

jest.mock("../../../../src/utils/mongo");

// Test the agent performance API
describe("Apre Agent Performance API", () => {
  beforeEach(() => {
    mongo.mockClear();
  });

  describe("GET /call-duration-by-date-range", () => {
    // Test the call-duration-by-date-range endpoint
    it("should fetch call duration data for agents within a specified date range", async () => {
      mongo.mockImplementation(async (callback) => {
        const db = {
          collection: jest.fn().mockReturnThis(),
          aggregate: jest.fn().mockReturnValue({
            toArray: jest.fn().mockResolvedValue([
              {
                agents: ["Agent A", "Agent B"],
                callDurations: [120, 90],
              },
            ]),
          }),
        };
        await callback(db);
      });

      const response = await request(app).get(
        "/api/reports/agent-performance/call-duration-by-date-range?startDate=2023-01-01&endDate=2023-01-31",
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          agents: ["Agent A", "Agent B"],
          callDurations: [120, 90],
        },
      ]);
    });

    // Test the call-duration-by-date-range endpoint with missing parameters
    it("should return 400 if startDate or endDate is missing", async () => {
      const response = await request(app).get(
        "/api/reports/agent-performance/call-duration-by-date-range?startDate=2023-01-01",
      );
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: "Start date and end date are required",
        status: 400,
        type: "error",
      });
    });

    // Test the call-duration-by-date-range endpoint with an invalid date range
    it("should return 404 for an invalid endpoint", async () => {
      const response = await request(app).get(
        "/api/reports/agent-performance/invalid-endpoint",
      );
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        message: "Not Found",
        status: 404,
        type: "error",
      });
    });
  });

  describe("GET /regions", () => {
    // Verifies that the /regions endpoint queries the agentPerformance collection
    // for distinct region values and returns them as a flat array of strings.
    it("should return a list of distinct regions from the agentPerformance collection", async () => {
      mongo.mockImplementation(async (callback) => {
        const db = {
          collection: jest.fn().mockReturnThis(),
          distinct: jest
            .fn()
            .mockResolvedValue(["north", "south", "east", "west"]),
        };
        await callback(db);
      });

      const response = await request(app).get(
        "/api/reports/agent-performance/regions",
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual(["north", "south", "east", "west"]);
    });
  });

  describe("GET /regions/:region", () => {
    // Verifies that the /regions/:region endpoint aggregates agentPerformance records
    // for the specified region, joins agent names, and returns each agent with their
    // rounded average call duration in seconds.
    it("should return per-agent average call duration for a given region", async () => {
      mongo.mockImplementation(async (callback) => {
        const db = {
          collection: jest.fn().mockReturnThis(),
          aggregate: jest.fn().mockReturnValue({
            toArray: jest.fn().mockResolvedValue([
              { agent: "Agent A", averageCallDuration: 112.5 },
              { agent: "Agent B", averageCallDuration: 98.0 },
            ]),
          }),
        };
        await callback(db);
      });

      const response = await request(app).get(
        "/api/reports/agent-performance/regions/north",
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        { agent: "Agent A", averageCallDuration: 112.5 },
        { agent: "Agent B", averageCallDuration: 98.0 },
      ]);
    });

    // Verifies that the /regions/:region endpoint returns an empty array when no
    // agentPerformance records exist for the specified region, rather than an error.
    it("should return an empty array when no data exists for the given region", async () => {
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
        "/api/reports/agent-performance/regions/unknown-region",
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });
});
