// Importing necessary modules and models
import { Sequelize } from "sequelize";
import Location from "../models/LocationModel.js";

// LocationController contains methods for handling operations on Location
export const LocationController = {
  // Method to retrieve all Location records
  getAllLocation: async (req, res) => {
    try {
      // Fetch all Location records with specific attributes
      const response = await Location.findAll({
        attributes: ["LocID", "LocationName", "IDNo", "Status"],
      });
      // Return the records
      res.status(200).json(response);
    } catch (error) {
      console.error("Error fetching all Location records:", error);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },

  // Method to retrieve a Location by IDNo
  getLocationByIdNo: async (req, res) => {
    try {
      // Fetch a single Location record by IDNo
      const location = await Location.findOne({
        where: { IDNo: req.params.id },
        order: Sequelize.col("IDNo"),
      });
      // Check if the record exists
      if (location) {
        res.status(200).json(location);
      } else {
        res.status(404).json({ msg: "Location not found" });
      }
    } catch (error) {
      console.error("Error fetching Location by IDNo:", error);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },

  // Method to create a new Location record
  createLocation: async (req, res) => {
    try {
      // Create a new Location record with the provided data
      const location = await Location.create(req.body);
      // Return the created record
      res.status(201).json(location);
    } catch (error) {
      console.error("Error creating Location:", error);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },

  // Method to update an existing Location record by IDNo
  updateLocation: async (req, res) => {
    try {
      // Update the record with the provided data
      const updated = await Location.update(req.body, {
        where: { IDNo: req.params.id },
      });
      // Check if any record was updated
      if (updated[0] > 0) {
        res.status(200).json({ msg: "Record updated successfully" });
      } else {
        res.status(404).json({ msg: "Record not found" });
      }
    } catch (error) {
      console.error("Error updating Location:", error);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },

  // Method to delete a Location record by IDNo
  deleteLocation: async (req, res) => {
    try {
      // Delete the record
      const deleted = await Location.destroy({
        where: { IDNo: req.params.id },
      });
      // Check if any record was deleted
      if (deleted) {
        res.status(200).json({ msg: "Record deleted successfully" });
      } else {
        res.status(404).json({ msg: "Record not found" });
      }
    } catch (error) {
      console.error("Error deleting Location:", error);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },
};
