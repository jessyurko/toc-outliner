<?php

	$list = $_POST['list'];
	
	$myfile = fopen("data/list.json", "w") or die("Unable to open file!");
	fwrite($myfile, $list);
	fclose($myfile);
	echo("hi");
	
?>