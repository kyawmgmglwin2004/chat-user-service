import { RowDataPacket } from 'mysql2';
import MySQL from '../helpers/db_helper';
import StatusCode from '../helpers/status_code_helper';
import { Context } from 'moleculer';
import bcrypt from 'bcrypt';

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

    } catch (error) {
        
    }
}