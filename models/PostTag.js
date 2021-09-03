const { Model, DataTypes } = require('sequelize');
const connection = require('../config/connection');

class PostTag extends Model {}

PostTag.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'post',
            key: 'id',
        }
    },
    tag_name: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'tag',
            key: 'name',
        }
    }
},
{
    sequelize: connection,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'post_tag',
});

module.exports = PostTag;
