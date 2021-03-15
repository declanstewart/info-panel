<?php

$includekeys =__DIR__ . '/../../../keys.php';
require_once ( $includekeys );

include 'ical.php';

function get_calendar_events($url, $importance, $name){

    $iCal = new iCal($url);
    $events = $iCal->eventsByDate();
    $output = [];

    foreach ($events as $date => $events){

    	foreach ($events as $event){

            $temp = json_encode($event);
            $temp = json_decode($temp, true);
            $temp['importance'] = $importance;
            $temp['name'] = $name;

            if($name === 'Bin Days'){
                $temp['dateStart'] = date("Y-m-d 00:00:00", strtotime($temp['dateStart']));
                $temp['dateEnd'] = date("Y-m-d 11:59:59", strtotime($temp['dateEnd']));
            }

            if(strtotime($temp['dateStart']) > time() || strtotime($temp['dateEnd']) > time()){

                array_push($output, $temp);

            }
    	}
    }
    return $output;
}

//$IP = $_SERVER["SERVER_ADDR"];
$IP = '127.0.0.1';

$declan_url = 'https://p26-caldav.icloud.com/published/2/MTMxNTc5OTU2NjEzMTU3OTXP_8bZSbFihoIpCdQcunhOjNhDDzXa3-WuDc7cs1IA4L9VyVCArbd1Qfg5MRu1GT0aKeqmlQWIn4YzJhY8ge8';
$declan_rota = 'https://feeds.rotacloud.com/calendar/cHdnqMZN2gcrJBr6yPgcbb1M/feed.ics';
$stacey_url = 'https://calendar.google.com/calendar/ical/stacey.dabinett.sd%40gmail.com/private-3d558c10db38a5b498912d9db205a3ba/basic.ics';
$public_holidays = 'https://calendar.google.com/calendar/ical/en.uk%23holiday%40group.v.calendar.google.com/public/basic.ics';
$bin_day = 'http://'.$IP.'/info-panel/data/CollectionDay.ics';

$declan_events = get_calendar_events($declan_url, 'major', 'Declan Events');
$declan_rota = get_calendar_events($declan_rota, 'minor', 'Declan Rota');
$stacey_events = get_calendar_events($stacey_url, 'major', 'Stacey Events');
$public_holidays_events = get_calendar_events($public_holidays, 'minor', 'Public Holidays');
$bin_day_events = get_calendar_events($bin_day, 'minor', 'Bin Days');

$final_output = [];

foreach ($declan_events as $value) {
    array_push($final_output, $value);
}
foreach ($declan_rota as $value) {
    array_push($final_output, $value);
}
foreach ($stacey_events as $value) {
    array_push($final_output, $value);
}
foreach ($public_holidays_events as $value) {
    array_push($final_output, $value);
}
foreach ($bin_day_events as $value) {
    array_push($final_output, $value);
}

usort($final_output, function($a, $b) {
    return $a['dateStart'] <=> $b['dateStart'];
});

header('Content-Type: application/json');
echo json_encode($final_output, JSON_PRETTY_PRINT);
