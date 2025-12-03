<?php

require_once "db.class.php";
class m_administracion_proces_cam_tercero_propied extends database {
	public function guardar(){
	
		}
	
	public function editar(){
		
		}
	
	public function eliminar(){
		
		}
	public function trasladar($post){
		$this->conecta_db();
		$consulta='';
		switch($post['accion_m']){
			case 'tpns':
				$this->trasladarPropiedadNoSus($post);
				break;
			case 'tps':
				$this->trasladarPropiedadSus($post);
				break;
			}
		}
	private function trasladarPropiedadNoSus($post){
		$consulta='update pro_propiedad set ter_ideregistro=' . $post['ter_ideregistro'] . " where pro_ideregistro=" . $post['pro_ideregistro'];
		$this->conecta_db();
		if ($this->ejecuta_db($consulta)){echo "OK";}
		else{
			echo 'Se ha producido un error en el traslado de la propiedad. Si el problema persiste comuníquese con el administrador del sistema';
			}
		$this->cierra_db();			
		}
	private function trasladarPropiedadSus($post){
		$this->conecta_db();
		$consulta='update dsus_detsuscrip set sus_ideregistro=' . $post['sus_ideregistro'] . ', ter_ideregistro=' . $post['ter_ideregistro'] . ' where dsus_ideregistr=' . $post['dsus_ideregistr'];
		if (!@$this->ejecuta_db($consulta)){echo "Ocurrió un problema trasladando la suscripción, por favor verifique su selección.";return false;};
		$consulta='update pro_propiedad set ter_ideregistro=' . $post['ter_ideregistro'] . " where pro_ideregistro=" . $post['pro_ideregistro'];
		$this->conecta_db();
		if ($this->ejecuta_db($consulta)){echo "OK";}
		else{
			echo 'Se ha producido un error en el traslado de la propiedad. Si el problema persiste comuníquese con el administrador del sistema';
			}
		$this->cierra_db();	
		}
	public function consultar($post){
		//print_r ($post);
		$consulta='';
		switch ($post["accion_m"]){
			case 'ter_documento':
				$consulta='select "ter_documento","ter_nombre","ter_apellido","ter_ideregistro" from "ter_tercero" where "ter_documento"=\'' . $post['ter_documento'] . "'";
				break;
			case 'propiedadOrigen':
				$consulta='select pro."pro_ideregistro"
								,pro.pro_idepropieda
								,uni."uni_nombre1"
								,pro.pro_numcatastral
								,pro."pro_descripcion"							
								,proy."proyecto_nom"
								,bar."barrio_nom"
								,pro."pro_direccion"
								,case when dsus.dsus_ideregistr>0 then \'S\'
										else \'N\'
									end as tienesuscr
							from pro_propiedad pro
							left join  dsus_detsuscrip dsus on dsus.pro_ideregistro=pro.pro_ideregistro
							inner join "proyectos" proy on pro."uni_municipio"=proy."proyecto_ideregistro"
							inner join "barrios" bar on pro."uni_barrio"=bar."barrio_ideregistro"
							inner join "uni_unidad" uni on pro."uni_tippropieda"=uni."uni_ideregistro"
							inner join uspr_usuprgpryto uspr on pro.uni_municipio=uspr.uni_municipio
							inner join esem_estempresa esem on esem.est_ideregistro=pro.est_tippropieda
							where pro."ter_ideregistro"=' . $post['ter_ideregistro'] . ' 
							and uspr.usu_ideregistro=\'' . $_SESSION['usu_ideregistro'] . '\'
							and uspr.prg_ideregistro=19
							and esem.emp_ideregistro=' . $_SESSION['emp_ideregistro'] . '							
							order by tienesuscr
							';

				break;
			case 'suscripcionPropiedadOrigen':
				$consulta="select dsus.dsus_ideregistr,'<strong>Convenio: </strong>' || cnre.cnre_nombre || ' <br><br><strong>Suscripcion: </strong>' || dsus.dsus_descripcion,dsus.sus_ideregistro,dsus.uni_tipsuscripc,dsus.cic_ideregistro
								from dsus_detsuscrip dsus
								inner join sus_suscripcion sus on dsus.sus_ideregistro=sus.sus_ideregistro
								inner join cnre_cnvrecaudo cnre on sus.cnre_ideregistr=cnre.cnre_ideregistr
								where pro_ideregistro=" . $post['pro_ideregistro'] . "
								";
				break;
			case 'cuadroBusquedaConsulta':
				isset($post['b_uni_municipio']) ? $uni_municipio=$post['b_uni_municipio'] : $uni_municipio='';
				isset($post['b_ter_documento']) ? $ter_documento=$post['b_ter_documento'] : $ter_documento='';
				isset($post['b_pro_direccion']) ? $pro_direccion=$post['b_pro_direccion'] : $pro_direccion='';
				isset($post['b_pro_numcatastral']) ? $pro_numcatastral=$post['b_pro_numcatastral'] : $pro_numcatastral='';
				isset($post['b_pro_idepropieda']) ? $pro_idepropieda=$post['b_pro_idepropieda'] : $pro_idepropieda='';
				if ($ter_documento!=''){
					$consulta="select ter.ter_ideregistro,ter.ter_documento,ter.ter_nombre || ' ' || ter.ter_apellido,ter.ter_telfijo,ter.ter_telcelular from ter_tercero ter
						where ter.ter_documento='$ter_documento' 
						";
					}
				else if ($pro_direccion!=''){
					$consulta="select distinct on (ter.ter_ideregistro) ter.ter_ideregistro,ter.ter_documento,ter.ter_nombre || ' ' || ter.ter_apellido,ter.ter_telfijo,ter.ter_telcelular from ter_tercero ter
						inner join pro_propiedad pro on pro.ter_ideregistro=ter.ter_ideregistro
						where pro.pro_direccion ~* '$pro_direccion'
						group by ter.ter_ideregistro,ter_documento,ter.ter_nombre,ter.ter_apellido,ter.ter_telfijo,ter.ter_telcelular
						and pro.uni_municipio = '$uni_municipio'
						limit 5
						";
					}
				else if ($pro_numcatastral!=''){
					$consulta="select distinct on (ter.ter_ideregistro) ter.ter_ideregistro,ter.ter_documento,ter.ter_nombre || ' ' || ter.ter_apellido,ter.ter_telfijo,ter.ter_telcelular from ter_tercero ter
						inner join pro_propiedad pro on pro.ter_ideregistro=ter.ter_ideregistro
						where pro.pro_numcatastral = '$pro_numcatastral'
						and pro.uni_municipio = $uni_municipio
						";
					}
				else if ($pro_idepropieda!=''){
					$consulta="select distinct on (ter.ter_ideregistro) ter.ter_ideregistro,ter.ter_documento,ter.ter_nombre || ' ' || ter.ter_apellido,ter.ter_telfijo,ter.ter_telcelular from ter_tercero ter
						inner join pro_propiedad pro on pro.ter_ideregistro=ter.ter_ideregistro
						where pro.pro_idepropieda ~* '$pro_idepropieda'
						and pro.uni_municipio = '$uni_municipio'
						";
					}
				else {
					return false;
					}
				break;
			case 'cargarResultadoAct':
				$consulta="select ter.ter_ideregistro,ter.ter_documento,ter_nomcompleto,ter.uni_tiptercero,ter.ter_telfijo,ter.ter_telcelular,ter.ter_sexo
								from ter_tercero ter
								where ter.ter_ideregistro=" . $post['ter_ideregistro_act'] . "
								";
				break;
			case 'cargarResultadoNew':
				$consulta="select ter.ter_ideregistro,ter.ter_documento,ter.ter_nomcompleto,ter.uni_tiptercero,ter.ter_telfijo,ter.ter_telcelular,ter.ter_sexo
								from ter_tercero ter
								where ter.ter_ideregistro=" . $post['ter_ideregistro_new'] . "
								";
				break;
			}
		//echo $consulta;
		//print_r($post);
				
		$this->conecta_db();
		$respuesta=$this->consulta_db($consulta);
		$this->cierra_db();	
		count($respuesta)>0 ? $this->consultaToCadena($respuesta) : print('sinDatos');	
		}
	public function navegar($post){
		//no aplica
		}
	
	
	}

?>