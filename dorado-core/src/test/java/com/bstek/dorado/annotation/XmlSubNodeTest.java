package com.bstek.dorado.annotation;

import static org.assertj.core.api.Assertions.assertThat;

import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.lang.reflect.Method;

import org.junit.jupiter.api.Test;

class XmlSubNodeTest {

	@Test
	void should_have_runtime_retention_when_inspected() {
		Retention retention = XmlSubNode.class.getAnnotation(Retention.class);
		assertThat(retention).isNotNull();
		assertThat(retention.value()).isEqualTo(RetentionPolicy.RUNTIME);
	}

	@Test
	void should_target_method_when_inspected() {
		Target target = XmlSubNode.class.getAnnotation(Target.class);
		assertThat(target).isNotNull();
		assertThat(target.value()).containsExactly(ElementType.METHOD);
	}

	@Test
	void should_be_inherited_when_inspected() {
		Inherited inherited = XmlSubNode.class.getAnnotation(Inherited.class);
		assertThat(inherited).isNotNull();
	}

	@Test
	void should_have_empty_string_as_default_nodeName() throws Exception {
		Method method = XmlSubNode.class.getDeclaredMethod("nodeName");
		assertThat(method.getDefaultValue()).isEqualTo("");
	}

	@Test
	void should_have_empty_string_as_default_icon() throws Exception {
		Method method = XmlSubNode.class.getDeclaredMethod("icon");
		assertThat(method.getDefaultValue()).isEqualTo("");
	}

	@Test
	void should_have_empty_string_as_default_propertyName() throws Exception {
		Method method = XmlSubNode.class.getDeclaredMethod("propertyName");
		assertThat(method.getDefaultValue()).isEqualTo("");
	}

	@Test
	void should_have_empty_string_as_default_propertyType() throws Exception {
		Method method = XmlSubNode.class.getDeclaredMethod("propertyType");
		assertThat(method.getDefaultValue()).isEqualTo("");
	}

	@Test
	void should_have_false_as_default_fixed() throws Exception {
		Method method = XmlSubNode.class.getDeclaredMethod("fixed");
		assertThat(method.getDefaultValue()).isEqualTo(false);
	}

	@Test
	void should_have_false_as_default_aggregated() throws Exception {
		Method method = XmlSubNode.class.getDeclaredMethod("aggregated");
		assertThat(method.getDefaultValue()).isEqualTo(false);
	}

	@Test
	void should_have_false_as_default_deprecated() throws Exception {
		Method method = XmlSubNode.class.getDeclaredMethod("deprecated");
		assertThat(method.getDefaultValue()).isEqualTo(false);
	}

	@Test
	void should_have_empty_string_as_default_parser() throws Exception {
		Method method = XmlSubNode.class.getDeclaredMethod("parser");
		assertThat(method.getDefaultValue()).isEqualTo("");
	}

	@Test
	void should_have_false_as_default_resultProcessed() throws Exception {
		Method method = XmlSubNode.class.getDeclaredMethod("resultProcessed");
		assertThat(method.getDefaultValue()).isEqualTo(false);
	}

	@Test
	void should_have_single_empty_string_as_default_implTypes() throws Exception {
		Method method = XmlSubNode.class.getDeclaredMethod("implTypes");
		assertThat(method.getDefaultValue()).isEqualTo(new String[] { "" });
	}
}
