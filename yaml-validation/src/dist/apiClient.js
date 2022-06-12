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
exports.__esModule = true;
exports.client = void 0;
var fetch_retry_1 = require("fetch-retry");
var lodash_1 = require("lodash");
var fetchWithRetry = fetch_retry_1["default"](fetch);
var ApiClient = /** @class */ (function () {
    function ApiClient(options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        this.fetch = function (path, method, data, options) {
            if (options === void 0) { options = {}; }
            return __awaiter(_this, void 0, void 0, function () {
                var body, modifiedPath, urlToFetch, isJson, response, err_1, status, success;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (method === "GET") {
                                if (data) {
                                    modifiedPath = path + "?" + (data && this.constructQueryString(data));
                                }
                                else {
                                    modifiedPath = path;
                                }
                            }
                            else if (method === "POST" || method === "PUT") {
                                if (data instanceof FormData || typeof data === "string") {
                                    body = data;
                                }
                                // Only stringify data if its a normal object and
                                // not if it's [object FormData], in addition to
                                // toggling Content-Type to application/json
                                if (typeof data === "object" &&
                                    (data || "").toString() === "[object Object]") {
                                    isJson = true;
                                    body = JSON.stringify(data);
                                }
                            }
                            if (path.match(/^http/)) {
                                urlToFetch = modifiedPath || path;
                            }
                            else {
                                urlToFetch = this.baseUrl + (modifiedPath || path);
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, fetchWithRetry(urlToFetch, {
                                    method: method,
                                    body: body,
                                    cache: "no-cache"
                                })];
                        case 2:
                            response = _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            err_1 = _a.sent();
                            return [3 /*break*/, 4];
                        case 4:
                            status = ((response === null || response === void 0 ? void 0 : response.status) || 0);
                            success = status >= 200 && status < 300;
                            if (options.download && success) {
                            }
                            else if (success && status === 204) {
                                return [2 /*return*/];
                            }
                            else if (success) {
                                return [2 /*return*/, response === null || response === void 0 ? void 0 : response.json()];
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        this.get = function (path, data, options) {
            if (data === void 0) { data = {}; }
            return _this.fetch(path, "GET", data, options);
        };
        this.post = function (path, data, options) {
            return _this.fetch(path, "POST", data, options);
        };
        this.constructQueryString = function (data) {
            return lodash_1.map(data, function (v, k) { return encodeURIComponent(k) + "=" + encodeURIComponent(v); }).join("&");
        };
        this.baseUrl = options.baseUrl || "/api";
    }
    return ApiClient;
}());
exports.client = new ApiClient();
