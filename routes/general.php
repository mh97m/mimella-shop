<?php

declare(strict_types=1);

use Carbon\Carbon;
use Hekmatinasser\Verta\Verta;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;

use function Laravel\Prompts\outro;

// ##########################################################################
// ########################## CLEAR REDIS CACHES ############################
// ##########################################################################
Artisan::command('redis:clear {pattern="*"}', function ($pattern) {
    $pattern = str_replace('"', '', $pattern);

    redisDel($pattern);

    $this->newLine();
    $this->info('redis caches has been cleared successfully');

    return Command::SUCCESS;
})->purpose('clear redis caches');
// ##########################################################################
// ##########################################################################
// ##########################################################################

// ##########################################################################
// ############################### CLEAR LOG ################################
// ##########################################################################
Artisan::command('log:clear', function () {
    exec('rm -f '.storage_path('logs/*.log'));
    exec('rm -f '.storage_path('logs/*.json'));
    exec('rm -f '.storage_path('app/logs/*'));
    exec('rm -f '.storage_path('debugbar/*.json'));
    exec('rm -f '.base_path('*.log'));
    $this->newLine();
    $this->info('logs has been cleared successfully');

    return Command::SUCCESS;
})->purpose('clear log files');
// ##########################################################################
// ##########################################################################
// ##########################################################################

// ##########################################################################
// ############################### MOVE LOG #################################
// ##########################################################################
Artisan::command('log:move', function () {
    // Create a new folder with the current timestamp
    $newFolder = storage_path('logs').'/'.now()->format('Y-m-d');
    exec('mkdir '.$newFolder);

    exec('mkdir '.$newFolder.'/laravel');
    exec('mkdir '.$newFolder.'/php-fpm');
    exec('mkdir '.$newFolder.'/nginx');
    exec('mkdir '.$newFolder.'/mongodb');
    exec('mkdir '.$newFolder.'/redis');
    exec('mkdir '.$newFolder.'/supervisor');

    // Function to handle moving files with renaming if file already exists
    function moveFile($source, $destination)
    {
        if (file_exists($destination)) {
            $info = pathinfo($destination);
            $base = $info['dirname'].DIRECTORY_SEPARATOR.$info['filename'];
            $ext = empty($info['extension']) ? '' : '.'.$info['extension'];
            $i = 1;
            while (file_exists($destination = $base.'_'.$i.$ext)) {
                $i++;
            }
        }

        return rename($source, $destination);
    }

    // Move laravel log files to the new folder
    foreach (glob(storage_path('logs').'/*.*') as $file) {
        moveFile($file, "{$newFolder}/laravel/".basename($file));
    }

    // Move php-fpm log files to the new folder
    foreach (glob('/var/log/php*fpm.log*') as $file) {
        moveFile($file, "{$newFolder}/php-fpm/".basename($file));
    }

    // Move nginx log files to the new folder
    foreach (glob('/var/log/nginx/*') as $file) {
        moveFile($file, "{$newFolder}/nginx/".basename($file));
    }

    // Move mongodb log files to the new folder
    foreach (glob('/var/log/mongodb/*') as $file) {
        moveFile($file, "{$newFolder}/mongodb/".basename($file));
    }

    // Move redis log files to the new folder
    foreach (glob('/var/log/redis/*') as $file) {
        moveFile($file, "{$newFolder}/redis/".basename($file));
    }

    // Move supervisor log files to the new folder
    foreach (glob('/var/log/supervisor/*') as $file) {
        moveFile($file, "{$newFolder}/supervisor/".basename($file));
    }

    $this->newLine();
    $this->info('Logs have been moved successfully');

    // Remove folders older than 7 days
    $oldFolders = File::directories(storage_path('logs'));
    $sevenDaysAgo = now()->subDays(30);

    foreach ($oldFolders as $folder) {
        $folderTimestamp = File::lastModified($folder);

        if ($folderTimestamp < $sevenDaysAgo->timestamp) {
            exec('rm -rf '.$folder);
            $this->info("Removed old log folder: $folder");
        }
    }

    // Create a new folder with the current timestamp for api calls
    $newFolder = storage_path('app/logs').'/'.now()->format('Y-m-d');
    exec('mkdir '.$newFolder);
    // Move api calls log files to the new folder
    exec('sudo mv '.storage_path('app/logs/*.*')." {$newFolder}");

    return Command::SUCCESS;
})->purpose('Move log files and remove old folders');
// ##########################################################################
// ##########################################################################
// ##########################################################################

