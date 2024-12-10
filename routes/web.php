<?php

use App\Http\Controllers\Admin\UsersController;
use App\Http\Controllers\Admin\VehiclesController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    ///Users
    Route::get('/users', [UsersController::class, 'index'])->name('user.list');
    Route::post('/users', [UsersController::class, 'store'])->name('user.create');
    Route::patch('/users/{id}', [UsersController::class, 'update'])->name('user.update');
    Route::delete('/users/{id}', [UsersController::class, 'destroy'])->name('user.destroy');
    //Vehicle
    Route::get('/vehicle', [VehiclesController::class, 'index'])->name('vehicle.list');
    Route::get('/vehicle/form', [VehiclesController::class, 'create'])->name('vehicle.create');
    Route::post('/vehicle/store', [VehiclesController::class, 'store'])->name('vehicle.store');
    Route::get('/vehicle/show/{id}', [VehiclesController::class, 'show'])->name('vehicle.show');
    Route::patch('/vehicle/update/{id}', [VehiclesController::class, 'update'])->name('vehicle.update');
    ///Perfil
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
