/// <reference path="../.astro/db-types.d.ts" />
/// <reference path="../.astro/actions.d.ts" />
/// <reference types="astro/client" />

type User = {
    name: string;
    email: string;
    // avatar: string;
    // emailVerified: boolean;
}

declare namespace App {

    interface Locals {
        isLoggedIn: boolean;
        isAdmin: boolean;
        user: User | null;
    }
}
