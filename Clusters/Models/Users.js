const mongoose = require("mongoose");

let schema = new mongoose.Schema({
  _id: String,
  bots: {
    type: Array,
    default: []
  },
  servers: {
    type: Array,
    default: []
  },
  storage: {
    type: Array,
    default: []
  },
  bio: {
    type: String,
    default: 'Nenhuma biografia definida!'
  },
  followers: {
    type: Number,
    default: 0
  },
  key: {
    type: String,
    default: ''
  }
});

module.exports = mongoose.model("DB_User", schema);
