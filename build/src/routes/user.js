"use strict";
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
const express_1 = __importDefault(require("express"));
const user_js_1 = require("../controllers/user.js");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const router = express_1.default.Router();
router.get("/", (_req, res) => {
    res.send("sign in");
});
router.patch("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let hashedPassword = "";
    let result;
    if (req.body.password) {
        hashedPassword = yield bcryptjs_1.default.hash(req.body.password, 10);
    }
    else {
        res.send("Please enter a password");
    }
    try {
        result = yield (0, user_js_1.updateUserFn)(req.body.id, { username: req.body.username, email: req.body.email, password: hashedPassword, });
    }
    catch (err) {
        res.send(err);
    }
    res.send(result);
}));
router.delete("/", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, user_js_1.deleteUserFn)(_req.body.id);
    res.send(result);
}));
exports.default = router;
