package com.bstek.dorado.spring;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.StringReader;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.MutablePropertyValues;
import org.springframework.beans.factory.config.BeanDefinitionHolder;
import org.springframework.beans.factory.support.AbstractBeanDefinition;
import org.springframework.beans.factory.support.GenericBeanDefinition;
import org.springframework.beans.factory.support.ManagedMap;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.xml.sax.InputSource;

class MapEntryShortCutDecoratorTest {

	private MapEntryShortCutDecorator decorator;

	private static DocumentBuilderFactory dbf;

	@BeforeAll
	static void initFactory() throws Exception {
		dbf = DocumentBuilderFactory.newInstance();
	}

	@BeforeEach
	void setUp() {
		decorator = new MapEntryShortCutDecorator("testProperty");
	}

	private Element createElement(String xml) throws Exception {
		DocumentBuilder db = dbf.newDocumentBuilder();
		Document doc = db.parse(new InputSource(new StringReader(xml)));
		return doc.getDocumentElement();
	}

	@Test
	void should_create_map_when_no_existing_property_value() throws Exception {
		AbstractBeanDefinition beanDef = new GenericBeanDefinition();
		BeanDefinitionHolder holder = new BeanDefinitionHolder(beanDef, "testBean");

		Element el = createElement("<item key=\"myKey\" value=\"myValue\"/>");

		BeanDefinitionHolder result = decorator.decorate(el, holder, null);

		assertThat(result).isSameAs(holder);
		MutablePropertyValues pvs = beanDef.getPropertyValues();
		assertThat(pvs.getPropertyValue("testProperty")).isNotNull();
		Object value = pvs.getPropertyValue("testProperty").getValue();
		assertThat(value).isInstanceOf(ManagedMap.class);
		@SuppressWarnings("unchecked")
		ManagedMap<String, Object> map = (ManagedMap<String, Object>) value;
		assertThat(map).containsEntry("myKey", "myValue");
	}

	@Test
	void should_add_to_existing_map() throws Exception {
		AbstractBeanDefinition beanDef = new GenericBeanDefinition();
		ManagedMap<String, Object> existingMap = new ManagedMap<>();
		existingMap.put("existingKey", "existingValue");
		beanDef.getPropertyValues().addPropertyValue("testProperty", existingMap);
		BeanDefinitionHolder holder = new BeanDefinitionHolder(beanDef, "testBean");

		Element el = createElement("<item key=\"newKey\" value=\"newValue\"/>");
		decorator.decorate(el, holder, null);

		assertThat(existingMap).containsEntry("existingKey", "existingValue");
		assertThat(existingMap).containsEntry("newKey", "newValue");
	}

	@Test
	void should_support_multi_key_with_comma_delimiter() throws Exception {
		AbstractBeanDefinition beanDef = new GenericBeanDefinition();
		BeanDefinitionHolder holder = new BeanDefinitionHolder(beanDef, "testBean");

		Element el = createElement("<item key=\"key1,key2,key3\" value=\"sharedValue\"/>");
		decorator.decorate(el, holder, null);

		@SuppressWarnings("unchecked")
		ManagedMap<String, Object> map = (ManagedMap<String, Object>) beanDef.getPropertyValues()
			.getPropertyValue("testProperty")
			.getValue();
		assertThat(map).containsKeys("key1", "key2", "key3");
		assertThat(map.get("key1")).isEqualTo("sharedValue");
		assertThat(map.get("key2")).isEqualTo("sharedValue");
		assertThat(map.get("key3")).isEqualTo("sharedValue");
	}

	@Test
	void should_not_split_key_when_multi_key_not_supported() throws Exception {
		MapEntryShortCutDecorator noMultiKey = new MapEntryShortCutDecorator("testProperty", false);
		AbstractBeanDefinition beanDef = new GenericBeanDefinition();
		BeanDefinitionHolder holder = new BeanDefinitionHolder(beanDef, "testBean");

		Element el = createElement("<item key=\"key1,key2\" value=\"value\"/>");
		noMultiKey.decorate(el, holder, null);

		@SuppressWarnings("unchecked")
		ManagedMap<String, Object> map = (ManagedMap<String, Object>) beanDef.getPropertyValues()
			.getPropertyValue("testProperty")
			.getValue();
		assertThat(map).containsKey("key1,key2");
		assertThat(map).doesNotContainKey("key1");
	}

	@Test
	void should_handle_empty_value_and_value_ref() throws Exception {
		AbstractBeanDefinition beanDef = new GenericBeanDefinition();
		BeanDefinitionHolder holder = new BeanDefinitionHolder(beanDef, "testBean");

		Element el = createElement("<item key=\"myKey\"/>");
		decorator.decorate(el, holder, null);

		@SuppressWarnings("unchecked")
		ManagedMap<String, Object> map = (ManagedMap<String, Object>) beanDef.getPropertyValues()
			.getPropertyValue("testProperty")
			.getValue();
		// When neither value nor value-ref is provided, and no bean child element, value is null
		assertThat(map).containsKey("myKey");
		assertThat(map.get("myKey")).isNull();
	}

	@Test
	void should_store_property_name() {
		MapEntryShortCutDecorator d1 = new MapEntryShortCutDecorator("prop1");
		MapEntryShortCutDecorator d2 = new MapEntryShortCutDecorator("prop2", false);
		assertThat(d1).isNotNull();
		assertThat(d2).isNotNull();
	}
}
