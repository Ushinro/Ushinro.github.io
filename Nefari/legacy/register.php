<?php
include_once 'includes/db_connect.php';
include_once 'includes/register.inc.php';
include_once 'includes/functions.php';

sessionStart();

include_once 'widgets/head.php';
?>
	<body>
		<!-- Registration form to be output if the POST variables are not
		set or if the registration script caused an error. -->
		<h1>Register a Faculty Member</h1>
		<?php
		if ( !empty( $errorMsg ) ) {
			echo $errorMsg;
		}
		?>

		<ul>
			<li>Passwords must be at least 6 characters long</li>
			<li>Passwords must contain
				<ul>
					<li>At least one upper case letter (A..Z)</li>
					<li>At least one lower case letter (a..z)</li>
					<li>At least one number (0..9)</li>
				</ul>
			</li>
		</ul>

		<form action="<?php echo escapeUrl( $_SERVER['PHP_SELF'] ); ?>" 
				method="POST" 
				name="add-faculty"
				id="add-faculty">
			<label for="first-name">First Name:</label>
			<input type="text"
					name="first-name"
					id="first-name"
					placeholder="First Name"
					required="required"><br>
			<label for="last-name">Last Name:</label>
			<input type="text"
					name="last-name"
					id="last-name"
					placeholder="Last Name"
					required="required"><br>

			<label for="email">Email:</label>
			<input type="email"
					name="email"
					id="email"
					placeholder="Email"
					required="required"><br>

			<label for="privileges">Privileges:</label>
			<select name="privileges" id="privileges">
					<option value="0">Administrator</option>
					<option value="1" selected="selected">Faculty</option>
			</select><br>

			<label for="password">Password:</label>
			<input type="password"
					name="password" 
					id="password"
					placeholder="Password"><br>
			<label for="confirm-password">Confirm password:</label>
			<input type="password" 
					name="confirm-password" 
					id="confirm-password"
					placeholder="Confirm Password"><br>

			<button type="submit"
					form="add-faculty">
			   Add Faculty
			</button>
		</form>
		<p>Return to the <a href="index.php">homepage</a>.</p>
	</body>
</html>