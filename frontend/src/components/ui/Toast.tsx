"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { clearMessages } from "@/store/noteSlice";

export default function Toast() {
    const dispatch = useAppDispatch();
    const { successMessage, errorMessage } = useAppSelector((s) => s.notes);

    const message = successMessage ?? errorMessage;
    const isSuccess = !!successMessage;

    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(() => dispatch(clearMessages()), 2500);
        return () => clearTimeout(timer);
    }, [message, dispatch]);

    if (!message) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-right-5 fade-in duration-200">
            <div
                role="alert"
                className={`
          flex items-center gap-3 rounded-lg border px-5 py-3 text-sm font-medium shadow-lg
          ${
              isSuccess
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-destructive bg-destructive/10 text-destructive"
          }
        `}
            >
                <span className="text-base">{isSuccess ? "✓" : "✕"}</span>

                <span>{message}</span>

                <button
                    onClick={() => dispatch(clearMessages())}
                    className="ml-2 opacity-60 hover:opacity-100 transition"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}