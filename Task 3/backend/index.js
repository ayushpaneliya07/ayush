const express = require("express");
const { Client } = require("pg");
const cors = require("cors");
const bcrypt = require('bcrypt')
const app = express();
const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "Task3",
  password: "Ayush@0078",
  port: 6606,
});

async function createUserTable() {
  try {
    await client.connect();
    const query = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
        )`;
    await client.query(query);
    console.log("users table created successfully");
  } catch (error) {
    console.error("Error creating users table:", error);
  }
}

async function clockIn () {

    try {
      console.log('create a table')
      await client.connect();
  
      const query = `
        CREATE TABLE IF NOT EXISTS clockinOut (
          id SERIAL PRIMARY KEY,
          datetime TIMESTAMP NOT NULL,
          cur_time VARCHAR(8) NOT NULL,
          break_time VARCHAR(8) NOT NULL
        )
      `;
      
      await client.query(query);
      console.log('Table created successfully');
    } catch (err) {
      console.error('Error creating table:', err);
    } finally {
      await client.end();
    }

}

app.use(cors());
app.use(express.json());


app.post("/signup",async (req, res) => {
  console.log("Request body:", req.body);

  try {
    const { firstName, lastName, email, password } =
      req.body;
      console.log(req.body)

    // const extstingUser = await users.findOne({ email });
    // if (extstingUser) {
    //   return res.status(404).json({ error: "email allready used" });
    // }
    const hashPassword =await bcrypt.hash(password, 7);
    const result = await client.query(
      `
        INSERT INTO users( first_name, last_name, email, password)
        VALUES ($1, $2, $3, $4)
        `,
      [firstName, lastName, email, hashPassword]
    );
    // console.log(result.rows);
    res
      .status(200)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to register user" });
  }
});

app.post("/login", async(req, res)=>{

  const {email, password} = req.body;
  
  try {
    const result = await client.query(
      `
      SELECT * FROM users
      WHERE email = $1
      `,
      [email]
    );

    // If no user found with the provided email, return error
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get the user's information
    const user = result.rows[0];

    const userPassword = await bcrypt.compare(password, user.password);
    if(userPassword){
      return res.status(200).json({ message: "login successfuly" });
    }
    return res.status(404).json({ error: "invalid password" });
  } catch (error) {
    console.log("something wrong", error);
  }
})

app.post('/',async(req,res)=>{
  // console.log(req.body, '1')
  try{
    const {datetime, curTime, breakTime} = req.body ;
    console.log(req.body)
    const result = await client.query(
      `
        INSERT INTO clockinOut (datetime, cur_time, break_time)
        VALUES (TO_TIMESTAMP($1 || ' ' || $2, 'YYYY-MM-DD HH24:MI:SS'), $2, $3)
        RETURNING id;
      `,
      [datetime, curTime, breakTime]
    );
    res
    .status(200)
    .json({ success: true, message: "ur punchInOut time successfully store" });
  }catch (error) {
    console.error("Error registering user:", error);
    res
      .status(500)
      .json({ success: false, message: "somthing wrong" });
  }
})

const startServer = async () => {
  await createUserTable(); // Ensure table is created before starting the server
  app.listen(3003, () => {
    console.log("Server is running on port 3003");
  });
};

startServer();
