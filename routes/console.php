<?php

use App\Console\Commands\BackupDatabase;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

/*Artisan::command('backup:run', function () {
    $this->call('backup:run');
})->purpose('Run a database backup')->hourly();
*/

Schedule::command('backup:run')->dailyAt('02:00');