const jwt = require("jsonwebtoken")
const secretkey = "vaibhav"

const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, secretkey, {
        expiresIn : "30d"
    })

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: "development",
        sameSite: "strict",
        maxAge : 30 * 24 * 60 * 30 * 1000

    })
}

module.exports = generateToken