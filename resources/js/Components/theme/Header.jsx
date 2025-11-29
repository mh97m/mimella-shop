import { cn } from "@/Components/lib/utils";
import { memo } from "react";

export default memo(() => {
    return (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-white/95 dark:bg-card/95 border-b border-ring-light/50 dark:border-ring/50 shadow-lg">
            <div className="flex items-center justify-between max-w-7xl mx-auto py-2 px-4">
                <div id="header-content">
                    <div
                        className="flex items-center gap-3 cursor-pointer"
                        data-page="home2.html"
                    >
                        <img
                            src="/assets/imgs/logo.png"
                            className="w-10 h-10 rounded-md shadow-md grid place-items-center"
                            aria-hidden="true"
                        />
                        <div>
                            <div className="text-sm text-muted-light dark:text-muted-dark">
                                M i m e l l a
                            </div>
                            <div className="text-lg font-extrabold">
                                میملا شاپ
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        style={{ display: "none" }}
                        className="nav-item p-3 rounded-xl border border-ring-light dark:border-ring-dark bg-white dark:bg-card/80 hover:bg-gray-50 dark:hover:bg-card/60 transition-all flex items-center gap-2"
                        title="سبد"
                        data-page="cart.html"
                    >
                        <span
                            className="min-w-[18px] h-[18px] px-1.5 rounded-full bg-brand text-black text-xs font-extrabold grid place-items-center"
                            id="cartCount2"
                        >
                            0
                        </span>
                        سبد
                    </button>
                </div>
            </div>
        </header>
    );
});
