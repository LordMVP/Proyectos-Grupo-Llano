package com.bioagricola.apirest.aprovechamiento.negocio;

import static com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrudImpl.IGNORAR_PARAMETRO_CONSULTA;

import java.lang.reflect.InvocationTargetException;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.xml.ws.http.HTTPException;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.beanutils.BeanUtilsBean;
import org.apache.log4j.Logger;

import com.bioagricola.apirest.modelo.enums.FuncionAgrupamientoJPQL;
import com.bioagricola.apirest.modelo.enums.TipoFiltro;
import com.bioagricola.apirest.modelo.enums.TipoOperador;
import com.bioagricola.apirest.modelo.enums.TipoOrdenamiento;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;
import com.bioagricola.apirest.modelo.manejadores.utils.InformacionAgrupamiento;
import com.bioagricola.apirest.modelo.manejadores.utils.InformacionFiltro;
import com.bioagricola.apirest.modelo.manejadores.utils.InformacionOrdenamiento;
import com.bioagricola.apirest.modelo.manejadores.utils.RangoConsulta;
import com.bioagricola.apirest.modelo.utils.UtilConstantes;

/**
 * Clase abstracta con las operaciones principales utilizadas en el CRUD
 * de los servicios REST.
 * 
 * @author GeneradorCRUD
 */
/**
 * Clase abstracta con las operaciones principales utilizadas en el CRUD
 * de los servicios REST. 
 * @author GeneradorCRUD
 *
 * @param <E> La entidad sobre la cual se realizan las operaciones CRUD o operaciones de negocio
 * @param <D> El DAO asociado a la entidad E que se utiliza para transmitir su información por medio de http
 */
public abstract class NegocioAbstracto<E,D> {
    
    private static final String MENSAJE_ERROR_ATRIBUTO_NO_IDENTIFICADO = "El atributo especificado no existe en la entidad: ";
    
    /**
     * Invoca el método decodificarFiltro validando antes que el filterBy no
     * sea nulo ni este vacío.
     * 
     * @param filterBy Cadena de caracteres con los parámetros de filtrado. Cada parámetro
     * está compuesto por el nombre del campo por el que se quiere filtrar, seguido por un operador
     * de comparación que puede tomar los valores {@literal '=', '<', '<=', '>', '>=', ':NOTLIKE:', ':LIKE:'}, y por último el valor
     * por el que se quiere filtrar. Los filtros se concatenan por el símbolo {@literal '&' (AND) o '|' (OR)}.
     * Ej. Una secuencia de parámetros de filtrado puede ser {@literal customerId>1&customerName:LIKE:juan}
     * @return Una lista con los filtros parseados a su correspondiente clase java 
     * @throws InvalidParameterException Excepción lanzada cuando algunos de los parámetros de la url tenía un error de sintáxis por lo que no pudo ser procesado correctamente
     */
    protected List<InformacionFiltro> invocarDecodificacionFiltro(String filterBy) 
                throws InvalidParameterException{
        
        List<InformacionFiltro> filtros = null;
        if(filterBy!=null && !filterBy.isEmpty()){
            filtros = decodificarFiltro(filterBy);
        }
        
        return filtros;    
    }
    
    /**
     * Invoca el método decodificarOrdenamiento validando antes que el orderBy no
     * sea nulo ni este vacío.
     * 
     * @param orderBy Cadena de caracteres con los parámetros de ordenamiento. Cada parámetro
     * está compuesto por el nombre del campo por el que se quiere ordenar, seguido por el símbolo '$' y 
     * posteriormente por los valores 'ASC' o 'DESC'. Estos dos ultimos valores son opcionales ya que si
     * no se especifica por defecto se asume que el ordenamiento es de forma Ascendente. Si se coloca más de un
     * parámetro debe ir separado por coma : ','.
     * @return Un lista con las condiciones de ordenamiento parseadas a su correspondiente clase java
     * @throws InvalidParameterException Excepción lanzada cuando algunos de los parámetros de la url tenía un error de sintáxis por lo que no pudo ser procesado correctamente
     */
    protected List<InformacionOrdenamiento> invocarDecodificacionOrdenamiento(String orderBy) 
                throws InvalidParameterException{
        
        List<InformacionOrdenamiento> ordenamiento = null;
        if(orderBy!=null && !orderBy.isEmpty()){
            ordenamiento = decodificarOrdenamiento(orderBy);
        }      
        
        return ordenamiento;    
    }
    
