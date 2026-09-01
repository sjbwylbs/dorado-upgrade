package com.bstek.dorado.view.widget;

import org.w3c.dom.Element;

import com.bstek.dorado.config.ParseContext;
import com.bstek.dorado.config.definition.ObjectDefinition;
import com.bstek.dorado.view.config.definition.ControlDefinition;
import com.bstek.dorado.view.config.xml.ViewXmlConstants;

/**
 * 控件的解析器。
 *
 */
public class ControlParser extends ComponentParser {

	@Override
	protected void initDefinition(ObjectDefinition definition, Element element, ParseContext context) throws Exception {
		super.initDefinition(definition, element, context);

		ControlDefinition controlDefinition = (ControlDefinition) definition;
		if (controlDefinition.getProperties().containsKey(ViewXmlConstants.ATTRIBUTE_LAYOUT_CONSTRAINT)) {
			Object layoutConstraint = controlDefinition.removeProperty(ViewXmlConstants.ATTRIBUTE_LAYOUT_CONSTRAINT);
			controlDefinition.setLayoutConstraint(layoutConstraint);
		}
	}

}
