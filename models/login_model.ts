import { ResultSetHeader, RowDataPacket } from 'mysql2';
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
};
export interface register {
    email: string | null;
    password: string | null;
    phone: string | null;
    userName: string | null;
}
interface profile {
    email: string | null;
}
interface editProfile {
    email: string | null;
    phone: string | null;
    image: string | null;
    userName: string | null;
    bio: string | null;
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
        const expiresIn = '5m';
        const secret =  "KyawMgMgLwin";

        const accessToken = jwtHelper.signJWT(payload, secret, expiresIn);
        const refreshToken = jwtHelper.signJWT(payload, secret, "7d");
        return StatusCode.OK( {accessToken, refreshToken});
    } catch (error) {
        console.error("Login Error: ", error);
        return StatusCode.UNKNOWN("Internal server error");
    }
}

export async function register(ctx: Context<register>) {
    try {
        const { email, password, phone, userName } = ctx.params;

        if(!email || !password || typeof password !=="string" ||   password.length < 6 ||  !phone || typeof phone !=="string" || !userName || typeof userName !=="string" ) {
            return StatusCode.INVALID_ARGUMENT("Invalid argument")
        }

        let sql = 'SELECT email FROM users WHERE email = ?';
        const [rows] = await MySQL.query<RowDataPacket[]>(sql, [email]);
        if(rows.length > 0) {
            return StatusCode.ALREADY_EXISTS("This email is already exist account");
        }
        let sql2 = 'SELECT phone FROM users WHERE phone = ?';
        const [row2] = await MySQL.query<RowDataPacket[]> (sql2, [phone]);
        if(row2.length > 0 ) {
             return StatusCode.ALREADY_EXISTS("This phone number is already exist account");
        }
        let hashPassword =  await bcrypt.hash(password, 10) ;

        let sql3 = 'INSERT INTO users (userName, password , email, phone) VALUES (? , ? , ?, ?)';

        const [result] = await MySQL.query<ResultSetHeader[]>(sql3, [userName, hashPassword, email, phone]);
        if(result.length === 0) {
            return StatusCode.UNAUTHENTICATED("User register error");
        }
        const user = result[0];
        return StatusCode.OK({user});
    } catch (error) {
        console.error("Register Error: ", error);
        return StatusCode.UNKNOWN("Internal server error");
    }
}

export async function profile(ctx :Context<profile> ) {
    try {
        const email = ctx.params;

        if(!email){
            return StatusCode.INVALID_ARGUMENT("need eamil")
        }
        let sql = `SELECT * FROM users WHERE email = ?`;
        const [rows] = await MySQL.query<RowDataPacket[]> (sql, [email]);
        if(rows.length === 0 )  {
            return StatusCode.NOT_FOUND("This email don't have account");
        }
        return StatusCode.OK(rows[0]);
    } catch (error) {
        // console.error("Profile Error: ", error);
        return StatusCode.UNKNOWN("Internal server error");
    }
}


export async function editProfile(ctx :Context<editProfile>) {
    try {
        const { email, phone, userName, image, bio } = ctx.params;
         if(!email){
            return StatusCode.INVALID_ARGUMENT("need eamil")
        }
        let field = [];
        let value = [];

         if (phone !== undefined) {
            field.push("phone = ?");
            value.push(phone);
         }
        if (userName !== undefined) {
            field.push("userName = ?");
            value.push(userName);
        }
        if (image !== undefined) {
            field.push("image = ?");
            value.push(image);
        }
        if (bio !== undefined) {
            field.push("bio = ?");
            value.push(bio);
        }
        if (field.length === 0) {
            return StatusCode.INVALID_ARGUMENT("No fields provided for update");
        }
        const sql = `UPDATE users SET ${field.join(", ")} WHERE email = ?`;
        value.push(email);

    const [data]: any = await MySQL.query(sql, value);

    if (data.affectedRows === 1) {
      return StatusCode.OK("Update successfully"); 
    }
    } catch (error : any) {
         console.log("Err @  update profile:", error.message);
    return StatusCode.UNKNOWN();
    }
}