    /**
     * Construye la información de agrupamiento para la consulta que se extrae 
     * de la url.
     * 
     * @param atributo El atributo de la entidad para el cual se quiere consultar
     * la lista de valores.
     * @return La información de agrupamiento a ejecutar en la consulta SELECT
     * @throws InvalidParameterException Si el atributo especificado no existe en la entidad T
     */
    protected InformacionAgrupamiento decodificarInformacionAgrupamiento(String atributo) 
                throws InvalidParameterException{
                
        if(atributo==null || atributo.isEmpty() || !entidadContieneAtributo(atributo)){
            throw new InvalidParameterException(MENSAJE_ERROR_ATRIBUTO_NO_IDENTIFICADO+atributo);
        }        
        
        return new InformacionAgrupamiento(FuncionAgrupamientoJPQL.DISTINCT, atributo);    
    }
    
    /**
     * Copia el valor que contienen los atributos del objeto fuente 
     * a los atributos del objeto destino cuyos nombres sean exactamente iguales.
     * Los atributos que no coinciden se omiten (Se dejan tal cual como estaban 
     * en el objeto destino).
     * 
     * @param destino objeto al que se le van a setear los valores de sus atributos
     * @param fuente objeto del que se copian los valores de los atributos
     */
    protected void copiarPropiedades(Object destino, Object fuente) {
        BeanUtilsBean.getInstance().getConvertUtils().register(false, false, 0);
        try {
            BeanUtils.copyProperties(destino, fuente);
        } catch (IllegalAccessException | InvocationTargetException ex) {
            getLogger().error(ex);
            throw new HTTPException(500);
        }
        
    }
    
    /**
     * Convierte una lista de la entidad E a una lista de DAOs D correspondientes
     * a la entidad E.
     * 
     * @param entidades Lista de entidades a ser transformada
     * @return  Una lista con los DAOs correspondientes a las entidades que se pasaron como parámetro
     */
    protected List<D> convertirListaEntidadesADao(List<E> entidades){
        List<D> listaDAO = new ArrayList<>();
        for(E entidad : entidades){       
            listaDAO.add(convertirEntidadADao(entidad));
        }
        
        return listaDAO;
    }
    
    /**
     * Convierte la entidad E que se pasa como parámetro a su correspondiente DAO D.
     * 
     * @param entidad Entidad a ser trasnformada
     * @return Un DAO D con la información de la entidad que se pasó como parámetro
     */
    protected D convertirEntidadADao(E entidad){
        
        D dao = instanciarDAO();
        copiarPropiedades(dao, entidad);  
        
        return dao;
    }
    
    /**
     * Devuelve los filtros que venían definidos en la cadena que se pasa como 
     * parámetro.
     * 
     * @param filterBy Cadena de caracteres con los parámetros de filtrado. Cada parámetro
     * está compuesto por el nombre del campo por el que se quiere filtrar, seguido por un operador
     * de comparación que puede tomar los valores {@literal '=', '<', '<=', '>', '>=', ':NOTLIKE:', ':LIKE:'}, y por último el valor
     * por el que se quiere filtrar. Los filtros se concatenan por el símbolo {@literal '&' (AND) o '|' (OR)}.
     * Ej. Una secuencia de parámetros de filtrado puede ser {@literal customerId>1&customerName:LIKE:juan}
     * @return  Una lista con los filtros parseados a su correspondiente clase java 
     */
    private List<InformacionFiltro> decodificarFiltro(String filterBy) throws InvalidParameterException{
        List<InformacionFiltro> filtros = new ArrayList<>();           
        
        int iteracion = 1;
        for(String condicion : decodificarParametrosFiltro(filterBy)){
            TipoFiltro tipoFiltro = identificarTipoFiltro(condicion);            
            String[] campoValor = condicion.split(tipoFiltro.getIdReducido());

            String campo = campoValor[0];
            if(!entidadContieneAtributo(campo)){
                throw new InvalidParameterException(MENSAJE_ERROR_ATRIBUTO_NO_IDENTIFICADO+campo);
            }

            String valor = campoValor[1];            
            if(valor.isEmpty()){
                throw new InvalidParameterException("No se especico un valor por el cual filtrar el campo.");
            }

            TipoOperador tipoOperador = identificarTipoOperador(filterBy, condicion);
            
            String nombre = campo + "_" + iteracion;
            filtros.add(new InformacionFiltro(tipoFiltro, campo, valor, tipoOperador, nombre));
            
            iteracion++;
        }
                
        return filtros;
    }
    
