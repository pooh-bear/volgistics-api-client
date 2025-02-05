import { GetScheduleOptions, ScheduleEntry } from "./index.d";
export declare const getSchedule: ({ baseUrl, orgId, authorization, date, prefix }: GetScheduleOptions) => Promise<ScheduleEntry[]>;
