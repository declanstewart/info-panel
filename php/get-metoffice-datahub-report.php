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

$curl = curl_init();

$CID = DATAPOINT_CLIENT_ID;
$SK = DATAPOINT_SECRET_KEY;

curl_setopt_array($curl, array(
  CURLOPT_URL => "https://api-metoffice.apiconnect.ibmcloud.com/metoffice/production/v0/forecasts/point/hourly?excludeParameterMetadata=true&includeLocationName=true&latitude=51.2802&longitude=-2.7767",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "GET",
  CURLOPT_HTTPHEADER => array(
    "accept: application/json",
    "x-ibm-client-id: $CID",
    "x-ibm-client-secret: $SK"
  ),
));

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
  echo "cURL Error #:" . $err;
  return;
}

$response = json_decode($response, true);

$data = $response['features']['0']['properties']['timeSeries'];

$output = [];

foreach ($data as $key => $row) {

    $forcast = $row['Rep'];

    $temp = [];
    $temp['time'] = $row['time'];
    $temp['time'] = str_replace("Z", "", $temp['time']);
    $temp['time'] = str_replace("T", " ", $temp['time']);
    $temp['time'] = $temp['time'] . ':00';
    $temp['significantWeatherCode'] = $row['significantWeatherCode'];
    $temp['precipitationRate'] = $row['probOfPrecipitation'];
    $temp['screenTemperature'] = $row['screenTemperature'];
    $temp['windDirection'] = wind_cardinals($row['windDirectionFrom10m']);
    $temp['windSpeed'] = $row['windSpeed10m'];
    $temp['gustSpeed'] = $row['windGustSpeed10m'];

    if(strtotime($temp['time']) >= strtotime(date("Y-m-d H:00:00"))){
        array_push($output, $temp);
    }

}

header('Content-Type: application/json');
echo json_encode($output, JSON_PRETTY_PRINT);
