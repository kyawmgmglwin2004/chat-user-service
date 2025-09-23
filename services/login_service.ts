import { ServiceSchema } from "moleculer";

import StatusCode from '../helpers/status_code_helper';
import * as loginModel from "../models/login_model";

const services: ServiceSchema = {
    name: "auth.login",
    actions: {
        async login(ctx) {
            try {
                return await loginModel.loginEmail(ctx);
            } catch (error) {
                  console.log("error @users login action: ",error)
             return StatusCode.UNKNOWN();
            }
        }
    }

}
export default services;