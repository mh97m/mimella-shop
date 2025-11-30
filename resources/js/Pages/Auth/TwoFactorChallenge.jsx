import InputError from "@/Components/InputError";
import AuthenticationCardLogo from "@/Components/LogoRedirect";
import { Button } from "@/Components/shadcn/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/shadcn/ui/card";
import { toast, Toaster } from "sonner";
import { Input } from "@/Components/shadcn/ui/input";
import { Label } from "@/Components/shadcn/ui/label";
import { useSeoMetaTags } from "@/Composables/useSeoMetaTags";
import { useForm } from "@inertiajs/react";
import { memo, useRef, useState } from "react";
import { route } from "ziggy-js";

export default memo(() => {
    useSeoMetaTags({
        title: "Two-factor Confirmation",
    });

    const [recovery, setRecovery] = useState(false);

    const form = useForm({
        code: "",
        recovery_code: "",
    });

    const recoveryCodeInput = useRef(null);
    const codeInput = useRef(null);

    const toggleRecovery = () => {
        setRecovery((prev) => !prev);
        if (!recovery) {
            form.setData("code", "");
            setTimeout(() => recoveryCodeInput.current?.focus(), 0);
        } else {
            form.setData("recovery_code", "");
            setTimeout(() => codeInput.current?.focus(), 0);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        form.post(route("two-factor.login"));
    };

    return (
        <main className="max-w-7xl mx-auto py-4 pb-20 min-h-[calc(100vh-3.5rem)] px-0 mx-0 pr-4">
            <Toaster position="top-center" />

            <div className="flex items-center justify-center px-1 pl-4">
                <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow rounded-2xl p-6 space-y-6 text-center">
                    <div className="flex justify-center">
                        <div className="w-20 h-20 flex items-center justify-center rounded-lg">
                            <AuthenticationCardLogo className="rounded-md shadow-md grid place-items-center" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                        احراز هویت دو مرحله‌ای
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {!recovery
                            ? "لطفاً برای ادامه، کد احراز هویت ارائه شده توسط برنامه خود را وارد کنید."
                            : "لطفاً یکی از کدهای بازیابی اضطراری خود را وارد کنید."}
                    </p>

                    <form onSubmit={submit} className="space-y-4 text-right">
                        {!recovery ? (
                            <div>
                                <label className="block mb-1 text-sm text-gray-600 dark:text-gray-300">
                                    کد احراز هویت
                                </label>
                                <input
                                    id="code"
                                    ref={codeInput}
                                    type="text"
                                    inputMode="numeric"
                                    value={form.data.code}
                                    onChange={(e) =>
                                        form.setData("code", e.target.value)
                                    }
                                    autoFocus
                                    autoComplete="one-time-code"
                                    placeholder="کد را وارد کنید"
                                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-brand-2 focus:border-brand-2 outline-none"
                                />
                                {form.errors.code && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {form.errors.code}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div>
                                <label className="block mb-1 text-sm text-gray-600 dark:text-gray-300">
                                    کد بازیابی
                                </label>
                                <input
                                    id="recovery_code"
                                    ref={recoveryCodeInput}
                                    type="text"
                                    value={form.data.recovery_code}
                                    onChange={(e) =>
                                        form.setData(
                                            "recovery_code",
                                            e.target.value,
                                        )
                                    }
                                    autoComplete="one-time-code"
                                    placeholder="کد بازیابی را وارد کنید"
                                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-brand-2 focus:border-brand-2 outline-none"
                                />
                                {form.errors.recovery_code && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {form.errors.recovery_code}
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="flex items-center justify-between mt-4 text-sm">
                            <button
                                type="button"
                                className="text-brand hover:underline"
                                onClick={toggleRecovery}
                            >
                                {!recovery
                                    ? "استفاده از کد بازیابی"
                                    : "استفاده از کد احراز هویت"}
                            </button>

                            <button
                                type="submit"
                                disabled={form.processing}
                                className="bg-brand text-white font-bold py-3 px-6 rounded-xl hover:bg-brand/90 transition disabled:opacity-70"
                            >
                                {form.processing ? "در حال ورود..." : "ورود"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
});
