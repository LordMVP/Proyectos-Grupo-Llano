package com.bioagricola.common.repository.generic;

import java.util.stream.Stream;

public interface Writer<T> {
	
	Integer write(Stream<T> list);
	
	Integer merge(Stream<T> list);
	
}
