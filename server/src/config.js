import { config } from "dotenv"

config();

export const PORT = process.env.PORT || 3000;

export const USER = process.env.USER || "ramon";

export const PASSWORD = process.env.PASSWORD || "rr1234**";

export const SERVER = process.env.SERVER || "localhost";

export const DATABASE = process.env.DATABASE || "Gateway_Manager";

export const SECRET = process.env.SECRET || "administrator";


