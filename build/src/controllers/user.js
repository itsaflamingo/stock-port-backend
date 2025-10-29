"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUpUsersTable = setUpUsersTable;
exports.setUpAdmin = setUpAdmin;
exports.getAllUsernames = getAllUsernames;
exports.addUserIfNotExists = addUserIfNotExists;
exports.isUserInDb = isUserInDb;
exports.updateUserFn = updateUserFn;
exports.deleteUserFn = deleteUserFn;
const pool_js_1 = __importDefault(require("../db/pool.js"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_schema_js_1 = __importStar(require("../db/schemas/user-schema.js"));
const admin_user_js_1 = require("../db/queries/admin-user.js");
dotenv_1.default.config();
//create users table if it does not exist
function setUpUsersTable() {
    return __awaiter(this, void 0, void 0, function* () {
        yield pool_js_1.default.query(user_schema_js_1.createType);
        yield pool_js_1.default.query(user_schema_js_1.default);
        //Confirm that users table has been created
        const status = yield pool_js_1.default.query(user_schema_js_1.select);
        return status.rows[0];
    });
}
//Call when setting up admin user. 
function setUpAdmin() {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield pool_js_1.default.query(admin_user_js_1.insertAdminUser, admin_user_js_1.params);
        return result.rows[0];
    });
}
function isUserInDb(username, email) {
    return __awaiter(this, void 0, void 0, function* () {
        //query database for username
        const result = yield pool_js_1.default.query(user_schema_js_1.findUser, [username, email]);
        //return bool - true if user exists, false if not
        return result.rows[0];
    });
}
function getAllUsernames() {
    return __awaiter(this, void 0, void 0, function* () {
        const { rows } = yield pool_js_1.default.query("SELECT * from usernames");
        return rows;
    });
}
function addUserIfNotExists(username, email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("USERNAME", username, email, password);
        yield pool_js_1.default.query(user_schema_js_1.alterTableUsers);
        const result = yield pool_js_1.default.query(user_schema_js_1.addUser, [username.toString(), email.toString(), password.toString()]);
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
        const result = yield pool_js_1.default.query(user_schema_js_1.updateUser, [
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
        const result = yield pool_js_1.default.query(user_schema_js_1.deleteUser, [id]);
        return result.rows[0];
    });
}
