<?php

use Project\Helpers\Config;

require_once 'core/Config.php';
require_once 'core/App.php';
require_once 'core/Controller.php';

$config = new Config();
$config->load('config.php');

try {
	$connection = new PDO(
		$config->get('db.type')
			. ':host=' . $config->get('db.host')
			. ';dbname=' . $config->get('db.name'),
		$config->get('db.user'),
		$config->get('db.pass')
	);
	
	// Set the PDO error mode to exception
	$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
	echo 'Connection failed: ' . $e->getMessage();
}