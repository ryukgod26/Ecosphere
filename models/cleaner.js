const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    fullName: { type: String,  },
    mobile: { type: String,  },
    locality: { type: String,  },
    city: { type: String,  },
    state: { type: String,},
    username: { type: String, unique: true },
    password: { type: String,  },
    googleId: { type: String },
});

module.exports = mongoose.model("cleaner", UserSchema);

