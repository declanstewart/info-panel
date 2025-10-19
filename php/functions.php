<?php

$includekeys =__DIR__ . '/../../../keys.php';
require_once ( $includekeys );

error_reporting(E_ALL);
ini_set('display_errors', '1');
date_default_timezone_set('UTC');

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

function createWeatherVersion($source){

    $link = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

    $sql = 'INSERT INTO infopanel.weather_version
                (source)
            VALUES(?);';

    $stmt = mysqli_prepare($link, $sql);
    mysqli_stmt_bind_param($stmt, 's', $source);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);

    $sql = "SELECT
            	version_id
            FROM infopanel.weather_version
            ORDER BY version_id DESC
            LIMIT 1";

    $stmt = mysqli_prepare($link, $sql);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_bind_result($stmt, $version_id);
    mysqli_stmt_fetch($stmt);
    mysqli_stmt_close($stmt);
    mysqli_close($link);
    return $version_id;
}

function insertWeatherData($data, $source){

    $link = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

    $version_id = createWeatherVersion($source);

    foreach ($data as $key => $row) {

        $time = $row['time'];
        $significantWeatherCode = $row['significantWeatherCode'];
        $precipitationRate = $row['precipitationRate'];
        $screenTemperature = $row['screenTemperature'];
        $windDirection = $row['windDirection'];
        $windDirectionRaw = $row['windDirectionRaw'];
        $windSpeed = $row['windSpeed'];
        $gustSpeed = $row['gustSpeed'];

        $sql = 'INSERT INTO infopanel.weather_records
                    (   time,
                        significantWeatherCode,
                        precipitationRate,
                        screenTemperature,
                        windDirection,
                        windDirectionRaw,
                        windSpeed,
                        gustSpeed,
                        version_id)
                VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?);';

        $stmt = mysqli_prepare($link, $sql);
        mysqli_stmt_bind_param($stmt, 'sidisiiii', $time,$significantWeatherCode,$precipitationRate,$screenTemperature,$windDirection,$windDirectionRaw,$windSpeed,$gustSpeed,$version_id);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);

    }
    mysqli_close($link);
}

function getWeatherData(){

    $link = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

    $output = [];


    $sql = "SELECT
            	`time`,
            	significantWeatherCode,
            	day_image,
            	night_image,
            	precipitationRate,
            	screenTemperature,
            	windDirection,
            	windDirectionRaw,
            	windSpeed,
            	gustSpeed
            FROM infopanel.weather_records
            inner join weather_codes on weather_code = significantWeatherCode
            where weather_records.version_id  = (SELECT
                            version_id
                        FROM infopanel.weather_version
                        ORDER BY version_id DESC
                        LIMIT 1)";

    $stmt = mysqli_prepare($link, $sql);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_bind_result($stmt, $time, $significantWeatherCode, $day_image, $night_image, $precipitationRate, $screenTemperature, $windDirection, $windDirectionRaw, $windSpeed, $gustSpeed);
    while(mysqli_stmt_fetch($stmt)){

        $temp = [];

        $sun_data = date_sun_info(strtotime($time), 51.2754, -2.7766);
        if(strtotime($time) > $sun_data['sunrise'] && strtotime($time) < $sun_data['sunset']){
            $temp['icon'] = $day_image;
        }else{
            $temp['icon'] = $night_image;
        }

        //$temp['time'] = $time;
        $temp['time'] = convert_to_user_date($time);
        $temp['significantWeatherCode'] = $significantWeatherCode;
        $temp['precipitationRate'] = $precipitationRate;
        $temp['screenTemperature'] = $screenTemperature;
        $temp['windDirection'] = $windDirection;
        $temp['windDirectionRaw'] = $windDirectionRaw;
        $temp['windSpeed'] = $windSpeed;
        $temp['gustSpeed'] = $gustSpeed;

        if(strtotime($time) >= strtotime(date("Y-m-d H:00:00"))){

            array_push($output, $temp);
        }

    }
    mysqli_stmt_close($stmt);
    mysqli_close($link);

    return $output;
}
