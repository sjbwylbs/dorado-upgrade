package com.bstek.dorado.view.widget.form;

import org.apache.commons.lang3.StringUtils;

import com.bstek.dorado.view.output.JsonBuilder;
import com.bstek.dorado.view.output.OutputContext;
import com.bstek.dorado.view.output.OutputUtils;
import com.bstek.dorado.view.output.PropertyOutputter;

public class CustomSpinnerValueOutputter implements PropertyOutputter {

	@Override
	public boolean isEscapeValue(Object value) {
		return OutputUtils.isEscapeValue(value);
	}

	@Override
	public void output(Object object, OutputContext context) throws Exception {
		JsonBuilder jsonBuilder = context.getJsonBuilder();
		jsonBuilder.array();
		for (String section : StringUtils.split((String) object, ";, ")) {
			int i = 0;
			try {
				i = Integer.parseInt(section);
			}
			catch (Exception e) {
				// do nothing
			}
			jsonBuilder.value(i);
		}
		jsonBuilder.endArray();
	}

}
