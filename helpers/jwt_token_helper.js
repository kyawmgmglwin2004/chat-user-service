const jwt = require('jsonwebtoken');
const StatusCode = require('../helpers/status_code_helper');

module.exports = {
    extractToken(authorization) {
        let type = authorization.split(" ")[0];
        if (type === "Token" || type === "Bearer")
            return authorization.split(" ")[1];
    },
    signJWT(payload, secret, expiresIn) {
        console.log("payload: ", payload);
        console.log("secret: ", secret);
        let exp = expiresIn || "1d";
        try {
            let signed = jwt.sign(payload, secret, { expiresIn: exp });
            return new StatusCode.OK(signed);
        } catch (err) {
            console.log(err.message);
            return new StatusCode.UNKNOWN("Error signing token");
        }
    },
    verifyJWT(token, secret) {
        try {
            let verified = jwt.verify(token, secret);
            return new StatusCode.OK(verified);
        } catch (err) {
            console.log(err.message);
            return new StatusCode.INVALID_ARGUMENT("Error verifying Token");
        }
    },
    decodeJWT(token) {
        if (token) {
            try {
                let decoded = jwt.decode(token);
                if (decoded) {
                    return new StatusCode.OK(decoded);
                } else {
                    throw ("decoded value is null");
                }
            } catch (err) {
                console.log(err.message);
                return new StatusCode.INVALID_ARGUMENT("Error verifying Token");
            }
        } else {
            return new StatusCode.INVALID_ARGUMENT("Token is missing");
        }
    }
}