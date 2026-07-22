import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();
const makeToken = (id) => jwt.sign({ userId: id }, process.env.JWT_SECRET, { expiresIn: "7d" });

router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 10) });
    res.json({ token: makeToken(user._id) });
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Invalid credentials" });
    }
    res.json({ token: makeToken(user._id) });
});

export default router;