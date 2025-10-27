<?php

declare(strict_types=1);

if (! function_exists('intToFloat')) {
    function intToFloat($num)
    {
        return is_numeric($num) ? number_format((float) $num, 2, '.', '') : $num;
    }
}

if (! function_exists('jsonSaver')) {
    function jsonSaver(string $file_name, array $data)
    {
        try {
            $path = storage_path("jsons/$file_name.json");
            if (! file_exists($path)) {
                file_put_contents($path, json_encode([]));
            }
            try {
                $file_content = json_decode(file_get_contents($path)) ?? [];
            } catch (Exception $e) {
                file_put_contents($path, json_encode([]));
                $file_content = json_decode(file_get_contents($path)) ?? [];
            }

            $items = [];
            $file_content_length = count($file_content);
            foreach ($data as $key_data => $value_data) {
                $counter = 0;
                foreach ($file_content as $key_file_content => $value_file_content) {
                    if (
                        $key_file_content === $key_data &&
                        $value_file_content === $value_data
                    ) {
                        $counter += 1;
                    }
                }
                if ($counter === $file_content_length) {
                    $items[$key_data] = $value_data;
                }
            }

            file_put_contents($path, json_encode(array_merge($file_content, $items), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

            return $path;
        } catch (Exception $e) {
            return $e;
        }
    }
}

if (! function_exists('customIntval')) {
    /**
     * Get intval
     *
     * @param  string|int  $value
     * @return int
     */
    function customIntval($value)
    {
        if (is_numeric($value)) {
            return (int) $value;
        }
        $persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        $englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

        return (int) (str_replace(
            $persianNumbers, $englishNumbers, str_replace(
                ',', '', $value
            )
        ));
    }
}

if (! function_exists('persianToEnglish')) {
    function persianToEnglish($value)
    {
        $persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        $englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

        return str_replace(
            $persianNumbers,
            $englishNumbers,
            $value,
        );
    }
}

if (! function_exists('onSuccessApi')) {

    /**
     * @return array
     */
    function onSuccessApi($status = 200, $message = null, $data = [])
    {
        return [
            'status' => $status,
            'message' => $message,
            'data' => $status === 200 ? $data : null,
        ];
    }

}
if (! function_exists('onFailApi')) {
    function onFailApi($status = 500, $message = null)
    {
        return [
            'status' => $status,
            'message' => $message,
            'data' => null,
        ];
    }
}
