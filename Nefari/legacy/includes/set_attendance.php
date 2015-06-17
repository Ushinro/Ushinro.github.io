<?php
include_once '_includes/db_connect.php';

$sql = 'SELECT * FROM `classes`
	WHERE `id` = :classId';

$stmt = $connection->prepare( $sql );

$stmt->bindParam( ':classId', $_GET['class'] );

$stmt->execute();

$class = $stmt->fetch();
$studentIds = explode( ',', $class['student_ids'], -1 );
$currentWeekday = date( 'l' );    // Sunday through Saturday
$meetingDays = explode( ',', $class['days'], -1 );
$isClassMeeting = false;

// Check if it is not past the end of class for the day first.
if ( date( 'H:i:s' ) < $class['end_time'] ) {
	foreach ( $meetingDays as $meetingDay ) {
		if ( $meetingDay === $currentWeekday ||
			$meetingDay === $currentWeekday ||
			$meetingDay === $currentWeekday ||
			$meetingDay === $currentWeekday ||
			$meetingDay === $currentWeekday  ) {
			$isClassMeeting = true;
			break;
		}
	}
}

if ( $isClassMeeting ) {
	try {
		$connection->beginTransaction();

		// Check if students have an entry for the day.
		$sql = 'SELECT * FROM `attendance`
				WHERE `student_id` = :studentId
					AND `class_id` = :classId
					AND DATE( `time_in` ) = :currentDate;';

		$stmt = $connection->prepare( $sql );
		$stmt->bindParam( ':studentId', $studentId );
		$stmt->bindParam( ':classId', $_GET['class'] );
		$stmt->bindValue( ':currentDate', date( 'Y-m-d' ) );

		foreach ( $studentIds as $studentId ) {
			$stmt->execute();

			$attendanceRecord = $stmt->fetch();

			if ( empty( $attendanceRecord ) ) {
				$status = "'Absent'";

				$connection->exec( 'INSERT INTO `attendance`
									( `student_id`, `class_id`, `status` )
									VALUES ( $studentId, ' . $class['id'] . ', $status );' );
			}
		}

		$connection->commit();
	} catch ( Exception $e ) {
		$connection->rollBack();
		echo 'Failed: ' . $e->getMessage();
	}
} else {
	header( 'Location: faculty_dash.php' );
}