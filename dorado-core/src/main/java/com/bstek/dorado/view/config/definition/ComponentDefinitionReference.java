package com.bstek.dorado.view.config.definition;

import com.bstek.dorado.config.definition.DefinitionReference;

/**
 * 指向组件的配置声明对象的引用。
 *
 */
public class ComponentDefinitionReference implements DefinitionReference<ComponentDefinition> {

	private ViewDefinition viewDefinition;

	private String componentId;

	/**
	 * @param viewDefinition 视图的配置声明对象。
	 * @param componentId 要指向的组件的id。
	 */
	public ComponentDefinitionReference(ViewDefinition viewDefinition, String componentId) {
		this.viewDefinition = viewDefinition;
		this.componentId = componentId;
	}

	@Override
	public ComponentDefinition getDefinition() {
		return viewDefinition.getComponent(componentId);
	}

}
