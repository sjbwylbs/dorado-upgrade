package com.bstek.dorado.config.definition;

/**
 * 通过直接关联指向某配置声明对象的引用。
 *
 */
public class DirectDefinitionReference<T extends Definition> implements DefinitionReference<T> {

	private T definition;

	/**
	 * @param definition 被引用的配置声明对象
	 */
	public DirectDefinitionReference(T definition) {
		this.definition = definition;
	}

	@Override
	public T getDefinition() {
		return definition;
	}

}
