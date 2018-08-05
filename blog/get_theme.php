<?php
	require 'config.php';
	
	if ($_POST['type'] == 'all') {
		
		$query = mysql_query("SELECT small_bg,big_bg,bg_color,bg_text FROM blog_theme LIMIT 0,6") or die('SQL ERROR！');
		
		$json = '';
		
		while (!!$row = mysql_fetch_array($query, MYSQL_ASSOC)) {
			$json .= json_encode($row).',';
		}
		
		echo '['.substr($json, 0 , strlen($json) - 1).']';
	
	} else if ($_POST['type'] == 'main') {
		
		$query = mysql_query("SELECT big_bg,bg_color FROM blog_theme WHERE bg_flag=1") or die('SQL ERROR！');
		
		echo json_encode(mysql_fetch_array($query, MYSQL_ASSOC));
		
	} else if ($_POST['type'] == 'set') {
	
		mysql_query("UPDATE blog_theme SET bg_flag=0 WHERE bg_flag=1") or die('SQL ERROR！');
		mysql_query("UPDATE blog_theme SET bg_flag=1 WHERE big_bg='{$_POST['big_bg']}'") or die('SQL ERROR！');
		
		echo mysql_affected_rows();
	}

	mysql_close();
?>