<?php 
include_once '_includes/db_connect.php';

// Check if attendance record exists
// for this class and this day.
// If not, mark every student as absent by default.
if ( isset( $_POST['cardSwipe'] ) ) {
	$swipeSuccessful = false;
	$swipeResponse = 'Student could not be found.';

	if ( strpos( $_POST['cardSwipe'], 'E' ) === false ) {
		$cardSwipe = trim( $_POST['cardSwipe'] );

		// Strips Extraneous Data Leaving only Digits
		// May be flawed
		preg_match_all( '!\d+!', $cardSwipe, $studentId );

		// Converting a Sting to an INT
		$studentId = intval( $studentId[0][0] );

		// Test to see if ID matches ID in the Database
		$sql = 'SELECT * 
				FROM `students` 
				WHERE `student_id` = :studentId 
				LIMIT 1';

		$stmt = $connection->prepare( $sql );

		$stmt->bindParam( ':studentId', $studentId );
		$stmt->execute();

		$student = $stmt->fetch();

		if ( !empty( $student ) ) {
			// Student exists
			$sql = 'SELECT *
					FROM `classes`
					WHERE `id` = :classId
					LIMIT 1';

			$stmt = $connection->prepare( $sql );

			$stmt->bindParam( ':classId', $_GET['class'] );
			$stmt->execute();

			$class = $stmt->fetch();

			if ( !empty( $class ) ) {
				$classRoster = explode( ',', $class['student_ids'], -1 );
				
				if ( in_array( $student['id'], $classRoster ) ) {
					// Student is in the class
					// First get attendance record
					$sql = 'SELECT * FROM `attendance`
							WHERE `student_id` = :studentId
								AND `class_id` = :classId
								AND DATE( `time_in` ) = :currentDate;';

					$stmt = $connection->prepare( $sql );

					$currentDate = date( 'Y-m-d' );
					$currentTime = date( 'H:i:s' );
					$timeIn = date( 'Y-m-d H:i:s' );  // The MySQL DATETIME format

					$stmt->bindParam( ':studentId', $student['id'] );
					$stmt->bindParam( ':classId', $_GET['class'] );
					$stmt->bindParam( ':currentDate', $currentDate );

					$stmt->execute();

					$attendanceRecord = $stmt->fetch();
					
					$sql = 'UPDATE `attendance`
							SET `status` = :status,
								`time_in` = :timeIn
							WHERE `id` = :attendanceId';

					$stmt = $connection->prepare( $sql );


					if ( $currentTime <= $class['start_time'] ) {
						$status = 'On Time';
					} else if ( $currentTime > $class['start_time'] && $currentTime < $class['end_time'] ) {
						$status = 'Late';
					} else if ( $currentTime >= $class['end_time'] ) {
						$status = 'Absent';
					}
					
					$stmt->bindParam( ':status', $status );                    
					$stmt->bindParam( ':timeIn', $timeIn );
					$stmt->bindParam( 'attendanceId', $attendanceRecord['id'] );

					$stmt->execute();

					$swipeSuccessful = true;
					$swipeResponse = 'Welcome, ' . $student['first_name'] . ' ' . $student['last_name'] . '.';
				} else {
					// Student not in class
					return;
				}
			} else {
				// Class could not be found
				return;
			}
		} else {
			// Student does not exist
			return;
		}
	} else {
		// There was a problem with the swipe
		$swipeResponse = 'Please swipe again.';
	}
}
?>

