package com.bstek.dorado.data.config.definition;

import java.util.Collection;
import java.util.Comparator;
import java.util.Set;
import java.util.TreeSet;

import com.bstek.dorado.data.listener.GenericObjectListener;

public final class GenericObjectListenerRegistry {

	private GenericObjectListenerRegistry() {
	}

	@SuppressWarnings("rawtypes")
	private static Set<GenericObjectListener<?>> listeners = new TreeSet<>(
			new Comparator<GenericObjectListener>() {
				private static final int DEFAULT_ORDER = 999;

				@Override
				public int compare(GenericObjectListener o1, GenericObjectListener o2) {
					int order1 = (o1 instanceof GenericObjectListener) ? o1.getOrder() : DEFAULT_ORDER;
					int order2 = (o2 instanceof GenericObjectListener) ? o2.getOrder() : DEFAULT_ORDER;
					int result = order1 - order2;
					if (result == 0) {
						result = o1.hashCode() - o2.hashCode();
						if (result == 0) {
							result = -1;
						}
					}
					return result;
				}
			});

	public static void addListener(GenericObjectListener<?> listener) {
		listeners.add(listener);
	}

	public static Collection<GenericObjectListener<?>> getListeners() {
		return listeners;
	}

}
