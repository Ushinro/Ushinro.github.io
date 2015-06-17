<?php
include_once 'db_connect.php';
 
$errorMsg = '';

if ( isset( $_POST['first-name'],
		$_POST['last-name'],
		$_POST['student-id'],
		$_POST['email'] ) ) {
	// Sanitize and validate the data passed in
	$firstName = filter_input( INPUT_POST, 'first-name', FILTER_SANITIZE_STRING );
	$lastName  = filter_input( INPUT_POST, 'last-name', FILTER_SANITIZE_STRING );
	$studentId = filter_input( INPUT_POST, 'student-id', FILTER_SANITIZE_NUMBER_INT );
	$email     = filter_input( INPUT_POST, 'email', FILTER_SANITIZE_EMAIL );
	$email     = filter_var( $email, FILTER_VALIDATE_EMAIL );
	if ( !filter_var( $email, FILTER_VALIDATE_EMAIL ) ) {
		// Not a valid email
		$errorMsg .= '<p class="error">The email address you entered is not valid.</p>';
	}

	if ( empty( $errorMsg ) ) {
		$sql = 'SELECT * FROM `classes` WHERE `id` = :classId';
		$stmt = $connection->prepare( $sql );
		$stmt->bindParam( ':classId', $_GET['class'] );
		$stmt->execute();
		$class = $stmt->fetch();
		$studentIds = explode( ',', $class['student_ids'] );

		if ( isset( $_POST['add-student-submit'] ) ) {
			// Insert the new user into the database 
			$sql = 'SELECT `id` FROM `students` WHERE `student_id` = :studentId LIMIT 1';
			$stmt = $connection->prepare( $sql );
			
			// Check if student exists 
			if ( $stmt ) {
				$stmt->bindParam( ':studentId', $studentId );
				$stmt->execute();
				$studentRowId = $stmt->fetch()[0];

				if ( empty( $studentRowId ) ) {
					// Add student if they don't exist
					$sql = 'INSERT INTO `students` 
							( `first_name`, `last_name`, `student_id`, `email` )
							VALUES ( :firstName, :lastName, :studentId, :email );';
		
					if ( $insertStmt = $connection->prepare( $sql ) ) {
						$insertStmt->bindParam( ':firstName', $firstName );
						$insertStmt->bindParam( ':lastName',  $lastName );
						$insertStmt->bindParam( ':studentId', $studentId );
						$insertStmt->bindParam( ':email',     $email );
						// Execute the prepared query.
						if ( !$insertStmt->execute() ) {
							header( 'Location: ../error.php?err=Registration failure: INSERT' );
						}
					}

					$studentRowId = $connection->lastInsertId();
				}

				if ( !in_array( $studentRowId, $studentIds ) ) {
					// If the student is already not part of the class, add the student
					$studentIdsInsert = $class['student_ids'] . $studentRowId . ',';
				
					$sql = 'UPDATE `classes`
							SET `student_ids` = :studentIds 
							WHERE `id` = :classId';
				
					$stmt = $connection->prepare( $sql );
				
					$stmt->bindParam( ':studentIds', $studentIdsInsert );
					$stmt->bindParam( ':classId',    $_GET['class'] );
				
					$stmt->execute();


					// Check if attendance was taken today
					// Mark student as absent if it was
					$sql = 'SELECT * FROM `attendance`
							WHERE `class_id` = :classId
							AND DATE( `time_in` ) = :currentDate;';

					$stmt = $connection->prepare( $sql );
					$stmt->bindParam( ':classId', $_GET['class'] );
					$stmt->bindValue( ':currentDate', date( 'Y-m-d' ) );
					$stmt->execute();
					$attendanceTaken = !empty( $stmt->fetch() );

					if ( $attendanceTaken ) {
						$status = "'Absent'";
						$connection->exec( 'INSERT INTO `attendance`
										( `student_id`, `class_id`, `status` )
										VALUES ( $studentRowId, ' . $class['id'] . ', $status );' );
					}
				}
			} else {
				$errorMsg .= '<p class="error">Sorry, an error has occurred.</p>';
			}
		} else if ( isset( $_POST['edit-student-submit'], $_GET['student'] ) ) {
			$sql = 'SELECT * FROM `students` WHERE `id` = :studentId';
			$stmt = $connection->prepare( $sql );
			$stmt->bindParam( ':studentId', $_GET['student'] );
			$stmt->execute();
			$student = $stmt->fetch();

			if ( $studentId !== $student['student_id'] ){
				// If updating the student's ID,
				// update the entry in the `students` table
				$sql = 'UPDATE `students`
						SET `student_id` = :studentIdUpdate
						WHERE `id` = :id';
	
				$stmt = $connection->prepare( $sql );
	
				$stmt->bindParam( ':studentIdUpdate', $studentId );
				$stmt->bindParam( ':id',              $_GET['student'] );
	
				$stmt->execute();
			}

			$sql = 'UPDATE `students`
					SET `first_name` = :firstName,
						`last_name`  = :lastName,
						`email`      = :email
					WHERE `id` = :id;';

			$stmt = $connection->prepare( $sql );

			$stmt->bindParam( ':firstName', $firstName );
			$stmt->bindParam( ':lastName',  $lastName );
			$stmt->bindParam( ':email',     $email );
			$stmt->bindParam( ':id',        $_GET['student'] );

			$stmt->execute();
		}
	
		$stmt = null;
	}
} else if ( isset( $_POST['remove-student-confirm'] ) ) {
	if ( $_POST['remove-student-confirm'] === 'REMOVE' ) {
		$sql = 'SELECT `student_ids` FROM `classes`
				WHERE `id` = :classId;';

		$stmt = $connection->prepare( $sql );

		$stmt->bindParam( ':classId', $_GET['class'] );

		$stmt->execute();

		$studentIds = explode( ',', $stmt->fetch()[0] );

		$key = array_search( $_GET['student'], $studentIds );

		unset( $studentIds[$key] );

		$studentIdsInsert = implode( ',', $studentIds );

		$sql = 'UPDATE `classes`
				SET `student_ids` = :studentIds 
				WHERE `id` = :classId';
		
		$stmt = $connection->prepare( $sql );
		
		$stmt->bindParam( ':studentIds', $studentIdsInsert );
		$stmt->bindParam( ':classId',    $_GET['class'] );

		$stmt->execute();

		header( 'Location: ../faculty_dash_class_details.php?class=' . $_GET['class'] );
	}
}