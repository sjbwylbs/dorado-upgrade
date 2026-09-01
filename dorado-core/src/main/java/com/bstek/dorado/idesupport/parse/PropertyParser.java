package com.bstek.dorado.idesupport.parse;

import java.util.Collection;
import java.util.Map;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.lang3.StringUtils;
import org.w3c.dom.Element;
import org.w3c.dom.Node;

import com.bstek.dorado.common.ClientType;
import com.bstek.dorado.config.ParseContext;
import com.bstek.dorado.config.xml.ConfigurableDispatchableXmlParser;
import com.bstek.dorado.idesupport.model.CompositeType;
import com.bstek.dorado.idesupport.template.LazyReferenceTemplate;
import com.bstek.dorado.idesupport.template.PropertyTemplate;

public class PropertyParser extends ConfigurableDispatchableXmlParser {

	@SuppressWarnings("unchecked")
	@Override
	protected Object doParse(Node node, ParseContext context) throws Exception {
		Element element = (Element) node;
		ConfigRuleParseContext parserContext = (ConfigRuleParseContext) context;

		PropertyTemplate propertyTemplate = new PropertyTemplate();
		Map<String, Object> properties = this.parseProperties(element, context);

		String reference = (String) properties.remove("reference");
		if (StringUtils.isNotEmpty(reference)) {
			String ruleName, prop;
			int i = reference.indexOf(':');
			if (i > 0) {
				ruleName = reference.substring(0, i);
				prop = reference.substring(i + 1);
			}
			else {
				ruleName = reference;
				prop = "id";
			}
			propertyTemplate
				.setReference(new LazyReferenceTemplate(parserContext.getRuleTemplateManager(), ruleName, prop));
		}

		String clientTypesText = (String) properties.remove("clientTypes");
		int clientTypes = ClientType.parseClientTypes(clientTypesText);
		if (clientTypes > 0) {
			propertyTemplate.setClientTypes(clientTypes);
		}

		String compositeTypeConfig = (String) properties.remove("compositeType");
		if (StringUtils.isNotEmpty(compositeTypeConfig)) {
			CompositeType compositeType = CompositeType.valueOf(compositeTypeConfig);
			propertyTemplate.setCompositeType(compositeType);
		}

		BeanUtils.copyProperties(propertyTemplate, properties);

		if (propertyTemplate.getCompositeType() == CompositeType.Fixed
				|| propertyTemplate.getCompositeType() == CompositeType.Open) {
			propertyTemplate
				.addProperties((Collection<PropertyTemplate>) dispatchChildElements(element, parserContext));
		}
		return propertyTemplate;
	}

}
