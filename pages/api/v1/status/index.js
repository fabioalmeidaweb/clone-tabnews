import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const postgresVersionResult = await database.query("SHOW server_version;");

  const maxConnectionsResult = await database.query("SHOW max_connections;");

  const databaseName = process.env.POSTGRES_DB;
  const databaseOpenedConnectionResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });

  const databaseOpenedConnectionValue =
    databaseOpenedConnectionResult.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: postgresVersionResult.rows[0].server_version,
        max_connections: parseInt(maxConnectionsResult.rows[0].max_connections),
        opened_connections: databaseOpenedConnectionValue,
      },
    },
  });
}

export default status;
