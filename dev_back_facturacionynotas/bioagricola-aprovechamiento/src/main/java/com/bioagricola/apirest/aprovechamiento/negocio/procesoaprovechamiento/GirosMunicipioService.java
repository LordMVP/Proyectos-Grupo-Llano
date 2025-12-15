package com.bioagricola.apirest.aprovechamiento.negocio.procesoaprovechamiento;

import com.bioagricola.apirest.aprovechamiento.dto.CrearGiroMunicipioDTO;
import com.bioagricola.apirest.aprovechamiento.dto.EditarGiroMunicipioDTO;
import com.bioagricola.apirest.modelo.entidades.aseo.AprGirosMunicipio;
import com.bioagricola.apirest.modelo.entidades.aseo.AprGirosMunicipioDetalle;
import com.bioagricola.apirest.modelo.manejadores.IManejadorAprGirosMunicipio;
import com.bioagricola.apirest.modelo.manejadores.IManejadorAprGirosMunicipioDetalle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class GirosMunicipioService {

    private final IManejadorAprGirosMunicipio manejadorGirosMunicipio;
    private final IManejadorAprGirosMunicipioDetalle manejadorGirosMunicipioDetalle;

    @Autowired
    public GirosMunicipioService(IManejadorAprGirosMunicipio manejadorGirosMunicipio,
                                IManejadorAprGirosMunicipioDetalle manejadorGirosMunicipioDetalle) {
        this.manejadorGirosMunicipio = manejadorGirosMunicipio;
        this.manejadorGirosMunicipioDetalle = manejadorGirosMunicipioDetalle;
    }

    public List<AprGirosMunicipio> listarTodos() {
        return manejadorGirosMunicipio.findAllByOrderByFechaPagoDesc();
    }

    public Optional<AprGirosMunicipio> obtenerPorId(Integer id) {
        return manejadorGirosMunicipio.findById(id);
    }

    @Transactional
    public AprGirosMunicipio crear(CrearGiroMunicipioDTO dto, String usuario) {
        // Crear el giro principal
        AprGirosMunicipio giro = new AprGirosMunicipio();
        giro.setFechaPago(dto.getFechaPago());
        giro.setTotalGiroMunicipio(dto.getTotalGiroMunicipio());
        giro.setObservaciones(dto.getObservaciones());
        giro.setUsuarioRegistro(usuario);
        giro.setFechaRegistro(LocalDateTime.now());
        giro.setFechaEdicion(LocalDateTime.now());

        // Guardar el giro principal
        giro = manejadorGirosMunicipio.save(giro);

        // Crear los detalles
        List<AprGirosMunicipioDetalle> detalles = new ArrayList<>();
        for (CrearGiroMunicipioDTO.DetalleGiroDTO detalleDTO : dto.getDetalles()) {
            AprGirosMunicipioDetalle detalle = new AprGirosMunicipioDetalle();
            detalle.setGirosMunicipio(giro);
            detalle.setMesAnioPago(detalleDTO.getMesAnioPago());
            detalle.setValorGirado(detalleDTO.getValorGirado());
            detalles.add(detalle);
        }

        // Guardar los detalles
        if (!detalles.isEmpty()) {
            detalles = (List<AprGirosMunicipioDetalle>) manejadorGirosMunicipioDetalle.saveAll(detalles);
            giro.setDetalles(detalles);
        }

        return giro;
    }

    @Transactional
    public AprGirosMunicipio editar(Integer id, EditarGiroMunicipioDTO dto, String usuario) {
        Optional<AprGirosMunicipio> optionalGiro = manejadorGirosMunicipio.findById(id);
        
        if (!optionalGiro.isPresent()) {
            throw new RuntimeException("Giro con ID " + id + " no encontrado");
        }

        AprGirosMunicipio giro = optionalGiro.get();
        
        // Actualizar datos del giro principal
        giro.setFechaPago(dto.getFechaPago());
        giro.setTotalGiroMunicipio(dto.getTotalGiroMunicipio());
        giro.setObservaciones(dto.getObservaciones());
        giro.setFechaEdicion(LocalDateTime.now());

        // Guardar el giro actualizado
        giro = manejadorGirosMunicipio.save(giro);

        // Procesar detalles
        List<AprGirosMunicipioDetalle> detallesActuales = manejadorGirosMunicipioDetalle.findByGirosMunicipioIdGiro(id);
        
        // Eliminar detalles marcados para eliminar
        List<Integer> idsAEliminar = dto.getDetalles().stream()
                .filter(d -> d.getEliminar() != null && d.getEliminar() && d.getIdDetalle() != null)
                .map(EditarGiroMunicipioDTO.DetalleGiroEditarDTO::getIdDetalle)
                .collect(Collectors.toList());

        if (!idsAEliminar.isEmpty()) {
            manejadorGirosMunicipioDetalle.deleteAllByIdDetalleIn(idsAEliminar);
        }

        // Procesar detalles para actualizar o crear
        List<AprGirosMunicipioDetalle> detallesParaGuardar = new ArrayList<>();
        
        for (EditarGiroMunicipioDTO.DetalleGiroEditarDTO detalleDTO : dto.getDetalles()) {
            if (detalleDTO.getEliminar() != null && detalleDTO.getEliminar()) {
                continue; // Saltar detalles marcados para eliminar
            }

            AprGirosMunicipioDetalle detalle;
            
            if (detalleDTO.getIdDetalle() != null) {
                // Actualizar detalle existente
                detalle = detallesActuales.stream()
                        .filter(d -> d.getIdDetalle().equals(detalleDTO.getIdDetalle()))
                        .findFirst()
                        .orElse(new AprGirosMunicipioDetalle());
            } else {
                // Crear nuevo detalle
                detalle = new AprGirosMunicipioDetalle();
                detalle.setGirosMunicipio(giro);
            }

            detalle.setMesAnioPago(detalleDTO.getMesAnioPago());
            detalle.setValorGirado(detalleDTO.getValorGirado());
            detallesParaGuardar.add(detalle);
        }

        // Guardar todos los detalles
        if (!detallesParaGuardar.isEmpty()) {
            detallesParaGuardar = (List<AprGirosMunicipioDetalle>) manejadorGirosMunicipioDetalle.saveAll(detallesParaGuardar);
        }

        // Recargar el giro con sus detalles actualizados
        return manejadorGirosMunicipio.findById(id).orElse(giro);
    }

    @Transactional
    public void eliminar(Integer id) {
        if (!manejadorGirosMunicipio.existsById(id)) {
            throw new RuntimeException("Giro con ID " + id + " no encontrado");
        }
        
        // Eliminar detalles primero
        manejadorGirosMunicipioDetalle.deleteByGirosMunicipioIdGiro(id);
        
        // Eliminar el giro principal
        manejadorGirosMunicipio.deleteById(id);
    }
}
