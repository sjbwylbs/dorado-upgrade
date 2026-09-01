package com.bstek.dorado.spring;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.StringReader;
import java.util.Properties;

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

class VirtualEventDecoratorTest {

	private VirtualEventDecorator decorator;

	private static DocumentBuilderFactory dbf;

	@BeforeAll
	static void initFactory() throws Exception {
		dbf = DocumentBuilderFactory.newInstance();
	}

	@BeforeEach
	void setUp() {
		decorator = new VirtualEventDecorator();
	}

	private Element createElement(String xml) throws Exception {
		DocumentBuilder db = dbf.newDocumentBuilder();
		Document doc = db.parse(new InputSource(new StringReader(xml)));
		return doc.getDocumentElement();
	}

	@Test
	void should_create_virtual_events_map_when_not_exists() throws Exception {
		AbstractBeanDefinition beanDef = new GenericBeanDefinition();
		BeanDefinitionHolder holder = new BeanDefinitionHolder(beanDef, "testBean");

		Element el = createElement("<item name=\"onClick\" signature=\"void onClick(Event e)\"/>");

		BeanDefinitionHolder result = decorator.decorate(el, holder, null);

		assertThat(result).isSameAs(holder);
		@SuppressWarnings("unchecked")
		ManagedMap<String, Object> map = (ManagedMap<String, Object>) beanDef.getPropertyValues()
			.getPropertyValue("virtualEvents")
			.getValue();
		assertThat(map).containsKey("onClick");
		Object descriptor = map.get("onClick");
		assertThat(descriptor).isInstanceOf(Properties.class);
		Properties props = (Properties) descriptor;
		assertThat(props.getProperty("signature")).isEqualTo("void onClick(Event e)");
	}

	@Test
	void should_add_to_existing_virtual_events_map() throws Exception {
		AbstractBeanDefinition beanDef = new GenericBeanDefinition();
		ManagedMap<String, Object> existingMap = new ManagedMap<>();
		Properties existingProps = new Properties();
		existingProps.setProperty("signature", "void onOld()");
		existingMap.put("onOld", existingProps);
		beanDef.getPropertyValues().addPropertyValue("virtualEvents", existingMap);
		BeanDefinitionHolder holder = new BeanDefinitionHolder(beanDef, "testBean");

		Element el = createElement("<item name=\"onNew\" signature=\"void onNew()\"/>");
		decorator.decorate(el, holder, null);

		assertThat(existingMap).hasSize(2);
		assertThat(existingMap).containsKey("onOld");
		assertThat(existingMap).containsKey("onNew");
	}

	@Test
	void should_return_same_bean_definition_holder() throws Exception {
		AbstractBeanDefinition beanDef = new GenericBeanDefinition();
		BeanDefinitionHolder holder = new BeanDefinitionHolder(beanDef, "testBean");

		Element el = createElement("<item name=\"onEvent\" signature=\"void onEvent()\"/>");
		BeanDefinitionHolder result = decorator.decorate(el, holder, null);
		assertThat(result).isSameAs(holder);
	}

	@Test
	void should_store_signature_in_properties() throws Exception {
		AbstractBeanDefinition beanDef = new GenericBeanDefinition();
		BeanDefinitionHolder holder = new BeanDefinitionHolder(beanDef, "testBean");

		Element el = createElement("<item name=\"onLoad\" signature=\"int onLoad(String data)\"/>");
		decorator.decorate(el, holder, null);

		@SuppressWarnings("unchecked")
		ManagedMap<String, Object> map = (ManagedMap<String, Object>) beanDef.getPropertyValues()
			.getPropertyValue("virtualEvents")
			.getValue();
		Properties props = (Properties) map.get("onLoad");
		assertThat(props.getProperty("signature")).isEqualTo("int onLoad(String data)");
	}
}
