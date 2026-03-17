const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    //get token from headers
    const token = req.headers.authorization;


    //if no token -reject
    if (!token) {
        return res.status(401).json({ message: "No token! Access denied!" });
    }
    //verify token
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();  //if valid move forward
    } catch (err) {
        res.status(401).json({ message: "Invalid Token" });
    }
};

module.exports = verifyToken;