    /**
     * Identifica el tipo de operador (AND o OR) que concatena la condicion que se pasa
     * como parámetro con la siguiente condición. Si es la última condición devuelve AND.
     * 
     * @param filterBy Cadena de caracteres con los parámetros de filtrado. Cada parámetro
     * está compuesto por el nombre del campo por el que se quiere filtrar, seguido por un operador
     * de comparación que puede tomar los valores {@literal '=', '<', '<=', '>', '>=', ':NOTLIKE:', ':LIKE:'}, y por último el valor
     * por el que se quiere filtrar. Los filtros se concatenan por el símbolo {@literal '&' (AND) o '|' (OR)}.
     * Ej. Una secuencia de parámetros de filtrado puede ser {@literal customerId>1&customerName:LIKE:juan}
     * @param condicion La condición (o parámetro) para la cual se quiere identificar el concatenador
     * @return El TipoOperador de concatenación correspondiente a la condición
     */
    private TipoOperador identificarTipoOperador(String filterBy, String condicion){
        int index = filterBy.indexOf(condicion);
        if(index+condicion.length()==filterBy.length()){
            //Corresponde a la última condición por lo que no importa el operador que se coloque
            //Por defecto se pone AND
            return TipoOperador.AND;
        }else{
            return TipoOperador.obtenerTipoOperador(String.valueOf(filterBy.charAt(index+condicion.length())));
        }
    }
    
    /**
     * Devuelve los ordenamientos que venían definidos en la cadena que se pasa como 
     * parámetro.
     * 
     * @param orderBy Cadena de caracteres con los parámetros de ordenamiento. Cada parámetro
     * está compuesto por el nombre del campo por el que se quiere ordenar, seguido por el símbolo '$' y 
     * posteriormente por los valores 'ASC' o 'DESC'. Estos dos ultimos valores son opcionales ya que si
     * no se especifica por defecto se asume que el ordenamiento es de forma Ascendente. Si se coloca más de un
     * parámetro debe ir separado por coma : ','.
     * @return Una lista con las condiciones de ordenamiento parseadas a su correspondiente clase java
     */
    private List<InformacionOrdenamiento> decodificarOrdenamiento(String orderBy) throws InvalidParameterException{
        List<InformacionOrdenamiento> ordenamientos = new ArrayList<>();
        
        for(String order : decodificarParametrosOrderBy(orderBy)){
            String[] campoDireccion = order.split(UtilConstantes.CARACTER_DE_ESCAPE+UtilConstantes.SEPARADOR_HTTP_ORDER_BY);
            String campo = campoDireccion[0];
            if(!entidadContieneAtributo(campo)){
                throw new InvalidParameterException(MENSAJE_ERROR_ATRIBUTO_NO_IDENTIFICADO+campo);
            }
            
            TipoOrdenamiento tipoOrdenamiento;            
            if(campoDireccion.length==2){
                tipoOrdenamiento = TipoOrdenamiento.obtenerTipoOrdenamiento(campoDireccion[1]);
            }else if(campoDireccion.length==1){
                tipoOrdenamiento = TipoOrdenamiento.ASCENDENTE;
            }else{
                throw new InvalidParameterException("El parametro especificado para el campo: " + campo+ ", tiene un error de sintaxis.");
            }
            
            ordenamientos.add(new InformacionOrdenamiento(tipoOrdenamiento, campo));
        }
        
        return ordenamientos;
    }
   
	 
    /**
     * Devuelve los parametros que se pasan dentro del String cada parametro
     * esta separado por el carácter & o por el caracter |
     * La estructura del parametro es:
     * 1. Nombre campo por el que se va filtrar
     * 2. Operador de comparación (Exacto, Like, etc -> TipoFiltro)
     * 3. Valor del campo
     * 4. Operador de concatenación
     * 
     * Ej. nombre=david&apellido!=sepulveda devuelve una lista con los siguientes elementos:
     * 1. nombre=david
     * 2. apellido!=sepulveda
     * 
     * @param filterBy Cadena de caracteres con los parámetros de filtrado. Cada parámetro
     * está compuesto por el nombre del campo por el que se quiere filtrar, seguido por un operador
     * de comparación que puede tomar los valores {@literal '=', '<', '<=', '>', '>=', ':NOTLIKE:', ':LIKE:'}, y por último el valor
     * por el que se quiere filtrar. Los filtros se concatenan por el símbolo {@literal '&' (AND) o '|' (OR)}.
     * Ej. Una secuencia de parámetros de filtrado puede ser {@literal customerId>1&customerName:LIKE:juan}
     * @return Una lista con cada una de las condiciones identificadas en el filterBy
     */
    private List<String> decodificarParametrosFiltro(String filterBy){
        List<String> parametros = new ArrayList<>();
        for(String temp : filterBy.split(TipoOperador.AND.getIdReducido())){
            String[] x = temp.split(UtilConstantes.CARACTER_DE_ESCAPE+TipoOperador.OR.getIdReducido());
            parametros.addAll(Arrays.asList(x));
        }
        
        return parametros;
    }
    
