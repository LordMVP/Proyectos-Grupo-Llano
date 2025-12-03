package com.bioagricola.homologaciones.dto.facade;

import java.lang.reflect.Field;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.JoinColumn;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import com.bioagricola.common.entity.UniUnidad;
import com.bioagricola.common.service.ParParametroService;
import com.bioagricola.homologaciones.dto.basic.UniUnidadDTO;
import com.fasterxml.jackson.annotation.JsonRawValue;
import com.google.gson.Gson;


public abstract class AbstractDTOFacade<E, D> {

	@Value("#{HOMOLOGACIONES_APP}")
	protected String HOMOLOGACIONES_APP;
	@Value("#{EMPRESA}")
	protected Long EMPRESA;

	@Autowired
	protected ParParametroService parametroService;
	@Autowired
	protected UniUnidadDTOFacade unidadFacade;

	protected JSONObject homologacionesParametros;

	protected Class<E> entityClass;
	protected Class<D> dtoClass;

	public abstract D convertToDto(E entity);

	public abstract E convertToEntity(D dto);

	public AbstractDTOFacade(Class<E> entityClass, Class<D> dtoClass) {
		this.dtoClass = dtoClass;
		this.entityClass = entityClass;
	}

	private void init() {
		this.homologacionesParametros = parametroService.getJSONObjectParameter(this.HOMOLOGACIONES_APP, this.EMPRESA);
		System.out.println(this.homologacionesParametros.toString());
	}

	protected D basicMap(E entity) {
		return null;
	}

	public E mapForUpdate(E source, E target) {
		try {
			E instance = entityClass.newInstance();
			for (Field f : source.getClass().getDeclaredFields()) {
				f.setAccessible(true);
				f.set(instance, f.get(source));
				Field tf = target.getClass().getDeclaredField(f.getName());
				tf.setAccessible(true);
				if (tf.get(target) != null) {
					{
						if (f.get(source) != null && !f.get(source).equals(tf.get(target))) {
							f.set(instance, tf.get(target));
						}
					}
				}
			}
			return instance;
		} catch (IllegalArgumentException | IllegalAccessException | NoSuchFieldException | SecurityException
				| InstantiationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

	protected D mapToDto(E entity) {
		try {
			D instance = dtoClass.newInstance();
			for (Field f : entity.getClass().getDeclaredFields()) {
				f.setAccessible(true);
				try {
					Field tf = instance.getClass().getDeclaredField(f.getName());
					if (f.get(entity) != null) {
						if (f.getType().equals(tf.getType())) {
							tf.setAccessible(true);
							tf.set(instance, f.get(entity));
						} else if (f.getType().equals(String.class) && f.isAnnotationPresent(JsonRawValue.class)) {
							if (tf.getType().equals(JSONObject.class)) {
								tf.setAccessible(true);								
								System.out.println("Convirtiendo JSON : "+(String) f.get(entity));								 
								JSONObject object = new JSONObject((String) f.get(entity));
								System.out.println("Resultado JSON : "+object);
								tf.set(instance, object);
							} else if (tf.getType().equals(JSONArray.class)) {
								tf.setAccessible(true);
								Gson gson = new Gson();
								tf.set(instance, gson.fromJson((String) f.get(entity), JSONArray.class));
							}
						} else if (f.getType().equals(UniUnidad.class) && tf.getType().equals(UniUnidadDTO.class)) {
							tf.setAccessible(true);
							tf.set(instance, unidadFacade.convertToDto((UniUnidad) f.get(entity)));
						} else if(f.isAnnotationPresent(JoinColumn.class) && tf.getType().equals(Long.class)) {
							String referencedColumnName= f.getAnnotation(JoinColumn.class).referencedColumnName();
							Object reference = f.get(entity);
							for(Field objectField : reference.getClass().getDeclaredFields()) {
								objectField.setAccessible(true);
								if( objectField.isAnnotationPresent(Column.class)) {
									Column col = objectField.getAnnotation(Column.class);
									if(col.name().equals(referencedColumnName)) {
										if(objectField.getType().equals(tf.getType())) {
											tf.setAccessible(true);
											tf.set(instance, objectField.get(reference));
										}
									}
								}
							}							
						}
					}
				} catch (NoSuchFieldException e) {
					//System.err.println("No se encontro: " + e.getMessage());
				}
			}
			return instance;
		} catch (IllegalArgumentException | IllegalAccessException | SecurityException | InstantiationException e) {
			e.printStackTrace();
		}
		return null;
	}

	protected E mapToEntity(D dto) {
		try {
			E instance = entityClass.newInstance();
			for (Field f : dto.getClass().getDeclaredFields()) {
				System.out.println("Evaluando "+dto.getClass().getName() + " : " + f.getName());
				f.setAccessible(true);
				try {
					Field tf = instance.getClass().getDeclaredField(f.getName());
					System.out.println("Evaluando Destino "+tf.getName() + " : "+tf.getType().getName());
					if (f.get(dto) != null) {
						if (f.getType().equals(tf.getType())) {
							tf.setAccessible(true);
							tf.set(instance, f.get(dto));
						} else if ((tf.getType().equals(String.class) && tf.isAnnotationPresent(JsonRawValue.class))) {							
							if (f.getType().equals(JSONObject.class)) {
								tf.setAccessible(true);
								JSONObject object = (JSONObject) f.get(dto);
								System.out.println("Object convertido "+object);
								System.out.println("Object convertido "+object.toString());
								tf.set(instance,object.toString());
							} else if (f.getType().equals(JSONArray.class)) {
								tf.setAccessible(true);
								tf.set(instance, ((JSONArray) f.get(dto)).toString());
							}
						} else if (f.getType().equals(UniUnidadDTO.class) && tf.getType().equals(UniUnidad.class)) {
							tf.setAccessible(true);
							tf.set(instance, unidadFacade.convertToEntity((UniUnidadDTO) f.get(dto)));
						}else if(tf.isAnnotationPresent(JoinColumn.class)) {
							Object tmp = tf.getType().newInstance();
							for(Field objectField :tmp.getClass().getDeclaredFields()) {
								objectField.setAccessible(true);
								if(objectField.isAnnotationPresent(Id.class)){
									System.out.println("Referencia inderecta: "+objectField.getName());
									tf.setAccessible(true);
									Object refer = f.get(dto);
									System.out.println("Referencia inderecta: "+refer.getClass().getName());
									Field fr = refer.getClass().getDeclaredField(objectField.getName());
									fr.setAccessible(true);
									Object refer2 = fr.get(refer);									
									System.out.println("Referencia inderecta: "+refer.getClass().getName());
									System.out.println("Referencia inderecta: "+refer2.getClass().getName());
									//Field referField = tf.getClass().getField(objectField.getName());
									objectField.set(tmp, refer2);
									//objectField.set(tmp, referField.get(f.get(dto)));
									tf.set(instance, tmp);
								}
							}
							System.out.println(tmp.getClass().getName());
						}
					}
				} catch (NoSuchFieldException e) {
					//System.err.println("No se encontro: " + e.getMessage());
				}
			}
			return instance;
		} catch (IllegalArgumentException | IllegalAccessException | SecurityException | InstantiationException e) {
			e.printStackTrace();
		}
		System.out.println();
		return null;
	}

	protected String getStringParameterValue(String key) {
		this.init();
		return this.homologacionesParametros.getString(key);
	}

	protected Integer getNumberParameterValue(String key) {
		this.init();
		return this.homologacionesParametros.getInt(key);
	}
	protected Long getLongNumberParameterValue(String key) {
		this.init();
		return this.homologacionesParametros.getLong(key);
	}
}
