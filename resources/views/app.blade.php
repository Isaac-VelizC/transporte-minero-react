<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'Benjamin') }}</title>
    <link rel="shortcut icon" type="image/png" href="assets/images/icon.png">
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!--     Fonts and icons     -->
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet" />
    <!-- Font Awesome Icons -->
    <script src="https://kit.fontawesome.com/42d5adcbca.js" crossorigin="anonymous"></script>

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
    @inertiaHead
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">

    <!-- Custom styles for this template -->
    <link href="{{ asset('assets/css/style.css')}}" rel="stylesheet">

</head>

<body class="m-0 font-sans text-base antialiased font-normal leading-default text-slate-500">
    @inertia
</body>

</html>