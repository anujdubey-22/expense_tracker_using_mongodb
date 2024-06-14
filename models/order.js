const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    paymentId: {
      type: String,
    },
    orderId: {
      type: String,
    },
    status: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

 const Order = new mongoose.model("Order", orderSchema);


 module.exports = Order


// const Sequelize = require("sequelize");

// const sequelize = require("../database");

// const Order = sequelize.define("order", {
//   id: {
//     type: Sequelize.INTEGER,
//     allowNull: false,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   paymentId: {
//     type: Sequelize.STRING,
//   },
//   orderId: {
//     type: Sequelize.STRING,
//   },
//   status: {
//     type: Sequelize.STRING,
//   },
// });

// module.exports = Order;
