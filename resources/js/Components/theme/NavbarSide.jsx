import { cn } from "@/Components/lib/utils";
import { memo } from "react";

export default memo(() => {
    return (
        <nav
            className="fixed top-0 right-0 w-80 h-screen bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-l border-gray-200/50 dark:border-gray-700/50 z-50 overflow-y-auto shadow-2xl"
            id="sidebar"
        >
            <div className="relative p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-l from-brand/5 to-transparent">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand to-brand-2 shadow-lg flex items-center justify-center">
                        <img
                            src="/assets/imgs/logo.png"
                            className="w-8 h-8 rounded-lg"
                            alt="Clickly"
                        />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            Clickly
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            فروشگاه آنلاین
                        </p>
                    </div>
                </div>
            </div>

            <div className="py-1">
                <div className="mb-1">
                    <button
                        data-toggle="MenuHome"
                        className="w-full text-right flex items-center justify-between gap-3 px-4 py-2 hover:bg-gradient-to-l hover:from-brand/10 hover:to-brand-2/5 transition-all duration-300 group"
                    >
                        <span className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <img
                                    src="/assets/imgs/home.svg"
                                    className="w-5 h-5 brightness-0 invert"
                                />
                            </div>
                            <span className="font-semibold text-gray-800 dark:text-gray-200">
                                خانه و وبلاگ
                            </span>
                        </span>
                        <svg
                            className="toggle-arrow w-5 h-5 transition-all duration-300 text-gray-400 group-hover:text-brand"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>

                    <ul
                        id="MenuHome"
                        className="hidden flex-col mt-2 mx-4 rounded-xl bg-gray-50/50 dark:bg-gray-800/30 overflow-hidden"
                    >
                        <li>
                            <a
                                href="#"
                                data-page="home2.html"
                                className="block px-6 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/50 hover:text-brand transition-all duration-200 border-r-3 border-transparent hover:border-brand"
                            >
                                صفحه نخست 1
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                data-page="home.html"
                                className="block px-6 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/50 hover:text-brand transition-all duration-200 border-r-3 border-transparent hover:border-brand"
                            >
                                صفحه نخست 2
                            </a>
                        </li>
                        <li className="border-t border-gray-200/50 dark:border-gray-700/50 my-1"></li>
                        <li>
                            <a
                                href="#"
                                data-page="blog.html"
                                className="block px-6 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/50 hover:text-brand transition-all duration-200 border-r-3 border-transparent hover:border-brand"
                            >
                                وبلاگ 1
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                data-page="blog2.html"
                                className="block px-6 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/50 hover:text-brand transition-all duration-200 border-r-3 border-transparent hover:border-brand"
                            >
                                وبلاگ 2
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                data-page="post.html"
                                className="block px-6 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/50 hover:text-brand transition-all duration-200 border-r-3 border-transparent hover:border-brand"
                            >
                                صفحه پست
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="mb-1">
                    <button
                        data-toggle="MenuPayment"
                        className="w-full text-right flex items-center justify-between gap-3 px-4 py-2 hover:bg-gradient-to-l hover:from-brand/10 hover:to-brand-2/5 transition-all duration-300 group"
                    >
                        <span className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <img
                                    src="/assets/imgs/cart.svg"
                                    className="w-5 h-5 brightness-0 invert"
                                />
                            </div>
                            <span className="font-semibold text-gray-800 dark:text-gray-200">
                                خرید و پرداخت
                            </span>
                        </span>
                        <svg
                            className="toggle-arrow w-5 h-5 transition-all duration-300 text-gray-400 group-hover:text-brand"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>

                    <ul
                        id="MenuPayment"
                        className="hidden flex-col mt-2 mx-4 rounded-xl bg-gray-50/50 dark:bg-gray-800/30 overflow-hidden"
                    >
                        <li>
                            <a
                                href="#"
                                data-page="cart.html"
                                className="block px-6 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/50 hover:text-brand transition-all duration-200 border-r-3 border-transparent hover:border-brand"
                            >
                                سبد خرید 1
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                data-page="cart2.html"
                                className="block px-6 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/50 hover:text-brand transition-all duration-200 border-r-3 border-transparent hover:border-brand"
                            >
                                سبد خرید 2
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                data-page="cart3.html"
                                className="block px-6 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/50 hover:text-brand transition-all duration-200 border-r-3 border-transparent hover:border-brand"
                            >
                                سبد خرید خالی
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                data-page="payment_method.html"
                                className="block px-6 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/50 hover:text-brand transition-all duration-200 border-r-3 border-transparent hover:border-brand"
                            >
                                روش های پرداخت
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                data-page="payment_method2.html"
                                className="block px-6 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/50 hover:text-brand transition-all duration-200 border-r-3 border-transparent hover:border-brand"
                            >
                                کارت های بانکی
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                data-page="near.html"
                                className="block px-6 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/50 hover:text-brand transition-all duration-200 border-r-3 border-transparent hover:border-brand"
                            >
                                فروشگاه های نزدیک
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="mb-1">
                    <button
                        data-toggle="MenuOrders"
                        className="w-full text-right flex items-center justify-between gap-3 px-4 py-2 hover:bg-gradient-to-l hover:from-brand/10 hover:to-brand-2/5 transition-all duration-300 group"
                    >
                        <span className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <img
                                    src="/assets/imgs/card.svg"
                                    className="w-5 h-5 brightness-0 invert"
                                />
                            </div>
                            <span className="font-semibold text-gray-800 dark:text-gray-200">
                                سفارشات
                            </span>
                        </span>
                        <svg
                            className="toggle-arrow w-5 h-5 transition-all duration-300 text-gray-400 group-hover:text-brand"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>

                    <ul
                        id="MenuOrders"
                        className="hidden flex-col mt-2 mx-4 rounded-xl bg-gray-50/50 dark:bg-gray-800/30 overflow-hidden"
                    >
                        <li>
                            <a
                                href="#"
                                data-page="orders.html"
                                className="block px-6 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/50 hover:text-brand transition-all duration-200 border-r-3 border-transparent hover:border-brand"
                            >
                                دمو 1
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                data-page="orders2.html"
                                className="block px-6 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/50 hover:text-brand transition-all duration-200 border-r-3 border-transparent hover:border-brand"
                            >
                                دمو 2
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="mb-1">
                    <button
                        data-toggle="MenuAllProducts"
                        className="w-full text-right flex items-center justify-between gap-3 px-4 py-2 hover:bg-gradient-to-l hover:from-brand/10 hover:to-brand-2/5 transition-all duration-300 group"
                    >
                        <span className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <img
                                    src="/assets/imgs/product.svg"
                                    className="w-5 h-5 brightness-0 invert"
                                />
                            </div>
                            <span className="font-semibold text-gray-800 dark:text-gray-200">
                                همه محصولات
                            </span>
                        </span>
                        <svg
                            className="toggle-arrow w-5 h-5 transition-all duration-300 text-gray-400 group-hover:text-brand"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>

                    <ul
                        id="MenuAllProducts"
                        className="hidden flex-col mt-2 mx-4 rounded-xl bg-gray-50/50 dark:bg-gray-800/30 overflow-hidden"
                    >
                        <li>
                            <a
                                href="#"
                                data-page="all.html"
                                className="block px-6 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/50 hover:text-brand transition-all duration-200 border-r-3 border-transparent hover:border-brand"
                            >
                                دمو 1
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                data-page="all2.html"
                                className="block px-6 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/50 hover:text-brand transition-all duration-200 border-r-3 border-transparent hover:border-brand"
                            >
                                دمو 2
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                data-page="all3.html"
                                className="block px-6 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/50 hover:text-brand transition-all duration-200 border-r-3 border-transparent hover:border-brand"
                            >
                                دمو 3
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                data-page="all4.html"
                                className="block px-6 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/50 hover:text-brand transition-all duration-200 border-r-3 border-transparent hover:border-brand"
                            >
                                دمو 4
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                data-page="all5.html"
                                className="block px-6 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/50 hover:text-brand transition-all duration-200 border-r-3 border-transparent hover:border-brand"
                            >
                                دمو 5
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                data-page="product.html"
                                className="block px-6 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/50 hover:text-brand transition-all duration-200 border-r-3 border-transparent hover:border-brand"
                            >
                                صفحه محصول
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                data-page="cats.html"
                                className="block px-6 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/50 hover:text-brand transition-all duration-200 border-r-3 border-transparent hover:border-brand"
                            >
                                دسته بندی محصولات
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="mb-1">
                    <button
                        data-toggle="MenuAccount"
                        className="w-full text-right flex items-center justify-between gap-3 px-4 py-2 hover:bg-gradient-to-l hover:from-brand/10 hover:to-brand-2/5 transition-all duration-300 group"
                    >
                        <span className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <img
                                    src="/assets/imgs/user.svg"
                                    className="w-5 h-5 brightness-0 invert"
                                />
                            </div>
                            <span className="font-semibold text-gray-800 dark:text-gray-200">
                                حساب کاربری
                            </span>
                        </span>
                        <svg
                            className="toggle-arrow w-5 h-5 transition-all duration-300 text-gray-400 group-hover:text-brand"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>

                    <ul
                        id="MenuAccount"
                        className="hidden flex-col mt-2 mx-4 rounded-xl bg-gray-50/50 dark:bg-gray-800/30 overflow-hidden"
                    >
                        <li>
                            <a
                                href="#"
                                data-page="profile.html"
                                className="block px-6 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/50 hover:text-brand transition-all duration-200 border-r-3 border-transparent hover:border-brand"
                            >
                                پروفایل 1
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                data-page="profile2.html"
                                className="block px-6 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/50 hover:text-brand transition-all duration-200 border-r-3 border-transparent hover:border-brand"
                            >
                                پروفایل 2
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                data-page="profile3.html"
                                className="block px-6 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/50 hover:text-brand transition-all duration-200 border-r-3 border-transparent hover:border-brand"
                            >
                                پروفایل 3
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                data-page="edit-profile.html"
                                className="block px-6 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/50 hover:text-brand transition-all duration-200 border-r-3 border-transparent hover:border-brand"
                            >
                                ویرایش پروفایل
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                data-page="login.html"
                                className="block px-6 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/50 hover:text-brand transition-all duration-200 border-r-3 border-transparent hover:border-brand"
                            >
                                فرم ورود
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                data-page="register.html"
                                className="block px-6 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/50 hover:text-brand transition-all duration-200 border-r-3 border-transparent hover:border-brand"
                            >
                                فرم ثبت نام
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                data-page="forget.html"
                                className="block px-6 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/50 hover:text-brand transition-all duration-200 border-r-3 border-transparent hover:border-brand"
                            >
                                فرم تغییر رمز عبور
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                data-page="otp.html"
                                className="block px-6 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/50 hover:text-brand transition-all duration-200 border-r-3 border-transparent hover:border-brand"
                            >
                                فرم OTP
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                data-page="address.html"
                                className="block px-6 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/50 hover:text-brand transition-all duration-200 border-r-3 border-transparent hover:border-brand"
                            >
                                تغییر آدرس پیشفرض
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                data-page="address2.html"
                                className="block px-6 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/50 hover:text-brand transition-all duration-200 border-r-3 border-transparent hover:border-brand"
                            >
                                تغییر آدرس پیشفرض 2
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="mb-1">
                    <button
                        data-toggle="MenuFav"
                        className="w-full text-right flex items-center justify-between gap-3 px-4 py-2 hover:bg-gradient-to-l hover:from-brand/10 hover:to-brand-2/5 transition-all duration-300 group"
                    >
                        <span className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <img
                                    src="/assets/imgs/favorite.svg"
                                    className="w-5 h-5 brightness-0 invert"
                                />
                            </div>
                            <span className="font-semibold text-gray-800 dark:text-gray-200">
                                علاقه مندی ها
                            </span>
                        </span>
                        <svg
                            className="toggle-arrow w-5 h-5 transition-all duration-300 text-gray-400 group-hover:text-brand"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>

                    <ul
                        id="MenuFav"
                        className="hidden flex-col mt-2 mx-4 rounded-xl bg-gray-50/50 dark:bg-gray-800/30 overflow-hidden"
                    >
                        <li>
                            <a
                                href="#"
                                data-page="fav.html"
                                className="block px-6 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/50 hover:text-brand transition-all duration-200 border-r-3 border-transparent hover:border-brand"
                            >
                                دمو 1
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                data-page="fav2.html"
                                className="block px-6 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/50 hover:text-brand transition-all duration-200 border-r-3 border-transparent hover:border-brand"
                            >
                                دمو 2
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                data-page="fav3.html"
                                className="block px-6 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/50 hover:text-brand transition-all duration-200 border-r-3 border-transparent hover:border-brand"
                            >
                                دمو 3 (لیست خالی)
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="space-y-1 mt-2 pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
                    <a
                        href="#"
                        data-page="contact.html"
                        className="flex items-center gap-4 px-4 py-2 hover:bg-gradient-to-l hover:from-brand/10 hover:to-brand-2/5 transition-all duration-300 group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <img
                                src="/assets/imgs/support.svg"
                                className="w-5 h-5 brightness-0 invert"
                            />
                        </div>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                            تماس با ما
                        </span>
                    </a>
                    <a
                        href="#"
                        data-page="about.html"
                        className="flex items-center gap-4 px-4 py-2 hover:bg-gradient-to-l hover:from-brand/10 hover:to-brand-2/5 transition-all duration-300 group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <img
                                src="/assets/imgs/info.svg"
                                className="w-5 h-5 brightness-0 invert"
                            />
                        </div>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                            درباره ما
                        </span>
                    </a>
                </div>
            </div>
        </nav>
    );
});
