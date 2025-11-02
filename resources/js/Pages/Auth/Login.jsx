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
import { Checkbox } from "@/Components/shadcn/ui/checkbox";
import { Input } from "@/Components/shadcn/ui/input";
import { Label } from "@/Components/shadcn/ui/label";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/Components/shadcn/ui/tabs";
import SocialLoginButton from "@/Components/SocialLoginButton";
import { useSeoMetaTags } from "@/Composables/useSeoMetaTags";
import { Link, useForm, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { route } from "ziggy-js";
import DefaultLayout from '@/Layouts/DefaultLayout'

export default function Login({
    canResetPassword,
    status,
    availableOauthProviders,
}) {
    const { props } = usePage();
    const [activeTab, setActiveTab] = useState(() => {
        try {
            return localStorage.getItem("login-active-tab") || "password";
        } catch {
            return "password";
        }
    });

    // Form state
    const passwordForm = useForm({
        email: "test@example.com",
        password: "password",
        remember: false,
    });

    const loginLinkForm = useForm({
        email: "",
    });

    // Computed
    const hasOauthProviders =
        Object.keys(availableOauthProviders || {}).length > 0;
    const isProcessing = passwordForm.processing || loginLinkForm.processing;

    // Methods
    const handlePasswordLogin = (e) => {
        e.preventDefault();
        passwordForm.post(route("login"), {
            onFinish: () => passwordForm.reset("password"),
        });
    };

    const handleLoginLink = (e) => {
        e.preventDefault();
        loginLinkForm.post(route("login-link.store"), {
            onSuccess: () => {
                loginLinkForm.reset();
                if (props.flash.success) {
                    toast.success(props.flash.success);
                }
            },
            onError: () => {
                if (props.flash.error) {
                    toast.error(props.flash.error);
                }
            },
        });
    };

    // Effects
    useEffect(() => {
        if (props.flash.error) {
            toast.error(props.flash.error);
        }

        if (props.flash.success) {
            toast.success(props.flash.success);
        }
    }, [props.flash]);

    useEffect(() => {
        try {
            localStorage.setItem("login-active-tab", activeTab);
        } catch {}
    }, [activeTab]);

    // SEO
    useSeoMetaTags({
        title: "Log in",
    });

    return (
        <DefaultLayout>
            <Toaster position="top-center" />

            <div className="flex items-center justify-center px-0 pl-4">
                <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow rounded-2xl p-6 space-y-6 text-center">
                    <div className="flex justify-center">
                        <div className="w-20 h-20 flex items-center justify-center rounded-lg">
                            <img src="assets/imgs/logo.png" alt="Clickly" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                        ورود به حساب کاربری
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        برای ادامه وارد حساب خود شوید
                    </p>

                    <form action="#" method="POST" className="space-y-4 text-right">
                        <div>
                            <label className="block mb-1 text-sm text-gray-600 dark:text-gray-300">
                                نام کاربری
                            </label>
                            <input
                                type="text"
                                name="username"
                                placeholder="نام کاربری خود را وارد کنید"
                                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-brand-2 focus:border-brand-2 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm text-gray-600 dark:text-gray-300">
                                رمز عبور
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="رمز عبور خود را وارد کنید"
                                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-brand-2 focus:border-brand-2 outline-none"
                                />
                                <span className="absolute left-3 top-2.5 text-gray-400 cursor-pointer">
                                    👁️
                                </span>
                            </div>
                        </div>

                        <a
                            href="#"
                            data-page="otp.html"
                            className="block w-full bg-brand text-white font-bold py-3 rounded-xl text-center hover:bg-brand/90 transition"
                        >
                            ورود
                        </a>

                        <div className="text-right text-sm">
                            <a
                                href="#"
                                data-page="forget.html"
                                className="text-brand hover:underline"
                            >
                                رمز عبور خود را فراموش کرده‌اید؟
                            </a>
                        </div>
                    </form>

                    <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                        هنوز حساب کاربری ندارید؟
                        <a
                            href="#"
                            data-page="register.html"
                            className="text-brand hover:underline"
                        >
                            ثبت‌نام کنید
                        </a>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
}
