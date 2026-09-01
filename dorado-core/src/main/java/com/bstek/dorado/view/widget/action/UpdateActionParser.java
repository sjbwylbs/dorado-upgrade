package com.bstek.dorado.view.widget.action;

import org.w3c.dom.Element;

import com.bstek.dorado.config.ParseContext;
import com.bstek.dorado.config.definition.DefinitionReference;
import com.bstek.dorado.config.definition.ObjectDefinition;
import com.bstek.dorado.data.config.definition.DataResolverDefinition;
import com.bstek.dorado.data.config.xml.DataXmlConstants;
import com.bstek.dorado.view.config.xml.ViewParseContext;
import com.bstek.dorado.view.widget.ComponentParser;

public class UpdateActionParser extends ComponentParser {

	@Override
	protected void initDefinition(ObjectDefinition definition, Element element, ParseContext context) throws Exception {
		DefinitionReference<DataResolverDefinition> dataResolverRef = dataObjectParseHelper
			.getReferencedDataResolver(DataXmlConstants.ATTRIBUTE_DATA_RESOLVER, element, (ViewParseContext) context);
		if (dataResolverRef != null) {
			definition.setProperty(DataXmlConstants.ATTRIBUTE_DATA_RESOLVER, dataResolverRef);
		}
		super.initDefinition(definition, element, context);
	}

}
