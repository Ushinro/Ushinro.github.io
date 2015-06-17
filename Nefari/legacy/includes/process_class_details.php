<?php
include_once 'db_connect.php';

if ( $_SERVER['REQUEST_METHOD'] === 'POST' ) {
	array_filter( $_POST, 'trimValue' ); // Trim POST data before any spaces get encoded to "%20"

	if ( isset( $_POST['course-title'],
			$_POST['subject-code'],
			$_POST['course-number'],
			$_POST['section'],
			$_POST['crn'],
			$_POST['start-date'],
			$_POST['end-date'],
			$_POST['start-time'],
			$_POST['end-time'],
			$_POST['meeting-days']
		 ) ) {
		$days = '';
		foreach( $_POST['meeting-days'] as $day ) {
			$days .= $day . ',';
		}

		if ( isset( $_POST['add-class-submit'] ) ) {
			$sql = 'INSERT INTO `classes`
					( `crn`, `subject_code`, `course_number`, `course_section`, `course_title`, `start_date`, `end_date`, `start_time`, `end_time`, `days`, `user_id` )
					VALUES ( :crn, :subjectCode, :courseNumber, :courseSection, :courseTitle, :startDate, :endDate, :startTime, :endTime, :days, :userId );';
		} else if ( isset( $_POST['edit-class-submit'] ) ) {
			$sql = 'UPDATE `classes`
					SET `crn`            = :crn,
						`subject_code`   = :subjectCode,
						`course_number`  = :courseNumber,
						`course_section` = :courseSection,
						`course_title`   = :courseTitle,
						`start_date`     = :startDate,
						`end_date`       = :endDate,
						`start_time`     = :startTime,
						`end_time`       = :endTime,
						`days`           = :days
					WHERE `id` = :classId;';
		}

		$stmt = $connection->prepare( $sql );

		$stmt->bindParam( ':crn',           $_POST['crn'] );
		$stmt->bindParam( ':subjectCode',   $_POST['subject-code'] );
		$stmt->bindParam( ':courseNumber',  $_POST['course-number'] );
		$stmt->bindParam( ':courseSection', $_POST['section'] );
		$stmt->bindParam( ':courseTitle',   $_POST['course-title'] );
		$stmt->bindParam( ':startDate',     $_POST['start-date'] );
		$stmt->bindParam( ':endDate',       $_POST['end-date'] );
		$stmt->bindParam( ':startTime',     $_POST['start-time'] );
		$stmt->bindParam( ':endTime',       $_POST['end-time'] );
		$stmt->bindParam( ':days',          $days );

		if ( isset( $_POST['add-class-submit'] ) ) {
			$stmt->bindParam( ':userId',        $_SESSION['user_id'] );
		} else if ( isset( $_POST['edit-class-submit'] ) ) {
			$stmt->bindParam( ':classId',       $_POST['edit-class-id'] );
		}
		
		$stmt->execute();

		$lastClassId = $connection->lastInsertId();
	}

	// Faculty are not required to upload a file
	// if they want to manually add the students with the class details form.
	if ( isset( $_FILES['classRoster']['tmp_name'] ) &&
		is_uploaded_file( $_FILES['classRoster']['tmp_name'] ) ) {
		// Include the Excel library if a file is uploaded
		require_once '_lib/php-excel/PHPExcel.php';

		// Once the file passes the tests,
		// process the data in the file.
		if ( is_file_valid( $_FILES['classRoster']['name'], $_FILES['classRoster']['tmp_name'] ) ) {
			$targetDir  = '_uploads/';
			$targetFile = $targetDir . basename( $_FILES['classRoster']['name'] );

			if ( move_uploaded_file( $_FILES['classRoster']['tmp_name'], $targetFile ) ) {
				storeExcelData( $connection, $targetFile, $_GET['class'] );
			} else {
				echo 'Error moving file';
			}
		} else {
			echo 'Sorry, your file was not uploaded.';
		}
	}
}

function is_file_valid( $file, $tmpFile ) {
	$targetFile    = basename( $file );
	$fileType      = strtolower( pathinfo( $targetFile, PATHINFO_EXTENSION ) );
	$fileSize      = filesize( $tmpFile );
	$fileSizeLimit = 2000000;       // About 2 MB
	
	// Limit file size.
	if ( $fileSize > $fileSizeLimit ) {
		echo 'Error: File size exceeds limit.';
		return false;
	}
	
	// Limit file type to .xls.
	if ( $fileType !== 'xls' && $fileType !== 'xlsx' ) {
		echo "Error: File isn't correct format.";
		return false;
	}

	return true;
}

