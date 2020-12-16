<?php

$includekeys =__DIR__ . '/../../../keys.php';
require_once ( $includekeys );

$url = 'http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/'.ACCUWEATHER_LOCATION_ID.'?apikey='.ACCUWEATHER_API_KEY;

$response = file_get_contents($url);
$response = json_encode($response);


header('Content-Type: application/json');
echo json_decode($response, JSON_PRETTY_PRINT);
