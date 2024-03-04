const express = require("express");
const { Client } = require("pg");
const cors = require("cors");
const bcrypt = require('bcrypt')
const app = express();

app.use(cors());
app.use(express.json());

const createUserTable = async () => {
    const client = new Client({
        user: "postgres",
        host: "localhost",
        database: "Task3",
        password: "Ayush@0078",
        port: 6606,
    });

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
        console.log("Users table created successfully");
    } catch (error) {
        console.error("Error creating users table:", error);
    } finally {
        await client.end();
    }
};

const punchInOutData = async () => {
    const client = new Client({
        user: "postgres",
        host: "localhost",
        database: "Task3",
        password: "Ayush@0078",
        port: 6606,
    });

    try {
        await client.connect();
        const query = `
            CREATE TABLE IF NOT EXISTS clockInOut (
                id SERIAL PRIMARY KEY,
                "current_Date" TIMESTAMP NOT NULL,
                cur_time VARCHAR(8) NOT NULL,
                break_time VARCHAR(8) NOT NULL
            )
        `;
        await client.query(query);
        console.log('ClockInOut table created successfully');
    } catch (error) {
        console.error('Error creating clockInOut table:', error);
    } finally {
        await client.end();
    }
};

app.post("/signup", async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const hashPassword = await bcrypt.hash(password, 7);

        const client = new Client({
            user: "postgres",
            host: "localhost",
            database: "Task3",
            password: "Ayush@0078",
            port: 6606,
        });

        await client.connect();
        const result = await client.query(
            `
                INSERT INTO users (first_name, last_name, email, password)
                VALUES ($1, $2, $3, $4)
            `,
            [firstName, lastName, email, hashPassword]
        );
        await client.end();

        res.status(200).json({ success: true, message: "User registered successfully" });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ success: false, message: "Failed to register user" });
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const client = new Client({
            user: "postgres",
            host: "localhost",
            database: "Task3",
            password: "Ayush@0078",
            port: 6606,
        });

        await client.connect();
        const result = await client.query(
            `
                SELECT * FROM users
                WHERE email = $1
            `,
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const user = result.rows[0];
        const userPassword = await bcrypt.compare(password, user.password);

        if (userPassword) {
            return res.status(200).json({ message: "Login successful" });
        }

        return res.status(404).json({ error: "Invalid password" });
    } catch (error) {
        console.error("Something went wrong:", error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
});

app.post('/', async (req, res) => {
    try {
        const { currentDate, curTime, breakTime } = req.body;

        const client = new Client({
            user: "postgres",
            host: "localhost",
            database: "Task3",
            password: "Ayush@0078",
            port: 6606,
        });

        await client.connect();
        const result = await client.query(
            `
                INSERT INTO clockInOut ("current_Date", cur_time, break_time)
                VALUES (TO_TIMESTAMP($1 || ' ' || $2, 'YYYY-MM-DD HH24:MI:SS'), $2, $3)
            `,
            [currentDate, curTime, breakTime]
        );
        await client.end();

        res.status(200).json({ success: true, message: "PunchInOut time successfully stored" });
    } catch (error) {
        console.error("Error storing PunchInOut time:", error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
});

const startServer = async () => {
    await createUserTable(); // Ensure users table is created before starting the server
    await punchInOutData(); // Ensure clockInOut table is created before starting the server
    app.listen(3003, () => {
        console.log("Server is running on port 3003");
    });
};

startServer();
