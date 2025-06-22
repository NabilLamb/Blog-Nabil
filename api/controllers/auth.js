import { db } from "../db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const register = async (req, res) => {
    const { username, email, password, profileImg } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const query = "SELECT * FROM users WHERE username = ? OR email = ?";
    db.query(query, [username, email], async (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length) return res.status(409).json({ message: "User already exists" });

        try {
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const insertQuery = "INSERT INTO users (username, email, password, userImg) VALUES (?, ?, ?, ?)";
            db.query(
                insertQuery,
                [username, email, hashedPassword, profileImg || null],
                (err, data) => {
                    if (err) return res.status(500).json(err);
                    return res.status(201).json({ message: "User registered successfully" });
                }
            );
        } catch (hashError) {
            return res.status(500).json({ message: "Hashing failed", error: hashError });
        }
    });
};
export const login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const query = "SELECT * FROM users WHERE email = ? ";
    db.query(query, [email], async (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json({ message: "User not found" });
        const user = data[0];

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Incorrect password" });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        if (!token) return res.status(500).json({ message: "Token generation failed" });

        const { password: userPassword, ...userWithoutPassword } = user;
        res.cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        }).status(200).json({ ...userWithoutPassword, message: "Login successful" });
    });
}
export const logout = (req, res) => {
    res.clearCookie("access_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    }).status(200).json({ message: "Logout successful" });
}