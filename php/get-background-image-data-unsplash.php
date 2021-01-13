<?php

$includekeys =__DIR__ . '/../../../keys.php';
require_once ( $includekeys );

function timestampToSeason($dateTime){
    $dayOfTheYear = date("z",strtotime($dateTime));
    //$dayOfTheYear = $dateTime->format('z');
    if($dayOfTheYear < 78 || $dayOfTheYear > 353){
        return 'Winter';
    }
    if($dayOfTheYear < 170){
        return 'Spring';
    }
    if($dayOfTheYear < 263){
        return 'Summer';
    }
    return 'Fall';
}

$season = timestampToSeason(date("Y-m-d"));

$url = UNSPLASH_API_URL.'/photos/random?orientation=portrait&query=nature,'.$season.'&client_id='.UNSPLASH_API_KEY;
$response = file_get_contents($url);
$response = json_encode($response);


header('Content-Type: application/json');
echo json_decode($response, JSON_PRETTY_PRINT);
