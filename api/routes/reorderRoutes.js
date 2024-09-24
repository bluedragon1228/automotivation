import express from "express";
import {
  createReorderRequest,
  getLowStockItems,
  getReorders,
} from "../controllers/reorderController.js";

const router = express.Router();

router.post("/reorder", createReorderRequest);
router.get("/low-stock", getLowStockItems);
router.get("/get", getReorders);

export default router;
