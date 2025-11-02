import { cn } from "@/Components/lib/utils";
import { memo } from "react";

export default memo(() => {
    return (
        <nav
            className="fixed bottom-0 inset-x-0 h-14 bg-white/95 dark:bg-card/95 backdrop-blur-md border-t border-b border-ring-light/50 dark:border-ring/50 grid grid-cols-4 items-center z-40"
            aria-label="ناوبری پایین"
        >
            <a
                className="nav-item flex flex-col items-center gap-0.5 text-sm text-muted-light dark:text-muted hover:text-gray-900 dark:hover:text-white transition-colors group active:text-brand"
                href="#"
                data-page="home2.html"
            >
                <span className="group-[.active]:scale-110 transition-transform">
                    <img
                        src="/assets/imgs/home.svg"
                        className="w-[20px] h-[20px] brightness-50 dark:brightness-75 group-[.active]:brightness-100 dark:group-[.active]:brightness-110"
                    />
                </span>
                <span>خانه</span>
            </a>
            <a
                className="nav-item flex flex-col items-center gap-0.5 text-sm text-muted-light dark:text-muted hover:text-gray-900 dark:hover:text-white transition-colors group"
                href="#"
                data-page="cart.html"
            >
                <span className="group-[.active]:scale-110 transition-transform">
                    <img
                        src="/assets/imgs/cart.svg"
                        className="w-[20px] h-[20px] brightness-50 dark:brightness-75 group-[.active]:brightness-100 dark:group-[.active]:brightness-110"
                    />
                </span>
                <span>سبد خرید</span>
            </a>
            <a
                className="nav-item flex flex-col items-center gap-0.5 text-sm text-muted-light dark:text-muted hover:text-gray-900 dark:hover:text-white transition-colors group"
                href="#"
                data-page="fav.html"
            >
                <span className="group-[.active]:scale-110 transition-transform">
                    <img
                        src="/assets/imgs/favorite.svg"
                        className="w-[20px] h-[20px] brightness-50 dark:brightness-75 group-[.active]:brightness-100 dark:group-[.active]:brightness-110"
                    />
                </span>
                <span>مورد علاقه</span>
            </a>
            <a
                className="nav-item flex flex-col items-center gap-0.5 text-sm text-muted-light dark:text-muted hover:text-gray-900 dark:hover:text-white transition-colors group"
                href="#"
                data-page="profile.html"
            >
                <span className="group-[.active]:scale-110 transition-transform">
                    <img
                        src="/assets/imgs/user.svg"
                        className="w-[20px] h-[20px] brightness-50 dark:brightness-75 group-[.active]:brightness-100 dark:group-[.active]:brightness-110"
                    />
                </span>
                <span>پروفایل</span>
            </a>
        </nav>
    );
});
