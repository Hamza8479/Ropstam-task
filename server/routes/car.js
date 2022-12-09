const express = require("express");

const router = express.Router();

// import middleware
const authMiddleware = require("../middlewares/auth")

// controller
const {
    create,
    listAll,
    remove,
    read,
    update,
    list,
    productsCount,
    productStar,
} = require("../controllers/car");

//routes
router.post("/product", authMiddleware, create);
router.get("/products/total", productsCount);

router.get("/products/:count", listAll); // product/10
router.delete("/product/:slug", remove);
router.get("/product/:slug", read);
router.put("/product/:slug", update);

router.post("/products", list);

module.exports = router;
