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
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
// async function createStocksWrite () {
//   try {
//     const createdStocks = await prisma.stocks.create({
//       data: {
//         email: 'martvil96@gmail.com',
//         currency: 'CZK',
//         stocks: {
//           create: []
//         }
//       }
//     })
//     return createdStocks
//   } catch (error: any) {
//     throw new Error(error)
//   }
// }
// createStocksWrite()
//   .then((result) => {
//     console.log('Stocks updated:', result)
//   })
//   .catch((error) => {
//     console.error('Error updating stocks:', error)
//   })
// async function createNetWorthWrite () {
//   try {
//     const createdStocks = await prisma.netWorth.create({
//       data: {
//         email: 'martvil96@gmail.com',
//         netWorthDates: [new Date()],
//         netWorthValues: [0]
//       }
//     })
//     return createdStocks
//   } catch (error: any) {
//     throw new Error(error)
//   }
// }
// createNetWorthWrite()
//   .then((result) => {
//     console.log('Net worth updated:', result)
//   })
//   .catch((error) => {
//     console.error('Error updating Net worth:', error)
//   })
// async function createTotalInvestedWrite () {
//   try {
//     const createdStocks = await prisma.totalInvested.create({
//       data: {
//         email: 'martvil96@gmail.com',
//         totalInvestedDates: [new Date()],
//         totalInvestedValues: [0]
//       }
//     })
//     return createdStocks
//   } catch (error: any) {
//     throw new Error(error)
//   }
// }
// createTotalInvestedWrite()
//   .then((result) => {
//     console.log('Total invested updated:', result)
//   })
//   .catch((error) => {
//     console.error('Error updating Total invested:', error)
//   })
function createRelativeChangeWrite() {
    return __awaiter(this, void 0, void 0, function () {
        var createdRelativeChange, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, prisma.relativeChange.create({
                            data: {
                                email: 'martvil96@gmail.com',
                                relativeChangeDates: [new Date()],
                                relativeChangeValues: [1]
                            }
                        })];
                case 1:
                    createdRelativeChange = _a.sent();
                    return [2 /*return*/, createdRelativeChange];
                case 2:
                    error_1 = _a.sent();
                    throw new Error(error_1);
                case 3: return [2 /*return*/];
            }
        });
    });
}
createRelativeChangeWrite()
    .then(function (result) {
    console.log('Total invested updated:', result);
})
    .catch(function (error) {
    console.error('Error updating Total invested:', error);
});
