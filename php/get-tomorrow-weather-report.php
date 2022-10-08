<?php

$includekeys =__DIR__ . '/../../../keys.php';
require_once ( $includekeys );

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



$url = 'https://api.tomorrow.io/v4/timelines?location=51.27944895910284,-2.7700182584695847&fields=temperature,windSpeed,windDirection,windGust,precipitationProbability,weatherCode&timesteps=1h&units=metric&apikey='.TOMORROW_API_KEY;
$response = file_get_contents($url);
$response = json_decode($response, true);

$weatherCodes = json_decode(file_get_contents("../data/icon-conversion.json"), true);


$data = $response['data']['timelines']['0']['intervals'];

/*header('Content-Type: application/json');
echo json_encode($data, JSON_PRETTY_PRINT);
return;*/

$output = [];

foreach ($data as $key => $row) {

		$temp = [];
		$temp['time'] = $row['startTime'];
		$temp['time'] = str_replace("Z", "", $temp['time']);
		$temp['time'] = str_replace("T", " ", $temp['time']);

		$now       = strtotime($temp['time']);
		$longitude = 51.27944895910284;
		$latitude  = -2.7700182584695847;

		$sun    = date_sun_info ( $now, $longitude, $latitude);
		$light  = $sun['civil_twilight_begin'];
		$dark   = $sun['civil_twilight_end'];

		$light_val = 'night';

		if (($now > $light && $now < $dark)) {

			$light_val = 'day';

		}

    //$temp['time'] = $temp['time'] . ':00';
    //$temp['significantWeatherCodeOld'] = $row['values']['weatherCode'];
		$temp['significantWeatherCode'] = $weatherCodes[$light_val][$row['values']['weatherCode']];
    $temp['precipitationRate'] = $row['values']['precipitationProbability'];
    $temp['screenTemperature'] = $row['values']['temperature'];
    $temp['windDirection'] = wind_cardinals($row['values']['windDirection']);
		$temp['windDirectionRaw'] = $row['values']['windDirection'];
    $temp['windSpeed'] = $row['values']['windSpeed'];
    $temp['gustSpeed'] = $row['values']['windGust'];
		$temp['nightOrDay'] = $light_val;

    if(strtotime($temp['time']) >= strtotime(date("Y-m-d H:00:00"))){
        array_push($output, $temp);
    }

}

header('Content-Type: application/json');
echo json_encode($output, JSON_PRETTY_PRINT);