// ##########################################################################
// ########################### CLEAR FILES CACHES ###########################
// ##########################################################################
Artisan::command('file-caches:clear', function () {
    $directory = 'pending_caches';
    $files = Storage::disk($directory)->files();
    $filesToDelete = [];
    foreach ($files as $file) {
        $filename = pathinfo($file, PATHINFO_FILENAME);

        if (mb_strpos($filename, 'agents-status') === 0 || mb_strpos($filename, 'units-status') === 0 || mb_strpos($filename, 'marketers-status') === 0) {
            $filesToDelete[] = $file;
        }
    }
    foreach ($filesToDelete as $file) {
        Storage::disk($directory)->delete($file);
    }
    $this->newLine();
    $this->info('clear file-caches successful');

    return Command::SUCCESS;
})->purpose('clear file-caches');
// ##########################################################################
// ##########################################################################
// ##########################################################################

// ##########################################################################
// ########################## CLEAR ALL LOGS ################################
// ##########################################################################
Artisan::command('ac', function () {
    Artisan::call('optimize:clear');
    Artisan::call('log:clear');
    Artisan::call('redis:clear');
    // exec('sudo echo "" > '.storage_path('logs').'/worker.log ');
    // exec('sudo chmod 777 '.storage_path('logs').'/worker.log ');
    // exec('sudo chown $USER '.storage_path('logs').'/worker.log ');
    // exec('sudo rm '.storage_path('scripts/python/data/token').'/*.txt ');
    $this->newLine();
    $this->info('clear successful');

    return Command::SUCCESS;
})->purpose('clear all caches');
// ##########################################################################
// ##########################################################################
// ##########################################################################

// ##########################################################################
// #################### GENERATE APP KEY FOR REACT ##########################
// ##########################################################################
Artisan::command('react-key:generate', function () {
    $key = base64_decode(mb_substr(env('APP_KEY'), 7));
    $app_key = bin2hex(mb_substr(hash('sha256', $key, true), 0, 32));

    $this->newLine();
    $this->info($app_key);

    return Command::SUCCESS;
})->purpose('GENERATE APP KEY FOR REACT');
// ##########################################################################
// ##########################################################################
// ##########################################################################

// ##########################################################################
// ############################# change:date ################################
// ##########################################################################
Artisan::command('cd {date}', function ($date) {
    if (
        $date[0] === '2' ||
        $date[1] >= '5'
    ) {
        $date = Carbon::parse($date)->timezone('UTC')->toJalali();
    } else {
        $date = Verta::parse($date)->timezone('UTC')->toCarbon();
    }
    outro(
        $date->format('Y/m/d'),
    );
})->purpose('change:date');
// ##########################################################################
// ##########################################################################
// ##########################################################################

// ##########################################################################
// ############################ current:date ################################
// ##########################################################################
Artisan::command('today', function () {
    outro(
        'Carbo -> '.now()->format('Y/m/d'),
    );
    outro(
        'Verta -> '.Verta::now()->format('Y/m/d'),
    );
})->purpose('today:date');
// ##########################################################################
// ##########################################################################
// ##########################################################################

// ##########################################################################
// ############################ DELETE TABLE ################################
// ##########################################################################
Artisan::command('table:delete {name}', function () {
    $table = $this->argument('name');

    // 1. Drop table if exists
    if (Schema::hasTable($table)) {
        Schema::dropIfExists($table);
        $this->info("Table `{$table}` has been deleted.");
    } else {
        $this->warn("Table `{$table}` does not exist.");
    }

    // 2. Delete migration records related to that table
    $deleted = DB::table('migrations')
        ->where('migration', 'like', "%{$table}%")
        ->delete();

    if ($deleted > 0) {
        $this->info("Removed {$deleted} migration record(s) related to `{$table}` from migrations table.");
    } else {
        $this->warn("No migration records found for `{$table}`.");
    }

    return Command::SUCCESS;
})->purpose('Delete a table and its related migration records');
// ##########################################################################
// ##########################################################################
// ##########################################################################
