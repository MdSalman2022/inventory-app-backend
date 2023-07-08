const express = require("express");
const productsController = require("../controllers/productsController");
const router = express.Router();

// /api/get-products
// /api/search-product
// /api/add-product
// /api/put-edit-product/:id
// /api/put-edit-products
// /api/put-update-available-stock
// /api/delete-product/:id

router.get("/get-products", productsController.getProducts);
router.get("/product-export", productsController.exportProducts);
router.get("/search-product", productsController.searchProduct);
router.post("/create-product", productsController.createProduct);
router.put("/edit-product-info", productsController.updateProduct);
router.put("/put-edit-products", productsController.updateProductQty);
router.put(
  "/put-update-available-stock",
  productsController.decrementProductQty
);
router.delete("/delete-product", productsController.deleteProduct);

module.exports = router;
