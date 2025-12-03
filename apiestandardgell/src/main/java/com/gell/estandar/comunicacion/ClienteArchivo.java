/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.estandar.comunicacion;

import com.gell.estandar.constante.EAplicacion;
import com.gell.estandar.constante.ERuta;
import com.gell.estandar.dto.ArchivoDTO;
import com.gell.estandar.dto.PeticionDTO;
import com.gell.estandar.dto.RespuestaDTO;
import com.gell.estandar.excepcion.AplicacionExcepcion;
import com.gell.estandar.util.ArchivoUtil;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintStream;
import java.lang.reflect.Type;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author God
 */
public class ClienteArchivo {

    private final String servicio;
    private final EAplicacion aplicacion;
    private final String token;

    /**
     * Se toma la dirección del servicio de la propiedad del sistema
     * servidor.archivo.ip
     *
     * @param aplicacion
     * @param token Token generado
     */
    public ClienteArchivo(EAplicacion aplicacion, String token) {
        servicio = System.getProperty("servidor.archivo.ip");
        this.aplicacion = aplicacion;
        this.token = token;
    }

    /**
     * Información necesaria para realizar la petición
     *
     * @param aplicacion
     * @param token Token genérico que se utilizará en todas las aplicaciones
     * @param servicio Dirección donde se encuentra el servicio de adjuntar los
     * archivos
     */
    public ClienteArchivo(EAplicacion aplicacion, String token, String servicio) {
        this.aplicacion = aplicacion;
        this.token = token;
        this.servicio = servicio;
    }

    /**
     * Guarda en AzDigital un listado de archivos
     *
     * @param listaArchivos Lista de archivos a guardar
     * @return Deveulve la información del archivo con ID que quedó en AZDigital
     * @throws AplicacionExcepcion Error al adjuntar los archivos en AZDigital
     */
    public RespuestaDTO<List<ArchivoDTO>> adjuntar(List<ArchivoDTO> listaArchivos)
            throws AplicacionExcepcion {
        String parametros = new Gson().toJson(listaArchivos);
        ERuta ruta = ERuta.ARCHIVO_ADJUNTAR;
        Type tipo = new TypeToken<RespuestaDTO<List<ArchivoDTO>>>() {
        }.getType();
        PeticionDTO peticion = new PeticionDTO()
                .setRuta(servicio + ruta.getUrl())
                .setMetodo(ruta.getMetodo())
                .setTipoContenido(ruta.getTipo())
                .setParametros(parametros)
                .setToken(token)
                .setTipo(tipo)
                .setNombreAplicacion(aplicacion.getNombreAplicacion());
        return Cliente.conectar(peticion);

    }

    public RespuestaDTO<ArchivoDTO> adjuntar(ArchivoDTO infoArchivo)
            throws AplicacionExcepcion {
        String parametros = new Gson().toJson(infoArchivo);
        ERuta ruta = ERuta.ARCHIVO_ADJUNTAR;
        Type tipo = new TypeToken<RespuestaDTO<ArchivoDTO>>() {
        }.getType();
        PeticionDTO peticion = new PeticionDTO()
                .setRuta(servicio + ruta.getUrl())
                .setMetodo(ruta.getMetodo())
                .setTipoContenido(ruta.getTipo())
                .setParametros(parametros)
                .setToken(token)
                .setNombreAplicacion(aplicacion.getNombreAplicacion())
                .setTipo(tipo);
        return Cliente.conectar(peticion);
    }

    /**
     * Adjunta un archivo en AZDigital
     *
     * @param archivo Información del archivo a adjuntar
     * @return Respuesta genérica con toda la información del archivo como quedó
     * en AZDigital
     * @throws AplicacionExcepcion Error al adjuntar
     */
    public RespuestaDTO<ArchivoDTO> adjuntar(MultipartFile archivo)
            throws AplicacionExcepcion {
        ArchivoDTO infoArchivo = ArchivoUtil.convertir(archivo);
        List<ArchivoDTO> lista = new ArrayList<>();
        lista.add(infoArchivo);
        String parametros = new Gson().toJson(lista);
        ERuta ruta = ERuta.ARCHIVO_ADJUNTAR;
        Type tipo = new TypeToken<RespuestaDTO<List<ArchivoDTO>>>() {
        }.getType();
        PeticionDTO peticion = new PeticionDTO()
                .setRuta(servicio + ruta.getUrl())
                .setMetodo(ruta.getMetodo())
                .setTipoContenido(ruta.getTipo())
                .setParametros(parametros)
                .setToken(token)
                .setTipo(tipo)
                .setNombreAplicacion(aplicacion.getNombreAplicacion());
        RespuestaDTO<List<ArchivoDTO>> respuesta = Cliente.conectar(peticion);
        return new RespuestaDTO<ArchivoDTO>()
                .setDatos(respuesta.getDatos().get(0));
    }

