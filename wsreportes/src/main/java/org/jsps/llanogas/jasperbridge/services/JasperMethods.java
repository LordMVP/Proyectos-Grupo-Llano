/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.jsps.llanogas.jasperbridge.services;

/**
 *
 * @author pc
 */

import java.io.Serializable;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.ejb.Stateless;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.jsps.llanogas.jasperbridge.db.model.ParametrosReporte;
import org.jsps.llanogas.jasperbridge.model.JasperFormato;

@Stateless
public class JasperMethods implements Serializable
{
    private Connection connection;
    private Context ctx;
    private boolean error;
    private String errorMessage;

    public JasperMethods()
    {
         try {
            System.out.println("Iniciando  Contexto Metodo Constructor JasperMethods");
            ctx = new InitialContext();
        } catch (NamingException ex) {
            Logger.getLogger(UsersService.class.getName()).log(Level.SEVERE, null, ex);
            ex.getStackTrace();
            System.out.println("Error inicializando Contexto Metodo Constructor UsersService: " + ex.getMessage());
            this.errorMessage = ex.getMessage();
            this.error = true;
        }
    }
    
    
    
     private void loadConnection(String jndiJdbc) throws NamingException, SQLException
     {
        if (this.connection == null || this.connection.isClosed()) {
            System.out.println("Iniciando Conexicion a Base de datos ");
            this.connection = ((DataSource) ctx.lookup(jndiJdbc)).getConnection();
        }
    }
     
     public List<ParametrosReporte> BuscarParametros(String jndiJdbc,String nombreReporte, Integer empresa)
     {
         List<ParametrosReporte> listaParametros=new ArrayList<>();
         try
        {   System.out.println("parametros enviados "+jndiJdbc+ " "+nombreReporte+" "+empresa);        
            loadConnection(jndiJdbc);
            String sql = "SELECT tabla.nombre as nombre, tabla.valores as valores, tabla.logo, tabla.tipo as tipo,tabla.sentencia as sentencia FROM ( SELECT jsonb_array_elements(ru.ru_parametros)::json->>'NOMBRE'::TEXT AS nombre, jsonb_array_elements(ru.ru_parametros)::json->>'DESCRIPCION'::TEXT AS descricpion,\n" +
            "jsonb_array_elements(ru.ru_parametros)::json->>'TIPO' AS tipo,jsonb_array_elements(ru.ru_parametros)::json->>'UNIDADES' AS valores, ru.ru_logo as logo,jsonb_array_elements(ru.ru_parametros)::json->>'SENTENCIA' AS sentencia FROM reportes.reu_reporteunidades ru WHERE UPPER(ru.ru_reporte_nombre)= UPPER(?) AND ru.ru_empresa=? ) tabla";
            PreparedStatement statement = this.connection.prepareStatement(sql);
            statement.setString(1, nombreReporte);
            statement.setInt(2, empresa);            
            ResultSet result = statement.executeQuery();                
            while(result.next())
            {
                ParametrosReporte pr=new ParametrosReporte();
                pr.setParametro(result.getString(1));
                pr.setUnidades(result.getString(2));
                pr.setLogo(result.getString(3));
                pr.setTipo(result.getString(4));
                pr.setSentencia(result.getString(5));
                listaParametros.add(pr);
            }

        } catch (SQLException sqex) {
            System.out.println("SQLExcepcion: Error en Metodo BuscarParametros " + sqex.getMessage());
            sqex.getStackTrace();
        } catch (NamingException nmex) {
            System.out.println("NamingException: Error en Metodo BuscarParametros" + nmex.getMessage());
            nmex.getStackTrace();
        } catch (Exception ex) {
            System.out.println("Exception: Error en Metodo BuscarParametros" + ex.getMessage());
            ex.getStackTrace();
            ex.printStackTrace();
        } finally {
            try {
                if (this.connection != null) {
                    this.connection.close();

                }
                System.out.println("Cerrando Exitosamente Conexión a la Base de datos");
            } catch (SQLException ex) {
                Logger.getLogger(UsersService.class.getName()).log(Level.SEVERE, null, ex);
                System.out.println("Error Cerrando la Conexion Jni:" + jndiJdbc);
            }
        }
         return listaParametros;
     }
     
