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
        while (_) try {
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
var fs = require("fs");
var utils_1 = require("@taquito/utils");
var node_crypto_1 = require("node:crypto");
var g = '8-gram.json';
var c = 'config.json';
var grams = JSON.parse(fs.readFileSync(g, 'utf-8'));
var config = JSON.parse(fs.readFileSync(c, 'utf-8'));
var tokens = function (contract) { return __awaiter(void 0, void 0, void 0, function () {
    var e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, fetch("https://api.tzkt.io/v1/contracts/".concat(contract, "/bigmaps/rgb/keys?") +
                        "value.token_id.gt=".concat(config.from[contract].id))];
            case 1: return [4 /*yield*/, (_a.sent()).json()];
            case 2: return [2 /*return*/, _a.sent()];
            case 3:
                e_1 = _a.sent();
                console.log(e_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var get = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _i, _a, contract, data, _b, rb, type, _c, data_1, token, _d, rgb, creator, creater, token_id, token_name, creator_name, creater_name, token_description, _e, hash, _f, fee, recipient, sha, desc, input, hex;
    var _g, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                _i = 0, _a = Object.keys(config.from);
                _j.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 4];
                contract = _a[_i];
                return [4 /*yield*/, tokens(contract)];
            case 2:
                data = _j.sent();
                _b = config.from[contract], rb = _b.rb, type = _b.type;
                for (_c = 0, data_1 = data; _c < data_1.length; _c++) {
                    token = data_1[_c];
                    _d = token.value, rgb = _d.rgb, creator = _d.creator, creater = _d.creater, token_id = _d.token_id, token_name = _d.token_name, creator_name = _d.creator_name, creater_name = _d.creater_name, token_description = _d.token_description;
                    token_description = (0, utils_1.bytes2Char)(token_description);
                    _e = (_g = /\[(.+)\]/gm.exec(token_description)) !== null && _g !== void 0 ? _g : [], hash = _e[1];
                    if ((hash === null || hash === void 0 ? void 0 : hash.length) === 64) {
                        if (rb)
                            rgb = (0, utils_1.bytes2Char)(rgb);
                        token_name = (0, utils_1.bytes2Char)(token_name);
                        creator_name = (0, utils_1.bytes2Char)(creator_name !== null && creator_name !== void 0 ? creator_name : creater_name);
                        _f = (_h = /(\S+)ꜩ → \{(\S+)\}/gm.exec(token_description)) !== null && _h !== void 0 ? _h : [], fee = _f[1], recipient = _f[2];
                        sha = (0, node_crypto_1.createHash)('sha256');
                        desc = token_description.split(' \n');
                        desc.pop();
                        input = "".concat(contract, ":").concat(creator !== null && creator !== void 0 ? creator : creater, ":").concat(creator_name, ":").concat(token_name).concat(desc.join(' \n'), ":").concat(rgb, ":") +
                            "".concat(recipient !== null && recipient !== void 0 ? recipient : '', ":").concat(fee !== null && fee !== void 0 ? fee : '');
                        sha.update(input, 'utf-8');
                        hex = sha.digest('hex');
                        if (hex === hash)
                            grams.grams.push({ rgb: rgb, token_id: token_id, type: type });
                    }
                }
                if (data === null || data === void 0 ? void 0 : data.length)
                    config.from[contract].id = data[data.length - 1].value.token_id;
                _j.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4:
                fs.writeFileSync(g, JSON.stringify(grams, null, 2));
                fs.writeFileSync(c, JSON.stringify(config, null, 2));
                return [2 /*return*/];
        }
    });
}); };
get();
