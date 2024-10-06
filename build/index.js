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
const models_1 = require("./infrastructure/database/models");
const server_1 = __importDefault(require("./server"));
const PORT_SERVER = process.env.PORT_SERVER || 3000;
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        yield models_1.sequelize.authenticate();
        yield models_1.sequelize.sync();
        const server = server_1.default.listen(PORT_SERVER, () => {
            console.log(`Server running on port ${PORT_SERVER}`),
                console.log(`Documentação da API disponível em http://localhost:${PORT_SERVER}/api-docs`);
        });
        process.on("SIGINT", function onSigint() {
            console.info("SIGINT (ctrl-c in docker). Graceful shutdown", new Date().toISOString());
            shutdown();
        });
        process.on("SIGTERM", function onSigterm() {
            console.info("SIGTERM (docker container stop). Graceful shutdown", new Date().toISOString());
            shutdown();
        });
        function shutdown() {
            server.close(function onServerClosed(err) {
                if (err) {
                    console.error(err);
                    process.exit(1);
                }
                process.exit(0);
            });
        }
    });
}
init();
