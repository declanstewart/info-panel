<?php

$includekeys =__DIR__ . '/../../../keys.php';
require_once ( $includekeys );

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

    if(strtotime($temp['time']) >= strtotime(date("Y-m-d H:00:00"))){
        array_push($output, $temp);
    }

}

header('Content-Type: application/json');
echo json_encode($output, JSON_PRETTY_PRINT);
