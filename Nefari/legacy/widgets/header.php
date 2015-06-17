<header>
	<a href="index.php" id="logo"></a>

	<input type="search" id="search">

	<ul id="account-menu">
		<li>
			<a href="#">
				Account Details
			</a>
			<ul class="dropdown-menu">
				<li>
					<a href="#">
						My Account
					</a>
				</li>
				<li>
					<?php printLogoutLink(); ?>
				</li>
			</ul>
		</li>
	</ul>
</header>