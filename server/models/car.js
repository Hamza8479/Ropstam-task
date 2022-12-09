const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const carSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32,
            text: true,
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            index: true,
        },
        registrationNo: {
            type: String,
            required: true,
            maxlength: 2000,
            text: true,
        },
        price: {
            type: Number,
            required: true,
            trim: true,
            maxlength: 32,
        },
        category: {
            type: ObjectId,
            ref: "Category",
        },
        color: {
            type: String,
            enum: ["Black", "Brown", "Silver", "White", "Blue", "Red"],
        },
        model: {
            type: String,
            enum: ["2000", "2001", "2002", "2003", "2005", "2006", "2007"],
        },

    },
    { timestamps: true }
);

module.exports = mongoose.model("Car", carSchema);