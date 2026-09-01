package com.bstek.dorado.view.type;

import java.util.Map;

import com.bstek.dorado.data.type.property.PropertyDef;
import com.bstek.dorado.view.output.ObjectOutputterDispatcher;
import com.bstek.dorado.view.output.OutputContext;

public class PropertyDefsOutputter extends ObjectOutputterDispatcher {

	@Override
	@SuppressWarnings("unchecked")
	public void output(Object object, OutputContext context) throws Exception {
		Map<String, PropertyDef> propertyDefs = (Map<String, PropertyDef>) object;
		super.output(propertyDefs.values(), context);
	}

}
