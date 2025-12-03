<?php

$jpath = "";
//print_r($_SERVER["REQUEST_URI"]);
strpos($_SERVER["REQUEST_URI"], "app") <= 0 ? $jpath = "app/modelo/" : $jpath = "../modelo/";
require $jpath . "jConf.php";

class Controlador extends jeusConf {

    //-----------------------------------------------CARGA DE PAGINA    
    public function cargarPagina($modulo = 'inicio') {
        if (isset($_SESSION['empresa'])) {
            $modulo == "" ? $modulo = 'inicio' : $modulo = $modulo;
            $pagina = $this->load_template($this->titulo, $modulo);
            $html = $this->load_page('app/vista/default/modulo/v.' . $modulo . '.php');
            $html2 = $this->replace_content_valor('/\#valor_ter_documento\#/ms', $_GET['ter_documento'], $html);
            $pagina = $this->replace_content('/\#CONTENIDO\#/ms', $html2, $pagina);
            $this->view_page($pagina);
        } else
            header('Location: /achagua/index.html');
    }

    private function load_template($title = 'Sin Titulo', $modulo) {
        $pagina = $this->load_page('app/vista/default/maestra.php');
        $header = "<h1> Sistema de información de  " . $_SESSION['empresa'] . " </h1>";
        $pagina = $this->replace_content('/\#HEADER\#/ms', $header, $pagina);
        $pagina = $this->replace_content('/\#TITLE\#/ms', $title, $pagina);
        $pagina = $this->replace_content('/\#JSFORM\#/ms', $modulo, $pagina);
        $menu_left = $this->load_page('app/vista/default/seccion/s.menulateral.php');
        $pagina = $this->replace_content('/\#MENULEFT\#/ms', $menu_left, $pagina);
        return $pagina;
    }

    public function cargarPrograma($modulo = 'inicio', $get) {
        $modulo == "" ? $modulo = 'inicio' : $modulo = $modulo;
        $pagina = $this->load_tempPrograma($this->titulo, $modulo, $get);
        $html = $this->load_page('app/vista/default/modulo/v.' . $modulo . '.php');
        $html2 = $this->replace_content_valor('/\#valor_ter_documento\#/ms', $_GET['ter_documento'], $html);
        $pagina = $this->replace_content('/\#CONTENIDO\#/ms', $html2, $pagina);
        $this->view_page($pagina);
    }

    private function load_tempPrograma($title = 'Sin Titulo', $modulo, $get) {
        $pagina = $this->load_page('app/vista/default/programa.php');
        $pagina = $this->replace_content('/\#JSFORM\#/ms', $modulo, $pagina);
        return $pagina;
    }

    private function load_page($page) {
        return file_get_contents($page);
    }

    private function replace_content($in = '/\#CONTENIDO\#/ms', $out, $pagina) {
        return preg_replace($in, $out, $pagina);
    }

    private function replace_content_valor($in = '/\#valor_ter_documento\#/ms', $out, $pagina) {
        return preg_replace($in, $out, $pagina);
    }

    private function view_page($html) {
        echo $html;
    }

}

?>