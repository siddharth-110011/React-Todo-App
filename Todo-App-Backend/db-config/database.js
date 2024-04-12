const mysql = require("mysql2");

const pool = mysql.createPool({
  connectionLimit: 10, // maximum number of connections in the pool
  host: process.env.Host,
  user: process.env.User,
  password: process.env.Pwd,
  database: process.env.DB,
  multipleStatements: true
});

function getConnectionFromPool() {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if(err) {
        reject(err);
      }
      else {
        resolve(connection);
      }
    })
  });
}

let shuttingDown = false;
// Close the connection pool when your application exits
process.on("exit", () => {
  if(!shuttingDown) {
      shutDown();
  }
});

process.on("SIGINT", () => {
  console.log("Received SIGINT signal (Ctrl+C)");
  // Trigger exit event to perform cleanup tasks
  if(!shuttingDown) {
    shuttingDown = true;
    shutDown();
  }
});

async function shutDown() {
  console.log("Inside shutDown()");
  let promise = new Promise((resolve, reject) => {
    pool.end((err) => {
        if (err) {
            console.error('Error occurred while closing the connection pool:', err);
            reject(err);
        } else {
            console.log('Connection pool has been gracefully closed');
            resolve();
        }
    });
  });
  
  let err = await promise;

  if(err) {
    console.log(result);
  }

  process.exit(0);
}

exports.pool = pool;
exports.getConnectionFromPool = getConnectionFromPool;
