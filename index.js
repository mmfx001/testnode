// backend/index.js

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8000;
const MONGOURL = process.env.MONGO_URL;

mongoose.connect(MONGOURL)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    });

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    surname: { type: String, required: true },
    age: { type: Number, required: true },
    password: { type: String, required: true }, // Added password field
});

const UserModule = mongoose.model("User", userSchema);

app.get("/getUsers", async (req, res) => {
    try {
        const userData = await UserModule.find();
        res.json(userData);
    } catch (error) {
        console.error("Error fetching users:", error.message);
        res.status(500).send("Server error");
    }
});

app.post("/addUser", async (req, res) => {
    try {
        const { name, surname, age, password } = req.body;

        if (!name || !surname || !age || !password) {
            return res.status(400).json({ message: "Please provide all required fields." });
        }

        const existingUser = await UserModule.findOne({ name });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }

        const newUser = new UserModule({ name, surname, age, password });
        await newUser.save();
        res.status(201).json(newUser); 
    } catch (error) {
        console.error("Error adding user:", error.message);
        res.status(500).send("Server error");
    }
});

app.put("/updateUser/:id", async (req, res) => {
    try {
        const updatedUser = await UserModule.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).send("User not found");
        }
        res.json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error.message);
        res.status(500).send("Server error");
    }
});

app.delete("/deleteUser/:id", async (req, res) => {
    try {
        const deletedUser = await UserModule.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).send("User not found");
        }
        res.send("User deleted");
    } catch (error) {
        console.error("Error deleting user:", error.message);
        res.status(500).send("Server error");
    }
});
