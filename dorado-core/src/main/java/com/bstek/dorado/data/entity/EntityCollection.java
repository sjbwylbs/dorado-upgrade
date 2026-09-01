package com.bstek.dorado.data.entity;

import java.util.Collection;
import java.util.Iterator;

import com.bstek.dorado.data.type.AggregationDataType;
import com.bstek.dorado.data.type.DataType;

/**
 * 抽象的集合类代理。
 *
 */
public abstract class EntityCollection<E> implements Collection<E> {

	private Collection<E> target;

	/**
	 * 集合的数据类型。
	 */
	private AggregationDataType dataType;

	/**
	 * 集合元素的数据类型。
	 */
	private DataType elementDataType;

	protected boolean elementsReplaced = false;

	protected boolean replaceElementFailed = false;

	/**
	 * @param target 被代理的集合类。
	 * @param dataType 集合的数据类型。
	 */
	public EntityCollection(Collection<E> target, AggregationDataType dataType) {
		this.target = target;
		setDataType(dataType);
	}

	public void setDataType(AggregationDataType dataType) {
		if (this.dataType != dataType) {
			this.dataType = dataType;
			this.elementDataType = (dataType == null) ? null : dataType.getElementDataType();
			elementsReplaced = false;
		}
	}

	/**
	 * 返回集合的数据类型。
	 */
	public AggregationDataType getDataType() {
		return dataType;
	}

	/**
	 * 返回集合元素的数据类型。
	 */
	public DataType getElementType() {
		return elementDataType;
	}

	/**
	 * 判断是否需要为传入的对象创建动态代理，如果需要将返回新创建的动态代理，否则将直接返回对象自身。
	 * @param element Object 可能需要代理的对象
	 * @return 动态代理或对象本身
	 */
	@SuppressWarnings("unchecked")
	protected E proxyElementIfNecessary(E element) {
		try {
			return (E) EntityUtils.toEntity(element, elementDataType);
		}
		catch (Exception e) {
			throw new IllegalStateException(e);
		}
	}

	protected void replaceAllElementIfNecessary() {
		if (!elementsReplaced && !replaceElementFailed) {
			try {
				replaceAllElementWithProxyIfNecessary(target);
			}
			catch (UnsupportedOperationException e) {
				// 为了处理那些经Collections.unmodifieableXXX()处理过的只读集合
				replaceElementFailed = true;
			}
			elementsReplaced = true;
		}
	}

	/**
	 * 判断集合中的每一个对象是否需要动态代理，如果需要将该集合元素替换为新创建的动态代理。
	 */
	protected abstract void replaceAllElementWithProxyIfNecessary(Collection<? extends E> collection);

	/**
	 * 返回被代理的集合类。
	 */
	public Collection<E> getTarget() {
		replaceAllElementIfNecessary();
		return target;
	}

	@Override
	public boolean add(E o) {
		if (elementsReplaced) {
			replaceAllElementIfNecessary();
			o = proxyElementIfNecessary(o);
		}
		return target.add(o);
	}

	@Override
	public boolean addAll(Collection<? extends E> c) {
		if (elementsReplaced) {
			replaceAllElementIfNecessary();
			boolean b = false;
			for (E o : c) {
				target.add(proxyElementIfNecessary(o));
				b = true;
			}
			return b;
		}
		else {
			return target.addAll(c);
		}
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
		replaceAllElementIfNecessary();
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
		replaceAllElementIfNecessary();
		return target.toArray();
	}

	@Override
	public <T> T[] toArray(T[] a) {
		replaceAllElementIfNecessary();
		return target.toArray(a);
	}

}
