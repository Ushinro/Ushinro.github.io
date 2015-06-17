<?php
include_once 'includes/db_connect.php';
include_once 'includes/functions.php';

sessionStart();

if ( isLoggedIn( $connection ) ) {
	// If logged in, redirect user to dashboard
	header( 'Location: faculty_dash.php' );
}

include_once 'widgets/head.php';
?>

<body>
	<div id="page-wrapper">
		<div id="error">
		<?php
			if ( isset( $_GET['error'] ) ) {
				echo '<p class="error">Error Logging In!</p>';
			}
		?>
		</div>

		<img id="login-logo" src="images/westphal_logo.png">

		<h1 class="login-title">Attendance App</h1>


		<form action="includes/process_login.php" method="post" name="login-form" id="login-form">
			<label id="username-label" for="username">Username / Email</label>
			<input type="username"
				name="username"
				id="username"
				placeholder="Username / Email"
				required>

			<label id="password-label" for="password">Password</label>
			<input type="password"
				name="password"
				id="password"
				placeholder="Password">

			<button class="btn"
				type="submit"
				form="login-form">
				Login
			</button>

			<a class="reset-pw">
				Forgot Password?
			</a>
		</form>
	</div>
</body>

</html>

