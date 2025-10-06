const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    mobile: { type: String, required: true },
    locality: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

module.exports = mongoose.model("cleaner", UserSchema);

