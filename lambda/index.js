const { Client } = require("pg");
const path = require("path");
const fs = require("fs");

exports.handler = async function (event) {
  const client = new Client({
    host: event.ResourceProperties.host,
    port: 5432,
    password: "postgres",
    database: "pulsedb",
    user: "postgres",
  });

  await client.connect();

  const sqlScript = fs
    .readFileSync(path.join(__dirname, "script.sql"))
    .toString();

  const res = await client.query(sqlScript);
  return {
    status: "OK",
    results: res,
  };
};
