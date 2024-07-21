import chalk from "chalk";
import database from "../app/lib/database.js";
import roleCrud from "../app/modules/auth/cruds/roleCrud.js";
import permissionCrud from "../app/modules/auth/cruds/permissionCrud.js";
import rolePermissionCrud from "../app/modules/auth/cruds/rolePermissionCrud.js";
import { generateGenericMongoId } from "../app/common/utils/helperUtils.js";
import { ROLE_TYPE, PERMISSION } from "../app/common/enums/authEnumTypes.js";

database.connect();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

await deleteAllData();
await initRoles();
await initPermissions();
await initRolePermissions();
await initExit();

async function deleteAllData() {
    try {
        console.log(`[${chalk.cyan("!")}] `, "Starting initRolePermissions.js...");
        await rolePermissionCrud.deleteAllRolePermissions();
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

async function initRolePermissions() {
    const batchRolePermissions = [
        {
            roleName: ROLE_TYPE.ADMIN,
            permissions: [
                PERMISSION.READ_USER,
                PERMISSION.CREATE_USER,
                PERMISSION.UPDATE_USER,
                PERMISSION.DELETE_USER,
                PERMISSION.READ_ROLE,
                PERMISSION.CREATE_ROLE,
                PERMISSION.UPDATE_ROLE,
                PERMISSION.DELETE_ROLE,
                PERMISSION.READ_PERMISSION,
                PERMISSION.CREATE_PERMISSION,
                PERMISSION.UPDATE_PERMISSION,
                PERMISSION.DELETE_PERMISSION,
                PERMISSION.READ_ROLE_PERMISSION,
                PERMISSION.CREATE_ROLE_PERMISSION,
                PERMISSION.UPDATE_ROLE_PERMISSION,
                PERMISSION.DELETE_ROLE_PERMISSION
            ]
        },
        {
            roleName: ROLE_TYPE.USER,
            permissions: [
                PERMISSION.READ_USER,
                PERMISSION.READ_ROLE,
                PERMISSION.READ_PERMISSION,
                PERMISSION.READ_ROLE_PERMISSION
            ]
        }
    ]

    await rolePermissionCrud.batchCreateRolePermissions(batchRolePermissions)
        .then(
            (msg) => {
                console.log(`[${chalk.green("✓")}] `, msg);
            }
        )
        .catch((err) => {
            console.log(`[${chalk.red("✗")}] `, "initRolePermissions Error: ", err.message);
            process.exit(1);
        });
}

async function initExit() {
    await sleep(1000);
    console.log(`[${chalk.cyan("!")}] `, "Ended initRolePermissions.js");
    process.exit(0);
}