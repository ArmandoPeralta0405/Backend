// src/database.ts
import mysql from 'mysql2/promise';
import { dbConfig } from './dbConfig';

let connection: mysql.Connection | null = null;

export async function conexionBD() {
  if (!connection) {
    connection = await mysql.createConnection(dbConfig);
  }
  return connection;
}
