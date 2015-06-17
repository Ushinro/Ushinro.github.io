<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Simple MVC</title>
		<link rel="stylesheet" href="../../public/css/reset.css">
		<link rel="stylesheet" href="../../public/css/main.css">
	</head>

	<body>
		<p>
			<strong>Welcome to the home/index view.</strong>
		</p>
		<p>
			Below is the result of the parameters passed into the URL. You can pass...
		</p>
		<p>
			<?php echo $data['name'] . ' is ' . $data['mood']; ?>
		</p>
	</body>
</html>