const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const connection = require('../config/connection');

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      // use validator for user sql injection
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8],
      },
    },
  },
  {
    hooks: {
      beforeCreate: async (newData) => {
        // TODO: This may need to be async awaited but linter doesn't like the async arrow function syntax
        // override the password in the newData packet with a hashed version
        newData.password = await bcrypt.hash(newData.password, bcrypt.genSaltSync(8));
        // newData.password = await bcrypt.hash(newData.password, 10)
        return newData;
      },
      beforeUpdate: async (updatedData) => {
        updatedData.password = await bcrypt.hash(
          updatedData.password,
          bcrypt.genSaltSync(8)
        );
        // updatedData.password = await bcrypt.hash(updatedData.password, 10)
        return updatedData;
      },
    },
    sequelize: connection,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'user',
    instanceMethods: {
      checkPassword(loginPw) {
        return bcrypt.compare(loginPw, this.hashPassword);
      },
    },
  }
);

module.exports = User;
