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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var http = require("http");
var socket_io_1 = require("socket.io");
var cors = require("cors");
var auth_1 = require("./routes/auth");
var user_1 = require("./routes/user");
var message_1 = require("./routes/message");
var client_1 = require("@prisma/client");
var dotenv = require("dotenv");
dotenv.config();
var app = express();
var prisma = new client_1.PrismaClient();
app.use(express.json());
app.use(cors());
app.use('/api', auth_1.default);
app.use('/api', user_1.default);
app.use('/api', message_1.default);
var server = http.createServer(app);
var io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});
io.on('connection', function (socket) {
    console.log('A user connected:', socket.id);
    socket.on('sendMessage', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var message, err_1;
        var content = _b.content, sender = _b.sender, receiver = _b.receiver;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    console.log('sendMessage event received:', { content: content, sender: sender, receiver: receiver });
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, prisma.message.create({
                            data: { content: content, sender: sender, receiver: receiver },
                        })];
                case 2:
                    message = _c.sent();
                    console.log('Message saved:', message);
                    io.emit('receiveMessage', message);
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _c.sent();
                    console.error('Error saving message:', err_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    socket.on('disconnect', function () {
        console.log('User disconnected:', socket.id);
    });
});
var PORT = process.env.SERVER_PORT || 4000;
server.listen(PORT, function () { return console.log("Server running on port ".concat(PORT)); });
