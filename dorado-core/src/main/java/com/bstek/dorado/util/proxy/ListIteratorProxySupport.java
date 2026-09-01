package com.bstek.dorado.util.proxy;

import java.util.ListIterator;

/**
 * {@link java.util.ListIterator}代理的抽象支持类。
 *
 */
public abstract class ListIteratorProxySupport<E> implements ListIterator<E> {

	private ListIterator<E> target;

	/**
	 * @param target 被代理{@link java.util.ListIterator}对象。
	 */
	public ListIteratorProxySupport(ListIterator<E> target) {
		this.target = target;
	}

	/**
	 * 返回被代理的{@link java.util.ListIterator}对象。
	 */
	public ListIterator<E> getTarget() {
		return target;
	}

	@Override
	public void add(E o) {
		target.add(o);
	}

	@Override
	public boolean hasNext() {
		return target.hasNext();
	}

	@Override
	public boolean hasPrevious() {
		return target.hasPrevious();
	}

	@Override
	public E next() {
		return target.next();
	}

	@Override
	public int nextIndex() {
		return target.nextIndex();
	}

	@Override
	public E previous() {
		return target.previous();
	}

	@Override
	public int previousIndex() {
		return target.previousIndex();
	}

	@Override
	public void remove() {
		target.remove();
	}

	@Override
	public void set(E o) {
		target.set(o);
	}

}
