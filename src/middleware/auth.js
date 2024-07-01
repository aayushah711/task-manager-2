const jwt = require("jsonwebtoken");
require("dotenv").config();

function authenticateToken(req, res, next) {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token)
    return res
      .status(401)
      .json({ error: "Access token is missing from the request header." });

  if (process.env.API_SECRET) {
    jwt.verify(token, process.env.API_SECRET, (err, user) => {
      if (err)
        return res.status(401).json({ error: "Invalid or expired token" });
      req.user = user;
      next();
    });
  } else {
    return res.status(500).json({
      error:
        "Unable to verify user at the moment. Please try again after sometime!",
    });
  }
}

module.exports = authenticateToken;
