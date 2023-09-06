'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Booking.belongsTo(models.Spot,{foreignKey:'spotId'});
      Booking.belongsTo(models.User,{foreignKey:'userId'});
    }
  }
  Booking.init({
    userId: DataTypes.INTEGER,
    spotId: DataTypes.INTEGER,
    startDate: {
      type:DataTypes.DATEONLY,
      allowNull:false,
      validate:{
        isStartDateValid(value){
          if(value >= this.endDate){
            throw new Error('Start date must be earlier than end date.')
          }
        },
      }
    },
    endDate:{
      type:DataTypes.DATEONLY,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};
