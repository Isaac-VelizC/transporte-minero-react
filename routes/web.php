<?php

use App\Http\Controllers\Admin\ConductorController;
use App\Http\Controllers\Admin\DeviceController;
use App\Http\Controllers\Admin\GeocercasController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\ShipmentsController;
use App\Http\Controllers\Admin\UsersController;
use App\Http\Controllers\Admin\VehiclesController;
use App\Http\Controllers\BackupController;
use App\Http\Controllers\ClientDriverController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RutaController;
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

Route::get('/dashboard', [HomeController::class, 'dashboardPage'])->middleware(['auth', 'verified'])->name('dashboard');


Route::middleware(['auth', 'checkRole:Admin|Secretaria|Encargado_Control'])->group(function () {
    Route::get('/admin/copias-de-seguridad', [BackupController::class, 'pageCopiasSeguridad'])->name('admin.page.packups');
    Route::post('/backups/run', [BackupController::class, 'runBackup'])->name('backup.run');
    Route::get('/backups/download/{file}', [BackupController::class, 'downloadBackup'])->name('backup.download');
    Route::get('/backup/delete/{name}', [BackupController::class, 'deleteBackup'])->name('backup.delete');
    ///Users
    Route::get('/users', [UsersController::class, 'index'])->name('user.list');
    Route::post('/users', [UsersController::class, 'store'])->name('user.create');
    Route::patch('/users/{id}/{id_persona}', [UsersController::class, 'update'])->name('user.update');
    Route::delete('/users/{id}', [UsersController::class, 'destroy'])->name('user.destroy');
    Route::get('/users/password/reestablcer/{id}', [UsersController::class, 'reestablecerPasswordUser'])->name('user.password.restore');
    //Clients
    Route::get('/users/clients/historial/{id}', [UsersController::class, 'historialEnviosCliente'])->name('client.history.list');
    Route::get('/users/clients', [UsersController::class, 'listClients'])->name('clients.list');
    Route::post('/users/clients', [UsersController::class, 'storeCliente'])->name('client.create');
    Route::patch('/users/clients/{id}/{id_persona}', [UsersController::class, 'updateCliente'])->name('client.update');
    ///Conductor
    Route::get('/drivers/list', [UsersController::class, 'listConductores'])->name('drivers.list');
    Route::get('/driver/form', [ConductorController::class, 'create'])->name('driver.create');
    Route::post('/driver/store', [ConductorController::class, 'store'])->name('driver.store');
    Route::get('/driver/form/edit/{id}', [ConductorController::class, 'edit'])->name('driver.edit');
    Route::patch('/driver/form/update/{id}/{id_persona}/{id_driver}', [ConductorController::class, 'update'])->name('driver.update');
    //Vehicle
    Route::get('/vehicle', [VehiclesController::class, 'index'])->name('vehicle.list');
    Route::get('/vehicle/form', [VehiclesController::class, 'create'])->name('vehicle.create');
    Route::post('/vehicle/store', [VehiclesController::class, 'store'])->name('vehicle.store');
    Route::get('/vehicle/show/{id}', [VehiclesController::class, 'show'])->name('vehicle.show');
    Route::get('/vehicle/form/{id}', [VehiclesController::class, 'edit'])->name('vehicle.edit');
    Route::patch('/vehicle/update/{id}', [VehiclesController::class, 'update'])->name('vehicle.update');
    Route::delete('/vehicle/{id}', [VehiclesController::class, 'destroy'])->name('vehicle.destroy');

    Route::get('/vehicle/programmings', [VehiclesController::class, 'listSchedules'])->name('schedule.list');
    Route::post('/vehicle/programming', [VehiclesController::class, 'registerConductorVehicle'])->name('vehicle.programming');
    Route::patch('/vehicle/programming/{id}', [VehiclesController::class, 'updateConductorVehicle'])->name('vehicle.programming.update');
    Route::get('/vehicle/programming/{id}/cancel', [VehiclesController::class, 'cancelScheduleVehicle'])->name('vehicle.programming.cancel');
    Route::delete('/vehicle/programming/{id}/delete', [VehiclesController::class, 'deleteScheduleVehicle'])->name('vehicle.programming.delete');
    Route::post('/vehicle/programming/{id}/reasignacion', [VehiclesController::class, 'reasignacionDriverVehicleEnvio'])->name('vehicle.programming.reasignacion');
    Route::get('/api/available-resources', [VehiclesController::class, 'availableResources']);
    Route::get('/all/envios/map', [VehiclesController::class, 'viewMapEnviosAll'])->name('all.map.envios');
    // Mantenimientos
    Route::get('/vehicle/mantenimientos', [VehiclesController::class, 'listMantenimientos'])->name('mantenimiento.list');
    Route::post('/vehicle/mantenimiento', [VehiclesController::class, 'storeMantenimientoVehicle'])->name('mantenimiento.store');
    Route::patch('/vehicle/mantenimiento/{id}', [VehiclesController::class, 'updateMantenimientoVehicle'])->name('mantenimiento.update');
    Route::delete('/vehicle/mantenimiento/{id}', [VehiclesController::class, 'destroyMantenimientoVehicle'])->name('mantenimiento.delete');
    //envios
    Route::get('/envios', [ShipmentsController::class, 'index'])->name('envios.list');
    Route::get('/envios/{id}', [ShipmentsController::class, 'show'])->name('envios.show');
    Route::get('/envios/form/shipments', [ShipmentsController::class, 'create'])->name('envios.create.form');
    Route::post('/envios/store/shipments', [ShipmentsController::class, 'store'])->name('envios.store.form');
    Route::get('/envios/edit/{id}', [ShipmentsController::class, 'edit'])->name('envios.edit');
    Route::patch('/envios/update/{id}', [ShipmentsController::class, 'update'])->name('envios.update.form');
    Route::patch('/envios/delete/{id}', [ShipmentsController::class, 'changeStatus'])->name('envios.delete');
    ///Perfil
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    //Map
    Route::get('/map/{id}/envio', [GeocercasController::class, 'showMap'])->name('view.map');
    Route::get('/geocerca', [GeocercasController::class, 'index'])->name('geocerca.list');
    Route::get('/geocerca/form', [GeocercasController::class, 'create'])->name('geocerca.create');
    Route::post('/geocerca/store', [GeocercasController::class, 'store'])->name('geocerca.store');
    Route::get('/geocerca/edit/{id}', [GeocercasController::class, 'edit'])->name('geocerca.edit');
    Route::patch('/geocerca/edit/update/{id}', [GeocercasController::class, 'update'])->name('geocerca.update');
    Route::delete('/geocerca/delete/{id}', [GeocercasController::class, 'destroy'])->name('geocerca.delete');
    //devices
    Route::get('/devices', [DeviceController::class, 'index'])->name('devices.list');
    Route::post('/devices', [DeviceController::class, 'store'])->name('devices.create');
    Route::patch('/devices/{id}', [DeviceController::class, 'update'])->name('devices.update');
    Route::put('/devices/{id}/storage', [DeviceController::class, 'updateStorageDevice'])->name('devices.update.storage');
    //Route::get('/devices/locations', [DeviceController::class, 'getLocations']);
    //Reports
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.view');
    Route::post('/reports/filter', [ReportController::class, 'filterConsult'])->name('admin.reports.filter');
    ///Altecados
    Route::get('/altercados/{id}', [ShipmentsController::class, 'altercationsListControler'])->name('altercados.list');
    Route::post('/message/send/control', [HomeController::class, 'sendMessageControl'])->name('send.message.control');
    Route::get('/messages', [HomeController::class, 'viewMessage'])->name('view.message');

    // Notification
    Route::get('/notification/{id}', [NotificationController::class, 'show'])->name('admin.notification');
    Route::get('/notifications', [NotificationController::class, 'index'])->name('all.notification');
    //Route::delete('/notification/{id}', [NotificationController::class, 'delete'])->name('notification.delete');
});

