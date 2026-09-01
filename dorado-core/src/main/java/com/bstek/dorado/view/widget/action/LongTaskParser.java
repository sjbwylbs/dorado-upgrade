package com.bstek.dorado.view.widget.action;

import org.apache.commons.lang3.StringUtils;
import org.w3c.dom.Element;

import com.bstek.dorado.config.ParseContext;
import com.bstek.dorado.config.definition.ObjectDefinition;
import com.bstek.dorado.view.config.xml.ViewParseContext;
import com.bstek.dorado.view.widget.ComponentParser;

public class LongTaskParser extends ComponentParser {

	@Override
	protected void initDefinition(ObjectDefinition definition, Element element, ParseContext context) throws Exception {
		super.initDefinition(definition, element, context);

		String taskName = (String) definition.getProperty("taskName");
		if (taskName != null && taskName.charAt(0) == '#') {
			String viewName = ((ViewParseContext) context).getResourceName();
			if (StringUtils.isNotEmpty(viewName)) {
				String prefix;
				int i1 = viewName.lastIndexOf('/');
				int i2 = viewName.lastIndexOf('.');
				int i = (i1 > i2) ? i1 : i2;
				if (i > 0 && i < (viewName.length() - 1)) {
					prefix = viewName.substring(i + 1);
				}
				else {
					prefix = viewName;
				}
				definition.setProperty("taskName", StringUtils.uncapitalize(prefix) + taskName);
			}
		}
	}

}
