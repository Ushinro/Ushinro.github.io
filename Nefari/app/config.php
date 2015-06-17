<?php 
return [
	'db'	=> [
	    	'host'       	=> '127.0.0.1',	// The host you want to connect to. 
	    	'name'       	=> 'nefari',   	// The database name.
	    	'user'       	=> 'nefari',   	// The database username.
	    	'pass'       	=> 'root',     	// The database password.
	    	'type'       	=> 'mysql',    	// The database type (mysql, pgsql, sqlite, etc.)
	    	'canRegister'	=> 'any',
	    	'defaultRole'	=> 'member',
	    	'secure'     	=> FALSE	// FOR DEVELOPMENT ONLY!!!!
	],
	'mail'	=> [
	      	'host'	=> 'smtp.gmail.com'
	]
];