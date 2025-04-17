const { Pool, Query } = require("pg");
const AWS = require("aws-sdk");

const ssm = new AWS.SSM({ region: "us-east-2" });

const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);
/*
const getPass = async () => {
  try {
    console.log("Retrieving password from SSM...");
    const param = await ssm
      .getParameter({
        Name: process.env.DB_PASS_PARAM,
        WithDecryption: true,
      })
      .promise()
      .then((data) => console.log(data.Parameter.Value))
      .catch((err) => console.error(err));
    console.log("Password retrieved successfully.");
    return param.Parameter.Value;
  } catch (error) {
    console.error("Error retrieving password:", error);
    throw new Error("Failed retrieving password from SSM.");
  }
};
*/
exports.handler = async (event) => {
  try {
    const q = await readFile("query.sql", "utf-8");
    console.log("Query file read successfully.");
    if (!q) {
      throw new Error("Query file is empty or not found.");
    }

    const dbpass = process.env.DB_PASS;

    if (!dbpass) {
      throw new Error("Failed to retrieve password from SSM.");
    }
    console.log("Password retrieved successfully.");
    const pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: "nexusdb",
      password: dbpass,
      port: process.env.DB_PORT,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    //initial query
    console.log("Querying database...");
    const result = await pool.query(q);

    await pool.end();

    const response = {
      statusCode: 200,
      body: JSON.stringify({
        message: "Query executed successfully",
        result: result.rows,
      }),
    };
    return response;
  } catch (error) {
    console.error("Error connecting:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
