<?php
	header('Content-Type:text/html; charset=utf-8');

	define('DB_HOST', 'localhost');
	define('DB_USER', 'root');
	define('DB_PWD', 'yangfan');
	define('DB_NAME', 'blog');
	
	$conn = @mysql_connect(DB_HOST, DB_USER, DB_PWD) or die('Data Base Link Failed：'.mysql_error());
	
	@mysql_select_db(DB_NAME) or die('Data Base Error：'.mysql_error());
	
	@mysql_query('SET NAMES UTF8') or die('Charset Error：'.mysql_error());
?>