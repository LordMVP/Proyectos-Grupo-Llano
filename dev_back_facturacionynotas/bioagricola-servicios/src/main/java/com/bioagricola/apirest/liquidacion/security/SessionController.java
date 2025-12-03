package com.bioagricola.apirest.liquidacion.security;

import com.bioagricola.apirest.liquidacion.web.servicio.utils.ConstantesServicios;
import com.bioagricola.apirest.modelo.entidades.Usuarios;
import com.bioagricola.apirest.modelo.manejadores.UsuariosRepository;
import com.gell.estandar.comunicacion.ClienteToken;
import com.gell.estandar.constante.EAplicacion;
import com.gell.estandar.dto.AutenticacionDTO;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Objects;

@RestController
public class SessionController {
    private final UsuariosRepository usuariosRepository;

    public SessionController(UsuariosRepository usuariosRepository) {
        this.usuariosRepository = usuariosRepository;
    }

    @PostMapping(value = "/login", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<JwtResponse> login(@RequestBody AutenticacionDTO autenticacionDTO) {

        try {
            return ResponseEntity.ok(Objects.requireNonNull(loginProcess(autenticacionDTO)));
        } catch (Exception ex) {

            return ResponseEntity.badRequest().body(null);
        }
    }

    private JwtResponse loginProcess(AutenticacionDTO autenticacionDTO) {
        JwtResponse response;

        try {
            ClienteToken clienteToken = new ClienteToken(EAplicacion.PRISMA, ConstantesServicios.URL_SERVICIO_TOKEN);
            Usuarios usuario = this.usuariosRepository.findByUsuLogin(autenticacionDTO.getUsuario()).orElse(new Usuarios());

            autenticacionDTO.setClave(usuario.getUsuarioPas());

            String token = clienteToken.autenticar(autenticacionDTO);
            response = new JwtResponse(token);
        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }

        return response;
    }
}
