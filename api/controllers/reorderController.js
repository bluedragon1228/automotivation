import ReorderRequest from "../model/ReorderRequest.js";
import SparePart from "../model/SparePart.model.js";

export const createReorderRequest = async (req, res) => {
  try {
    const newReorder = new ReorderRequest(req.body);
    await newReorder.save();
    res.status(201).json(newReorder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLowStockItems = async (req, res) => {
  try {
    const lowStockParts = await SparePart.find({ quantity: { $lt: 20 } });
    res.status(200).json(lowStockParts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching low stock items." });
  }
};

export const getReorders = async (req, res) => {
  try {
    const reorders = await ReorderRequest.find();
    res.status(200).json(reorders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
