export const ROLE_TYPE = {
    USER: "user",
    ADMIN: "admin"
}

export const MODULE_TYPE = {
    USER_GENERAL_MODULE: "user_general_module",
    ADMIN_GENERAL_MODULE: "admin_general_module",
    USER_AUTH_MODULE: "user_auth_module",
    ADMIN_AUTH_MODULE: "admin_auth_module"
}

export const PERMISSION = {
    // USER
    READ_USER: "read_user",
    CREATE_USER: "create_user",
    UPDATE_USER: "update_user",
    DELETE_USER: "delete_user",

    // ROLE
    READ_ROLE: "read_role",
    CREATE_ROLE: "create_role",
    UPDATE_ROLE: "update_role",
    DELETE_ROLE: "delete_role",

    // PERMISSION
    READ_PERMISSION: "read_permission",
    CREATE_PERMISSION: "create_permission",
    UPDATE_PERMISSION: "update_permission",
    DELETE_PERMISSION: "delete_permission",

    // ROLE PERMISSION
    READ_ROLE_PERMISSION: "read_role_permission",
    CREATE_ROLE_PERMISSION: "create_role_permission",
    UPDATE_ROLE_PERMISSION: "update_role_permission",
    DELETE_ROLE_PERMISSION: "delete_role_permission",
}