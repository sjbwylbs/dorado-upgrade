package com.bstek.dorado.util.proxy;

import java.io.ObjectStreamException;
import java.io.Serializable;
import java.util.Collection;
import java.util.Iterator;

/**
 * {@link java.util.Collection}代理的抽象支持类。
 *
 */
public abstract class CollectionProxySupport<E> implements Collection<E>, Serializable {

	private static final long serialVersionUID = -6529194580197068453L;

	private Collection<E> target;

	/**
	 * @param target 被代理的{@link java.util.Collection}对象。
	 */
	public CollectionProxySupport(Collection<E> target) {
		setTarget(target);
	}

	/**
	 * 设置被代理的{@link java.util.Collection}对象。
	 */
	protected void setTarget(Collection<E> target) {
		this.target = target;
	}

	/**
	 * 返回被代理的{@link java.util.Collection}对象。
	 */
	public Collection<E> getTarget() {
		return target;
	}

	@Override
	public boolean add(E o) {
		return target.add(o);
	}

	@Override
	public boolean addAll(Collection<? extends E> c) {
		return target.addAll(c);
	}

	@Override
	public void clear() {
		target.clear();
	}

	@Override
	public boolean contains(Object o) {
		return target.contains(o);
	}

	@Override
	public boolean containsAll(Collection<?> c) {
		return target.containsAll(c);
	}

	@Override
	public boolean equals(Object o) {
		return target.equals(o);
	}

	@Override
	public int hashCode() {
		return target.hashCode();
	}

	@Override
	public boolean isEmpty() {
		return target.isEmpty();
	}

	@Override
	public Iterator<E> iterator() {
		return target.iterator();
	}

	@Override
	public boolean remove(Object o) {
		return target.remove(o);
	}

	@Override
	public boolean removeAll(Collection<?> c) {
		return target.removeAll(c);
	}

	@Override
	public boolean retainAll(Collection<?> c) {
		return target.retainAll(c);
	}

	@Override
	public int size() {
		return target.size();
	}

	@Override
	public Object[] toArray() {
		return target.toArray();
	}

	@Override
	public <T> T[] toArray(T[] a) {
		return target.toArray(a);
	}

	public Object writeReplace() throws ObjectStreamException {
		return target;
	}

}
