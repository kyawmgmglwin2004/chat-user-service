const jwt = require('jsonwebtoken');
const StatusCode = require('../helpers/status_code_helper');

const jwtHelper = {
   extractToken(authorization: any) {
        let type = authorization.split(" ")[0];
        if (type === "Token" || type === "Bearer")
            return authorization.split(" ")[1];
    },
    signJWT(payload :any, secret : any, expiresIn : any) {
        console.log("payload: ", payload);
        console.log("secret: ", secret);
        let exp = expiresIn || "1d";
        try {
            let signed = jwt.sign(payload, secret, { expiresIn: exp });
            return new StatusCode.OK(signed);
        } catch (err) {
            if (err && typeof err === "object" && "message" in err) {
                console.log((err as any).message);
            } else {
                console.log(err);
            }
            return new StatusCode.UNKNOWN("Error signing token");
        }
    },
     verifyJWT(token :any, secret :any) {
        try {
            let verified = jwt.verify(token, secret);
            return new StatusCode.OK(verified);
        } catch (err) {
            console.log((err as any).message);
            return new StatusCode.INVALID_ARGUMENT("Error verifying Token");
        }
    },
    decodeJWT(token :any) {
        if (token) {
            try {
                let decoded = jwt.decode(token);
                if (decoded) {
                    return new StatusCode.OK(decoded);
                } else {
                    throw ("decoded value is null");
                }
            } catch (err) {
                console.log((err as any).message);
                return new StatusCode.INVALID_ARGUMENT("Error verifying Token");
            }
        } else {
            return new StatusCode.INVALID_ARGUMENT("Token is missing");
        }
    }
}
export default jwtHelper;