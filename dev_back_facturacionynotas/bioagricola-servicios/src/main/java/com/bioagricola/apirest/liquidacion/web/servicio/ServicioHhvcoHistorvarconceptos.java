package com.bioagricola.apirest.liquidacion.web.servicio;


import com.bioagricola.apirest.liquidacion.negocio.NegocioHhvcoHistorvarconceptos;
import com.bioagricola.apirest.liquidacion.negocio.interfaces.IHhvcoHistorvarconceptos;
import com.bioagricola.apirest.liquidacion.security.JwtUtil;
import com.bioagricola.apirest.modelo.dtos.HhvcoHistorvarconceptosDTO;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;
import com.gell.estandar.dto.AuditoriaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/webresources/servicios/hhvcoHistorvarconceptos")
public class ServicioHhvcoHistorvarconceptos implements IHhvcoHistorvarconceptos {
    @Autowired
    private NegocioHhvcoHistorvarconceptos negocioHhvcoHistorvarconceptos;

    @PostMapping("/crear")
    @Override
    public HhvcoHistorvarconceptosDTO crear(@RequestBody HhvcoHistorvarconceptosDTO hhvcoHistorvarconceptosDTO) throws InvalidParameterException {
        return negocioHhvcoHistorvarconceptos.crear(hhvcoHistorvarconceptosDTO);
    }

    @PutMapping("/actualizar")
    @Override
    public HhvcoHistorvarconceptosDTO actualizar(@RequestBody HhvcoHistorvarconceptosDTO hhvcoHistorvarconceptosDTO) throws InvalidParameterException {
        return negocioHhvcoHistorvarconceptos.actualizar(hhvcoHistorvarconceptosDTO);
    }

    @DeleteMapping("/eliminar/{hhvcoIderegistr}")
    @Override
    public String eliminar(@PathVariable Integer hhvcoIderegistr) {
        negocioHhvcoHistorvarconceptos.eliminar(hhvcoIderegistr);
        return "Registro eliminado";
    }

    @GetMapping("/{hhvcoIderegistr}")
    @Override
    public HhvcoHistorvarconceptosDTO consultarPorId(@PathVariable Integer hhvcoIderegistr) {
        return negocioHhvcoHistorvarconceptos.consultarPorId(hhvcoIderegistr);
    }
    @PostMapping("/actualizarConceptosAseo")
    public Boolean actualizarConceptosValorRango(@RequestBody Map<String, Object> parametros) {
        Map<String, Object> objeto = (Map<String, Object>) parametros.get("objeto");
        AuditoriaDTO auditoriaDTO = JwtUtil.auditoriaDTO;
        Integer id_empresa = auditoriaDTO.getIdEmpresa();
        Integer id_usuario = auditoriaDTO.getIdUsuario();
        Integer mes = Integer.parseInt(objeto.get("mes").toString());
        Integer anio = Integer.parseInt(objeto.get("anio").toString());
        return negocioHhvcoHistorvarconceptos.actualizarConceptosValorRango(id_empresa, id_usuario, mes, anio);
    }

    @PostMapping("/sincronizarConceptosAseo")
    public Integer sincronizarConceptosValorRango(@RequestBody Map<String, Object> parametros) {
        Map<String, Object> objeto = (Map<String, Object>) parametros.get("objeto");
        Integer mes = Integer.parseInt(objeto.get("mes").toString());
        Integer anio = Integer.parseInt(objeto.get("anio").toString());
        return negocioHhvcoHistorvarconceptos.sincronizarConceptosValorRango(mes, anio);
    }

    @PostMapping("/cancelarConceptosAseo")
    public String cancelarConceptosValorRango(@RequestBody Map<String, Object> parametros) {
        Map<String, Object> objeto = (Map<String, Object>) parametros.get("objeto");
        Integer mes = Integer.parseInt(objeto.get("mes").toString());
        Integer anio = Integer.parseInt(objeto.get("anio").toString());
        negocioHhvcoHistorvarconceptos.cancelarConceptosValorRango(mes, anio);
        return "Cancelación exitosa";
    }

    @GetMapping("/aprobados/{anio}/{mes}")
    public List<Object> listarAprobados(@PathVariable("anio") Integer y, @PathVariable("mes") Integer m) {
        return  negocioHhvcoHistorvarconceptos.aprobados(m, y);
    }

    @GetMapping("/consultar")
    @Override
    public List<HhvcoHistorvarconceptosDTO> consultar(Long filterBy, String orderBy, Integer from, Integer to) {
        return null;
    }

    @GetMapping("/listar")
    @Override
    public List<HhvcoHistorvarconceptosDTO> listar() {
        return negocioHhvcoHistorvarconceptos.listar();
    }

    @GetMapping("/listarSincronizacion/{anio}/{mes}")
    @Override
    public List<HhvcoHistorvarconceptosDTO> listarRecientes(@PathVariable("anio") Integer anio, @PathVariable("mes") Integer mes) {
        System.out.println("anio: " + anio + " mes: " + mes);
        return negocioHhvcoHistorvarconceptos.listarRecientes(anio,mes).stream()
                .map(obj -> {
                    Object[] row = (Object[]) obj;
                    HhvcoHistorvarconceptosDTO dto = new HhvcoHistorvarconceptosDTO();
                    dto.setHhvcoIderegistr((Integer) row[0]);
                    dto.setEmpIderegistro((Integer) row[1]);
                    dto.setHvtconIderegistr(Long.parseLong(row[2].toString()));
                    dto.setDhvtcIderegistr((Integer) row[3]);
                    dto.setUniConceptoLiq((Integer) row[4]);
                    dto.setNombreConLiq((String) row[5]);
                    dto.setUniConceptoVartar((Integer) row[6]);
                    dto.setNombreConVartar((String) row[7]);
                    dto.setConRangoinicio((Integer) row[8]);
                    dto.setConRangofin((Integer) row[9]);
                    dto.setHhvcoValor((BigDecimal) row[10]);
                    dto.setAnioActualizar((Integer) row[11]);
                    dto.setMesActualizar((Integer) row[12]);
                    dto.setHhvcoFecharegistro((Timestamp) row[13]);
                    dto.setHhvcoFechataras((Timestamp) row[14]);
                    dto.setUsuIderegistro((Integer) row[15]);
                    dto.setHhvcoEstado((String) row[16]);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @GetMapping("/existePeriodo/{anio}/{mes}")
    public Boolean existePeriodo(@PathVariable("anio") Integer anio, @PathVariable("mes") Integer mes) {
        return negocioHhvcoHistorvarconceptos.existePeriodo(mes, anio);
    }


}
