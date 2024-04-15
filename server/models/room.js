const mongoose = require("mongoose");
const playerSchema = require("./player");

const roomSchema = new mongoose.Schema({

  //Non required properties : hence, being assigned to DB by default values.
  occupancy: {
    type: Number,
    default: 2,
  },
  maxRounds: {
    type: Number,
    default: 6,
  },

  // Required Properties : Assigned to the DB by programmer (me)
  currentRound: {
    required: true,
    type: Number,
    default: 1,
  },
  players: [playerSchema],
  isJoin: {
    type: Boolean,
    default: true,
  },
  turn: { type: playerSchema, default: null },
  turnIndex: {
    type: Number,
    default: 0,
  },
});

const roomModel = mongoose.model("Room", roomSchema);
module.exports = roomModel;