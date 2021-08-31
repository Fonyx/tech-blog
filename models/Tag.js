const { Model, DataTypes } = require('sequelize');
const connection = require('../config/connection');
const validators = require('../utils/validators');

class Tag extends Model {}

Tag.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        tag_name: {
            type: DataTypes.STRING(30),
            validate: {
                'caller': (text) => {
                    validators.stringSpacesNoNumbers(text);
                }
            }
        }
    },
    {
        sequelize: connection,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'tag',
    }
);

module.exports = Tag;