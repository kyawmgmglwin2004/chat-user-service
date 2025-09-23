import { ServiceSchema } from "moleculer";

import StatusCode from '../helpers/status_code_helper';
import * as loginModel from "../models/login_model";

const services: ServiceSchema = {
    name: "auth.login",
    actions: {
        async login(ctx) {
            try {
                return await 
            } catch (error) {
                
            }
        }
    }

}
export default services;