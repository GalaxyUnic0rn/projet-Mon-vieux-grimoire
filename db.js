const mongoose = require('mongoose');
const config = require("./config");
const connectionString = `mongodb+srv://${config.mongodb.user}:${config.mongodb.password}@${config.mongodb.host}/${config.mongodb.dbName}?retryWrites=true&w=majority`;
mongoose.set('strictQuery', true); // to suppress DepreciationWarning in logger

const connect = () => {
    return mongoose.connect(connectionString)
        .then(instance => {
            console.log('Connexion à MongoDB réussie !');
            return instance;
        }).catch(reason => {
            console.log('Connexion à MongoDB échouée !');
            throw reason;
        });
};

connect().then(instance => {

    // Events from doc: https://mongoosejs.com/docs/connections.html#connection-events
    instance.connection.on("connecting", () => {
        console.error("Emitted when Mongoose starts making its initial connection to the MongoDB server");
    });
    instance.connection.on("connected", () => {
        console.error("Emitted when Mongoose successfully makes its initial connection to the MongoDB server, or when Mongoose reconnects after losing connectivity. May be emitted multiple times if Mongoose loses connectivity.");
    });
    instance.connection.on("open", () => {
        console.error("Emitted after 'connected' and onOpen is executed on all of this connection's models.");
    });
    instance.connection.on("disconnecting", () => {
        console.error("Your app called Connection#close() to disconnect from MongoDB");
    });
    instance.connection.on("disconnected", () => {
        console.error("Emitted when Mongoose lost connection to the MongoDB server. This event may be due to your code explicitly closing the connection, the database server crashing, or network connectivity issues.");
    });
    instance.connection.on("close", () => {
        console.error("Emitted after Connection#close() successfully closes the connection. If you call conn.close(), you'll get both a 'disconnected' event and a 'close' event.");
    });
    instance.connection.on("reconnected", () => {
        console.error("Emitted if Mongoose lost connectivity to MongoDB and successfully reconnected. Mongoose attempts to automatically reconnect when it loses connection to the database.");
    });
    instance.connection.on("close", () => {
        console.error("DB closed");
    });
    instance.connection.on("error", () => {
        console.error("Emitted if an error occurs on a connection, like a parseError due to malformed data or a payload larger than 16MB.");
    });
    instance.connection.on("fullsetup", () => {
        console.error("Emitted when you're connecting to a replica set and Mongoose has successfully connected to the primary and at least one secondary.");
    });
    instance.connection.on("all", () => {
        console.error("Emitted when you're connecting to a replica set and Mongoose has successfully connected to all servers specified in your connection string.");
    });
    instance.connection.on("reconnectFailed", () => {
        console.error("Emitted when you're connected to a standalone server and Mongoose has run out of reconnectTries. The MongoDB driver will no longer attempt to reconnect after this event is emitted. This event will never be emitted if you're connected to a replica set.");
    });
});