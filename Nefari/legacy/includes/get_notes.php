<?php
include_once 'db_connect.php';

$sql = "SELECT `notes` FROM `attendance`
	WHERE `id` = :attendanceId";

$stmt = $connection->prepare( $sql );

$stmt->bindParam( ':attendanceId', $_POST['attendance_id'] );

$stmt->execute();

$attendanceRecord = $stmt->fetch( PDO::FETCH_ASSOC );

$json = json_encode( $attendanceRecord );
echo $json;
?>