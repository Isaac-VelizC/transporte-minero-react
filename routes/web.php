<?php

use App\Http\Controllers\Admin\GeocercasController;
use App\Http\Controllers\Admin\ShipmentsController;
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
    Route::get('/vehicle/form/{id}', [VehiclesController::class, 'edit'])->name('vehicle.edit');
    Route::patch('/vehicle/update/{id}', [VehiclesController::class, 'update'])->name('vehicle.update');
    Route::post('/vehicle/programming', [VehiclesController::class, 'registerConductorVehicle'])->name('vehicle.programming');
    Route::patch('/vehicle/programming/{id}', [VehiclesController::class, 'updateConductorVehicle'])->name('vehicle.programming.update');
    //envios
    Route::get('/envios', [ShipmentsController::class, 'index'])->name('envios.list');
    Route::get('/envios/{id}', [ShipmentsController::class, 'show'])->name('envios.show');
    Route::get('/envios/form/shipments', [ShipmentsController::class, 'create'])->name('envios.create.form');
    Route::post('/envios/store/shipments', [ShipmentsController::class, 'store'])->name('envios.store.form');
    Route::get('/envios/edit/{id}', [ShipmentsController::class, 'edit'])->name('envios.edit');
    Route::patch('/envios/update/{id}', [ShipmentsController::class, 'update'])->name('envios.update.form');
    Route::delete('/envios/delete/{id}', [ShipmentsController::class, 'destroy'])->name('envios.delete');
    ///Perfil
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    //Map
    Route::get('/map', [GeocercasController::class, 'showMap'])->name('view.map');
    Route::get('/geocerca', [GeocercasController::class, 'index'])->name('geocerca.list');
    Route::get('/geocerca/form', [GeocercasController::class, 'create'])->name('geocerca.create');
    Route::post('/geocerca/store', [GeocercasController::class, 'store'])->name('geocerca.store');
    Route::get('/geocerca/edit/{id}', [GeocercasController::class, 'edit'])->name('geocerca.edit');
    Route::patch('/geocerca/edit/update/{id}', [GeocercasController::class, 'update'])->name('geocerca.update');
    Route::delete('/geocerca/delete/{id}', [GeocercasController::class, 'destroy'])->name('geocerca.delete');
});

require __DIR__.'/auth.php';
