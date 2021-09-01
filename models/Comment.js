const { Model, DataTypes } = require('sequelize');
const connection = require('../config/connection.js');

class Comment extends Model {}

Comment.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        content: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        post_id: {
            type: DataTypes.INTEGER,
            references: {
                model:"post",
                key: "id"
            }
        }
    },
    {
        sequelize: connection,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'comment',
    }
);

module.exports = Comment;
