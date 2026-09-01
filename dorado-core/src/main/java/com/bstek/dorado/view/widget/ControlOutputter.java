package com.bstek.dorado.view.widget;

import com.bstek.dorado.view.output.JsonBuilder;
import com.bstek.dorado.view.output.OutputContext;

/**
 * 默认的视图控件的输出器。
 *
 */
public class ControlOutputter extends ComponentOutputter {

	@Override
	protected void outputObjectProperties(Object object, OutputContext context) throws Exception {
		Control control = (Control) object;
		Boolean lazyInit = control.getLazyInit();
		if (lazyInit != null) {
			JsonBuilder json = context.getJsonBuilder();
			json.key("$lazyInit").value(lazyInit);
		}
		super.outputObjectProperties(control, context);
	}

}
