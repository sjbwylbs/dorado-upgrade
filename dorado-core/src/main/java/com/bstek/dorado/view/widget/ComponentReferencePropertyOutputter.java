package com.bstek.dorado.view.widget;

import java.io.Writer;

import org.apache.commons.lang3.StringUtils;

import com.bstek.dorado.view.output.JsonBuilder;
import com.bstek.dorado.view.output.OutputContext;
import com.bstek.dorado.view.output.OutputUtils;
import com.bstek.dorado.view.output.PropertyOutputter;

public class ComponentReferencePropertyOutputter implements PropertyOutputter {

	@Override
	public boolean isEscapeValue(Object value) {
		return OutputUtils.isEscapeValue(value);
	}

	@Override
	public void output(Object object, OutputContext context) throws Exception {
		Writer writer = context.getWriter();
		JsonBuilder jsonBuilder = context.getJsonBuilder();
		String id = String.valueOf(object);
		String[] ids = StringUtils.split(id, ',');
		if (ids.length > 1) {
			jsonBuilder.array();
			for (String id2 : ids) {
				jsonBuilder.beginValue();
				writer.append("view.getComponentReference(\"");
				writer.append(id2);
				writer.append("\")");
				jsonBuilder.endValue();
			}
			jsonBuilder.endArray();
		}
		else {
			jsonBuilder.beginValue();
			writer.append("view.getComponentReference(\"");
			writer.append(id);
			writer.append("\")");
			jsonBuilder.endValue();
		}
	}

}
