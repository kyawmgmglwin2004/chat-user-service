import { ResultSetHeader, RowDataPacket } from 'mysql2';
import MySQL from '../helpers/db_helper';
import StatusCode from '../helpers/status_code_helper';
import { Context } from 'moleculer';
import bcrypt from 'bcrypt';
import jwtHelper from '../helpers/jwt_token_helper';

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
export interface LoginResult {
    accessToken: string;
    refreshToken: string;
    user: {
        id: number;
        email: string;
        userName: string;
    };
}

export async function loginEmail(ctx: Context<loginByEmailType>) {
    try {
        const { email, password } = ctx.params;
        if (!email || !password || typeof password !== "string" || password.length < 6) {
            return null;
        }

        let sql = "SELECT * FROM users WHERE email = ?";
        const [rows] = await MySQL.query<UserRow[]>(sql, [email]);
        if (!rows || rows.length == 0) {
            return null;
        }

        const user = rows[0];
        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            return null;
        }

        const payload = { id: user.id, email: user.email };
        const secret = "KyawMgMgLwin";

        const accessToken = jwtHelper.signJWT(payload, secret, "5m");
        const refreshToken = jwtHelper.signJWT(payload, secret, "7d");

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                userName: user.userName
            }
        };
    } catch (error) {
        console.error("Login Error: ", error);
        return null;
    }
}

export async function register(ctx: Context<register>) {
    try {
        const { email, password, phone, userName } = ctx.params;

        if (
            !email || !password || typeof password !== "string" || password.length < 6 ||
            !phone || typeof phone !== "string" ||
            !userName || typeof userName !== "string"
        ) {
            return StatusCode.INVALID_ARGUMENT("Invalid argument");
        }

        // Check email exists
        const [rows] = await MySQL.query<RowDataPacket[]>(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );
        if (rows.length > 0) {
            return StatusCode.ALREADY_EXISTS("This email already exists");
        }

        // Check phone exists
        const [row2] = await MySQL.query<RowDataPacket[]>(
            "SELECT id FROM users WHERE phone = ?",
            [phone]
        );
        if (row2.length > 0) {
            return StatusCode.ALREADY_EXISTS("This phone number already exists");
        }

        // Hash password
        const hashPassword = await bcrypt.hash(password, 10);

        // Insert user
        const sql3 = "INSERT INTO users (userName, password, email, phone) VALUES (?, ?, ?, ?)";
        const [result] = await MySQL.query<ResultSetHeader>(sql3, [userName, hashPassword, email, phone]);

        if (result.affectedRows === 0) {
            return StatusCode.UNAUTHENTICATED("User register error");
        }

        // Return newly created user
        return StatusCode.OK({
            user: {
                id: result.insertId,
                email,
                phone,
                userName
            }
        });
    } catch (error) {
        console.error("Register Error: ", error);
        return StatusCode.UNKNOWN("Internal server error");
    }
}

