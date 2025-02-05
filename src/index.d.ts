import { GetSchedule } from "./schedule/index.d";

export interface VolgisticsClient {
    login: (params: { email: string; password: string }) => Promise<void>;
    getSchedule: (params: GetSchedule) => Promise<any>;
}

export interface VolgisticsClientOptions {
    baseUrl?: string;
    orgId: string|number;
}

export interface GetScheduleOptions {
    date: string|Date;
    prefix?: string;
}