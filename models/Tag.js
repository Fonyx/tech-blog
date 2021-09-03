const { Model, DataTypes } = require('sequelize');
const connection = require('../config/connection');
const validators = require('../utils/validators');

const colors = [
    'red', 
    'pink', 
    'purple', 
    'deep-purple', 
    'indigo',
    'blue',
    'light-blue',
    'cyan',
    'teal',
    'green',
    'light-green',
    'lime',
    'yellow',
    'amber',
    'orange',
    'deep-orange',
    'brown',
    'grey',
]
const modifiers = [
    'lighten-5', 
    'lighten-4', 
    'lighten-3', 
    'lighten-2', 
    'lighten-1',
    '',
    'darken-1',
    'darken-2',
    'darken-3',
    'darken-4',
    'accent-1',
    'accent-2',
    'accent-3',
    'accent-4',
]

// a function that returns a random int inclusively between min and max
function generateRandomIntFromRange(min, max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

class Tag extends Model {
}

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
        },
        materialize_color:{
            type: DataTypes.ENUM,
            values: colors,
            allowNull: false,
        },
        materialize_modifier:{
            type: DataTypes.ENUM,
            values: modifiers,
            allowNull: false,
        }
    },{
    hooks:{
        beforeCreate: (tag) => {
            let randomColor = generateRandomIntFromRange(0, colors.length-1);
            let randomModifier = generateRandomIntFromRange(0, colors.length-1);
            tag.materialize_color = colors[randomColor];
            tag.materialize_modifier = modifiers[randomModifier];
        }
    },
    sequelize: connection,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'tag',
    }
);

module.exports = Tag;