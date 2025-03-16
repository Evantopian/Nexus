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
  } catch (error) {
    console.error("Error retrieving password:", error);
    throw new Error("Failed retrieving password from SSM.");
  }
};
export const handler = async (event) => {
  try {
    const dbpass = await getPass();
    const pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: "nexusdb",
      password: dbpass,
      port: 5432,
    });
    const response = {
      statusCode: 200,
      body: JSON.stringify("HELLO LAMBDA !"),
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
