<?php
include_once 'db_connect.php';
 
$errorMsg = '';
 
if ( isset( $_POST['first-name'], $_POST['last-name'], $_POST['email'], $_POST['password'], $_POST['confirm-password'] ) ) {
	// Sanitize and validate the data passed in
	$firstName  = filter_input( INPUT_POST, 'first-name', FILTER_SANITIZE_STRING );
	$lastName   = filter_input( INPUT_POST, 'last-name', FILTER_SANITIZE_STRING );
	$privileges = filter_input( INPUT_POST, 'privileges', FILTER_SANITIZE_NUMBER_INT );
	$email      = filter_input( INPUT_POST, 'email', FILTER_SANITIZE_EMAIL );
	$email      = filter_var( $email, FILTER_VALIDATE_EMAIL );
	if ( !filter_var( $email, FILTER_VALIDATE_EMAIL ) ) {
		// Not a valid email
		$errorMsg .= '<p class="error">The email address you entered is not valid.</p>';
	}
	// Get first part of email ( After validation ) so that users can log in with that instead of typing the whole email.
	$username = strstr( $email, '@', true );
 
	if ( $_POST['password'] !== $_POST['confirm-password'] ) {
		$errorMsg .= '<p class="error">The passwords provided do not match.</p>';
	}
	$password = filter_input( INPUT_POST, 'confirm-password', FILTER_SANITIZE_STRING ); 
 
	$sql = 'SELECT `id` FROM `users` WHERE `email` = :email LIMIT 1';
	$stmt = $connection->prepare( $sql );
 
	// check existing email  
	if ( $stmt ) {
		$stmt->bindParam( ':email', $email );
		$stmt->execute();
		$result = $stmt->fetchAll();
 
		if ( sizeof( $result ) === 1 ) {
			// A user with this email address already exists
			$errorMsg .= '<p class="error">A user with this email address already exists.</p>';
			$stmt = null;
		}
		
		$stmt = null;
	} else {
		$errorMsg .= '<p class="error">Sorry, an error has occurred.</p>';
		
		$stmt = null;
	}
 
	// TODO: 
	// We'll also have to logout for the situation where the user doesn't have
	// rights to do registration, by checking what type of user is attempting to
	// perform the operation.
	if ( empty( $errorMsg ) ) {
		// Create hashed password, salt is stored within it
		$hashedPassword = password_hash( $password, PASSWORD_DEFAULT );
 
		// Insert the new user into the database 
		$sql = 'INSERT INTO `users` 
				( `first_name`, `last_name`, `email`, `username`, `password`, `privileges` )
				VALUES ( :firstName, :lastName, :email, :username, :password, :privileges )';
		if ( $insertStmt = $connection->prepare( $sql ) ) {
			$insertStmt->bindParam( ':firstName',  $firstName );
			$insertStmt->bindParam( ':lastName',   $lastName );
			$insertStmt->bindParam( ':email',      $email );
			$insertStmt->bindParam( ':username',   $username );
			$insertStmt->bindParam( ':password',   $hashedPassword );
			$insertStmt->bindParam( ':privileges', $privileges );
			// Execute the prepared query.
			if ( !$insertStmt->execute() ) {
				header( 'Location: ../error.php?err=Registration failure: INSERT' );
			}
		}
		header( 'Location: faculty_dash.php' );
	}
}