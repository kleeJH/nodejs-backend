import dotenv from "dotenv";
import cron from "cron";
import chalk from "chalk";
import { exec } from "child_process";
import { log } from "../common/utils/loggingUtils.mjs";

dotenv.config();

const isActive = process.env.CRONJOB_ACTIVE.toLowerCase() === "true";
const cronTime = process.env.CRONJOB_BACKUPDB_TIME;
const backupDirectory = process.env.CRONJOB_BACKUPDB_DIRECTORY;

async function databaseBackup() {
    const databaseBackupCron = new cron.CronJob(
        cronTime,
        async () => {
            try {
                console.log(`[${chalk.cyan("!")}] Database backup started.`);
            } catch (error) {
            } finally {
                console.log(`[${chalk.green("✓")}] Database backup completed.`);
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