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
import { memo } from "react";
import { route } from "ziggy-js";

export default memo(({ status }) => {
    useSeoMetaTags({
        title: "Forgot Password",
    });

    const form = useForm({
        mobile: "",
    });

    const submit = (e) => {
        e.preventDefault();
        form.post(route("password.mobile"));
    };

    return (
        <main className="max-w-7xl mx-auto py-4 pb-20 min-h-[calc(100vh-3.5rem)] px-0 mx-0 pr-4">
            <Toaster position="top-center" />

            <div className="flex items-center justify-center px-1 pl-4 min-h-screen">
                <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow rounded-2xl p-6 space-y-6 text-center">
                    {/* LOGO */}
                    <div className="flex justify-center">
                        <div className="w-20 h-20 flex items-center justify-center rounded-lg">
                            <img
                                className="rounded-md shadow-md grid place-items-center"
                                src="assets/imgs/logo.png"
                                alt="Clickly"
                            />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                        بازیابی رمز عبور
                    </h2>

                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-7">
                        رمز عبور خود را فراموش کرده‌اید؟ مشکلی نیست — شماره
                        موبایل خود را وارد کنید تا لینک بازیابی برای شما ارسال
                        شود.
                    </p>

                    {status && (
                        <div className="text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 p-2 rounded-xl text-sm">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4 text-right">
                        {/* MOBILE */}
                        <div>
                            <label className="block mb-1 text-sm text-gray-600 dark:text-gray-300">
                                شماره موبایل
                            </label>
                            <input
                                id="mobile"
                                type="mobile"
                                value={form.data.mobile}
                                onChange={(e) =>
                                    form.setData("mobile", e.target.value)
                                }
                                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-brand-2 focus:border-brand-2 outline-none"
                                required
                                autoFocus
                                autoComplete="username"
                            />
                            {form.errors.mobile && (
                                <p className="text-sm text-red-500 mt-1">
                                    {form.errors.mobile}
                                </p>
                            )}
                        </div>

                        {/* SUBMIT */}
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="block w-full bg-brand text-white font-bold py-3 rounded-xl text-center hover:bg-brand/90 transition disabled:opacity-70"
                        >
                            {form.processing
                                ? "در حال ارسال..."
                                : "ارسال لینک بازیابی رمز عبور"}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
});
