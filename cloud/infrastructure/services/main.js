const { Pool, Query } = require("pg");
const AWS = require("aws-sdk");

const ssm = new AWS.SSM();

const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);

const getPass = async () => {
  try {
    const param = await ssm
      .getParameter({
        Name: process.env.DB_PASS_PARAM,
        WithDecryption: true,
      })
      .promise();
    return param.Parameter.Value;
  } catch (error) {
    console.error("Error retrieving password:", error);
    throw new Error("Failed retrieving password from SSM.");
  }
};

exports.handler = async (event) => {
  try {
    const q = await readFile("query.sql", "utf-8");

    if (!q) {
      throw new Error("Query file is empty or not found.");
    }

    const dbpass = await getPass();

    if (!dbpass) {
      throw new Error("Failed to retrieve password from SSM.");
    }

    const pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: "nexusdb",
      password: dbpass,
      port: 5432,
      ssl: {
        rejectUnauthorized: false,
      },
    });

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
