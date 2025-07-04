import { drizzle } from "drizzle-orm/expo-sqlite";
import * as SQLite from "expo-sqlite";
const sqlite = SQLite.openDatabaseSync("test001.db");
export const db = drizzle(sqlite);
