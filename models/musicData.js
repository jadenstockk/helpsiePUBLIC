const mongoose = require("mongoose");
let Schema = new mongoose.Schema({
    queueID: String,
    queue: Array,
});

module.exports = mongoose.model("song", Schema);