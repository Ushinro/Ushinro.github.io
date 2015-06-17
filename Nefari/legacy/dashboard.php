<?php
include_once 'includes/db_connect.php';
include_once 'includes/functions.php';

sessionStart();

//Only display content if someone is logged in
if ( isLoggedIn( $connection ) ) :

include_once 'widgets/head.php';
?>

<body>
	<?php include 'header.php'; ?>
</body>