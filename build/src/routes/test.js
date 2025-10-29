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
const express_1 = require("express");
const supabase_js_1 = __importDefault(require("../utils/supabase.js"));
const router = (0, express_1.Router)();
router.get('/test', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data, error } = yield supabase_js_1.default
            .from('positions')
            .select('*')
            .limit(1);
        if (error) {
            console.error('Supabase error:', error.message);
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json({ success: true, data });
    }
    catch (err) {
        console.error('Unexpected error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
router.post('/test', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        const { data, error } = yield supabase_js_1.default
            .from('positions')
            .insert({ name })
            .select();
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(201).json({ success: true, data });
    }
    catch (err) {
        console.error('Unexpected error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
exports.default = router;
