let sqs=require("sequelize")
let sequelize=new sqs.Sequelize({
  dialect:"sqlite",
  storage:"sequelize:./database.sqlite"
})

module.exports={DataTypes:sqs.DataTypes, sequelize}
