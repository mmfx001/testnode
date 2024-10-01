// const express = require('express');
// const cors = require('cors');

// const ApiUrl = express();

// // CORS ni o'rnatish
// ApiUrl.use(cors({
//     origin: 'http://localhost:5176', // Frontend manzilini belgilash
//     methods: ['GET', 'POST'], // Ruxsat etilgan so'rov turlari
//     allowedHeaders: ['Content-Type'] // Ruxsat etilgan sarlavhalar
// }));

// ApiUrl.use(express.json());

// let users = [];

// // Foydalanuvchini qo'shish (POST so'rovi)
// ApiUrl.post('/users', (req, res) => {
//     const { name, surname, age } = req.body;

//     if (!name || !surname || !age) {
//         return res.status(400).json({ message: "Iltimos, barcha qiymatlarni kiriting" });
//     }

//     const id = Math.floor(Math.random() * 10000) + 1;

//     const existingUser = users.find(v => v.name === name && v.surname === surname && v.age === age);
//     if (existingUser) {
//         return res.status(400).json({ message: "Bunday foydalanuvchi allaqachon mavjud" });
//     }

//     users.push({ id, name, surname, age });
//     res.json({ data: users });
// });

// // Foydalanuvchilarni olish (GET so'rovi)
// ApiUrl.get('/users', (req, res) => {
//     res.json({ data: users });
// });

// ApiUrl.listen(5002, () => {
//     console.log('API 5002-portda ishga tushdi');
// });
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
    name: String,
    surname: String,
    age: Number,
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
        const newUser = new UserModule(req.body);
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
