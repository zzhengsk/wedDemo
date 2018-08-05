<?php
	require 'config.php';
	
	$_pass = sha1($_POST['pass']);
	
	$query = mysql_query("SELECT user FROM blog_user WHERE user='{$_POST['user']}' AND pass='{$_pass}'") or die('SQL ERROR！');
	
	//Username and Password correct
	if (mysql_fetch_array($query, MYSQL_ASSOC)) {		
		echo 0;
	} 
	//not corret
	else {	
		echo 1;
	}
	
	mysql_close();
?>