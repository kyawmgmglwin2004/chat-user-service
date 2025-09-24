import jwt, { Secret, SignOptions, JwtPayload } from "jsonwebtoken";
import StatusCode from "../helpers/status_code_helper";

type JwtExpire = "7d" | "2h" | "5m" | number;

interface JwtHelper {
  extractToken(authorization: string): string | undefined;
  signJWT(payload: object, secret: Secret, expiresIn?: JwtExpire): ReturnType<typeof StatusCode.OK>;
  verifyJWT(token: string, secret: Secret): ReturnType<typeof StatusCode.OK>;
  decodeJWT(token: string): ReturnType<typeof StatusCode.OK>;
}


const jwtHelper: JwtHelper = {
  extractToken(authorization: string): string | undefined {
    if (!authorization) return undefined;
    const parts = authorization.split(" ");
    const type = parts[0];
    if (type === "Token" || type === "Bearer") {
      return parts[1];
    }
    return undefined;
  },

  signJWT(payload: object, secret: Secret, expiresIn: JwtExpire = "7d") {
    try {
      const options: SignOptions = { expiresIn };
      const signed = jwt.sign(payload, secret, options);
      return StatusCode.OK(signed);
    } catch (err: any) {
      console.error(err.message || err);
      return StatusCode.UNKNOWN("Error signing token");
    }
  },

  verifyJWT(token: string, secret: Secret) {
    try {
      const verified = jwt.verify(token, secret) as JwtPayload | string;
      return StatusCode.OK(verified);
    } catch (err: any) {
      console.error(err.message || err);
      return StatusCode.INVALID_ARGUMENT("Error verifying Token");
    }
  },

  decodeJWT(token: string) {
    if (!token) {
      return StatusCode.INVALID_ARGUMENT("Token is missing");
    }

    try {
      const decoded = jwt.decode(token);
      if (decoded) {
        return StatusCode.OK(decoded);
      } else {
        return StatusCode.INVALID_ARGUMENT("Decoded value is null");
      }
    } catch (err: any) {
      console.error(err.message || err);
      return StatusCode.INVALID_ARGUMENT("Error decoding Token");
    }
  },
};

export default jwtHelper;
