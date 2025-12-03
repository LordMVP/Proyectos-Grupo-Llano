package com.bioagricola.common.util;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.json.JSONObject;

import com.bioagricola.homologaciones.dto.basic.BasicCompactDTO;
import com.google.gson.Gson;



public class BasicReflectionConvert<T> {

	private Class<T> modelClass;
	private String id;
	private String descripcion;
	private String codigo;
	private String json;
	private String[] properties;

	public BasicReflectionConvert(Class<T> classModel, String id, String descripcion) {
		this(classModel, id, descripcion, null);
	}

	public BasicReflectionConvert(Class<T> classModel, String id, String descripcion, String codigo) {
		this.modelClass = classModel;
		this.id = id;
		this.descripcion = descripcion;
		this.codigo = codigo;
		this.properties = null;
	}

	public BasicReflectionConvert(Class<T> classModel, String id, String descripcion, String codigo,
			String[] properties) {
		this(classModel, id, descripcion, codigo);
		this.properties = properties;
	}

	public BasicReflectionConvert(Class<T> classModel, String id, String descripcion, String codigo, String json) {
		this(classModel, id, descripcion, codigo);
		this.json = json;
	}

	public BasicReflectionConvert(Class<T> classModel, String id, String descripcion, String codigo, String json,
			String[] properties) {
		this(classModel, id, descripcion, codigo);
		this.json = json;
		this.properties = properties;
	}

	public T convert(BasicCompactDTO dto) {

		try {
			T instance = this.modelClass.newInstance();

			if (dto.getId() != null) {
				Field fieldId = this.modelClass.getDeclaredField(this.id);
				fieldId.setAccessible(true);
				fieldId.set(instance, dto.getId());
			}
			if (dto.getNombre() != null) {
				Field fieldDescripcion = this.modelClass.getDeclaredField(this.descripcion);
				fieldDescripcion.setAccessible(true);
				fieldDescripcion.set(instance, dto.getNombre());
			}

			if (this.codigo != null && dto.getCodigo() != null) {
				Field fieldCodigo = this.modelClass.getDeclaredField(this.codigo);
				fieldCodigo.setAccessible(true);
				fieldCodigo.set(instance, dto.getCodigo());
			}
			if (properties != null && dto.getProperties() != null) {
				for (String property : this.properties) {
					Field field = this.modelClass.getDeclaredField(property);
					field.setAccessible(true);
					field.set(instance, dto.getProperties().get(property));
				}

			}
			if (json != null && dto.getJson() != null) {
				Field jsonField = this.modelClass.getDeclaredField(this.json);
				jsonField.setAccessible(true);
				jsonField.set(instance, dto.getJson().toString());
			}

			return instance;
		} catch (InstantiationException | IllegalAccessException | NoSuchFieldException | SecurityException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return null;
	}

	public BasicCompactDTO convert(T item) {
		try {
			BasicCompactDTO newDto = new BasicCompactDTO();

			Field fieldId = this.modelClass.getDeclaredField(this.id);
			fieldId.setAccessible(true);
			Integer id = (Integer) fieldId.get(item);
			newDto.setId(id);

			Field fieldDescripcion = this.modelClass.getDeclaredField(this.descripcion);
			fieldDescripcion.setAccessible(true);
			Object descripcion = fieldDescripcion.get(item);
			newDto.setNombre(descripcion.toString());

			if (this.codigo != null) {
				Field fieldCodigo = this.modelClass.getDeclaredField(this.codigo);
				fieldCodigo.setAccessible(true);
				Object codigo = fieldCodigo.get(item);
				newDto.setCodigo(codigo.toString());
			}
			if (properties != null) {
				HashMap<String, Object> propertiesMap = new HashMap<>();
				for (String property : this.properties) {
					Field field = this.modelClass.getDeclaredField(property);
					field.setAccessible(true);
					Object fieldValue = field.get(item);
					propertiesMap.put(property, fieldValue);
				}
				newDto.setProperties(propertiesMap);
			}
			if (json != null) {
				Field jsonField = this.modelClass.getDeclaredField(this.json);
				jsonField.setAccessible(true);
				String json = (String) jsonField.get(item);
				Gson gson = new Gson();
				JSONObject jsonObject = gson.fromJson(json, JSONObject.class);
				newDto.setJson(jsonObject);
			}
			return newDto;
		} catch (IllegalArgumentException | IllegalAccessException | NoSuchFieldException | SecurityException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

	public List<BasicCompactDTO> convert(List<T> items) {
		List<BasicCompactDTO> itemsDto = new ArrayList<BasicCompactDTO>();
		for (T item : items) {
			itemsDto.add(this.convert(item));
		}
		return itemsDto;
	}

	public T mapEntityToEntity(T source, T target) {
		try {
			for (Field f : source.getClass().getDeclaredFields()) {
				f.setAccessible(true);
				// System.out.println(f.getName() +":"+f.get(source).toString());
				if (f.get(source) != null) {
					System.out.println("Source " + f.getName() + ":" + f.get(source).toString());
					System.out.println("Target " + f.getName() + ":" + f.get(target));
					if (!f.get(source).equals(f.get(target)))
						f.set(target, f.get(source));
				}
			}
		} catch (IllegalArgumentException | IllegalAccessException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return target;
	}

}
