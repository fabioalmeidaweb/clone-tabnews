import database from "infra/database.js";
import orchestrator from "tests/orchestrator.js";

beforeAll(cleanDatabase);
async function cleanDatabase() {
  await orchestrator.waitForAllServices();
  await database.query("drop schema public cascade; create schema public;");
}
describe("DELETE /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    test("Trying to use a DELETE method", async () => {
      const response = await fetch("http://localhost:3000/api/v1/migrations", {
        method: "DELETE",
      });
      expect(response.status).toBe(405);
    });
  });
});
