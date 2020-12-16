<?php

$includekeys =__DIR__ . '/../../../keys.php';
require_once ( $includekeys );

$url = 'http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/'.METOFFICE_LOCATION_ID.'?res=3hourly&key='.METOFFICE_API_KEY;

$response = file_get_contents($url);
$response = json_decode($response, true);
$data = $response['SiteRep']['DV']['Location']['Period'];

$output = [];
$skip = false;

foreach ($data as $key => $row) {

    $forcast = $row['Rep'];

    foreach ($forcast as $value) {

        $temp = [];
        $temp['time'] = $value['$'] / 60;
        $temp['type'] = $value['W'];//icon id
        $temp['pp'] = $value['Pp'];//precipitation percentage
        $temp['temp'] = $value['T'];

        if($skip === false){
            $skip = true;
        }else{
            array_push($output, $temp);
        }

        if(count($output) >= 5){
            break 2;
        }
    }

}

header('Content-Type: application/json');
echo json_encode($output, JSON_PRETTY_PRINT);
