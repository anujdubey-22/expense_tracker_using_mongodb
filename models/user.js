const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
          type: String,
          required: true
        },
        email: {
          type: String,
          required: true,
          unique: true,
        },
        password: {
          type: String,
          required: true
        },
        isPremium: Boolean,
        totalAmount: {
          type: Number,
          default: 0
        }
  },
  { timestamps: true }
);

const User = new mongoose.model("User", userSchema);

module.exports = User


// const Sequelize = require("sequelize");
// const sequelize = require("../database");

// const User = sequelize.define("user", {
//   id: {
//     type: Sequelize.INTEGER,
//     allowNull: false,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   name: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   email: {
//     type: Sequelize.STRING,
//     allowNull: false,
//     unique: true,
//   },
//   password: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   isPremium: Sequelize.BOOLEAN,
//   totalAmount: {
//     type: Sequelize.INTEGER,
//     defaultValue: 0
//   }
// });

// module.exports = User;
