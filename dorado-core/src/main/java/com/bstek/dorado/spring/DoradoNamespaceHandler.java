package com.bstek.dorado.spring;

import org.springframework.beans.factory.xml.NamespaceHandlerSupport;

/**
 * (mailto:benny.bao@bstek.com)
 */
public class DoradoNamespaceHandler extends NamespaceHandlerSupport {

	@Override
	public void init() {
		registerBeanDefinitionDecorator("property-parser", new MapEntryShortCutDecorator("propertyParsers"));
		registerBeanDefinitionDecorator("sub-parser", new MapEntryShortCutDecorator("subParsers"));
		registerBeanDefinitionDecorator("attribute-parser", new MapEntryShortCutDecorator("attributeParsers"));
		registerBeanDefinitionDecorator("property-outputter", new MapEntryShortCutDecorator("propertieConfigs"));
		registerBeanDefinitionDecorator("virtual-property", new VirtualPropertyDecorator());
		registerBeanDefinitionDecorator("virtual-event", new VirtualEventDecorator());

		registerBeanDefinitionParser("import-dorado", new ImportDoradoElementParser());
	}

}
