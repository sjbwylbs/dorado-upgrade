package com.bstek.dorado.spring;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.StringReader;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.config.BeanDefinitionHolder;
import org.springframework.beans.factory.support.AbstractBeanDefinition;
import org.springframework.beans.factory.support.GenericBeanDefinition;
import org.springframework.beans.factory.support.ManagedMap;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.xml.sax.InputSource;

class VirtualPropertyDecoratorTest {

	private VirtualPropertyDecorator decorator;

	private static DocumentBuilderFactory dbf;

	@BeforeAll
	static void initFactory() throws Exception {
		dbf = DocumentBuilderFactory.newInstance();
	}

	@BeforeEach
	void setUp() {
		decorator = new VirtualPropertyDecorator();
	}

	private Element createElement(String xml) throws Exception {
		DocumentBuilder db = dbf.newDocumentBuilder();
		Document doc = db.parse(new InputSource(new StringReader(xml)));
		return doc.getDocumentElement();
	}

	@Test
	void should_create_virtual_properties_map_when_not_exists() throws Exception {
		AbstractBeanDefinition beanDef = new GenericBeanDefinition();
		BeanDefinitionHolder holder = new BeanDefinitionHolder(beanDef, "testBean");

		Element el = createElement(
				"<item name=\"myProp\" type=\"string\" avialableAt=\"design\" defaultValue=\"default\" referenceComponentType=\"component\"/>");

		BeanDefinitionHolder result = decorator.decorate(el, holder, null);

		assertThat(result).isSameAs(holder);
		@SuppressWarnings("unchecked")
		ManagedMap<String, Object> map = (ManagedMap<String, Object>) beanDef.getPropertyValues()
			.getPropertyValue("virtualProperties")
			.getValue();
		assertThat(map).containsKey("myProp");
		Object descriptor = map.get("myProp");
		assertThat(descriptor).isInstanceOf(java.util.Properties.class);
		java.util.Properties props = (java.util.Properties) descriptor;
		assertThat(props.getProperty("type")).isEqualTo("string");
		assertThat(props.getProperty("avialableAt")).isEqualTo("design");
		assertThat(props.getProperty("defaultValue")).isEqualTo("default");
		assertThat(props.getProperty("referenceComponentType")).isEqualTo("component");
	}

	@Test
	void should_add_to_existing_virtual_properties_map() throws Exception {
		AbstractBeanDefinition beanDef = new GenericBeanDefinition();
		ManagedMap<String, Object> existingMap = new ManagedMap<>();
		java.util.Properties existingProps = new java.util.Properties();
		existingProps.setProperty("type", "int");
		existingMap.put("existingProp", existingProps);
		beanDef.getPropertyValues().addPropertyValue("virtualProperties", existingMap);
		BeanDefinitionHolder holder = new BeanDefinitionHolder(beanDef, "testBean");

		Element el = createElement("<item name=\"newProp\" type=\"string\" avialableAt=\"\" defaultValue=\"\" referenceComponentType=\"\"/>");
		decorator.decorate(el, holder, null);

		assertThat(existingMap).hasSize(2);
		assertThat(existingMap).containsKey("existingProp");
		assertThat(existingMap).containsKey("newProp");
	}

	@Test
	void should_return_same_bean_definition_holder() throws Exception {
		AbstractBeanDefinition beanDef = new GenericBeanDefinition();
		BeanDefinitionHolder holder = new BeanDefinitionHolder(beanDef, "testBean");

		Element el = createElement("<item name=\"prop\" type=\"\" avialableAt=\"\" defaultValue=\"\" referenceComponentType=\"\"/>");
		BeanDefinitionHolder result = decorator.decorate(el, holder, null);
		assertThat(result).isSameAs(holder);
	}
}
