package com.bioagricola.common.util;

import java.lang.reflect.Field;

import org.springframework.stereotype.Component;

@Component
public class EntityDTORefectionConverter<S, T> {

	public EntityDTORefectionConverter() {
		// TODO Auto-generated constructor stub
	}

	public T convert(S source, T target) {
		try {

			for (Field f : source.getClass().getDeclaredFields()) {
				f.setAccessible(true);
				Field tf = target.getClass().getDeclaredField(f.getName());
				System.out.println("Field S: " + f.getName() + "," + f.getType().getName() + ": " + tf.getName() + ","
						+ tf.getType().getName());
				if (f.get(source) != null) {
					{
						tf.setAccessible(true);
						tf.set(target, f.get(source));

					}
				}
			}
		} catch (IllegalArgumentException | IllegalAccessException | NoSuchFieldException | SecurityException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return target;
	}
}
