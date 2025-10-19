<?php

header('Content-Type: application/javascript');

$includefunctions =__DIR__ . '/functions.php';
require_once ( $includefunctions );

//echo json_encode(date_sun_info(time(), 51.2754, -2.7766),JSON_PRETTY_PRINT);
//return;

echo json_encode(getWeatherData(), JSON_PRETTY_PRINT);
