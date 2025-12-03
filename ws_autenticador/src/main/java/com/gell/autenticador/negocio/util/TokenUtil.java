package com.gell.autenticador.negocio.util;

import com.gell.estandar.constante.EMensajeEstandar;
import com.gell.estandar.dto.AuditoriaDTO;
import com.gell.estandar.excepcion.AplicacionExcepcion;
import com.gell.estandar.util.LogUtil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.Map;

@SuppressWarnings("UseSpecificCatch")
public final class TokenUtil {

  private final static String CLAVE = "GrupoLlanogas";
  private final static int EXPIRACION = 600000;

  public static String generarToken(AuditoriaDTO auditoria) throws AplicacionExcepcion {
      
    String token;
    LocalDateTime fecha = LocalDateTime.now();
    token = Jwts.builder()
            .setSubject(String.valueOf(System.currentTimeMillis()))
            .setId(String.valueOf(auditoria.getId()))
            .setIssuedAt(Date.from(fecha.atZone(ZoneId.systemDefault()).toInstant()))
            .setExpiration(
                    Date.from(fecha.plusMinutes(EXPIRACION)
                            .atZone(ZoneId.systemDefault())
                            .toInstant())
            )
            .claim("idEmpresa", auditoria.getIdEmpresa())
            .claim("idAcceso", auditoria.getId())
            .claim("idUsuario", auditoria.getIdUsuario())
            .claim("info", auditoria.getParametros())
            .signWith(SignatureAlgorithm.HS256, CLAVE.getBytes())
            .compact();
    return "Bearer " + token;
  }

  public static AuditoriaDTO validarToken(String token)
          throws AplicacionExcepcion
  {
    try {
      Jws<Claims> tokenConvertido = Jwts.parser()
              .setSigningKey(CLAVE.getBytes("UTF-8"))
              .parseClaimsJws(token);
      Claims cuerpoToken = tokenConvertido.getBody();
      LocalDateTime fecha = cuerpoToken.getExpiration().toInstant().atZone(ZoneId.systemDefault())
              .toLocalDateTime();
      if (fecha.isBefore(LocalDateTime.now())) {
        throw new AplicacionExcepcion(EMensajeEstandar.ERROR_SESION_EXPIRADO);
      }
      //Colocar la validación del token con la base de datos
      String id = cuerpoToken.getId();
      AuditoriaDTO auditoria = new AuditoriaDTO()
              .setId(id)
              .setIdEmpresa(cuerpoToken.get("idEmpresa", Integer.class))
              .setIdUsuario(cuerpoToken.get("idUsuario", Integer.class))
              .setParametros((Map<String, String>) cuerpoToken.get("info"));
      return auditoria;
    } catch (AplicacionExcepcion ex) {
      throw ex;
    } catch (Exception ex) {
      LogUtil.error(ex);
      throw new AplicacionExcepcion(EMensajeEstandar.ERROR_TOKEN_CORRUPTO);
    }
  }

}
