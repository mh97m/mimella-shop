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
import { useSeoMetaTags } from "@/Composables/useSeoMetaTags";
import { Link, useForm } from "@inertiajs/react";
import { memo } from "react";
import { route } from "ziggy-js";

export default memo(({ status }) => {
    useSeoMetaTags({
        title: "Mobile Verification",
    });

    const form = useForm({});

    const submit = (e) => {
        e.preventDefault();
        form.post(route("verification.send"));
    };

    const verificationLinkSent = status === "verification-link-sent";

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
                        تایید شماره موبایل
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        قبل از ادامه، لطفاً شماره موبایل خود را با کلیک روی لینک
                        ارسالی تأیید کنید. اگر لینک را دریافت نکردید، می‌توانیم
                        دوباره برای شما ارسال کنیم.
                    </p>

                    {verificationLinkSent && (
                        <div className="text-sm font-medium text-green-600 dark:text-green-400">
                            لینک تایید جدید به شماره موبایل شما ارسال شد.
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4 text-right">
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="w-full bg-brand text-white font-bold py-3 rounded-xl hover:bg-brand/90 transition disabled:opacity-70"
                        >
                            {form.processing
                                ? "در حال ارسال..."
                                : "ارسال مجدد لینک تایید"}
                        </button>

                        <div className="flex justify-between mt-4 text-sm">
                            <a
                                href={route("profile.show")}
                                className="text-gray-600 dark:text-gray-400 underline hover:text-gray-900 dark:hover:text-gray-100"
                            >
                                ویرایش پروفایل
                            </a>

                            <a
                                href={route("logout")}
                                method="post"
                                as="button"
                                className="text-gray-600 dark:text-gray-400 underline hover:text-gray-900 dark:hover:text-gray-100"
                            >
                                خروج
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
});
