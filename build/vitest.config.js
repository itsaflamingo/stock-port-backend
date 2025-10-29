"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("vitest/config");
exports.default = (0, config_1.defineConfig)({
    test: {
        include: ['vitest/**/*.test.ts'], // or just ['vitest/**']    globals: true,
        environment: 'node',
    },
});