    /**
     * Adjunta una lista de archivos al programa de AZDigital
     *
     * @param archivo lista de archivos que se van a subir a AZDigital
     * @return Información como quedó el archivo
     * @throws AplicacionExcepcion
     */
    public RespuestaDTO<List<ArchivoDTO>> adjuntar(MultipartFile[] archivo)
            throws AplicacionExcepcion {
        List<ArchivoDTO> listaArchivos = ArchivoUtil.convertir(archivo);
        return adjuntar(listaArchivos);
    }

    /**
     * Consulta un archivo en específico
     *
     * @param id Identificador del archivo
     * @return Información del archivo
     * @throws AplicacionExcepcion Error al consultar el archivo
     */
    public RespuestaDTO<ArchivoDTO> consultar(String id)
            throws AplicacionExcepcion {
        ERuta ruta = ERuta.ARCHIVO_CONSULTAR;
        Type tipo = new TypeToken<RespuestaDTO<ArchivoDTO>>() {
        }.getType();
        PeticionDTO peticion = new PeticionDTO()
                .setRuta(servicio + ruta.getUrl())
                .setMetodo(ruta.getMetodo())
                .setTipoContenido(ruta.getTipo())
                .setParametros("id=" + id)
                .setToken(token)
                .setTipo(tipo)
                .setNombreAplicacion(aplicacion.getNombreAplicacion());
        return Cliente.conectar(peticion);
    }

    /**
     * Consulta un archivo en específico
     *
     * @param id Identificador del archivo
     * @return Información del archivo
     * @throws AplicacionExcepcion Error al consultar el archivo
     */
    public byte[] consultarByte(String id)
            throws AplicacionExcepcion {
        ERuta ruta = ERuta.ARCHIVO_CONSULTAR;
        Type tipo = new TypeToken<RespuestaDTO<ArchivoDTO>>() {
        }.getType();
        PeticionDTO peticion = new PeticionDTO()
                .setRuta(servicio + ruta.getUrl())
                .setMetodo(ruta.getMetodo())
                .setTipoContenido(ruta.getTipo())
                .setParametros("id=" + id)
                .setToken(token)
                .setTipo(tipo)
                .setNombreAplicacion(aplicacion.getNombreAplicacion());
        RespuestaDTO<ArchivoDTO> archivo = Cliente.conectar(peticion);
        if (archivo.getCodigo() > 0) {
            String contenido = archivo.getDatos().getContenido();
            return Base64.getDecoder().decode(contenido);
        }

        throw new AplicacionExcepcion(archivo.getCodigo(), archivo.getMensaje());
    }
    
    /**
     * Consulta un archivo en específico
     *
     * @param id Identificador del archivo
     * @return Información del archivo
     * @throws AplicacionExcepcion Error al consultar el archivo
     */
    public ArchivoDTO consultarArchivo(String id)
            throws AplicacionExcepcion {
        ERuta ruta = ERuta.ARCHIVO_CONSULTAR;
        Type tipo = new TypeToken<RespuestaDTO<ArchivoDTO>>() {
        }.getType();
        PeticionDTO peticion = new PeticionDTO()
                .setRuta(servicio + ruta.getUrl())
                .setMetodo(ruta.getMetodo())
                .setTipoContenido(ruta.getTipo())
                .setParametros("id=" + id)
                .setToken(token)
                .setTipo(tipo)
                .setNombreAplicacion(aplicacion.getNombreAplicacion());
        RespuestaDTO<ArchivoDTO> archivo = Cliente.conectar(peticion);
        if(archivo.getDatos()!=null) {
        	return archivo.getDatos();
        }else {
            throw new AplicacionExcepcion(archivo.getCodigo(), archivo.getMensaje());
        }

    }

    public static byte[] Generar_ReporteByte(String str_url, String Parametros) throws AplicacionExcepcion {
        HttpURLConnection cnn = null;
        try {
            URL url = new URL(str_url);
            cnn = (HttpURLConnection) url.openConnection();
            cnn.setRequestMethod("POST");
            cnn.setRequestProperty("Content-Type", "application/json");
            cnn.setDoOutput(true);
            cnn.setDoInput(true);
            try (PrintStream salida = new PrintStream(cnn.getOutputStream())) {
                salida.print(Parametros);
                salida.flush();
            }
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            try (InputStream reader = cnn.getInputStream()) {
                byte[] buffer = new byte[1024];
                int readByte;
                while ((readByte = reader.read(buffer)) != -1) {
                    out.write(buffer, 0, readByte);
                }
                out.flush();
            }
//            PrintStream outFile = new PrintStream("d:\\extracto_.pdf");
//            outFile.write(out.toByteArray());
//            outFile.flush();
//            outFile.close();
            return out.toByteArray();
        } catch (MalformedURLException ex) {
            ex.printStackTrace();
        } catch (IOException ex) {
            ex.printStackTrace();
        } finally {
            if (cnn != null) {
                cnn.disconnect();
            }            
        }
        throw new AplicacionExcepcion(-1 ,"error al generar el reporte ");
    }

}
