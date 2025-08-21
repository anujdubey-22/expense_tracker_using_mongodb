require("dotenv").config();

const mongoose = require("mongoose");
//console.log(`${process.env.mongodb_URL}/${process.env.database_Name}`)
async function mongooseConnection() {
  try {
    const connectionInstance =  await mongoose.connect(
      `${process.env.mongodb_URL}/${process.env.database_Name}`
    );
    //console.log(connectionInstance)
    console.log(`connected to database MONGODB, database HOST is : ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error(error, "error in connecting database");
  }
}

module.exports = mongooseConnection;

// const Sequelize = require('sequelize');

// const sequelize = new Sequelize(process.env.db_name,process.env.db_root,process.env.db_password,{
//     host:process.env.db_host ,
//     dialect:process.env.db_dialect
// })

// module.exports = sequelize;
