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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSchedule = void 0;
const headerHelper_1 = require("../helpers/headerHelper");
const getSchedule = (_a) => __awaiter(void 0, [_a], void 0, function* ({ baseUrl, orgId, authorization, date, prefix }) {
    var _b;
    const dateObj = new Date(date);
    const dateDMY = dateObj.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
    });
    const dateISO = dateObj.toISOString();
    const getEndpoint = 'schedule';
    const referer = `${baseUrl}${orgId}/schedule?view=month&date=${dateDMY}`;
    const params = new URLSearchParams({
        date: dateISO,
        timeSpan: '0',
        kind: 'volunteer',
        daySearch: '0',
        firstCall: 'true',
        currView: 'month',
        platform: 'web',
    });
    const headers = (0, headerHelper_1.initReqHeaders)({ referer, authorization });
    const response = yield fetch(`${baseUrl}${getEndpoint}?${params.toString()}`, {
        method: 'GET',
        headers,
    });
    const resp = yield response.json();
    console.log(resp);
    if (!resp && !resp.schedule && !(((_b = resp.schedule) === null || _b === void 0 ? void 0 : _b.length) >= 0)) {
        throw new Error('No schedule found');
    }
    const data = resp.schedule;
    if (!prefix) {
        return data;
    }
    return data.filter(entry => entry.title.startsWith(prefix));
});
exports.getSchedule = getSchedule;
