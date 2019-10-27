"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Error Handler. Provides full stack - remove for production
 */
const app_1 = require("./app");
new app_1.Server().start()
    .then(() => {
    console.log('Server started...');
})
    .catch((err) => {
    console.error(err);
});
//# sourceMappingURL=server.js.map