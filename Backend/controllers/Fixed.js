import { Op } from "sequelize"; // Import Sequelize operators for search functionality
import EntitasBisnis from "../models/EntitasBisnisModel.js";
import Entity from "../models/EntityModel.js";
import FixedDocument from "../models/FixedDocumentModel.js";
import FixedGroup from "../models/FixedGroupModel.js";
import Fixed from "../models/FixedModel.js";
import Location from "../models/LocationModel.js";
import Unit from "../models/UnitModel.js";
import { generateFixedAndInvNo } from "../utils/utility.js";

export const FixedController = {
  // createFixed: Creates a new fixed asset record
  createFixed: async (req, res) => {
    try {
      const fixed = await Fixed.create(req.body); // Create a new fixed asset record based on request body
      res.status(201).json(fixed); // Respond with the created fixed asset record
    } catch (error) {
      console.error("Error creating fixed asset:", error);
      res.status(500).json({ msg: "Internal Server Error" }); // Handle errors and respond with an error message
    }
  },

  createFixedWithDocument: async (req, res) => {
    const { fixedData, documentData } = req.body;

    try {
      let newFixed = { ...fixedData };

      // Generate FixedNo and InvNo if they are not provided
      if (!newFixed.FixedNo || !newFixed.InvNo) {
        // Since generateFixedAndInvNo expects an array of IDs, we first create the fixed asset record to get its ID
        const temporaryFixed = await Fixed.create(newFixed);
        const fixedIds = [temporaryFixed.FixedIDNo];

        // Generate the FixedNo and InvNo using the generated ID
        const updatedFixedAssets = await generateFixedAndInvNo(fixedIds);

        // Update newFixed with the generated FixedNo and InvNo
        newFixed.FixedNo = updatedFixedAssets[0].FixedNo;
        newFixed.InvNo = updatedFixedAssets[0].InvNo;

        // Delete the temporary fixed asset record
        await temporaryFixed.destroy();
      }

      // Create a new fixed asset record based on newFixed
      newFixed = await Fixed.create(newFixed);

      if (documentData && documentData.length > 0) {
        const documentRecords = documentData.map((doc) => ({
          ...doc,
          FixedIDNo: newFixed.FixedIDNo,
        }));
        await FixedDocument.bulkCreate(documentRecords);
      }

      res.status(201).json({ msg: "New data has been created successfully" });
    } catch (error) {
      console.error("Error creating fixed asset with document:", error);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },

  // getAllFixed: Retrieves all fixed asset records with pagination and search functionality
  getAllFixed: async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1); // Determine the current page or default to 1
    const pageSize = Math.max(1, parseInt(req.query.pageSize) || 10); // Determine the page size or default to 10
    const offset = (page - 1) * pageSize; // Calculate the offset for pagination

    const searchQuery = req.query.search || ""; // Retrieve search query from request or default to empty string

    try {
      // Query database to get fixed asset records with specified attributes and included models
      const { count, rows: fixedRecords } = await Fixed.findAndCountAll({
        attributes: ["FixedIDNo", "Entity", "FixedAssetName", "AccNo", "Currency", "FixedNo", "Qty", "SalVageValue", "Status", "IDNoGR", "IDNoEB"],
        include: [
          { model: FixedDocument, attributes: ["DocumentIDNo", "NoDocument", "ExpiredDate", "DocumentType"] },
          { model: FixedGroup, attributes: ["Name"] },
          { model: EntitasBisnis, attributes: ["EBCode"] },
          { model: Entity, attributes: ["Entity", "EntityName"], as: "EntityRelations" },
          { model: Unit, attributes: ["Unit"], as: "UnitRelations" },
          { model: Location, attributes: ["LocID", "LocationName"] },
        ],
        where: {
          [Op.or]: [
            { Entity: { [Op.like]: `%${searchQuery}%` } }, // Search by Entity field
            { FixedNo: { [Op.like]: `%${searchQuery}%` } }, // Search by FixedNo field
            { Status: { [Op.like]: `%${searchQuery}%` } }, // Search by Status field
            { FixedAssetName: { [Op.like]: `%${searchQuery}%` } }, // Search by FixedAssetName field
            // Add other fields as needed for search
          ],
        },
        limit: pageSize, // Limit number of records per page
        offset: offset, // Apply pagination offset
      });

      const totalPages = Math.ceil(count / pageSize); // Calculate total pages based on count and pageSize

      // Respond with fetched fixed asset records, pagination details, and total count
      res.status(200).json({
        data: fixedRecords,
        page,
        pageSize,
        totalRecords: count,
        totalPages,
      });
    } catch (error) {
      console.error("Error fetching fixed assets:", error);
      res.status(500).json({ msg: "Internal Server Error" }); // Handle errors and respond with an error message
    }
  },

  // getFixedById: Retrieves a specific fixed asset record by its ID
  getFixedById: async (req, res) => {
    try {
      const fixed = await Fixed.findOne({
        where: { FixedIDNo: req.params.id }, // Find fixed asset by ID specified in request parameters
        include: [
          { model: FixedDocument, attributes: ["DocumentIDNo", "NoDocument", "ExpiredDate", "DocumentType"] },
          { model: FixedGroup, attributes: ["Name"] },
          { model: EntitasBisnis, attributes: ["EBCode"] },
          { model: Entity, attributes: ["Entity", "EntityName"], as: "EntityRelations" },
          { model: Unit, attributes: ["Unit"], as: "UnitRelations" },
          { model: Location, attributes: ["LocID", "LocationName"] },
        ],
      });

      if (!fixed) {
        return res.status(404).json({ msg: "Fixed not found" }); // Respond with error message if fixed asset not found
      }

      res.status(200).json(fixed); // Respond with the fetched fixed asset record
    } catch (error) {
      console.error("Error fetching fixed asset by ID:", error);
      res.status(500).json({ msg: "Internal Server Error" }); // Handle errors and respond with an error message
    }
  },

  // getFixedByFixedNo: Retrieves a specific fixed asset record by its FixedNo
  getFixedByFixedNo: async (req, res) => {
    try {
      const fixed = await Fixed.findOne({
        where: { FixedNo: req.params.fixedNo }, // Find fixed asset by FixedNo specified in request parameters
        include: [
          { model: FixedDocument, attributes: ["DocumentIDNo", "NoDocument", "ExpiredDate", "DocumentType"] },
          { model: FixedGroup, attributes: ["Name"] },
          { model: EntitasBisnis, attributes: ["EBCode"] },
          { model: Entity, attributes: ["Entity", "EntityName"], as: "EntityRelations" },
          { model: Unit, attributes: ["Unit"], as: "UnitRelations" },
          { model: Location, attributes: ["LocID", "LocationName"] },
        ],
      });

      if (!fixed) {
        return res.status(404).json({ msg: "Fixed not found" }); // Respond with error message if fixed asset not found
      }

      res.status(200).json(fixed); // Respond with the fetched fixed asset record
    } catch (error) {
      console.error("Error fetching fixed asset by FixedNo:", error);
      res.status(500).json({ msg: "Internal Server Error" }); // Handle errors and respond with an error message
    }
  },

  // updateFixed: Updates a specific fixed asset record by its ID
  updateFixed: async (req, res) => {
    const { documentData, ...fixedData } = req.body;

    try {
      // Only attempt to update fixedData if it contains any keys
      let fixedUpdated = 0;
      if (Object.keys(fixedData).length > 0) {
        const [updated] = await Fixed.update(fixedData, { where: { FixedIDNo: req.params.id } });
        fixedUpdated = updated;
      }

      // Handle adding/updating documents if documentData is provided
      if (documentData && documentData.length > 0) {
        for (const doc of documentData) {
          if (doc.DocumentIDNo) {
            // If DocumentIDNo is provided, update the existing document
            await FixedDocument.update(doc, { where: { DocumentIDNo: doc.DocumentIDNo } });
          } else {
            // If DocumentIDNo is not provided, create a new document
            await FixedDocument.create({ ...doc, FixedIDNo: req.params.id });
          }
        }
      }

      // Respond based on the update results
      if (fixedUpdated || (documentData && documentData.length > 0)) {
        res.status(200).json({ msg: "Fixed record and associated documents updated successfully" });
      } else {
        res.status(404).json({ msg: "Fixed record not found" });
      }
    } catch (error) {
      console.error("Error updating fixed asset and documents:", error);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },
  // deleteFixed: Deletes a specific fixed asset record by its ID
  deleteFixed: async (req, res) => {
    try {
      const deleted = await Fixed.destroy({ where: { FixedIDNo: req.params.id } }); // Delete fixed asset record by ID
      if (deleted) {
        res.status(200).json({ msg: "Fixed record deleted successfully" }); // Respond with success message if deletion is successful
      } else {
        res.status(404).json({ msg: "Fixed record not found" }); // Respond with error message if fixed asset not found
      }
    } catch (error) {
      console.error("Error deleting fixed asset:", error);
      res.status(500).json({ msg: "Internal Server Error" }); // Handle errors and respond with an error message
    }
  },

  deleteDocument: async (req, res) => {
    try {
      const deleted = await FixedDocument.destroy({ where: { DocumentIDNo: req.params.id } });
      if (deleted) {
        res.status(200).json({ msg: "Document deleted successfully" });
      } else {
        res.status(404).json({ msg: "Document not found" });
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },
};
