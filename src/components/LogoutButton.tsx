"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/Linkedink/login" })}
            className="font-medium hover:underline text-danger"
        >
            LOGOUT
        </button>
    );
}