    /**
     * Devuelve los parametros que se pasan dentro del String cada parametro
     * esta separado por el carácter & o por el caracter |
     * La estructura del parametro es:
     * 1. Nombre campo por el que se va filtrar
     * 2. Operador de comparación de división ':'
     * 3. Direccionalidad del ordenamiento (TipoOrdenamiento)
     * 
     * Ej. nombre:ASC&apellido:DESC devuelve dos parámetros:
     * 1. nombre:ASC
     * 2. apellido:DESC
     * 
     * @param orderBy Cadena de caracteres con los parámetros de ordenamiento. Cada parámetro
     * está compuesto por el nombre del campo por el que se quiere ordenar, seguido por el símbolo '$' y 
     * posteriormente por los valores 'ASC' o 'DESC'. Estos dos ultimos valores son opcionales ya que si
     * no se especifica por defecto se asume que el ordenamiento es de forma Ascendente. Si se coloca más de un
     * parámetro debe ir separado por coma : ','.
     * @return 
     */
    private List<String> decodificarParametrosOrderBy(String orderBy){
        
        return Arrays.asList(orderBy.split(UtilConstantes.SEPARADOR_PARAMETROS_CONSULTA));
    }
    
    /**
     * Identifica el TipoFiltro que viene definido en el parametro del filterBy
     * 
     * @param parametro Cualquiera de los parametros que viene definido en la condición filterBy 
     * de la consulta. 
     * La estructura del parametro es:
     * 1. Nombre campo por el que se va filtrar
     * 2. Operador de comparación de división ':'
     * 3. Direccionalidad del ordenamiento (TipoOrdenamiento)
     * 
     * @return
     * @throws InvalidParameterException Excepción lanzada cuando algunos de los parámetros de la url tenía un error de sintáxis por lo que no pudo ser procesado correctamente
     */
    private TipoFiltro identificarTipoFiltro(String parametro) throws InvalidParameterException{
        TipoFiltro tipoFiltro;
        if(parametro.contains(TipoFiltro.DIFERENTE.getIdReducido())){
            tipoFiltro = TipoFiltro.DIFERENTE;
        }else if(parametro.contains(TipoFiltro.LIKE.getIdReducido())){
            tipoFiltro = TipoFiltro.LIKE;
        }else if(parametro.contains(TipoFiltro.MENOR_O_IGUAL.getIdReducido())){
            tipoFiltro = TipoFiltro.MENOR_O_IGUAL;
        }else if(parametro.contains(TipoFiltro.MAYOR_O_IGUAL.getIdReducido())){
            tipoFiltro = TipoFiltro.MAYOR_O_IGUAL;
        }else if(parametro.contains(TipoFiltro.MAYOR.getIdReducido())){
            tipoFiltro = TipoFiltro.MAYOR;
        }else if(parametro.contains(TipoFiltro.MENOR.getIdReducido())){
            tipoFiltro = TipoFiltro.MENOR;
        }else if(parametro.contains(TipoFiltro.NOT_LIKE.getIdReducido())){
            tipoFiltro = TipoFiltro.NOT_LIKE;
        }else if(parametro.contains(TipoFiltro.EXACTO.getIdReducido())){
            tipoFiltro = TipoFiltro.EXACTO;
        }else{
            throw new InvalidParameterException("Operador de comparación no identificado en filtro: "+parametro);
        }
        
        return tipoFiltro;
        
    }
    
