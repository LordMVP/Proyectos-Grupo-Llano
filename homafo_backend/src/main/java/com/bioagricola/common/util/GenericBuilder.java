package com.bioagricola.common.util;

import java.util.ArrayList;
import java.util.List;
import java.util.function.BiConsumer;
import java.util.function.Consumer;
import java.util.function.Supplier;

public class GenericBuilder<T> {
	
	private final Supplier<T> instantiator;
	
	private List<Consumer<T>> modifiers;
	
	private GenericBuilder(Supplier<T> instantiator) {
		this.instantiator = instantiator;
		this.modifiers = new ArrayList<>();
	}
	
	public static <T> GenericBuilder<T> of(Supplier<T> instantiator) {
		return new GenericBuilder<>(instantiator);
	}
	
	public <U> GenericBuilder<T> with(BiConsumer<T, U> consumer, U value) {
		Consumer<T> modifier = instance -> consumer.accept(instance, value);
		modifiers.add(modifier);
		return this;
    }
	
	public T build() {
		T value = instantiator.get();
		modifiers.forEach(modifier -> modifier.accept(value));
		modifiers.clear();
		return value;
	}
	
}
