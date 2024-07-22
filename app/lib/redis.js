import { createClient } from "redis"
import { ExternalServiceError } from "../common/exceptions/exceptions";
import { log } from "../common/utils/loggingUtils.mjs";

let client;

async function connect() {
    const prefix = "redis://";
    const baseUrl = `${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;
    const redisAuth = `:${process.env.REDIS_PASSWORD}@`;
    const redisUrl = process.env.REDIS_PASSWORD ? `${prefix}${redisAuth}${baseUrl}` : `${prefix}${baseUrl}`;

    try {
        client = createClient({ url: redisUrl });
        client.on("error", (err) => {
            throw new ExternalServiceError("Redis", err);
        });

        await client.connect();
        return client;
    } catch (error) {
        log.error(error);
    }
}

async function disconnect() {
    if (client) {
        await client.disconnect();
        console.log('Disconnected from Redis');
    }
}

function set(key, value) {
    return client.set(key, value);
}

function get(key) {
    return client.get(key);
}

export default { connect, disconnect, set, get };
