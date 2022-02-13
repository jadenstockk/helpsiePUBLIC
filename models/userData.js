const mongoose = require("mongoose");

let Schema = new mongoose.Schema({

    guild: String,
    user: String,

    xp: {
        
        type: Number,
        default: 0,

    },
    totalxp: {
        
        type: Number,
        default: 0,

    },
    messages: {

        type: Number,
        default: 0,

    },
    level: {

        type: Number,
        default: 0,

    },
    warns: Array,

    bDate: String,
    bWished: Array,
});

module.exports = mongoose.model("userData", Schema);