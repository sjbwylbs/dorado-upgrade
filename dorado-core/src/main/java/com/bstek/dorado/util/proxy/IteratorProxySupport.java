package com.bstek.dorado.util.proxy;

import java.util.Iterator;

/**
 * {@link java.util.Iterator}代理的抽象支持类。
 *
 */
public abstract class IteratorProxySupport<E> implements Iterator<E> {

	private Iterator<E> target;

	/**
	 * @param target 被代理{@link java.util.Iterator}对象。
	 */
	public IteratorProxySupport(Iterator<E> target) {
		this.target = target;
	}

	/**
	 * 返回被代理的{@link java.util.Iterator}对象。
	 */
	public Iterator<E> getTarget() {
		return target;
	}

	@Override
	public boolean hasNext() {
		return target.hasNext();
	}

	@Override
	public E next() {
		return target.next();
	}

	@Override
	public void remove() {
		target.remove();
	}

}