function storeExcelData( $connection, $targetFile, $classId ) {
	$id = $lastName = $firstName = $middleName = $levelName = $classification = $majorName = $email = null;
	// $data = new PhpExcelReader();
	// $data->read( $targetFile );
	$inputFileType = 'Excel2003XML';
	$objPHPExcel = PHPExcel_IOFactory::load( $targetFile );

	// Loop to get all sheets in a file.
	for( $sheet = 0, $numSheets = $objPHPExcel->getSheetCount(); $sheet < $numSheets; $sheet++ ) {    
		$objWorksheet = $objPHPExcel->setActiveSheetIndex( $sheet );

		// Checking sheet not empty
		if( !empty( $objWorksheet ) ) {
			$classList = '';

			// Loop used to get each row of the sheet
			// Skip the column title by starting the row at 2
			for( $row = 2, $numRows = $objWorksheet->getHighestRow(); $row <= $numRows; $row++ ) {
				$studentId      = filter_var( $objWorksheet->getCellByColumnAndRow( 0, $row )->getValue(), FILTER_SANITIZE_NUMBER_INT );
				$lastName       = filter_var( $objWorksheet->getCellByColumnAndRow( 1, $row )->getValue(), FILTER_SANITIZE_STRING );
				$firstName      = filter_var( $objWorksheet->getCellByColumnAndRow( 2, $row )->getValue(), FILTER_SANITIZE_STRING );
				$middleName     = filter_var( $objWorksheet->getCellByColumnAndRow( 3, $row )->getValue(), FILTER_SANITIZE_STRING );
				$levelName      = filter_var( $objWorksheet->getCellByColumnAndRow( 4, $row )->getValue(), FILTER_SANITIZE_STRING );
				$classification = filter_var( $objWorksheet->getCellByColumnAndRow( 5, $row )->getValue(), FILTER_SANITIZE_STRING );
				$majorName      = filter_var( $objWorksheet->getCellByColumnAndRow( 6, $row )->getValue(), FILTER_SANITIZE_STRING );
				$email          = filter_var( $objWorksheet->getCellByColumnAndRow( 7, $row )->getValue(), FILTER_SANITIZE_EMAIL );

				$sql = 'SELECT * FROM `students`
						WHERE `student_id` = :studentId;';

				$stmt = $connection->prepare( $sql );

				$stmt->bindParam( ':studentId', $studentId );

				$stmt->execute();

				$student = $stmt->fetch();
				// Check if student already exists,
				// if not, add the student,
				// otherwise update their information.
				if ( empty( $student ) ) {
					$sql = 'INSERT INTO `students` 
						( `student_id`, `last_name`, `first_name`, `middle_name`, `level_name`, `classification`, `major_name`, `email` )
						VALUES ( :studentId, :lastName, :firstName, :middleName, :levelName, :classification, :majorName, :email );';

					$stmt = $connection->prepare( $sql );

					$stmt->bindParam( ':studentId',      $studentId );
					$stmt->bindParam( ':lastName',       $lastName );
					$stmt->bindParam( ':firstName',      $firstName );
					$stmt->bindParam( ':middleName',     $middleName );
					$stmt->bindParam( ':levelName',      $levelName );
					$stmt->bindParam( ':classification', $classification );
					$stmt->bindParam( ':majorName',      $majorName );
					$stmt->bindParam( ':email',          $email );

					$stmt->execute();

					$lastStudentId = $connection->lastInsertId();
				} else {
					$sql = 'UPDATE `students`
							SET `level_name`     = :levelName,
								`classification` = :classification,
								`major_name`     = :majorName
							WHERE `student_id` = :studentId;';

					$stmt = $connection->prepare( $sql );

					$stmt->bindParam( ':levelName',      $levelName );
					$stmt->bindParam( ':classification', $classification );
					$stmt->bindParam( ':majorName',      $majorName );
					$stmt->bindParam( ':studentId',      $studentId );

					$stmt->execute();

					$lastStudentId = $student['id'];
				}

				// Separate ids with ','
				// and make them accessible with explode() call.
				$classList .= $lastStudentId . ',';
			}

			$sql = 'UPDATE `classes`
					SET `student_ids` = :classList 
					WHERE `classes`.`id` = :id;';

			$stmt = $connection->prepare( $sql );

			$stmt->bindParam( ':classList', $classList );
			$stmt->bindParam( ':id', $classId );

			$stmt->execute();
		}
		 
	}
}

// Trim array values using this function "trimValue"
function trimValue( &$value ) {
	if ( gettype( $value ) === 'array' ) {
		array_filter( $value, 'trimValue' );
	} else {
		$value = trim( $value );
	}
}
?>