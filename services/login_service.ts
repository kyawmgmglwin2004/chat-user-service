import { ServiceSchema } from "moleculer";

import StatusCode from '../helpers/status_code_helper';
import * as loginModel from "../models/login_model";

interface LoginResult {
    accessToken : string;
    refreshToken: string;
    user: {
        id: number;
        email: string;
        userName: string;
    }
};
const services: ServiceSchema = {
    name: "auth.login",
    actions: {
        async login(ctx) {
            try {
               try {
                    let result: LoginResult | null =  await loginModel.loginEmail(ctx);

                    if (result) {
                        ctx.meta.$responseHeaders = {
                            "Set-Cookie": [
                                `accessToken=${result.accesssToken};
                                HttpOnly;
                                Secure;
                                SameSite = Strict;
                                Path=/; 
                                Max-Age=900`,
                                `refreshToken=${result.refreshToken}; 
                                HttpOnly; 
                                Secure; 
                                SameSite=Strict; 
                                Path=/; 
                                Max-Age=${60*60*24*7}`
                            ]
                        }
                    }
               } catch (error) {
                
               }
            } catch (error) {
                  console.log("error @users login action: ",error)
             return StatusCode.UNKNOWN("SERVER ERROR");
            }
        },
        async register(ctx) {
            try {
                return await loginModel.register(ctx);
            } catch (error) {
                console.log("error @users register action: ",error)
                return StatusCode.UNKNOWN("SERVER ERROR");
            }
        }
    }
    

}
export default services;