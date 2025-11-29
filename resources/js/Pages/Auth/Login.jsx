import { useForm, usePage } from "@inertiajs/react";
import { useEffect } from "react";
import { toast, Toaster } from "sonner";
import DefaultLayout from "@/Layouts/DefaultLayout";
import { route } from "ziggy-js";

export default function Login() {
    const { props } = usePage();

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
        <DefaultLayout>
            <Toaster position="top-center" />

            <div className="flex items-center justify-center px-0 pl-4">
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
                            <input
                                type="password"
                                name="password"
                                value={form.data.password}
                                onChange={(e) =>
                                    form.setData("password", e.target.value)
                                }
                                placeholder="رمز عبور خود را وارد کنید"
                                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-brand-2 focus:border-brand-2 outline-none"
                            />
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
        </DefaultLayout>
    );
}
