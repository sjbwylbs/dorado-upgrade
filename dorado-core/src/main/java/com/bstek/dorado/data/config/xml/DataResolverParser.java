package com.bstek.dorado.data.config.xml;

import org.apache.commons.lang3.StringUtils;
import org.w3c.dom.Element;

import com.bstek.dorado.config.ParseContext;
import com.bstek.dorado.config.definition.DefinitionReference;
import com.bstek.dorado.config.definition.ObjectDefinition;
import com.bstek.dorado.config.xml.XmlConstants;
import com.bstek.dorado.data.config.definition.DataResolverDefinition;

public class DataResolverParser extends GenericObjectParser {

	@Override
	@SuppressWarnings("unchecked")
	protected DefinitionReference<DataResolverDefinition>[] getParentDefinitionReferences(String parentNameText,
			ParseContext context) throws Exception {
		DefinitionReference<DataResolverDefinition> parentReference = ((DataParseContext) context)
			.getDataResolverReference(parentNameText, (DataParseContext) context);
		if (parentReference != null) {
			return new DefinitionReference[] { parentReference };
		}
		else {
			return null;
		}
	}

	@Override
	protected void initDefinition(ObjectDefinition definition, Element element, ParseContext context) throws Exception {
		super.initDefinition(definition, element, context);

		DataResolverDefinition dataResolver = (DataResolverDefinition) definition;

		String interceptor = (String) dataResolver.removeProperty(XmlConstants.ATTRIBUTE_INTERCEPTOR);
		if (StringUtils.isNotEmpty(interceptor)) {
			dataResolver.setInterceptor(interceptor);
		}
	}

}
