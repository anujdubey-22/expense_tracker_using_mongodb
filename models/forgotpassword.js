const mongoose = require("mongoose");

const forgotpasswordShema = new mongoose.Schema(
  {
    userId: {
      type: Number,
    },
    isactive: {
      type: Boolean,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

 const Forgotpassword = new mongoose.model(
  "Forgotpassword",
  forgotpasswordShema
);

module.exports = Forgotpassword

// const Sequelize = require("sequelize");
// const sequelize = require("../database");

// const Forgotpassword = sequelize.define("forgotpassword", {
//   id: {
//     type: Sequelize.UUID,
//     defaultValue: Sequelize.UUIDV4,
//     primaryKey: true,
//     allowNull: false,
//   },
//   userId: {
//     type: Sequelize.INTEGER,
//   },
//   isactive: {
//     type: Sequelize.BOOLEAN,
//   }
// });

// module.exports = Forgotpassword;
