const { Model, DataTypes } = require('sequelize');
const connection = require('../config/connection');
const User = require('../models/User');

class Post extends Model {}

Post.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            // only allow characters for title
            validate: {
                isAlpha: true,
            },
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
            // make sure user doesn't enter SQL sensitive characters, whatever they are
            // validate: {
            //     is
            // }
        },
        created: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id',
            },
        },
    },
    {
        sequelize: connection,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'post'
    }
);

// instance methods, requires an instance of the class
Post.prototype.getWithUser = async function() {
    return await this.findByPk(this.id, {
        include: [
            {
                model: User,
                exclude: ['password'],
            }
        ]
    })
}

// class methods - available from class, no instance required
Post.getAllSerializedInstancesWithUser = async function(){
    let rawPosts = await this.findAll({
        include: [
            {
                model: User,
                exclude: ['password'],
            }
        ]
    });
    let posts = rawPosts.map((postObj) => {
        return postObj.get();
    });
    return posts;
};

module.exports = Post;
