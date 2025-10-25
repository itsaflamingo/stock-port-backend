var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import pool from "../db/pool.js";
import dotenv from "dotenv";
import createUsersTable, { createType, select, findUser, addUser, alterTableUsers, updateUser, deleteUser } from "../db/schemas/user-schema.js";
import { insertAdminUser, params } from "../db/queries/admin-user.js";
dotenv.config();
//create users table if it does not exist
function setUpUsersTable() {
    return __awaiter(this, void 0, void 0, function* () {
        yield pool.query(createType);
        yield pool.query(createUsersTable);
        //Confirm that users table has been created
        const status = yield pool.query(select);
        return status.rows[0];
    });
}
//Call when setting up admin user. 
function setUpAdmin() {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield pool.query(insertAdminUser, params);
        return result.rows[0];
    });
}
function isUserInDb(username, email) {
    return __awaiter(this, void 0, void 0, function* () {
        //query database for username
        const result = yield pool.query(findUser, [username, email]);
        //return bool - true if user exists, false if not
        return result.rows[0];
    });
}
function getAllUsernames() {
    return __awaiter(this, void 0, void 0, function* () {
        const { rows } = yield pool.query("SELECT * from usernames");
        return rows;
    });
}
function addUserIfNotExists(username, email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("USERNAME", username, email, password);
        yield pool.query(alterTableUsers);
        const result = yield pool.query(addUser, [username.toString(), email.toString(), password.toString()]);
        console.log("RESULT: ", result.rows[0]);
        return result.rows[0];
    });
}
function updateUserFn(id, updates) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("UPDATES: ", updates);
        if (!updates.username && !updates.email && !updates.password) {
            return null;
        }
        const updateValues = {
            username: updates.username || null,
            email: updates.email || null,
            password: updates.password || null
        };
        const result = yield pool.query(updateUser, [
            id,
            updateValues.username,
            updateValues.email,
            updateValues.password
        ]);
        return result.rows[0];
    });
}
function deleteUserFn(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield pool.query(deleteUser, [id]);
        return result.rows[0];
    });
}
export { setUpUsersTable, setUpAdmin, getAllUsernames, addUserIfNotExists, isUserInDb, updateUserFn, deleteUserFn };
