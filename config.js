const path = require('path')

const envFilePath = path.resolve(__dirname, `.${process.env.NODE_ENV}.env`)
const env = require("dotenv").config({ path: envFilePath })
if (env.error) {
    throw new Error(`Unable to load the .env file from ${envFilePath}.`)
}

module.exports = {
    mongodb: {
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        dbName: process.env.DBNAME
    }
};