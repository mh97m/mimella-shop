import { cn } from "@/Components/lib/utils";
import { memo } from "react";

export default memo(() => {
    return (
        <div
            id="exitModal"
            className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 opacity-0 pointer-events-none transition-opacity duration-300"
        >
            <div className="bg-white dark:bg-card rounded-2xl p-6 max-w-sm w-full shadow-2xl transform scale-95 transition-transform duration-300">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                        <svg
                            className="w-8 h-8 text-red-600 dark:text-red-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold mb-2">خروج از برنامه</h3>
                    <p className="text-muted-light dark:text-muted-dark mb-6">
                        آیا مطمئن هستید که می‌خواهید از برنامه خارج شوید؟
                    </p>

                    <div className="flex gap-3">
                        <button
                            id="exitCancel"
                            className="flex-1 px-4 py-2 rounded-xl border border-ring-light dark:border-ring text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-card/60 transition-colors"
                        >
                            انصراف
                        </button>
                        <button
                            id="exitConfirm"
                            className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors"
                        >
                            خروج
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
});
