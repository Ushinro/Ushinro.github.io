<?php
include_once 'db_connect.php';

$sql = "SELECT * FROM `classes`
	WHERE `id` = :classId";

$stmt = $connection->prepare( $sql );

$stmt->bindParam( ':classId', $_POST['classId'] );

$stmt->execute();

$class = $stmt->fetch( PDO::FETCH_ASSOC );

$json = json_encode( $class );
echo $json;
?>