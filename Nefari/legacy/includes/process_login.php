<?php
include_once 'db_connect.php';
include_once 'functions.php';
 
sessionStart(); // Our custom secure way of starting a PHP session.
 
if ( isset( $_POST['username'], $_POST['password'] ) ) {
	$username = $_POST['username'];
	$password = $_POST['password'];

	if ( login( $username, $password, $connection ) === true ) {
		// Login success 
		header( 'Location: ../faculty_dash.php' );
	} else {
		// Login failed 
		header( 'Location: ../index.php?error=1' );
	}
} else {
	// The correct POST variables were not sent to this page. 
	echo 'Invalid Request';
}