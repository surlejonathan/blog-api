import { db } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  // Check existing user
  const query = "SELECT * FROM users WHERE email = ? OR username = ?";
  const { email, username, password } = req.body;

  db.query(query, [email, username], (err, result) => {
    if (err) return res.json(err);
    if (result.length) return res.status(409).json("User already exists!");

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const addUser =
      "INSERT INTO users (`username`, `email`, `password`) VALUES (?)";
    const values = [username, email, hash];

    db.query(addUser, [values], (err, result) => {
      if (err) return res.json(err);
      return res.status(200).json("User has been created!");
    });
  });
};

export const login = (req, res) => {
  // Check user
  const query = "SELECT * FROM users WHERE username = ?";

  const { username } = req.body;

  db.query(query, username, (err, result) => {
    if (err) return res.json(err);
    if (result.length === 0) return res.status(404).json("User not found!");

    // Check password

    const { password, ...other } = result[0];

    const correctPassword = bcrypt.compareSync(req.body.password, password);

    if (!correctPassword) return res.status(400).json("Wrong credentials!");

    const token = jwt.sign(result[0].id, process.env.JWT_KEY);

    res
      .cookie("access_token", token, {
        httpOnly: true,
        domain: ".app",
        secure: true,
        sameSite: "strict",
      })
      .status(200)
      .json(other);
  });
};

export const logout = (req, res) => {
  res
    .clearCookie("access_token", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .json("User has been logged out!");
};
