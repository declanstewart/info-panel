<?php
header('Content-type: application/json');

$includefunctions =__DIR__ . '/functions.php';
require_once ( $includefunctions );

error_reporting(E_ALL);
ini_set('display_errors', '1');
date_default_timezone_set('UTC');

if(in_array(date("i"),[00,15,30,45])){//every 15 minutes

    $request = @file_get_contents("https://api.open-meteo.com/v1/forecast?latitude=51.2754&longitude=-2.7766&hourly=temperature_2m,precipitation_probability,weather_code,wind_speed_10m,wind_gusts_10m,wind_direction_10m&forecast_days=2&wind_speed_unit=mph");

    $response = json_decode($request, true);

    $returned_times = $response['hourly']['time'];

    $output = [];

    foreach ($returned_times as $key => $time) {

    	$temp = [];
        //$temp['time'] = convert_to_user_date($time);
        $temp['time'] = $time;
        $temp['significantWeatherCode'] = $response['hourly']['weather_code'][$key];
        $temp['precipitationRate'] = $response['hourly']['precipitation_probability'][$key];
        $temp['screenTemperature'] = $response['hourly']['temperature_2m'][$key];
        $temp['windDirection'] = wind_cardinals($response['hourly']['wind_direction_10m'][$key]);
    	$temp['windDirectionRaw'] = $response['hourly']['wind_direction_10m'][$key];
        $temp['windSpeed'] = $response['hourly']['wind_speed_10m'][$key];
        $temp['gustSpeed'] = $response['hourly']['wind_gusts_10m'][$key];

        if(strtotime($time) >= strtotime(date("Y-m-d H:00:00"))){

            array_push($output, $temp);
        }

    }

    insertWeatherData($output, 'openMeteo');

    //echo json_encode($output, JSON_PRETTY_PRINT);
    //return;


}



//echo json_encode(getWeatherData(),JSON_PRETTY_PRINT);
