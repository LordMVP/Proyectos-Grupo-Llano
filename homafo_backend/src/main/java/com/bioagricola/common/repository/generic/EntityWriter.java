package com.bioagricola.common.repository.generic;

import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Stream;

import javax.persistence.EntityManager;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.bioagricola.common.util.CounterReducer;

@Component
@Transactional
public class EntityWriter<T> implements Writer<T> {
	
	@Autowired
	private EntityManager manager;
	
	@Override
	@Transactional
	public Integer write(Stream<T> list) {
		CounterReducer<T> reducer = new CounterReducer<>();
		AtomicReference<Integer> counter = new AtomicReference<>(reducer.initialValue());
		list.forEach(item -> {
			manager.persist(item);
			counter.set(reducer.reduce(counter.get(), reducer.map(item)));
		});
		return counter.get();
	}
	
	@Override
	@Transactional
	public Integer merge(Stream<T> list) {
		AtomicInteger counter = new AtomicInteger(0);
		list.forEach(item-> {
			manager.merge(item);
			counter.incrementAndGet();
		});
		return counter.get();
	}
	
}
