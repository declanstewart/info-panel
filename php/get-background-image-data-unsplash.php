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

function randomiser(){

    switch (rand(1,3)) {
        case 1:
            return timestampToSeason(date("Y-m-d"));
            break;
        case 2:
            return 'flower';
            break;
        case 3:
            return date("F");
            break;
    }
}

$keyword = randomiser();

$url = UNSPLASH_API_URL.'/photos/random?orientation=portrait&query='.$keyword.'&client_id='.UNSPLASH_API_KEY;
$response = file_get_contents($url);
$response = json_encode($response);


header('Content-Type: application/json');
echo json_decode($response, JSON_PRETTY_PRINT);
