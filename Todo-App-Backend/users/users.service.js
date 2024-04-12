const db = require("../db-config/database");
const jwt = require("jsonwebtoken");
const { sendErrorResponse, getErrorObject } = require("../utils/utils.js");

exports.loginUser = async (user) => {
  // Add the todo to the database.

  const pool = db.pool;

  try {
    const sql = `select * from user_details where email_id = ?;`;

    const promise = new Promise((resolve, reject) => {
      pool.query(sql, [user.emailId], function (err, result) {
        if (err) {
          const internalError = new Error(err.message);
          reject(
            getErrorObject(
              internalError,
              500,
              "Something went wrong in the server!"
            )
          );
        } else {
          if (result.length == 0) {
            reject(getErrorObject(null, 400, "user_does_not_exist"));
          } else {
            const userDetail = result[0];
            if (userDetail["password"] === user.password) {
              const userFacingResponse = {};

              userFacingResponse.userId = userDetail["user_id"];
              userFacingResponse.userName = userDetail["user_name"];
              userFacingResponse.message = "user_logged_in";

              let payload = {
                emailId: user.emailId,
                userId: userDetail["user_id"],
                userName: userDetail["user_name"],
                expirationDate: new Date(
                  new Date().getTime() + process.env.tokenExpiresIn * 1000
                ),
              };

              let token = jwt.sign(payload, process.env.Secret_Key);
              userFacingResponse.token = token;

              resolve(userFacingResponse);
            } else {
              reject(getErrorObject(null, 400, "incorrect_password"));
            }
          }
        }
      });
    });

    const promiseResult = await promise;

    return promiseResult;
  } catch (error) {
    sendErrorResponse(error);
  }
};

exports.signupUser = async (user) => {
  // Add the todo to the database.

  const connection = await db.getConnectionFromPool();

  try {
    const sql = `call add_user (?, ?, ?, @add_user_status);
          select @add_user_status as add_user_status;`;

    const promise = new Promise((resolve, reject) => {
      connection.query(
        sql,
        [user.userName, user.emailId, user.password],
        function (err, result) {
          if (err) {
            const internalError = new Error(err.message);

            reject(
              getErrorObject(
                internalError,
                500,
                "Something went wrong in the server!"
              )
            );
          } else {
            let signUpResponse = result[1][0];
            resolve(signUpResponse);
          }
        }
      );
    });

    const promiseResult = await promise;
    return promiseResult;
  } catch (error) {
    sendErrorResponse(error);
  } finally {
    connection.release(); // Release the connection back to the pool.
    console.log("Connection released!");
  }
};
