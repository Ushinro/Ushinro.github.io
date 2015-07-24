<!DOCTYPE html>
<html lang="en" encoding="utf-8">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="initial-scale=1.0, user-scalable=no, width=device-width, maximum-scale=1.0" />
		<meta name="author" content="Ushinro">
		<meta name="description" content="Schedule events!">
		<meta name="keywords" content="">


		<link rel="stylesheet" href="css/reset.css">
		<link rel="stylesheet" href="css/main.css">

		
		<title>Chronical - Schedule Events</title>
	</head>

	<body>
		<header>
			<h1>Chronical</h1>
			<h4 class="subtitle">Schedule your next event</h4>
		</header>


		<form action="#">
			<section>
				<h2 class="label">
					Date and Time
				</h2>
				<div class="input">
					<input type="datetime-local" id="datetime" name="datetime" value="2010-12-16 12:01:00"/>
				</div>
				<div class="btn">
					<div class="date-btn">
						<button onclick="Event.adjustDate(1, 'd');">
							+ 1d
						</button>
						<button onclick="Event.adjustDate(-1, 'd');">
							- 1d
						</button>
					</div>
					<div class="time-btn">
						<button onclick="Event.adjustTime(15, 'm');">
							+ 15m
						</button>
						<button onclick="Event.adjustTime(-15, 'm');">
							- 15m
						</button>
					</div>
				</div>
			</section>



			<section>
				<h2 class="label">
					Event Title (Optional)
				</h2>
				<div class="input">
					<input type="text" id="event-title" name="event-title" placeholder="My Event Title"/>
				</div>
			</section>

			<br/>

			<button type="submit">
				Create Countdown
			</button>
		</form>

		<script src="js/main.js"></script>
	</body>
</html>