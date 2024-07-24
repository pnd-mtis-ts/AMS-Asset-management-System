// Importing necessary modules and models
import argon2 from "argon2";
import User from "../models/UserModel.js";

// UserController contains methods for handling operations on User
export const UserController = {
  // Method to retrieve all User records
  getUser: async (req, res) => {
    try {
      // Fetch all User records with specific attributes
      const users = await User.findAll({
        attributes: ["id", "name", "email"],
      });

      // Return the records
      res.status(200).json(users);
    } catch (error) {
      // Handle errors
      console.error("Error retrieving users:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Method to retrieve a User by its ID
  getUserById: async (req, res) => {
    try {
      // Fetch a single User record by its ID
      const user = await User.findOne({
        attributes: ["name", "email"],
        where: { id: req.params.id },
      });

      // Check if the record exists
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Return the record
      res.status(200).json(user);
    } catch (error) {
      // Handle errors
      console.error("Error retrieving user by ID:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Method to create a new User record
  createUser: async (req, res) => {
    const { name, email, password } = req.body;
    try {
      // Hash the password
      const hashPassword = await argon2.hash(password);

      // Create a new User record with the provided data
      await User.create({
        name,
        email,
        password: hashPassword,
      });

      // Return success message
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      // Handle errors
      console.error("Error creating user:", error);
      res.status(400).json({ error: "Failed to register user" });
    }
  },

  // Method to update an existing User record by its ID
  updateUser: async (req, res) => {
    const { name, email, password } = req.body;
    try {
      // Find the user by ID
      const user = await User.findByPk(req.params.id);

      // Check if the user exists
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Hash the new password if provided
      let hashPassword = user.password;
      if (password) {
        hashPassword = await argon2.hash(password);
      }

      // Update the user record
      await user.update({
        name,
        email,
        password: hashPassword,
      });

      // Return success message
      res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
      // Handle errors
      console.error("Error updating user:", error);
      res.status(400).json({ error: "Failed to update user" });
    }
  },

  // Method to delete a User record by its ID
  deleteUser: async (req, res) => {
    try {
      // Find the user by ID
      const user = await User.findByPk(req.params.id);

      // Check if the user exists
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Delete the user record
      await user.destroy();

      // Return success message
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      // Handle errors
      console.error("Error deleting user:", error);
      res.status(400).json({ error: "Failed to delete user" });
    }
  },
};

export default UserController;
