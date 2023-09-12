"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.conexionBD = void 0;
// src/database.ts
const promise_1 = __importDefault(require("mysql2/promise"));
const dbConfig_1 = require("./dbConfig");
let connection = null;
async function conexionBD() {
    if (!connection) {
        connection = await promise_1.default.createConnection(dbConfig_1.dbConfig);
    }
    return connection;
}
exports.conexionBD = conexionBD;
