// Importing necessary modules and models
import { Sequelize } from "sequelize";
import Entity from "../models/EntityModel.js";

// EntityController contains methods for handling operations on Entity
export const EntityController = {
  // Method to retrieve all Entity records
  getAllEntity: async (req, res) => {
    try {
      // Fetch all Entity records with specific attributes
      const response = await Entity.findAll({
        attributes: ["Entity", "EntityName", "Address", "City", "Phone", "Fax", "Status", "IDNo", "EntityCatName"],
      });
      // Return the records
      res.status(200).json(response);
    } catch (error) {
      console.error("Error fetching all entities:", error);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },

  // Method to retrieve an Entity by IDNo
  getEntityByIdNo: async (req, res) => {
    try {
      // Fetch a single Entity record by IDNo
      const entity = await Entity.findOne({
        where: { IDNo: req.params.id },
        order: Sequelize.col("IDNo"),
      });
      // Check if the record exists
      if (entity) {
        res.status(200).json(entity);
      } else {
        res.status(404).json({ msg: "Entity not found" });
      }
    } catch (error) {
      console.error("Error fetching entity by IDNo:", error);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },

  // Method to create a new Entity record
  createEntity: async (req, res) => {
    try {
      // Create a new Entity record with the provided data
      const entity = await Entity.create(req.body);
      // Return the created record
      res.status(201).json(entity);
    } catch (error) {
      console.error("Error creating entity:", error);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },

  // Method to update an existing Entity record by IDNo
  updateEntity: async (req, res) => {
    try {
      // Update the record with the provided data
      const [updated] = await Entity.update(req.body, {
        where: { IDNo: req.params.id },
      });
      // Check if any record was updated
      if (updated) {
        res.status(200).json({ msg: "Record updated successfully" });
      } else {
        res.status(404).json({ msg: "Record not found" });
      }
    } catch (error) {
      console.error("Error updating entity:", error);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },

  // Method to delete an Entity record by IDNo
  deleteEntity: async (req, res) => {
    try {
      // Delete the record
      const deleted = await Entity.destroy({
        where: { IDNo: req.params.id },
      });
      // Check if any record was deleted
      if (deleted) {
        res.status(200).json({ msg: "Record deleted successfully" });
      } else {
        res.status(404).json({ msg: "Record not found" });
      }
    } catch (error) {
      console.error("Error deleting entity:", error);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },
};
