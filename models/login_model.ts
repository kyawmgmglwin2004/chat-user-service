import { RowDataPacket } from 'mysql2';
import MySQL from '../helpers/db_helper';
import StatusCode from '../helpers/status_code_helper';
import { Context } from 'moleculer';
import bcrypt from 'bcrypt';
import jwtHelper from '../helpers/jwt_token_helper';
import config from '../configurations/config';

export interface loginByEmailType {
    email: string | null;
    password: string | null;
};
interface UserRow extends RowDataPacket {
    id:number;
    email: string;
    password: string;
}

export async function loginEmail(ctx: Context<loginByEmailType>) {
    try {
        const { email, password } = ctx.params;

        if(!email || !password || typeof password !=="string" || password.length < 6) {
            return StatusCode.INVALID_ARGUMENT("Invalid email or password");
        }

        let sql = 'SELECT id, email, password FROM users WHERE email = ?';
        const [rows] = await MySQL.query<UserRow[]>(sql, [email]);
        if(!rows || rows.length == 0) {
            return StatusCode.NOT_FOUND("User not found");
        }
        const user = rows[0];
        const checkPassword = await bcrypt.compare(password, user.password);
        if( !checkPassword ) {
            return StatusCode.UNAUTHENTICATED("Invalid password");
        }
        const payload = { id: user.id, email: user.email };
        const expiresIn = { expiresIn: '7d' };
        const secret = config.JWT_SECRET;

        const token = jwtHelper.signJWT(payload, secret, expiresIn);
        return StatusCode.OK("LOGIN_SUCCESS",  token );
    } catch (error) {
        console.error("Login Error: ", error);
        return StatusCode.INVALID_ARGUMENT("Internal server error");
    }
}