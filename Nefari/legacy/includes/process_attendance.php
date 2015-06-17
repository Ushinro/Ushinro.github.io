<?php
include_once 'db_connect.php';

if ( isset( $_POST['status'] ) ) {
    $sql = 'UPDATE `attendance`
        SET `status` = :status
        WHERE `id` = :id';

    $stmt = $connection->prepare( $sql );

    $stmt->bindParam( ':status', $_POST['status'] );
    $stmt->bindParam( ':id', $_POST['attendance_id'] );

    $stmt->execute();
} else if ( isset( $_POST['excused'] ) ) {
    $sql = 'UPDATE `attendance`
            SET `excused` = :excused
            WHERE `id` = :id';

    $stmt = $connection->prepare( $sql );

    $stmt->bindParam( ':excused', $_POST['excused'] );
    $stmt->bindParam( ':id', $_POST['attendance_id'] );

    $stmt->execute();
} else if ( isset( $_POST['edit-notes'] ) ) {
    $sql = 'UPDATE `attendance`
            SET `notes` = :notes
            WHERE `id` = :id';

    $stmt = $connection->prepare( $sql );

    $stmt->bindParam( ':notes', $_POST['edit-notes'] );
    $stmt->bindParam( ':id', $_POST['attendance_id'] );

    $stmt->execute();
}

$stmt = null;
?>