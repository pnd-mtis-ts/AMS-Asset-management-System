import argon2 from "argon2";
import jwt from "jsonwebtoken";
import Role from "../models/RoleModel.js";
import Users from "../models/UserModel.js";
import UserRole from "../models/UserRoleModel.js";

// Login function
export const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Users.findOne({ where: { email } });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const match = await argon2.verify(user.password, password);
    if (!match) return res.status(400).json({ msg: "Wrong password" });

    const accessToken = jwt.sign({ id: user.id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10h" });

    res.status(200).json({ accessToken, user: { name: user.name, email: user.email } });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Logout function
export const logOut = (req, res) => {
  // For JWT, client-side should remove the token
  res.status(200).json({ msg: "Logged out successfully" });
};

// Get current user information
export const Me = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ msg: "No token provided" });

    const token = authHeader.split(" ")[1];
    let userId;
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      userId = decoded.id;
    } catch (error) {
      return res.status(403).json({ msg: "Invalid token" });
    }

    const user = await UserRole.findOne({
      where: { userId },
      include: [
        {
          model: Users,
          attributes: ["name", "email"],
        },
        {
          model: Role,
          attributes: ["name"],
        },
      ],
    });

    if (!user) return res.status(404).json({ msg: "User not found" });

    // Send the user details as the response
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
