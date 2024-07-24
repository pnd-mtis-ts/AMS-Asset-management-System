// Importing necessary modules and models
import { Op } from "sequelize";
import AssetRelocationItem from "../models/AssetRelocationItemModel.js";
import AssetRelocation from "../models/AssetRelocationModel.js";
import Fixed from "../models/FixedModel.js";
import Location from "../models/LocationModel.js";

// AssetRelocationItemController contains methods for handling asset relocation item operations
export const AssetRelocationItemController = {
  // Method to create a new asset relocation item
  createAssetRelocationItem: async (req, res) => {
    const { AssetRelocation_ID, FixedIDNo, NewLocation, NewEmployeeResponsible } = req.body;
    try {
      const fixed = await Fixed.findByPk(FixedIDNo);

      // Check if the fixed asset exists
      if (!fixed) {
        return res.status(404).json({ msg: "Fixed asset not found." });
      }

      const previousLocation = fixed.LocId;
      const previousEmployeeResponsible = fixed.EmpID;

      // Update fixed asset location if new location is provided
      if (NewLocation) {
        const newLocationRecord = await Location.findByPk(NewLocation);
        if (!newLocationRecord) {
          return res.status(404).json({ msg: "New location not found." });
        }
        fixed.LocId = NewLocation;
      } else {
        fixed.LocId = previousLocation;
      }

      // Update fixed asset employee responsible if new employee is provided
      if (NewEmployeeResponsible) {
        fixed.EmpID = NewEmployeeResponsible;
      } else {
        fixed.EmpID = previousEmployeeResponsible;
      }

      // Save the updated fixed asset
      await fixed.save();

      // Create a new asset relocation item
      const relocationItem = await AssetRelocationItem.create({
        AssetRelocation_ID,
        FixedIDNo,
        PreviousLocation: previousLocation,
        NewLocation: NewLocation || previousLocation,
        PreviousEmployeeResponsible: previousEmployeeResponsible,
        NewEmployeeResponsible: NewEmployeeResponsible || previousEmployeeResponsible,
        RelocationDate: new Date(),
      });

      // Return the created asset relocation item
      res.status(200).json({ msg: "Asset relocation item created successfully", relocationItem });
    } catch (error) {
      console.error("Error creating asset relocation item:", error);
      res.status(500).json({ msg: "Failed to create asset relocation item", error: error.message });
    }
  },

  // Method to get all asset relocation items with pagination and search
  getAllAssetRelocationItems: async (req, res) => {
    // Retrieve pagination and search parameters from the query string
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const pageSize = Math.max(1, parseInt(req.query.pageSize) || 10);
    const offset = (page - 1) * pageSize;
    const searchQuery = req.query.search || "";

    try {
      // Find and count all asset relocation items with pagination and search
      const { count, rows: assetRelocationItemRecords } = await AssetRelocationItem.findAndCountAll({
        include: [
          {
            model: AssetRelocation,
            attributes: ["TransNo"],
          },
          {
            model: Fixed,
            attributes: ["FixedAssetName", "FixedNo"],
            include: [
              {
                model: Location,
                attributes: ["LocID", "LocationName"],
              },
            ],
          },
        ],
        where: {
          [Op.or]: [{ RelocationID: { [Op.like]: `%${searchQuery}%` } }],
        },
        limit: pageSize,
        offset: offset,
      });

      const totalPages = Math.ceil(count / pageSize);

      // Return the asset relocation items with pagination details
      res.status(200).json({
        data: assetRelocationItemRecords,
        page,
        pageSize,
        totalRecords: count,
        totalPages,
      });
    } catch (error) {
      console.error("Error fetching asset relocation items:", error);
      return res.status(500).json({ msg: "Internal server error", error: error.message });
    }
  },

  // Method to get asset relocation items by FixedIDNo
  getAssetRelocationItemsByFixedIDNo: async (req, res) => {
    try {
      // Find asset relocation items by FixedIDNo
      const assetRelocationItems = await AssetRelocationItem.findAll({
        where: { FixedIDNo: req.params.fixedIDNo },
        include: [
          {
            model: AssetRelocation,
            attributes: ["TransNo"],
          },
          {
            model: Fixed,
            attributes: ["FixedAssetName", "FixedNo"],
            include: [
              {
                model: Location,
                attributes: ["LocID", "LocationName"],
              },
            ],
          },
        ],
      });

      // Check if any asset relocation items exist
      if (assetRelocationItems.length === 0) {
        return res.status(404).json({ msg: "No asset relocation items found for the given FixedIDNo." });
      }

      // Return the asset relocation items
      res.status(200).json({ data: assetRelocationItems });
    } catch (error) {
      console.error("Error fetching asset relocation items by FixedIDNo:", error);
      res.status(500).json({ msg: "Failed to fetch asset relocation items", error: error.message });
    }
  },

  // Method to get an asset relocation item by ID
  getAssetRelocationItemById: async (req, res) => {
    try {
      const { id } = req.params;
      // Find asset relocation item by ID
      const assetRelocationItem = await AssetRelocationItem.findByPk(id);
      if (!assetRelocationItem) {
        return res.status(404).json({ error: "Asset Relocation Item not found" });
      }
      // Return the asset relocation item
      return res.json(assetRelocationItem);
    } catch (error) {
      console.error("Error fetching asset relocation item by ID:", error);
      return res.status(500).json({ msg: "Internal server error", error: error.message });
    }
  },

  // Method to update an asset relocation item by ID
  updateAssetRelocationItem: async (req, res) => {
    try {
      const { id } = req.params;
      const { AssetRelocation_ID, FixedIDNo, PreviousLocation, NewLocation, PreviousEmployeeResponsible, NewEmployeeResponsible, RelocationDate } = req.body;

      // Find asset relocation item by ID
      const assetRelocationItem = await AssetRelocationItem.findByPk(id);
      if (!assetRelocationItem) {
        return res.status(404).json({ error: "Asset Relocation Item not found" });
      }

      // Update the asset relocation item
      await assetRelocationItem.update({
        AssetRelocation_ID,
        FixedIDNo,
        PreviousLocation,
        NewLocation,
        PreviousEmployeeResponsible,
        NewEmployeeResponsible,
        RelocationDate,
      });

      // Return the updated asset relocation item
      res.status(200).json({ msg: "Record Updated", assetRelocationItem });
    } catch (error) {
      console.error("Error updating asset relocation item:", error);
      res.status(400).json({ msg: "Error updating record", error: error.message });
    }
  },

  // Method to delete an asset relocation item by ID
  deleteAssetRelocationItem: async (req, res) => {
    try {
      // Delete asset relocation item by ID
      const deleted = await AssetRelocationItem.destroy({
        where: { RelocationID: req.params.id },
      });
      if (deleted) {
        res.status(200).json({ msg: "Record deleted successfully" });
      } else {
        res.status(404).json({ msg: "Record not found" });
      }
    } catch (error) {
      // Handle errors
      console.error("Error deleting asset relocation item:", error);
      res.status(500).json({ msg: "Internal server error", error: error.message });
    }
  },
};
