package com.bioagricola.homologaciones.service.impl;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import com.bioagricola.common.util.ENUM_COLUMN_TYPE_DATA;
import com.bioagricola.common.util.ENUM_IMCOL_TIPO_RESOLUCION;
import com.bioagricola.homologaciones.dto.ParametrizacionDiminsRequest;
import com.bioagricola.homologaciones.dto.ParametrizacionImcolRequest;
import com.bioagricola.homologaciones.dto.ParametrizacionIminsRequest;
import com.bioagricola.homologaciones.dto.ParametrizacionImportacionRequest;
import com.bioagricola.homologaciones.dto.ParametrizacionImportacionUpdateRequest;
import com.bioagricola.homologaciones.entity.DiminsDimportarInsertsEntity;
import com.bioagricola.homologaciones.entity.ImarcArchivosImportacion;
import com.bioagricola.homologaciones.entity.ImcolImportarColumnaEntity;
import com.bioagricola.homologaciones.entity.IminsImportarInsertsEntity;
import com.bioagricola.homologaciones.repository.ImarcArchivosImportacionRepository;

@Service
public class ImarcArchivosImportacionService extends AbstractService<ImarcArchivosImportacion,Long>
{

	@Autowired
	private ImarcArchivosImportacionRepository repository;

	public ImarcArchivosImportacionService() {
		super(ImarcArchivosImportacion.class);
		// TODO Auto-generated constructor stub
	}


