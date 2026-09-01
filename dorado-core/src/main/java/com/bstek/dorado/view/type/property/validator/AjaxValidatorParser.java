package com.bstek.dorado.view.type.property.validator;

import org.apache.commons.lang3.StringUtils;
import org.w3c.dom.Element;

import com.bstek.dorado.config.ParseContext;
import com.bstek.dorado.config.definition.ObjectDefinition;
import com.bstek.dorado.data.config.xml.GenericObjectParser;
import com.bstek.dorado.view.config.xml.ViewParseContext;

public class AjaxValidatorParser extends GenericObjectParser {

	@Override
	protected void initDefinition(ObjectDefinition definition, Element element, ParseContext context) throws Exception {
		super.initDefinition(definition, element, context);

		String service = (String) definition.getProperty("service");
		if (service != null && service.charAt(0) == '#') {
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
				definition.setProperty("service", StringUtils.uncapitalize(prefix) + service);
			}
		}
	}

}
