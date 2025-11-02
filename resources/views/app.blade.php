<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <meta name="theme-color" content="#ffffff" id="theme-color">
    <meta name="msapplication-TileColor" content="#ffffff" id="tile-color">
    <meta name="apple-mobile-web-app-status-bar-style" content="default" id="status-bar-style">
    <meta name="msapplication-navbutton-color" content="#ffffff" id="nav-button-color">
    <meta name="apple-mobile-web-app-status-bar-style" content="default" id="status-bar-style">
    <meta name="format-detection" content="telephone=no">
    <meta name="mobile-web-app-status-bar-style" content="default" id="mobile-status-bar">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-title" content="Shop">

    <link rel="canonical" href="{{ url()->current() }}">

    <!-- Favicon & App Icons -->
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="manifest" href="/site.webmanifest">

    <!-- Styles -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/assets/css/styles.css">

    <!-- Scripts -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="/assets/js/tailwind-config.js"></script>
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead
</head>

<body class="font-vazir min-h-screen transition-colors duration-300 dark:bg-gradient-to-br dark:from-gray-900 dark:to-black bg-gray-50 dark:text-white text-gray-900">
    {{-- <div id="preloader"><div class="loader"></div></div> --}}
    @inertia

    {{-- <script src="/assets/js/app.js"></script>
    <script src="/assets/js/service-worker.js"></script> --}}
</body>

</html>
