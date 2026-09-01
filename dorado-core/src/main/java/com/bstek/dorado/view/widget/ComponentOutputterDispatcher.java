package com.bstek.dorado.view.widget;

import org.apache.commons.lang3.StringUtils;

import com.bstek.dorado.view.annotation.Widget;
import com.bstek.dorado.view.output.ObjectOutputterDispatcher;
import com.bstek.dorado.view.output.OutputContext;
import com.bstek.dorado.view.registry.ComponentTypeRegisterInfo;
import com.bstek.dorado.view.registry.ComponentTypeRegistry;

public class ComponentOutputterDispatcher extends ObjectOutputterDispatcher {

	private ComponentTypeRegistry componentTypeRegistry;

	public void setComponentTypeRegistry(ComponentTypeRegistry componentTypeRegistry) {
		this.componentTypeRegistry = componentTypeRegistry;
	}

	@Override
	protected void outputObject(Object object, OutputContext context) throws Exception {
		super.outputObject(object, context);

		if (object instanceof Component) {
			String dependsPackage = null;
			ComponentTypeRegisterInfo registerInfo = componentTypeRegistry.getRegisterInfo(object.getClass());
			if (registerInfo != null) {
				dependsPackage = registerInfo.getDependsPackage();
			}
			else {
				Widget widget = object.getClass().getAnnotation(Widget.class);
				if (widget != null) {
					dependsPackage = widget.dependsPackage();
				}
			}

			if (dependsPackage != null && StringUtils.isNotEmpty(dependsPackage)) {
				context.addDependsPackage(dependsPackage);
			}
		}
	}

}
