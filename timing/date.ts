import moment from "moment-timezone";

export function getTimezoneDateUtcInMs(date: Date, timezone: string) {
    return new Date(date).valueOf() - ( moment.tz(timezone).utcOffset() * 60 * 1000)
}

export function getCurrentTimezoneDateInUtc(timezone: string) {
    return moment.tz(timezone).utc(false).valueOf()
}
