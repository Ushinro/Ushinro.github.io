<?php
include_once 'psl-config.php';

try {
	$connection = new PDO( DATABASE_TYPE . ':host=' . HOST . ';dbname=' . DATABASE, USER, PASSWORD );
	// set the PDO error mode to exception
	$connection->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
} catch ( PDOException $e ) {
	echo 'Connection failed: ' . $e->getMessage();
}