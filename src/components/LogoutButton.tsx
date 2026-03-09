"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/Linkedink/login" })}
            className="text-sm font-medium text-body hover:text-danger transition-colors"
        >
            Logout
        </button>
    );
}
