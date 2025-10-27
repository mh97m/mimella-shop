<?php

declare(strict_types=1);

use Hekmatinasser\Verta\Verta;
use Illuminate\Support\Facades\DB;

global $breaker, $start, $end;
$breaker = "\n|--------------------------------------------------------------------------|\n";
$start = '[ '.Verta::now()->format('Y-m-d H:i:s')." ]\n$breaker";
$end =
"\n===========================================================================|\n".
"===========================================================================|\n".
"===========================================================================|\n";

function appLogger(array $args = [])
{
    $format = isset($args['format']) ? $args['format'] : 'log';
    unset($args['format']);

    $func_name = $format.'Logger';

    return $func_name($args);
}

function txtLogger(array $args)
{
    global $start;
    global $breaker;
    global $end;
    $type = isset($args['type']) ? $args['type'] : 'info';
    unset($args['type']);
    $file_name = isset($args['file_name']) ? $args['file_name'] : (int) (microtime(true) * 1000);
    unset($args['file_name']);
    $message = isset($args['message']) ? $args['message'] : 'default';
    unset($args['message']);
    // $bigest_key_len = max(array_map('strlen', array_keys($args)));
    $log_text = $start;
    $log_text .= '|--'.mb_strtoupper($type).' ==> [ '.$message.' ]'.$breaker;
    foreach ($args as $key => $value) {
        $log_text .= '|--'.mb_strtoupper($key).' ==> [ '.$value.' ]'.$breaker;
    }
    $log_text .= $end;

    $ext = str_replace('Logger', '', __FUNCTION__);

    $path = config('logging.path')."{$file_name}.{$ext}";

    file_put_contents($path, $log_text.PHP_EOL, FILE_APPEND | LOCK_EX);

    return true;
}

function logLogger(array $args)
{
    global $start;
    global $breaker;
    global $end;
    $type = isset($args['type']) ? $args['type'] : 'info';
    unset($args['type']);
    $file_name = isset($args['file_name']) ? $args['file_name'] : (int) (microtime(true) * 1000);
    unset($args['file_name']);
    $message = isset($args['message']) ? $args['message'] : 'default';
    unset($args['message']);
    // $bigest_key_len = max(array_map('strlen', array_keys($args)));
    $log_text = $start;
    $log_text .= '|--'.mb_strtoupper($type).' ==> [ '.$message.' ]'.$breaker;
    foreach ($args as $key => $value) {
        $log_text .= '|--'.mb_strtoupper($key).' ==> [ '.$value.' ]'.$breaker;
    }
    $log_text .= $end;

    $ext = str_replace('Logger', '', __FUNCTION__);

    $path = config('logging.path')."{$file_name}.{$ext}";

    file_put_contents($path, $log_text.PHP_EOL, FILE_APPEND | LOCK_EX);

    return true;
}

function jsonLogger(array $args)
{
    // Set the filename or use the current timestamp if not provided
    $file_name = isset($args['file_name']) ? $args['file_name'] : (int) (microtime(true) * 1000);
    unset($args['file_name']);

    // Define the log file path
    $ext = str_replace('Logger', '', __FUNCTION__);
    $path = config('logging.path')."{$file_name}.{$ext}";

    // Update 'message' key to 'msg' if it exists
    if (isset($args['message'])) {
        $args['msg'] = $args['message'];
        unset($args['message']);
    }

    // Replace newlines (\n) in each value with spaces
    foreach ($args as &$value) {
        if (is_string($value)) {
            $value = str_replace("\n", ' ', $value);
        }
    }

    // Add the current timestamp
    $args['time'] = Verta::now()->formatDatetime();

    // Encode the arguments as a JSON object
    $json_data = json_encode($args, JSON_UNESCAPED_UNICODE);

    // Replace commas with spaces inside the JSON object
    $json_data = str_replace(',', ', ', $json_data); // Ensuring there is a space after each comma

    // Append the JSON object to the file with a newline at the end
    // Log::alert([$path, $json_data]);
    file_put_contents($path, $json_data.PHP_EOL, FILE_APPEND);

    return true;
}

function dbLogger(array $args)
{
    $insert_arr = array_merge($args, [
        'created_at' => nowUTCDateTime(),
    ]);
    $table_name = mb_strtolower($args['table']).'_logs';
    unset($insert_arr['file_name']);
    unset($insert_arr['table']);

    $primaryKey = null;
    $primaryValue = null;
    if (isset($insert_arr['primaryKey'])) {
        $primaryKey = $insert_arr['primaryKey'];
        $primaryValue = $insert_arr[$primaryKey];
        unset($insert_arr['primaryKey']);
        unset($insert_arr[$primaryKey]);
    }

    if ($primaryKey) {
        $log = DB::table($table_name)
            ->where([
                $primaryKey => $primaryValue,
            ])
            ->first();
        if ($log) {
            $log = DB::table($table_name)
                ->where([
                    $primaryKey => $primaryValue,
                ])
                ->update($insert_arr);

            return true;
        }
        $insert_arr[$primaryKey] = $primaryValue;

    }

    $log = DB::table($table_name)->insert($insert_arr);

    return $log ? true : false;
}

function logRowMaker(string $log_text, string $key, string $value)
{
    global $breaker;

    return '|--'.mb_strtoupper($key).' ==> [ '.$value." ]\n".$breaker;
    $text = '';
    $rows = mb_str_split('|--'.mb_strtoupper($key).' ==> [ '.$value.' ]', 73);
    foreach ($rows as $row) {
        $text .= $row.str_repeat('-', (75 - mb_strlen($row)))."|\n";
        $log_text .= $text;
    }
    $log_text .= $breaker;

    return $log_text;
}
