import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const password = `${process.env.ADMIN_PASSWORD}`; // ← your actual password
const hash = await bcrypt.hash(password, 12); // 12 = salt rounds
//console.log("Hashed password:", hash);
