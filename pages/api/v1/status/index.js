import database from "../../../../infra/database.js";

async function status(request, response) {
  const result = await database.query("SELECT 0.1 + 0.2 as sum;");
  response.status(200).json({ chave: "Forçaaa!" });
}
export default status;