    /**
     * Valida que los parámetros from y to de la consulta esten correctamente definidos.
     * Es decir que si ambos están definidos, ambos sean mayores o iguales a 0, y que el 
     * parámetro to sea mayor o igual al parámetro from. Si los parámetros son válidos
     * devuelve un objeto RangoConsulta con la información contenida en ellos, de lo contrario lanza una excepción.
     * 
     * @param from Entero que especifica el numero de registro inicial que devuelve al consulta
     * @param to Entero que especifica el numero de registro final que devuelve al consulta
     * @return RangoConsulta Condición de filtrado de la consulta
     * @throws InvalidParameterException Excepción lanzada cuando algunos de los parámetros de la url tenía un error de sintáxis por lo que no pudo ser procesado correctamente
     */
    protected RangoConsulta validarParametrosBloque(Integer from, Integer to) 
                throws InvalidParameterException{
        
        RangoConsulta rango = new RangoConsulta();
        
        if(sonValoresNulos(from,to)){
            rango.setFrom(IGNORAR_PARAMETRO_CONSULTA);
            rango.setTo(IGNORAR_PARAMETRO_CONSULTA);
        }else{
            if(sonValoresNoNulos(from, to)){
                if(sonValoresNegativos(from, to)){
                    throw new InvalidParameterException("Se especifico un parametro negativo como valor de restriccion de resultados (from o to)");
                }else if(to<from){
                    throw new InvalidParameterException("El parametro to no puede ser menor al parametro from");
                }else{
                    rango.setFrom(from);
                    rango.setTo(to);
                }
            }else{
                throw new InvalidParameterException("Se especifico solo un valor de restriccion de resultados (from o to)");
            }
        }
        
        return rango;
        
    }
    
    /**
     * Devuelve verdadero si ambos parametros son diferentes de nulo.
     * @param from Valor entero
     * @param to Valor entero
     * @return verdadero si ambos parametros son diferentes de nulo.
     */
    private boolean sonValoresNoNulos(Integer from , Integer to){
        return from!=null && to!=null;
    }
    
    /**
     * Devuelve verdadero si ambos parametros son nulos.
     * @param from Valor entero
     * @param to Valor entero
     * @return verdadero si ambos parametros son nulos.
     */
    private boolean sonValoresNulos(Integer from , Integer to){
        return from==null && to==null;
    }
    
    /**
     * Devuelve verdadero si alguno de los valores es negativo.
     * @param from Valor entero
     * @param to Valor entero
     * @return verdadero si alguno de los valores es negativo.
     */
    private boolean sonValoresNegativos(Integer from , Integer to){
        return from<0 || to<0;
    }
    
    /**
     * Devuelve verdadero si la entidad principal del servicio E contiene el atributo
     * que se pasa como parámetro.
     * 
     * @param nombreAtributo Nombre del atributo de la entidad E
     * @return boolean
     */
    protected abstract boolean entidadContieneAtributo(String nombreAtributo);
    
    /**
     * Devuelve el logger del servicio que extiende está clase. 
     * 
     * @return  Logger
     */
    protected abstract Logger getLogger();
    
    /**
     * Devuelve una nueva instancia del DAO D
     * 
     * @return Una instancia sin valores asignados del Dao D
     */
    protected abstract D instanciarDAO();
    
    /**
     * Imprime en el log el llamado al servicio que se pasa como parámetro, 
     * imprimiendo cada uno de los parámetros que recibe.
     * 
     * @param className Nombre de la clase que contiene al servicio
     * @param nombreServicio Nombre del servicio
     * @param parameters Parámetros que recibe el servicio.
     */
    protected void logService(String className, String nombreServicio, Object... parameters){
        getLogger().debug(className+"."+nombreServicio+" --> Inicio");
        for(int i =0; i<parameters.length; i++){
            getLogger().debug(className+"."+nombreServicio+" --> parametro +"+i+": "+parameters[i]);
        }
    }

	public Object getValorFactura(BigInteger idFactura) {
		// TODO Auto-generated method stub
		return null;
	}

	public Object valorFactura(BigInteger idFactura) {
		// TODO Auto-generated method stub
		return null;
	}
    
}
