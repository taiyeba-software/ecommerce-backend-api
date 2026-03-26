const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../middlewares/auth.middleware");
const { getOrderController, createOrderController, deleteOrderController, listOrders } = require("../controllers/order.controller");
const { handleValidationErrors } = require("../validators/validate");

const {
  createOrderValidator,
  getOrderValidator
} = require("../validators/order.validator");

// CREATE ORDER
router.post("/", authenticateToken, createOrderValidator, handleValidationErrors, createOrderController);

// LIST ORDERS
router.get("/", authenticateToken, listOrders);

// GET ORDER
router.get("/:id", authenticateToken, getOrderValidator, handleValidationErrors, getOrderController);

// DELETE ORDER  ← NEW
router.delete("/:id", authenticateToken, getOrderValidator, handleValidationErrors, deleteOrderController);

module.exports = router;
