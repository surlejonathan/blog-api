import jwt from "jsonwebtoken";

export const checkToken = async (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({ message: "Error. Need a token" });
  }

  jwt.verify(token, process.env.JWT_KEY, (err, userInfo) => {
    if (err) {
      res.status(403).json({ message: "Error. Bad token" });
    } else {
      req.currentUser = userInfo;
      return next();
    }
  });
};
