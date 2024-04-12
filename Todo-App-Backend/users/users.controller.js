const usersService = require("./users.service.js");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");

exports.authenticate_token = (req, res, next) => {
  console.log("Authenticating Token");
  console.log("req.body: ", req.body);

  const cookiesReceived = cookie.parse(req.headers.cookie || "");
  console.log("Cookie Received:", cookiesReceived);

  if (cookiesReceived.token !== undefined) {
    const token = cookiesReceived.token;
    jwt.verify(token, process.env.Secret_Key, (err, retrievedPayload) => {
      if (err) {
        console.log("Error while verifying the token value!");
        return res
          .status(401)
          .send(authenticationFailedResponse);
      }
      console.log("Information stored in token: ", retrievedPayload);

      req.body.userDataFromToken = {};
      req.body.userDataFromToken.emailId = retrievedPayload.emailId;
      req.body.userDataFromToken.userId = retrievedPayload.userId;
      req.body.userDataFromToken.userName = retrievedPayload.userName;

      let expiresIn =
        (new Date(retrievedPayload.expirationDate) - new Date()) / 1000;
      req.body.userDataFromToken.expiresIn = expiresIn;

      // console.log("userDataFromToken: ", req.body.userDataFromToken);

      next();
    });
  } else {
    return res.status(401).send(authenticationFailedResponse);
  }
};

let authenticationFailedResponse = {
  error: {
    message: "Authentication Failed: Token is missing or invalid.",
  },
}

exports.validate_session_token = (req, res) => {
  // console.log(req.body.userDataFromToken.expiresIn);
  res.send({
    emailId: req.body.userDataFromToken.emailId,
    userId: req.body.userDataFromToken.userId,
    userName: req.body.userDataFromToken.userName,
    expiresIn: req.body.userDataFromToken.expiresIn,
  });
};

exports.login_user = (req, res) => {
  console.log("req.body:");
  console.log(req.body);

  console.log("Flag 1");

  usersService
    .loginUser(req.body.user)
    .then((loginResponse) => {
      let token = cookie.serialize("token", loginResponse.token, {
        domain: "localhost",
        path: "/",
        httpOnly: true,
        secure: false,
        // sameSite: "lax",
        maxAge: +process.env.tokenExpiresIn, // expiresIn is in seconds
      });
      // Setting the cookie 'token' at the client side.
      res.setHeader("Set-Cookie", token);
      res.send(loginResponse);
    })
    .catch((err) => {
      console.log("Error occurred while login!");
      // res.status(err.error.statusCode).send(err);
      res.send(err);
    });
};

exports.logout_user = (req, res) => {
  console.log(`\n${"-".repeat(20)} User logged out ${"-".repeat(20)}`);
  res.clearCookie("token");
  res.send({ logoutStatus: true });
};

exports.signup_user = (req, res) => {
  console.log("req.body:");
  console.log(req.body);

  usersService
    .signupUser(req.body.user)
    .then((signUpResponse) => {
      res.send(signUpResponse);
    })
    .catch((err) => {
      console.log("Error occurred while signup!");
      res.status(err.error.statusCode).send(err);
    });
};
