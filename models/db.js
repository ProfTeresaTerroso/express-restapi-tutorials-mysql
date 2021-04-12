const mysql = require('mysql');
const dbConfig = require('../config/db.config.js');

// const connection = mysql.createConnection({
//     host: dbConfig.HOST,
//     user: dbConfig.USER,
//     password: dbConfig.PASSWORD,
//     database: dbConfig.DB
// });

// connection.connect(function (err) {
//     if (err) throw err;
//     console.log(`Database ${dbConfig.DB} @ ${dbConfig.HOST} is connected successfully !`);
// });

// module.exports = connection;

let connection;

function handleDisconnect() {
    // connection = mysql.createConnection(dbConfig); 
    // Recreate the connection, since the old one cannot be reused. 
    connection = mysql.createConnection({
        host: dbConfig.HOST,
        user: dbConfig.USER,
        password: dbConfig.PASSWORD,
        database: dbConfig.DB
    });
    
    connection.connect( function onConnect(err) {   
        // The server is either down or restarting (takes a while sometimes)
        if (err) {                                  
            console.log('error when connecting to db:', err);
            // introduce a delay before attempting to reconnect, to avoid a hot loop, and to allow our node script to process asynchronous requests in the meantime
            setTimeout(handleDisconnect, 10000);    
        }                                           
        console.log(`Database ${dbConfig.DB} @ ${dbConfig.HOST} is connected successfully !`);
    });                                             
    
    // If you're also serving http, display a 503 error
    connection.on('error', function onError(err) {
        console.log('db error', err);
        // Connection to the MySQL server is usually lost due to either server restart, or a connnection idle timeout
        if (err.code == 'PROTOCOL_CONNECTION_LOST' || err.code == 'ECONNRESET') {   
            handleDisconnect();                         
        } else {                                         
            throw err;                                  
        }
    });
}
handleDisconnect();

module.exports = connection;


// let connectionPool;

// function attemptConnection() {
//     connectionPool = mysql.createPool({
//         connectionLimit: 10,
//         host: dbConfig.HOST2,
//         user: dbConfig.USER,
//         password: dbConfig.PASSWORD,
//         database: dbConfig.DB
//     });

//     connectionPool.getConnection(function (err) {
//         if (err) {
//             console.log('error when connecting to DB:', err);
//             setTimeout(attemptConnection, 2000);
//         }
//         console.log(`Database ${dbConfig.DB} @ ${dbConfig.HOST} is connected successfully !`);
//     });

//     connectionPool.on('error', function (err) {
//         console.log('DB error', err);
//         if (err.code === 'PROTOCOL_CONNECTION_LOST') {
//             attemptConnection();
//         } else {
//             attemptConnection()
//             throw err;
//         }
//     });

// }

// attemptConnection();

// module.exports = connectionPool;
