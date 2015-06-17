<?php
include_once 'psl-config.php';
 
function sessionStart() {
	$sessionName = 'sec_session_id';   // Set a custom session name
	$secure = SECURE;
	// This stops JavaScript being able to access the session id.
	$httponly = true;
	// Forces sessions to only use cookies.
	if ( ini_set( 'session.use_only_cookies', 1 ) === FALSE ) {
		header( "Location: ../error.php?err=Could not initiate a safe session ( ini_set )" );
		exit();
	}
	// Gets current cookies params.
	$cookieParams = session_get_cookie_params();
	session_set_cookie_params( $cookieParams['lifetime'],
		$cookieParams['path'], 
		$cookieParams['domain'], 
		$secure,
		$httponly );
	// Sets the session name to the one set above.
	session_name( $sessionName );
	session_start();            // Start the PHP session 
	session_regenerate_id( true );    // regenerated the session, delete the old one. 
}


function login( $username, $password, $connection ) {
	// Using prepared statements means that SQL injection is not possible. 
	if ( $stmt = $connection->prepare( 'SELECT *
		FROM users
		WHERE username = :username OR email = :username
		LIMIT 1' ) ) {
		$stmt->bindParam( ':username', $username );
		$stmt->execute();    // Execute the prepared query.
 
		$user       = $stmt->fetch();
		$userId     = $user['id'];
		$dbPassword = $user['password'];

		if ( !empty( $user ) ) {
			// If the user exists we check if the logout is locked
			// from too many login attempts 

			if ( checkBrute( $userId, $connection ) === true ) {
				// logout is locked 
				// Send an email to user saying their logout is locked
				return false;
			} else {
				// Check if thepassword in the database matches
				// the password the user submitted.
				if ( password_verify( $password, $dbPassword ) ) {
					// Password is correct!
					$firstName  = $user['first_name'];
					$lastName   = $user['last_name'];
					$privileges = $user['privileges'];

					// Get the user-agent string of the user.
					$userBrowser = $_SERVER['HTTP_USER_AGENT'];

					// XSS protection as we might print this value
					$userId = preg_replace( '/[^0-9]+/',
								'',
								$userId );
					$_SESSION['user_id'] = $userId;

					// XSS protection as we might print this value
					$username = preg_replace( '/[^a-zA-Z0-9_\-]+/',
								'', 
								$username );
					$_SESSION['username'] = $username;

					$firstName = preg_replace( '/[^a-zA-Z0-9_\-]+/',
								'', 
								$firstName );
					$_SESSION['first_name'] = $firstName;

					$lastName = preg_replace( '/[^a-zA-Z0-9_\-]+/',
								'', 
								$lastName );
					$_SESSION['last_name'] = $lastName;

					$_SESSION['privileges'] = $privileges;

					$_SESSION['login_string'] = $dbPassword . $userBrowser;

					// Login successful.
					return true;
				} else {
					// Password is not correct
					// We record this attempt in the database
					$now = date( 'Y-m-d H:i:s' ); // The MySQL DATETIME format
					$ipAddress = filter_var( $_SERVER['REMOTE_ADDR'], FILTER_VALIDATE_IP );

					$connection->query( "INSERT INTO login_attempts
							( user_id, time, ip_address )
							VALUES ( $userId, $now, $ipAddress )" );

					return false;
				}
			}
		} else {
			// No user exists.
			return false;
		}
	}
}


function isLoggedIn( $connection ) {
	// Check if all session variables are set 
	if ( isset( $_SESSION['user_id'], 
		$_SESSION['username'], 
		$_SESSION['login_string'] ) ) {
 
		$userId      = $_SESSION['user_id'];
		$loginString = $_SESSION['login_string'];
		$username    = $_SESSION['username'];
 
		// Get the user-agent string of the user.
		$userBrowser = $_SERVER['HTTP_USER_AGENT'];
 
		if ( $stmt = $connection->prepare( 'SELECT password 
						  FROM users 
						  WHERE id = :id LIMIT 1' ) ) {
			// Bind "$user_id" to parameter. 
			$stmt->bindParam( ':id', $userId );
			$stmt->execute();   // Execute the prepared query.

			$user = $stmt->fetch();
 
			if ( !empty( $user ) ) {
				// If the user exists get variables from result.
				$password = $user['password'];
				$stmt->fetch();
				$loginCheck = $password . $userBrowser;
 
				if ( $loginCheck === $loginString ) {
					// Logged In!!!! 
					return true;
				} else {
					// Not logged in 
					return false;
				}
			} else {
				// Not logged in 
				return false;
			}
		} else {
			// Not logged in 
			return false;
		}
	} else {
		// Not logged in 
		return false;
	}
}


function checkBrute( $userId, $connection ) {
	define( 'TIME_INTERVAL',      2 );  // In hours
	define( 'SECONDS_PER_MINUTE', 60 );
	define( 'MINUTES_PER_HOUR',   60 );

	$failedLoginLimit = 5;
	$now = time();

	// All login attempts are counted from the past 2 hours. 
	$valid_attempts = $now - ( TIME_INTERVAL * SECONDS_PER_MINUTE * MINUTES_PER_HOUR );
 
	if ( $stmt = $connection->prepare( "SELECT time 
					FROM login_attempts 
					WHERE user_id = :id 
					AND time > $valid_attempts" ) ) {
		$stmt->bindParam( ':id', $userId );
	
		$stmt->execute();
		$rows = $stmt->fetchAll();
	
		// If there have been more than 5 failed logins 
		if ( count( $rows ) > $failedLoginLimit ) {
			return true;
		} else {
			return false;
		}
	}
}


function escapeUrl( $url ) {
	if ( '' == $url ) {
		return $url;
	}
 
	$url = preg_replace( '|[^a-z0-9-~+_.?#=!&;,/:%@$\|*\'()\\x80-\\xff]|i',
		'',
		$url );
 
	$strip = array( '%0d',
			'%0a',
			'%0D',
			'%0A' );
	$url = ( string ) $url;
 
	$count = 1;
	while ( $count ) {
		$url = str_replace( $strip, '', $url, $count );
	}
 
	$url = str_replace( ';//', '://', $url );
 
	$url = htmlentities( $url );
 
	$url = str_replace( '&amp;', '&#038;', $url );
	$url = str_replace( "'", '&#039;', $url );
 
	if ( $url[0] !== '/' ) {
		// We're only interested in relative links from $_SERVER['PHP_SELF']
		return '';
	} else {
		return $url;
	}
}


function dayToDrexelDay( $day ) {
	switch( $day ) {
		case 'Monday':
		case 'Mon':
			return 'M';
			break;
		case 'Tuesday':
		case 'Tue':
			return 'T';
			break;
		case 'Wednesday':
		case 'Wed':
			return 'W';
			break;
		case 'Thursday':
		case 'Thu':
			return 'R';
			break;
		case 'Friday':
		case 'Fri':
			return 'F';
			break;
	}
}


function prefixSectionNumber( $section ) {
	if ( $section < 10 ) {
		return '00' . $section;
	} else if ( $section < 100 ) {
		return '0' . $section;
	} else {
		return $section;
	}
}


function getClass( $connection, $classId, $userId ) {
	$sql = 'SELECT * FROM `classes`
			WHERE `id` = :classId
				AND `user_id` = :userId
			LIMIT 1;';
	$stmt = $connection->prepare( $sql );
	$stmt->bindParam( ':classId', $classId );
	$stmt->bindParam( ':userId', $userId );
	$stmt->execute();

	return $stmt->fetch();
}


function getAllClasses( $connection, $userId ) {
	$sql = 'SELECT * FROM `classes`
			WHERE `user_id`= :userId
				AND DATE( `end_date` ) >= :currentDate;';
	$stmt = $connection->prepare( $sql );
	$stmt->bindParam( ':userId', $userId );
	$stmt->bindValue( ':currentDate', date( 'Y-m-d' ) );
	$stmt->execute();

	return $stmt->fetchAll();
}


function getStudent( $connection, $studentId ) {
	$sql = 'SELECT * FROM `students`
			WHERE `id` = :studentId
			LIMIT 1;';
	$stmt = $connection->prepare( $sql );
	$stmt->bindParam( ':studentId', $studentId );
	$stmt->execute();

	return $stmt->fetch();
}


function getAllUsersButCurrent( $connection, $currentUser ) {
	$sql = 'SELECT * FROM `users` WHERE NOT `id` = :userId';
	$stmt = $connection->prepare( $sql );
	$stmt->bindParam( ':userId', $currentUser );
	$stmt->execute();

	return $stmt->fetchAll();
}


function getStudentAttendanceRecords( $connection, $classId, $studentId ) {
	$sql = 'SELECT * FROM `attendance`
			WHERE `class_id` = :classId
				AND `student_id` = :studentId;';
	$stmt = $connection->prepare( $sql );
	$stmt->bindParam( ':classId', $classId );
	$stmt->bindParam( ':studentId', $studentId );
	$stmt->execute();

	return $stmt->fetchAll();
}

function printLogoutLink() {
	echo '<a href="includes/logout.php" id="logout">'
		. 'Log out, '
		. htmlentities( $_SESSION['first_name'] )
		. ' '
		. htmlentities( $_SESSION['last_name'] )
		. '</a>';
}