	public List<HashMap<String, Object>> datosArchivo(Integer imarcId)
	{
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.repository.InformacionArchivo(imarcId))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("impar_ideregistro", tmp2[0]);
    		tmp1.put("mpar_columna_interna",tmp2[1]);
    		tmp1.put("impar_columna_externa",tmp2[2]);
    		tmp1.put("impar_tabla_interna",tmp2[3]);
    		tmp1.put("impar_tipo_dato",tmp2[4]);
    		tmp1.put("impar_obligatorio",tmp2[5]);
    		tmp1.put("impar_homologa",tmp2[6]);
    		tmp1.put("imarc_ideregistro",tmp2[7]);
    		tmp1.put("impar_tabla_referencia",tmp2[8]);
    		tmp1.put("impar_columna_referencia",tmp2[9]);
    		tmp1.put("impar_encabezado",tmp2[10]);
    		tmp1.put("detalles",datosArchivoDetalles(((BigInteger) tmp2[0]).intValue()));
    		total.add(tmp1);
    	}
    	return total;
	}

	public List<HashMap<String, Object>> datosArchivoDetalles(Integer imparId)
	{
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.repository.InformacionArchivoDetalle(imparId))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("dimpa_ideregistro", tmp2[0]);
    		tmp1.put("impar_ideregistro",tmp2[1]);
    		tmp1.put("dimpa_valor_externo",tmp2[2]);
    		tmp1.put("dimpa_valor_interno",tmp2[3]);
    		tmp1.put("dimpa_valor_interno_nombre",tmp2[4]);
    		total.add(tmp1);
    	}
    	return total;
	}

	public List<HashMap<String, Object>> datosALlanogas(String fecha1, String fecha2, Integer ciclo)
	{
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.repository.InformacionLLanogas(fecha1, fecha2, ciclo))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("codigo", tmp2[0]);
    		tmp1.put("ubicacion",tmp2[1]);
    		tmp1.put("estrato",tmp2[2]);
    		tmp1.put("municipio",tmp2[3]);
    		tmp1.put("nombre",tmp2[4]);
    		tmp1.put("identificacion",tmp2[5]);
    		tmp1.put("direccion",tmp2[6]);
    		tmp1.put("ciclo",tmp2[7]);
    		tmp1.put("tipoUso",tmp2[8]);
    		tmp1.put("contador",tmp2[9]);
    		tmp1.put("catastral",tmp2[10]);
    		tmp1.put("fechaInicio",tmp2[11]);
    		total.add(tmp1);
    	}
    	return total;
	}

	public List<HashMap<String, Object>> tiposArchivos()
	{
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.repository.tiposArchivos())
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("imarc_ideregistro", tmp2[0]);
    		tmp1.put("imarc_nombre_archivo", tmp2[1]);
    		tmp1.put("imarc_tipo_archivo", tmp2[2]);
			tmp1.put("imarc_tipo_proceso", tmp2[3]);
    		total.add(tmp1);
    	}
    	return total;
	}

	public List<HashMap<String, Object>> datosArchivoEditar(Integer imarcId)
	{
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.repository.InformacionArchivo(imarcId))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("ideregistro", tmp2[0]);
    		tmp1.put("columnaInterna",tmp2[1]);
    		tmp1.put("columnaExterna",tmp2[2]);
    		tmp1.put("tablaInterna",tmp2[3]);
    		tmp1.put("tipoDato",tmp2[4]);
    		tmp1.put("obligatorio",tmp2[5]);
    		tmp1.put("homologa",tmp2[6]);
    		tmp1.put("imarc_ideregistro",tmp2[7]);
    		tmp1.put("tablaReferencia",tmp2[8]);
    		tmp1.put("columnaReferencia",tmp2[9]);
    		tmp1.put("encabezado",tmp2[10]);
    		tmp1.put("detalles",datosArchivoDetalles(((BigInteger) tmp2[0]).intValue()));
    		total.add(tmp1);
    	}
    	return total;
	}

	public Integer insertarImarcBasico(ParametrizacionImportacionRequest request)
	{
		try
		{
			ImarcArchivosImportacion imarc=new ImarcArchivosImportacion();
			imarc.setImarcNombreArchivo(request.getImarcNombreArchivo());
			imarc.setImarcTipoArchivo(request.getImarcTipoArchivo());
			imarc.setImarcTipoProceso(request.getImarcTipoProceso());
			imarc.setImarcEstado("A");
			if(request.getDetallesImcol()==null)
			{
				request.setDetallesImcol(new ArrayList<ParametrizacionImcolRequest>());
			}
			if(imarc.getImcolList()==null)
			{
				imarc.setImcolList(new ArrayList<ImcolImportarColumnaEntity>());
			}
			if(imarc.getIminsList()==null)
			{
				imarc.setIminsList(new ArrayList<IminsImportarInsertsEntity>());
			}
			///Imco

			for(ParametrizacionImcolRequest tmp :request.getDetallesImcol())
			{
				ImcolImportarColumnaEntity detalle = new ImcolImportarColumnaEntity();
				detalle.setImarcIderegistro(imarc);
				detalle.setImcolDescripcion(tmp.getDescripcion());
				detalle.setImcolJson(tmp.getJson().length()>0 ? tmp.getJson() : null);
				detalle.setImcolNombre(tmp.getNombre());
				detalle.setImcolObligatorio(tmp.getObligatorio());
				detalle.setImcolTipoDato(tmp.getTipoDato());
				detalle.setImcolTipoResolucion(ENUM_IMCOL_TIPO_RESOLUCION.valueOf(tmp.getTipoResolucion()));
				detalle.setImcolValidador(tmp.getValidador());
				imarc.getImcolList().add(detalle);
				//System.err.println("detalle salio "+detalle.getImcolDescripcion()+" "+detalle.getImcolJson()+" "+detalle.getImcolNombre()+" "+detalle.getImcolObligatorio()+" "+detalle.getImcolTipoDato()+" "+detalle.getImcolTipoResolucion()+" "+detalle.getImcolValidador());
			}
			///Imins
			for(ParametrizacionIminsRequest tmp2: request.getDetallesImins())
			{
				IminsImportarInsertsEntity detalle2=new IminsImportarInsertsEntity();
				if(detalle2.getDiminsList()==null)
				{
					detalle2.setDiminsList(new ArrayList<DiminsDimportarInsertsEntity>());
				}
				detalle2.setImarcIderegistro(imarc);
				detalle2.setIminsTabla(tmp2.getTabla());
				detalle2.setIminsOrden(tmp2.getOrden());
				detalle2.setIminsJson(tmp2.getJson().length()>0 ? tmp2.getJson() : null);
				if(detalle2.getDiminsList()==null)
				{
					detalle2.setDiminsList(new ArrayList<DiminsDimportarInsertsEntity>());
				}
				detalle2.setDiminsList(agregarDimins(tmp2.getDetalleDimins(),detalle2));
				//System.out.println("que llego "+tmp2.getTabla()+" " +tmp2.getOrden() + " "+tmp2.getJson());
				imarc.getIminsList().add(detalle2);
			}
			//System.err.println("termine imins...");
			repository.save(imarc);
			return 1;
		}catch (Exception e) {
			System.err.println("cual es el error insertar "+e.getMessage());
			return 0;
		}
	}

	public List<DiminsDimportarInsertsEntity> agregarDimins(List<ParametrizacionDiminsRequest> request,IminsImportarInsertsEntity imins)
	{
		List<DiminsDimportarInsertsEntity> resultado=new ArrayList<>();
		for(ParametrizacionDiminsRequest tmp: request)
		{
			DiminsDimportarInsertsEntity tmp2=new DiminsDimportarInsertsEntity();
			tmp2.setDiminsColumnName(tmp.getNombreColumna());
			tmp2.setDiminsJson(tmp.getJson().length()> 0 ? tmp.getJson() : null);
			tmp2.setDiminsLongitud(tmp.getLongitud());
			tmp2.setDiminsObligatorio(tmp.getObligatorio());
			//tmp2.setDiminsTipoDato(tmp.getTipoDato());
			System.out.println("Tipo de Dato "+tmp.getTipoDato());
			if(tmp.getTipoDato() == null || tmp.getTipoDato().isEmpty() || tmp.getTipoDato().equals("--")){
				tmp2.setDiminsTipoDato(ENUM_COLUMN_TYPE_DATA.TEXTO);
			}else {
				tmp2.setDiminsTipoDato(ENUM_COLUMN_TYPE_DATA.valueOf(tmp.getTipoDato()));
			}

			tmp2.setDiminsTipoResolucion(ENUM_IMCOL_TIPO_RESOLUCION.valueOf(tmp.getTipoResolucion()));
			tmp2.setDiminsValidador(tmp.getValidador());
			tmp2.setIminsIderegistro(imins);
			tmp2.setDiminsEditable(tmp.getDiminseditable());
			tmp2.setDiminsSugerido(tmp.getDiminsSugerido());
			//tmp2.setDiminsJsonSugerido(tmp.getDiminsJsonSugerido()!=null ? tmp.getDiminsJsonSugerido() : null );
			tmp2.setDiminsJsonSugerido(tmp.getDiminsJsonSugerido().length()>0 ? tmp.getDiminsJsonSugerido() : null );
			resultado.add(tmp2);
		}
		return resultado;
	}

	///update
	public Integer actualizarImarcBasico(ParametrizacionImportacionUpdateRequest request)
	{
		try
		{
			ImarcArchivosImportacion imarc=new ImarcArchivosImportacion();
			imarc.setImarcIderegistro(Long.valueOf(request.getIdImarc()));
			//imarc=repository.buscarIdImarc(Long.valueOf(request.getIdImarc()));
			imarc.setImarcNombreArchivo(request.getImarcNombreArchivo());
			imarc.setImarcTipoArchivo(request.getImarcTipoArchivo());
			imarc.setImarcTipoProceso(request.getImarcTipoProceso()==null ? null : Integer.parseInt(request.getImarcTipoProceso()));
			imarc.setImarcEstado(request.getImarcEstado());
			if(imarc.getImcolList()==null)
			{
				imarc.setImcolList(new ArrayList<ImcolImportarColumnaEntity>());
			}
			if(imarc.getImcolList()==null)
			{
				imarc.setImcolList(new ArrayList<ImcolImportarColumnaEntity>());
			}
			if(imarc.getIminsList()==null)
			{
				imarc.setIminsList(new ArrayList<IminsImportarInsertsEntity>());
			}
			///Imco
			//System.err.println("termine imarc ");

			for(ParametrizacionImcolRequest tmp :request.getDetallesImcol())
			{
				//System.err.println("que llego del json "+tmp.getJson());
				ImcolImportarColumnaEntity detalle = new ImcolImportarColumnaEntity();
				detalle.setImarcIderegistro(imarc);
				if(tmp.getIdImcol()>0)
				{
					detalle.setImcolIderegistro(Long.valueOf(tmp.getIdImcol()));
				}
				detalle.setImcolDescripcion(tmp.getDescripcion());
				detalle.setImcolJson(tmp.getJson()!=null ? tmp.getJson() : null);
				detalle.setImcolNombre(tmp.getNombre());
				detalle.setImcolObligatorio(tmp.getObligatorio());
				detalle.setImcolTipoDato(tmp.getTipoDato());
				detalle.setImcolTipoResolucion(ENUM_IMCOL_TIPO_RESOLUCION.valueOf(tmp.getTipoResolucion()));
				detalle.setImcolValidador(tmp.getValidador());
				imarc.getImcolList().add(detalle);
			}
			//System.err.println("termine Imcol ");

			///Imins
			for(ParametrizacionIminsRequest tmp2: request.getDetallesImins())
			{
				IminsImportarInsertsEntity detalle2=new IminsImportarInsertsEntity();
				if(detalle2.getDiminsList()==null)
				{
					detalle2.setDiminsList(new ArrayList<DiminsDimportarInsertsEntity>());
				}
				if(tmp2.getIdImins()>0)
				{
					detalle2.setIminsIderegistro(Long.valueOf(tmp2.getIdImins()));
				}
				detalle2.setImarcIderegistro(imarc);
				detalle2.setIminsTabla(tmp2.getTabla());
				detalle2.setIminsOrden(tmp2.getOrden());
				detalle2.setIminsJson(tmp2.getJson()!=null ? tmp2.getJson() : null);
				if(detalle2.getDiminsList()==null)
				{
					detalle2.setDiminsList(new ArrayList<DiminsDimportarInsertsEntity>());
				}
				detalle2.setDiminsList(actualizarDimins(tmp2.getDetalleDimins(),detalle2));
				imarc.getIminsList().add(detalle2);
			}

			//System.err.println("termine imins...");
			repository.save(imarc);
			return 1;
		}catch (Exception e) {
			System.err.println("cual es el error "+e.getMessage());
			return 0;
		}
	}

	public List<DiminsDimportarInsertsEntity> actualizarDimins(List<ParametrizacionDiminsRequest> request,IminsImportarInsertsEntity imins)
	{
		List<DiminsDimportarInsertsEntity> resultado=new ArrayList<>();
		for(ParametrizacionDiminsRequest tmp: request)
		{
			DiminsDimportarInsertsEntity tmp2=new DiminsDimportarInsertsEntity();
			if(tmp.getIdDimins()>0)
			{
				tmp2.setDiminsIderegistro(Long.valueOf(tmp.getIdDimins()));
			}
			tmp2.setDiminsColumnName(tmp.getNombreColumna());
			tmp2.setDiminsJson(tmp.getJson()!=null ? tmp.getJson() : null);
			tmp2.setDiminsLongitud(tmp.getLongitud());
			tmp2.setDiminsObligatorio(tmp.getObligatorio());
			tmp2.setDiminsTipoDato(tmp.getTipoDato()==null ? null : ENUM_COLUMN_TYPE_DATA.valueOf(tmp.getTipoDato()));
			tmp2.setDiminsTipoResolucion(tmp.getTipoResolucion()==null ? null :ENUM_IMCOL_TIPO_RESOLUCION.valueOf(tmp.getTipoResolucion()));
			tmp2.setDiminsValidador(tmp.getValidador());
			tmp2.setIminsIderegistro(imins);
			tmp2.setDiminsEditable(tmp.getDiminseditable());
			tmp2.setDiminsSugerido(tmp.getDiminsSugerido());
			tmp2.setDiminsJsonSugerido(tmp.getDiminsJsonSugerido()!=null ? tmp.getDiminsJsonSugerido() : null );
			resultado.add(tmp2);
		}
		return resultado;
	}



	//listas de datos

	public List<HashMap<String, Object>> datosImarc(Integer imarcId)
	{
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.repository.buscarImarc(imarcId))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("imarcNombreArchivo", tmp2[0]);
    		tmp1.put("imarcTipoArchivo", tmp2[1]);
    		tmp1.put("idImarc", tmp2[2]);
			tmp1.put("imarcTipoProceso", tmp2[3]);
			tmp1.put("imarcEstado", tmp2[4]);
    		tmp1.put("detallesImcol", datosImcol(imarcId));
    		tmp1.put("detallesImins", datosImins(imarcId));
    		total.add(tmp1);
    	}
    	return total;
	}

	public List<HashMap<String, Object>> datosImcol(Integer imarcId)
	{
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.repository.buscarImcol(imarcId))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("nombre", tmp2[0]);
    		tmp1.put("descripcion", tmp2[1]);
    		tmp1.put("tipoDato", tmp2[2]);
    		tmp1.put("obligatorio", tmp2[3]);
    		tmp1.put("validador", tmp2[4]);
    		tmp1.put("tipoResolucion", tmp2[5]);
    		tmp1.put("json", tmp2[6]);
    		tmp1.put("idImcol", tmp2[7]);
    		total.add(tmp1);
    	}
    	return total;
	}

	public List<HashMap<String, Object>> datosImins(Integer imarcId)
	{
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.repository.buscarimins(imarcId))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("tabla", tmp2[0]);
    		tmp1.put("orden", tmp2[1]);
    		tmp1.put("json", tmp2[2]);
    		tmp1.put("idImins", tmp2[3]);
    		tmp1.put("detalleDimins", datosDimins(((BigInteger) tmp2[3]).intValue()));
    		total.add(tmp1);
    	}
    	return total;
	}

	public List<HashMap<String, Object>> datosDimins(Integer imins)
	{
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.repository.buscardimins(imins))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("nombreColumna", tmp2[0]);
    		tmp1.put("json", tmp2[1]);
    		tmp1.put("tipoResolucion", tmp2[2]);
    		tmp1.put("tipoDato", tmp2[3]);
    		tmp1.put("validador", tmp2[4]);
    		tmp1.put("obligatorio", tmp2[5]);
    		tmp1.put("longitud", tmp2[6]);
    		tmp1.put("idDimins", tmp2[7]);
    		tmp1.put("diminseditable", tmp2[8]);
    		tmp1.put("diminsSugerido", tmp2[9]);
    		tmp1.put("diminsJsonSugerido", tmp2[10]);
    		total.add(tmp1);
    	}
    	return total;
	}


	@Override
	protected JpaRepository<ImarcArchivosImportacion, Long> getRepository() {
		// TODO Auto-generated method stub
		return repository;
	}


}
