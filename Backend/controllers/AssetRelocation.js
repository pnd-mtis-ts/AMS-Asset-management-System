// Importing necessary modules and models
import { Op } from "sequelize";
import db from "../config/Database.js";
import AssetRelocationItem from "../models/AssetRelocationItemModel.js";
import AssetRelocation from "../models/AssetRelocationModel.js";
import EntitasBisnis from "../models/EntitasBisnisModel.js";
import Fixed from "../models/FixedModel.js";
import Location from "../models/LocationModel.js";

// AssetRelocationController contains methods for handling asset relocation operations
export const AssetRelocationController = {
  // Method to create a new asset relocation
  createAssetRelocation: async (req, res) => {
    try {
      // Extracting data from the request body
      const { TransNo, TransDate, TransDesc, IDNoEB } = req.body;
      // Checking if the business entity exists
      const entitasBisnis = await EntitasBisnis.findByPk(IDNoEB);
      if (!entitasBisnis) {
        return res.status(404).json({ error: "Entitas Bisnis not found" });
      }
      // Creating a new asset relocation
      const assetRelocation = await AssetRelocation.create({
        TransNo,
        TransDate,
        TransDesc,
        IDNoEB,
      });

      // Returning the created asset relocation
      return res.status(201).json(assetRelocation);
    } catch (error) {
      // Handling errors
      console.error("Error creating asset relocation:", error);
      res.status(500).json({ msg: "Internal server error", error: error.message });
    }
  },

  // Method to create an asset relocation with items
  createAssetRelocationWithItems: async (req, res) => {
    const { TransNo, TransDate, TransDesc, IDNoEB, items } = req.body;
    const transaction = await db.transaction();

    try {
      // Check if the business entity exists
      const entitasBisnis = await EntitasBisnis.findByPk(IDNoEB);
      if (!entitasBisnis) {
        await transaction.rollback();
        return res.status(404).json({ error: "Entitas Bisnis not found" });
      }

      // Create asset relocation with transaction
      const assetRelocation = await AssetRelocation.create({ TransNo, TransDate, TransDesc, IDNoEB }, { transaction });

      // Loop through each item to create asset relocation items
      for (const item of items) {
        const { FixedIDNo, NewLocation, NewEmployeeResponsible } = item;
        const fixed = await Fixed.findByPk(FixedIDNo, { transaction });

        // Check if the fixed asset exists
        if (!fixed) {
          await transaction.rollback();
          return res.status(404).json({ msg: "Fixed asset not found." });
        }

        const previousLocation = fixed.LocId;
        const previousEmployeeResponsible = fixed.EmpID;

        // Update fixed asset location if new location is provided
        if (NewLocation) {
          const newLocationRecord = await Location.findByPk(NewLocation, { transaction });
          if (!newLocationRecord) {
            await transaction.rollback();
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
        await fixed.save({ transaction });

        // Create a new asset relocation item
        await AssetRelocationItem.create(
          {
            AssetRelocation_ID: assetRelocation.ID,
            FixedIDNo,
            PreviousLocation: previousLocation,
            NewLocation: NewLocation || previousLocation,
            PreviousEmployeeResponsible: previousEmployeeResponsible,
            NewEmployeeResponsible: NewEmployeeResponsible || previousEmployeeResponsible,
            RelocationDate: new Date(),
          },
          { transaction }
        );
      }

      // Commit the transaction
      await transaction.commit();
      res.status(201).json({ msg: "Asset relocation and items created successfully", assetRelocation });
    } catch (error) {
      // Rollback the transaction in case of error
      await transaction.rollback();
      console.error("Error creating asset relocation and items:", error);
      res.status(500).json({ msg: "Failed to create asset relocation and items", error: error.message });
    }
  },

  // Method to get all asset relocations with pagination and search
  getAllAssetRelocations: async (req, res) => {
    // Retrieve pagination and search parameters from the query string
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const pageSize = Math.max(1, parseInt(req.query.pageSize) || 10);
    const offset = (page - 1) * pageSize;
    const searchQuery = req.query.search || "";

    try {
      // Find and count all asset relocations with pagination and search
      const { count, rows: assetRelocationRecords } = await AssetRelocation.findAndCountAll({
        include: [
          {
            model: EntitasBisnis,
            attributes: ["EBCode"],
          },
        ],
        where: {
          [Op.or]: [{ IDNoEB: { [Op.like]: `%${searchQuery}%` } }],
        },
        limit: pageSize,
        offset: offset,
      });

      const totalPages = Math.ceil(count / pageSize);

      // Return the asset relocation records with pagination details
      res.status(200).json({
        data: assetRelocationRecords,
        page,
        pageSize,
        totalRecords: count,
        totalPages,
      });
    } catch (error) {
      // Handle errors
      console.error("Error fetching asset relocations:", error);
      res.status(500).json({ msg: "Internal server error", error: error.message });
    }
  },

  // Method to get an asset relocation by ID
  getAssetRelocationById: async (req, res) => {
    try {
      // Find asset relocation by ID
      const assetRelocation = await AssetRelocation.findOne({
        attributes: ["ID", "TransNo", "TransDate", "TransDesc", "IDNoEB"],
        include: [
          {
            model: AssetRelocationItem,
            attributes: ["RelocationID", "AssetRelocation_ID", "FixedIDNo", "PreviousLocation", "NewLocation", "PreviousEmployeeResponsible", "NewEmployeeResponsible", "RelocationDate"],
            include: [
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
              {
                model: Location,
                as: "PreviousLocationDetails",
                attributes: ["LocID", "LocationName"],
                foreignKey: "PreviousLocation",
              },
              {
                model: Location,
                as: "NewLocationDetails",
                attributes: ["LocID", "LocationName"],
                foreignKey: "NewLocation",
              },
            ],
          },
        ],
        where: { ID: req.params.id },
      });

      // Check if asset relocation exists
      if (!assetRelocation) {
        return res.status(404).json({ error: "Asset Relocation not found" });
      }

      // Return the asset relocation
      return res.json(assetRelocation);
    } catch (error) {
      // Handle errors
      console.error("Error fetching asset relocation by ID:", error);
      return res.status(500).json({ error: "Internal server error", error: error.message });
    }
  },

  // Method to update an asset relocation by ID
  updateAssetRelocation: async (req, res) => {
    try {
      const { id } = req.params;
      const { TransNo, TransDate, TransDesc, IDNoEB } = req.body;

      // Find asset relocation by ID
      const assetRelocation = await AssetRelocation.findByPk(id);
      if (!assetRelocation) {
        return res.status(404).json({ error: "Asset Relocation not found" });
      }

      // Check if the business entity exists
      const entitasBisnis = await EntitasBisnis.findByPk(IDNoEB);
      if (!entitasBisnis) {
        return res.status(404).json({ error: "Entitas Bisnis not found" });
      }

      // Update the asset relocation
      await assetRelocation.update({
        TransNo,
        TransDate,
        TransDesc,
        IDNoEB,
      });

      // Return the updated asset relocation
      return res.json(assetRelocation);
    } catch (error) {
      // Handle errors
      console.error("Error updating asset relocation:", error);
      return res.status(500).json({ error: "Internal server error", error: error.message });
    }
  },

  // Method to delete an asset relocation by ID
  deleteAssetRelocation: async (req, res) => {
    try {
      // Delete asset relocation by ID
      const deleted = await AssetRelocation.destroy({
        where: { ID: req.params.id },
      });
      if (deleted) {
        res.status(200).json({ msg: "Record deleted successfully" });
      } else {
        res.status(404).json({ msg: "Record not found" });
      }
    } catch (error) {
      // Handle errors
      console.error("Error deleting asset relocation:", error);
      res.status(500).json({ msg: "Internal server error", error: error.message });
    }
  },
};
