package com.bstek.dorado.view.widget.layout;

import com.bstek.dorado.view.output.JsonBuilder;
import com.bstek.dorado.view.output.ObjectOutputterDispatcher;
import com.bstek.dorado.view.output.OutputContext;

public class LayoutConstraintPropertyOutputter extends ObjectOutputterDispatcher {

	@Override
	public void output(Object object, OutputContext context) throws Exception {
		if (object == Layout.NON_LAYOUT_CONSTRAINT) {
			JsonBuilder json = context.getJsonBuilder();
			json.beginValue();
			context.getWriter().append("dorado.widget.layout.Layout.NONE_LAYOUT_CONSTRAINT");
			json.endValue();
		}
		else {
			outputObject(object, context);
		}
	}

}
