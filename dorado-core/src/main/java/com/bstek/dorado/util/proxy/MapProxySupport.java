package com.bstek.dorado.util.proxy;

import java.util.Collection;
import java.util.Map;
import java.util.Set;

/**
 * {@link java.util.Map}代理的抽象支持类。
 *
 */
public abstract class MapProxySupport<K, V> implements Map<K, V> {

	/**
	 * target
	 */
	protected Map<K, V> target;

	/**
	 * @param target 被代理{@link java.util.Map}对象。
	 */
	public MapProxySupport(Map<K, V> target) {
		this.target = target;
	}

	/**
	 * 返回被代理的{@link java.util.Map}对象。
	 */
	public Map<K, V> getTarget() {
		return target;
	}

	@Override
	public int size() {
		return target.size();
	}

	@Override
	public boolean isEmpty() {
		return target.isEmpty();
	}

	@Override
	public boolean containsKey(Object key) {
		return target.containsKey(key);
	}

	@Override
	public boolean containsValue(Object value) {
		return target.containsValue(value);
	}

	@Override
	public V get(Object key) {
		return target.get(key);
	}

	@Override
	public V put(K key, V value) {
		return target.put(key, value);
	}

	@Override
	public V remove(Object key) {
		return target.remove(key);
	}

	@Override
	public void putAll(Map<? extends K, ? extends V> t) {
		target.putAll(t);
	}

	@Override
	public void clear() {
		target.clear();
	}

	@Override
	public Set<K> keySet() {
		return target.keySet();
	}

	@Override
	public Collection<V> values() {
		return target.values();
	}

	@Override
	public Set<Map.Entry<K, V>> entrySet() {
		return target.entrySet();
	}

	@Override
	public boolean equals(Object o) {
		return target.equals(o);
	}

	@Override
	public int hashCode() {
		return target.hashCode();
	}

}
