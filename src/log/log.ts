import { LogTypes } from "@/types";

export function log(message: string, logType: LogTypes = LogTypes.Info) {
    const timeString = new Date().toLocaleTimeString();

    if (logType == LogTypes.Info) {
        console.info(`[INFO] [${timeString}] ${message}`);
    } else if (logType == LogTypes.Success) {
        console.log(`\x1b[32m[INFO] [${timeString}] ${message}`);
    } else {
        console.error(`\x1b[31m[ERROR] [${timeString}] ${message}`);
    }
}
