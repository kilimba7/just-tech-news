const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');



// create a User model
class User extends Model {
    // set up method to run on instance data (per user) to check password
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
    }
}

// define table colums and configuration 
User.init(
    {
        // Table columns definitions
        // define an ID column
        id: {
            // use special Sequalize DataTypes object to provide what type of data it is
            type: DataTypes.INTEGER,
            // this is equivalent to sql NOT NULL optioin
            allowNull: false,
            // instruct that this is the primary key
            primaryKey: true,
            // turn on auto increment
            autoIncrement: true
            },
        // define a username column
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // define an email column
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            // there cannot be any duplicate email values in this table
            unique: true,
            // if allowNull is set to false, we can run our data through validators before creating the table data
            validate: {
                isEmail: true
            }
        },
        // define a password column
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // this means the password must be at least four characters long
                len: [4]
            }
        }
    },
    {
            hooks: {
            // set up beforeCreate lifecylce hook functionality 
           async beforeCreate(newUserData) {
            newUserData.password = await bcrypt.hash(newUserData.password, 10)
                    return newUserData;
            },

            // set up beforeUpdate lifecycle "hook" functionality
            async beforeUpdate(updateUserData) {
                updateUserData.password = await bcrypt.hash(updateUserData.password, 10);
                return updateUserData;
            }
        },
        // table configs
        // pass in imported sequelize connection (direct connection to our database)
        sequelize,
        // don't create automatic time stamps
        timestamps: false,
        // don't pluralize name of database
        freezeTableName: true,
        // use underscores instead of camel-casing 
        underscored: true,
        // make it so our model name stays lowercase
        modelName: 'user'
    }
);

// exporting so that other files can use this 
module.exports = User;