     public List<String> parametrosAdicionales(String jndiJdbc, String nombreReporte, Integer empresa)
    {

        List<String> adicionales=new ArrayList<>();
         try
        {
            System.out.println("parametros enviados "+jndiJdbc+ " "+nombreReporte+" "+empresa);        
            loadConnection(jndiJdbc);
            String sql = "SELECT ru.ru_logo as logo, ru.ru_titulo_empresa as titulo FROM reportes.reu_reporteunidades ru WHERE UPPER(ru.ru_reporte_nombre)= UPPER(?) AND ru.ru_empresa=?";
            PreparedStatement statement = this.connection.prepareStatement(sql);
            statement.setString(1, nombreReporte);
            statement.setInt(2, empresa);            
            ResultSet result = statement.executeQuery();                
            while(result.next())
            {
                adicionales.add(result.getString(1));
                adicionales.add(result.getString(2));
            }

        } catch (SQLException sqex) {
            System.out.println("SQLExcepcion: Error en Metodo parametrosAdicionales " + sqex.getMessage());
            sqex.getStackTrace();
        } catch (NamingException nmex) {
            System.out.println("NamingException: Error en Metodo parametrosAdicionales" + nmex.getMessage());
            nmex.getStackTrace();
        } catch (Exception ex) {
            System.out.println("Exception: Error en Metodo parametrosAdicionales" + ex.getMessage());
            ex.getStackTrace();
            ex.printStackTrace();
        } finally {
            try {
                if (this.connection != null) {
                    this.connection.close();

                }
                System.out.println("Cerrando Exitosamente Conexión a la Base de datos");
            } catch (SQLException ex) {
                Logger.getLogger(UsersService.class.getName()).log(Level.SEVERE, null, ex);
                System.out.println("Error Cerrando la Conexion Jni:" + jndiJdbc);
            }
        }
        return adicionales;
    }
     
     public String convertir(String json)
     {
       String cadena="";  
       try
        {  
            JSONArray jsonArray = new JSONArray(json);
             for (int i = 0; i < jsonArray.length(); i++)
                 {
                     JSONObject jb = jsonArray.getJSONObject(i);
                     //cadena=cadena+","+jb.get("UNIDAD").toString();
                     if(jb.get("UNIDAD") instanceof Integer)
                     {
                         cadena=cadena+(cadena.isEmpty() ? "" : ",")+jb.get("UNIDAD").toString();
                     }
                     else
                     {
                         cadena=cadena+(cadena.isEmpty() ? "" : ",")+"\'"+jb.getString("UNIDAD")+"\'";
                     }

                 }
         }
        catch(JSONException e){e.printStackTrace();}
     return cadena;
     }
     
     public String buscarNombre(String ruta)
     {
         String nombre="";
        String[] partes = ruta.split("/");
	for(String algo:partes)
            {
		    if(algo.indexOf("jrxml")!= -1)
		    {
		        nombre=algo.replace(".jrxml", "");
		    }
            }
        return nombre;
    }
     
    public String convertirFormato(String cadena)
    {        
        String texto="";
        Pattern pat = Pattern.compile("\\\"(.*?)\\\"");
        Matcher mat = pat.matcher(cadena);
        while (mat.find())
        {
                texto=texto + mat.group().replace("\"", "");;
        }
        return texto;
    }
    
     public List<JasperFormato> buscarParametros(String texto)
    {
      
        Pattern pat = Pattern.compile("\\$P\\{(.*?)\\} | \\$P\\!\\{(.*?)\\}");
        Matcher mat = pat.matcher(texto);
        List<JasperFormato> tmp=new ArrayList<>();
        while (mat.find()) {
                tmp.add(new JasperFormato("PARAMETRO", mat.group()));
            } 
            return tmp;
    }
     
     
     public boolean isError() {
        return error;
    }

    public void setError(boolean error) {
        this.error = error;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }
       
}
