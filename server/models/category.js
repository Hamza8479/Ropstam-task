const mongoose = require("mongoose");
// const { ObjectId } = mongoose.Schema;

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: "Name is required", // optional rather do true or write any msg
            minlength: [2, "Too Short"],
            maxlength: [32, "Too Long"],
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            index: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);