import { useForm, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import DefaultLayout from "@/Layouts/DefaultLayout";
import { route } from "ziggy-js";

export default function Login() {
    const { props } = usePage();

    const [passwordInputType, setPasswordInputType] = useState(true);

    // Inertia form
    const form = useForm({
        mobile: "",
        password: "",
        remember: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        form.post(route("login"), {
            onFinish: () => form.reset("password"),
        });
    };

    // Flash message toast
    useEffect(() => {
        if (props.flash?.error) toast.error(props.flash.error);
        if (props.flash?.success) toast.success(props.flash.success);
    }, [props.flash]);

    return (
        <main className="max-w-7xl mx-auto py-4 pb-20 min-h-[calc(100vh-3.5rem)] px-0 mx-0 pr-4">
            <Toaster position="top-center" />

            <div className="flex items-center justify-center px-1 pl-4">
                <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow rounded-2xl p-6 space-y-6 text-center">
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
                        ورود به حساب کاربری
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        برای ادامه وارد حساب خود شوید
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4 text-right"
                    >
                        <div>
                            <label className="block mb-1 text-sm text-gray-600 dark:text-gray-300">
                                شماره موبایل
                            </label>
                            <input
                                type="mobile"
                                name="mobile"
                                value={form.data.mobile}
                                onChange={(e) =>
                                    form.setData("mobile", e.target.value)
                                }
                                placeholder="شماره موبایل خود را وارد کنید"
                                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-brand-2 focus:border-brand-2 outline-none"
                            />
                            {form.errors.mobile && (
                                <p className="text-sm text-red-500 mt-1">
                                    {form.errors.mobile}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-1 text-sm text-gray-600 dark:text-gray-300">
                                رمز عبور
                            </label>
                            <div class="relative">
                                <input
                                    type={
                                        passwordInputType ? "password" : "text"
                                    }
                                    name="password"
                                    value={form.data.password}
                                    onChange={(e) =>
                                        form.setData("password", e.target.value)
                                    }
                                    placeholder="رمز عبور خود را وارد کنید"
                                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-brand-2 focus:border-brand-2 outline-none"
                                />

                                <span
                                    className="absolute left-3 top-2.5 text-gray-400 cursor-pointer"
                                    onClick={() =>
                                        setPasswordInputType(!passwordInputType)
                                    }
                                >
                                    {passwordInputType ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            fill="currentColor"
                                            class="bi bi-eye-slash"
                                            viewBox="0 0 16 16"
                                        >
                                            <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z" />
                                            <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" />
                                            <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z" />
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            fill="currentColor"
                                            class="bi bi-eye-fill"
                                            viewBox="0 0 16 16"
                                        >
                                            <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                                            <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                                        </svg>
                                    )}
                                </span>
                            </div>
                            {form.errors.password && (
                                <p className="text-sm text-red-500 mt-1">
                                    {form.errors.password}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={form.processing}
                            className="block w-full bg-brand text-white font-bold py-3 rounded-xl text-center hover:bg-brand/90 transition disabled:opacity-70"
                        >
                            {form.processing ? "در حال ورود..." : "ورود"}
                        </button>

                        <div className="text-right text-sm">
                            <a
                                href={route("password.request")}
                                className="text-brand hover:underline"
                            >
                                رمز عبور خود را فراموش کرده‌اید؟
                            </a>
                        </div>
                    </form>

                    <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                        هنوز حساب کاربری ندارید؟{" "}
                        <a
                            href={route("register")}
                            className="text-brand hover:underline"
                        >
                            ثبت‌نام کنید
                        </a>
                    </div>
                </div>
            </div>
        </main>
    );
}
