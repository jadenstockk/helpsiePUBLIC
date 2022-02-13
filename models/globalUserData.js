const mongoose = require("mongoose");

let Schema = new mongoose.Schema({

    user: String,

    votes: {
        type: Array,
        default: [],
    }
});

module.exports = mongoose.model("globalUserData", Schema);