Route::middleware(['auth', 'checkRole:Conductor'])->group(function () {
    Route::get('/driver/envios/', [ShipmentsController::class, 'listEnviosConductor'])->name('driver.envios.list');
    Route::get('/driver/envios/{id}/status', [ClientDriverController::class, 'changeStatusShipment'])->name('driver.envios.status');
    Route::post('/driver/envios/renuncia', [ClientDriverController::class, 'renunciaEnvio'])->name('driver.envios.renuncia');

    Route::get('/driver/envio/show/{id}', [ClientDriverController::class, 'showEnvio'])->name('driver.envio.show');
    Route::get('/driver/show/map', [ClientDriverController::class, 'showMapMonitoreo'])->name('driver.show.map');
    Route::get('/driver/mantenimientos/', [ClientDriverController::class, 'mantenimientosVehiculosList'])->name('driver.mantenimientos.list');
    Route::post('/devices/{id}/location/{envio_id}', [ClientDriverController::class, 'updateLocationDevice']);
    Route::patch('/driver/mantenimiento/{id}/confirm', [ClientDriverController::class, 'updateEstatusMantenimiento'])->name('driver.confirm.status');
    Route::get('/driver/create/form/altercado/{id}', [ClientDriverController::class, 'createAltercado'])->name('create.altercation');
    Route::post('driver/store/artercado', [ClientDriverController::class, 'storeReporteAltercados'])->name('driver.store.altercado');
    Route::patch('/driver/envios/{id}/confirm', [ClientDriverController::class, 'confirmEntrega'])->name('client.envios.status');
});

Route::post('/ruta_devices', [RutaController::class, 'guardarPunto']);
Route::get('/ruta_devices/{envio_id}/ruta/{device_id}', [RutaController::class, 'obtenerRuta']);
Route::get('/envios/{envio_id}/rutas', [RutaController::class, 'obtenerRutaAll']);
Route::get('/api/user', [RutaController::class, 'getUser']);
Route::get('/api/envio/activo', [RutaController::class, 'getEnvioActivo']);
Route::post('/api/sync-route/', [RutaController::class, 'updateRutasOffline']);
Route::get('/api/travel-time', [RutaController::class, 'getTravelTime']);

Route::middleware(['auth', 'checkRole:Cliente'])->group(function () {
    Route::get('/client/pedidos/', [ShipmentsController::class, 'listEnviosCliente'])->name('client.pedido.list');
    Route::get('/client/envio/show/{id}', [ClientDriverController::class, 'showEnvioClient'])->name('client.envio.show');
    Route::post('/message/send', [HomeController::class, 'sendMessage'])->name('send.message');
});

//Route::get('/devices/{id}/location/{envio_id}/monitoreo', [DeviceController::class, 'updateDeviceRutMap'])->name('device.monitoreo.put');
Route::post('/update-devices-ruta', [DeviceController::class, 'updateDevicesRutaMap'])->name('device.monitoreo.post');
Route::get('/list/devices/actives', [DeviceController::class, 'listDevicesActive'])->name('list.device.active');
Route::get('error', [HomeController::class, 'errorPage'])->name('error.page');
require __DIR__ . '/auth.php';
