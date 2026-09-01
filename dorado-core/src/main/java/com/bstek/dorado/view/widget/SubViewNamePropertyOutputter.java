package com.bstek.dorado.view.widget;

import com.bstek.dorado.view.output.JsonBuilder;
import com.bstek.dorado.view.output.OutputContext;
import com.bstek.dorado.view.output.VirtualPropertyOutputter;

public class SubViewNamePropertyOutputter implements VirtualPropertyOutputter {

	@Override
	public void output(Object object, String property, OutputContext context) throws Exception {
		JsonBuilder jsonBuilder = context.getJsonBuilder();
		jsonBuilder.key(property).value(((SubViewHolder) object).getSubView());
	}

}
