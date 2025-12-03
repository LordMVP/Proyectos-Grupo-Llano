<?php
class m_ap_upload{	
	public function cargarArchivo($post,$files,$destino){
		$uploaddir = $destino;
		$pfx=$post['pfx'];
		$ext = explode('.',$files['userfile']['name']);
		$extension = $ext[1];
		$newname = $_SESSION['acc_ideregistro'] . '_' . $pfx . $ext[0];
		$uploadfile = $uploaddir . $newname . '.' . $extension;
		if (move_uploaded_file($files['userfile']['tmp_name'], $uploadfile)) {
			echo $newname . '.' . $extension;
			} 
		else{
			echo "error";
			}
		}
	}
?>
