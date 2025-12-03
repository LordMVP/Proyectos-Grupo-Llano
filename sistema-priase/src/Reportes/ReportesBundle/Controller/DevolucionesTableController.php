<?php

namespace Reportes\ReportesBundle\Controller;


class DevolucionesTableController extends DefaultTableController {

    protected function getModel($conexion) {
        return new \Reportes\ReportesBundle\Models\DevolucionesTableModel($conexion);
    }

}
