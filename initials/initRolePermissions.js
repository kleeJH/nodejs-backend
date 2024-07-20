import chalk from "chalk";
import database from "../app/lib/database.js";
import roleCrud from "../app/modules/user/cruds/roleCrud.js";
import permissionCrud from "../app/modules/user/cruds/permissionCrud.js";
import { generateGenericMongoId } from "../app/common/utils/helperUtils.js";
import { ROLE_TYPE, PERMISSION } from "../app/common/enums/authEnumTypes.js";

database.connect();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

await deleteAllData();
await initRoles();
await initPermissions();
await initExit();

async function deleteAllData() {
    try {
        await roleCrud.deleteAllRoles();
        await permissionCrud.deleteAllPermissions();
    } catch (err) {
        console.log(`[${chalk.red("✗")}] `, "deleteAllData Error: ", err.message);
        process.exit(1);
    }
}

async function initRoles() {
    const batchRoles = [
        {
            _id: generateGenericMongoId("1"),
            name: ROLE_TYPE.ADMIN,
            description: "Admin role",
            isAdmin: true
        },
        {
            _id: generateGenericMongoId("2"),
            name: ROLE_TYPE.USER,
            description: "User role",
            isAdmin: false
        },
    ];

    await roleCrud.batchCreateRoles(batchRoles)
        .then(
            (msg) => {
                console.log(`[${chalk.green("✓")}] `, msg);
            }
        )
        .catch((err) => {
            console.log(`[${chalk.red("✗")}] `, "initRoles Error: ", err.message);
            process.exit(1);
        });
}

async function initPermissions() {
    const batchPermissions = [
        {
            _id: generateGenericMongoId("1"),
            name: PERMISSION.READ_USER,
            description: "Read user"
        },
        {
            _id: generateGenericMongoId("2"),
            name: PERMISSION.CREATE_USER,
            description: "Create user"
        },
        {
            _id: generateGenericMongoId("3"),
            name: PERMISSION.UPDATE_USER,
            description: "Update user"
        },
        {
            _id: generateGenericMongoId("4"),
            name: PERMISSION.DELETE_USER,
            description: "Delete user"
        },

        // ROLE
        {
            _id: generateGenericMongoId("5"),
            name: PERMISSION.READ_ROLE,
            description: "Read role"
        },
        {
            _id: generateGenericMongoId("6"),
            name: PERMISSION.CREATE_ROLE,
            description: "Create role"
        },
        {
            _id: generateGenericMongoId("7"),
            name: PERMISSION.UPDATE_ROLE,
            description: "Update role"
        },
        {
            _id: generateGenericMongoId("8"),
            name: PERMISSION.DELETE_ROLE,
            description: "Delete role"
        },

        // PERMISSION
        {
            _id: generateGenericMongoId("9"),
            name: PERMISSION.READ_PERMISSION,
            description: "Read permission"
        },
        {
            _id: generateGenericMongoId("10"),
            name: PERMISSION.CREATE_PERMISSION,
            description: "Create permission"
        },
        {
            _id: generateGenericMongoId("11"),
            name: PERMISSION.UPDATE_PERMISSION,
            description: "Update permission"
        },
        {
            _id: generateGenericMongoId("12"),
            name: PERMISSION.DELETE_PERMISSION,
            description: "Delete permission"
        },

        // ROLE PERMISSION
        {
            _id: generateGenericMongoId("13"),
            name: PERMISSION.READ_ROLE_PERMISSION,
            description: "Read role permission"
        },
        {
            _id: generateGenericMongoId("14"),
            name: PERMISSION.CREATE_ROLE_PERMISSION,
            description: "Create role permission"
        },
        {
            _id: generateGenericMongoId("15"),
            name: PERMISSION.UPDATE_ROLE_PERMISSION,
            description: "Update role permission"
        },
        {
            _id: generateGenericMongoId("16"),
            name: PERMISSION.DELETE_ROLE_PERMISSION,
            description: "Delete role permission"
        }
    ];

    await permissionCrud.batchCreatePermissions(batchPermissions)
        .then(
            (msg) => {
                console.log(`[${chalk.green("✓")}] `, msg);
            }
        )
        .catch((err) => {
            console.log(`[${chalk.red("✗")}] `, "initPermissions Error: ", err.message);
            process.exit(1);
        });
}

// TODO: add role permission

async function initExit() {
    await sleep(1000);
    process.exit(0);
}