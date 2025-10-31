import { ServiceSchema } from "moleculer";
import StatusCode from "../helpers/status_code_helper";
import * as loginModel from "../models/login_model";
import jwtHelper from "../helpers/jwt_token_helper";

interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    userName: string;
  };
}

const services: ServiceSchema = {
  name: "chat.auth",
  actions: {
    async login(ctx: any) {
      try {
        let result = await loginModel.loginEmail(ctx);
        console.log("result :", result)
        if (result) {
          ctx.meta.$responseHeaders = {
            "Set-Cookie": [
              `accessToken=${result.accessToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=900`,
              `refreshToken=${
                result.refreshToken
              }; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${
                60 * 60 * 24 * 7
              }`,
            ],
          };
          return result;
        } else {
          return StatusCode.UNAUTHENTICATED("Invalid credentials");
        }
      } catch (error) {
        console.log("error @users login action: ", error);
        return StatusCode.UNKNOWN("SERVER ERROR");
      }
    },

    async logout(ctx: any) {
      try {
        ctx.meta.$responseHeaders = {
          "Set-Cookie": [
            `accessToken=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`,
            `refreshToken=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`,
          ],
        };

        return { message: "Logged out successfully" };
      } catch (error) {
        console.log("error @users logout action: ", error);
        return StatusCode.UNKNOWN("SERVER ERROR");
      }
    },

    async register(ctx: any) {
      try {
        return await loginModel.register(ctx);
      } catch (error) {
        console.log("error @users register action: ", error);
        return StatusCode.UNKNOWN("SERVER ERROR");
      }
    },
  },
};

export default services;
