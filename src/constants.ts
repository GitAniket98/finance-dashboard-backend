export const ROLES = {
    ADMIN : "admin",
    ANALYST : "analyst",
    VIEWER : "viewer"
} as const

export const USER_STATUS = {
    ACTIVE : "active",
    INACTIVE : "inactive"
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]
export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS]