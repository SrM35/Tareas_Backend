import { join } from "node:path";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "12345678",
    database: "short_url",
    synchronize: true,
    logging: true,
    entities: [join(__dirname, "db/emtity/**/*.{ts,js}")],
    subscribers: [],
    migrations: [],
})