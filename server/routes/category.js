const express = require("express");

const router = express.Router();

// import middleware
const authMiddleware = require("../middlewares/auth")

// controller
const {
    create,
    read,
    update,
    remove,
    list,
    getSubs,
} = require("../controllers/category");

//routes
router.post("/category", authMiddleware, create);
router.get("/categories", list);
router.get("/category/:slug", read);
router.put("/category/:slug", authMiddleware, update);
router.delete("/category/:slug", authMiddleware, remove);
// router.get("/category/subs/:_id", getSubs);

module.exports = router;