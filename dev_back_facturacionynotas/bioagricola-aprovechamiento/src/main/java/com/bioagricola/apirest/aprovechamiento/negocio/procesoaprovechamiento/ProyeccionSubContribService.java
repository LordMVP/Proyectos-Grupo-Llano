package com.bioagricola.apirest.aprovechamiento.negocio.procesoaprovechamiento;

import com.bioagricola.apirest.modelo.entidades.aseo.AprProyeccionSubContrib;
import com.bioagricola.apirest.modelo.manejadores.IManejadorAprProyeccionSubContrib;
import com.bioagricola.apirest.modelo.manejadores.IManejadorUniUnidad;
import com.bioagricola.apirest.modelo.manejadores.UsuariosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ProyeccionSubContribService {

    private final IManejadorAprProyeccionSubContrib manejadorProyeccion;
    private final IManejadorUniUnidad manejadorUniUnidad;

    @Autowired
    public ProyeccionSubContribService(IManejadorAprProyeccionSubContrib manejadorProyeccion,
                                       IManejadorUniUnidad manejadorUniUnidad) {
        this.manejadorProyeccion = manejadorProyeccion;
        this.manejadorUniUnidad = manejadorUniUnidad;
    }
    public List<Map<String, Object>> obtenerEstratos() {
        return manejadorUniUnidad.findEstratos();
    }

    public List<AprProyeccionSubContrib> listarTodos() {
        return manejadorProyeccion.findAllByOrderByAnioAscEstratoAsc();
    }

    public List<AprProyeccionSubContrib> listarPorAnio(Integer anio) {
        return manejadorProyeccion.findByAnio(anio);
    }

    public List<AprProyeccionSubContrib> listarActuales() {
        return manejadorProyeccion.findByEsActualTrue();
    }

    @Transactional
    public AprProyeccionSubContrib crear(AprProyeccionSubContrib proyeccion, String usuario) {
        proyeccion.setCreadoPor(usuario);
        proyeccion.setFechaCreacion(LocalDateTime.now());
        proyeccion.setFueActualizado(false);
        return manejadorProyeccion.save(proyeccion);
    }

    @Transactional
    public AprProyeccionSubContrib actualizar(Long id, AprProyeccionSubContrib proyeccion, String usuario) {
        Optional<AprProyeccionSubContrib> existente = manejadorProyeccion.findById(id);

        if (existente.isPresent()) {
            AprProyeccionSubContrib proyeccionExistente = existente.get();

            proyeccionExistente.setAnio(proyeccion.getAnio());
            proyeccionExistente.setEstrato(proyeccion.getEstrato());
            proyeccionExistente.setValor(proyeccion.getValor());
            proyeccionExistente.setEsActual(proyeccion.getEsActual());
            proyeccionExistente.setFueActualizado(true);
            proyeccionExistente.setActualizadoPor(usuario);
            proyeccionExistente.setFechaActualizacion(LocalDateTime.now());

            return manejadorProyeccion.save(proyeccionExistente);
        }

        throw new RuntimeException("Proyección con ID " + id + " no encontrada");
    }

    @Transactional
    public AprProyeccionSubContrib actualizar(Long id, String usuario) {
        Optional<AprProyeccionSubContrib> existente = manejadorProyeccion.findById(id);

        if (existente.isPresent()) {
            AprProyeccionSubContrib proyeccionExistente = existente.get();
            proyeccionExistente.setEsActual(false);
            proyeccionExistente.setFueActualizado(true);
            proyeccionExistente.setActualizadoPor(usuario);
            proyeccionExistente.setFechaActualizacion(LocalDateTime.now());

            return manejadorProyeccion.save(proyeccionExistente);
        }

        throw new RuntimeException("Proyección con ID " + id + " no encontrada");
    }
}