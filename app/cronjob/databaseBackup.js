import dotenv from "dotenv";
import cron from "cron";
import { exec } from "child_process";
import { cronLog } from "../common/utils/loggingUtils.mjs";

dotenv.config();

const isActive = process.env.CRONJOB_ACTIVE.toLowerCase() === "true";
const cronTime = process.env.CRONJOB_BACKUPDB_TIME;
const backupDirectory = process.env.CRONJOB_BACKUPDB_DIRECTORY;

async function databaseBackup() {
    const databaseBackupCron = new cron.CronJob(
        cronTime,
        async () => {
            try {
                cronLog.info(`[!] Database backup started.`);
                const mongoDBURL = process.env.MONGODB_URL;

                const directoryDate = new Date().toISOString().split("T")[0];
                const directoryPath = `${backupDirectory}/${directoryDate}`;
                const backupCommand = `mongodump --uri ${mongoDBURL} --db ${process.env.MONGODB_DBNAME} --out ${directoryPath}`;

                await new Promise((resolve, reject) => {
                    exec(backupCommand, (error, stdout, stderr) => {
                        if (error) {
                            reject(error);
                        } else if (stderr) {
                            reject(stderr);
                        } else {
                            resolve(stdout);
                        }
                    });
                })
            } catch (error) {
                cronLog.error(`[✗] Database backup failed.`, error.message);
            } finally {
                cronLog.info(`[✓] Database backup completed.`);
            }
        },
        null,
        isActive
    );

    databaseBackupCron.start();
}

function startDatabaseBackupCron() {
    if (isActive) {
        databaseBackup();
    }
}

export { startDatabaseBackupCron }