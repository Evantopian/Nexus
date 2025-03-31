const { Pool } = require("pg");
const AWS = require("aws-sdk");

const ssm = new AWS.SSM();

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
  const dbpass = await getPass();

  if (!dbpass) {
    throw new Error("Failed to retrieve password from SSM.");
  }

  try {
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

    // Get query from input
    const { sql, params } = JSON.parse(event.body || "{}");

    if (!sql) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "SQL query is required" }),
      };
    }

    console.log("Executing query:", sql, "with params:", params);

    const result = await pool.query(sql, params || []);

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
