<?php
header('Content-Type: application/javascript');

error_reporting(E_ALL);
ini_set('display_errors', '1');
date_default_timezone_set('UTC');

$includekeys =__DIR__ . '/../../../keys.php';
require_once ( $includekeys );

function convert_to_user_date($date, $format = 'Y-m-d H:i:s', $userTimeZone = 'Europe/London', $serverTimeZone = 'UTC')
{
    try {
        $dateTime = new DateTime ($date, new DateTimeZone($serverTimeZone));
        $dateTime->setTimezone(new DateTimeZone($userTimeZone));
        return $dateTime->format($format);
    } catch (Exception $e) {
        return '';
    }
}

function wind_cardinals($deg) {
	$cardinalDirections = array(
		'N' => array(348.75, 361),
		'N2' => array(0, 11.25),
		'NNE' => array(11.25, 33.75),
		'NE' => array(33.75, 56.25),
		'ENE' => array(56.25, 78.75),
		'E' => array(78.75, 101.25),
		'ESE' => array(101.25, 123.75),
		'SE' => array(123.75, 146.25),
		'SSE' => array(146.25, 168.75),
		'S' => array(168.75, 191.25),
		'SSW' => array(191.25, 213.75),
		'SW' => array(213.75, 236.25),
		'WSW' => array(236.25, 258.75),
		'W' => array(258.75, 281.25),
		'WNW' => array(281.25, 303.75),
		'NW' => array(303.75, 326.25),
		'NNW' => array(326.25, 348.75)
	);
	foreach ($cardinalDirections as $dir => $angles) {
		if ($deg >= $angles[0] && $deg < $angles[1]) {
			$cardinal = str_replace("2", "", $dir);
			}
		}
		return $cardinal;
}

$request = @file_get_contents("https://api.open-meteo.com/v1/forecast?latitude=51.2754&longitude=-2.7766&hourly=temperature_2m,precipitation_probability,weather_code,wind_speed_10m,wind_gusts_10m,wind_direction_10m&forecast_days=2&wind_speed_unit=mph");

$response = json_decode($request, true);

/*echo json_encode($response, JSON_PRETTY_PRINT);
return;*/

$returned_times = $response['hourly']['time'];

/*echo json_encode($data, JSON_PRETTY_PRINT);
return;*/

$output = [];

foreach ($returned_times as $key => $time) {

	$temp = [];
    $temp['time'] = convert_to_user_date($time);
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

echo json_encode($output, JSON_PRETTY_PRINT);
return;
