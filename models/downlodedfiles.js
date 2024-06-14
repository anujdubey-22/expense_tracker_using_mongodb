const mongoose = require("mongoose");

const downloadedfilesSchema = new mongoose.Schema(
  {
    // id: {
    //   type: Number,
    //   required:true,
    // },
    url: {
      type: String,
      required: true,
    },
    datedownloaded: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Downloadedfiles = new mongoose.model(
  "Downloadedfiles",
  downloadedfilesSchema
);

module.exports = Downloadedfiles;

// const Sequelize = require("sequelize");
// const sequelize = require("../database");

// const Downloadedfiles = sequelize.define("downloadedfiles", {
//   id: {
//     type: Sequelize.INTEGER,
//     allowNull: false,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   url: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   datedownloaded: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
// });

// module.exports = Downloadedfiles;
