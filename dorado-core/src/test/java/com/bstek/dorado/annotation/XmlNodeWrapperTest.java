package com.bstek.dorado.annotation;

import static org.assertj.core.api.Assertions.assertThat;

import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.reflect.Method;

import org.junit.jupiter.api.Test;

class XmlNodeWrapperTest {

	@Test
	void should_have_runtime_retention_when_inspected() {
		Retention retention = XmlNodeWrapper.class.getAnnotation(Retention.class);
		assertThat(retention).isNotNull();
		assertThat(retention.value()).isEqualTo(RetentionPolicy.RUNTIME);
	}

	@Test
	void should_have_no_target_when_inspected() {
		// XmlNodeWrapper has no @Target annotation
		java.lang.annotation.Target target = XmlNodeWrapper.class.getAnnotation(java.lang.annotation.Target.class);
		assertThat(target).isNull();
	}

	@Test
	void should_not_be_inherited_when_inspected() {
		Inherited inherited = XmlNodeWrapper.class.getAnnotation(Inherited.class);
		assertThat(inherited).isNull();
	}

	@Test
	void should_have_empty_string_as_default_label() throws Exception {
		Method method = XmlNodeWrapper.class.getDeclaredMethod("label");
		assertThat(method.getDefaultValue()).isEqualTo("");
	}

	@Test
	void should_have_empty_string_as_default_icon() throws Exception {
		Method method = XmlNodeWrapper.class.getDeclaredMethod("icon");
		assertThat(method.getDefaultValue()).isEqualTo("");
	}

	@Test
	void should_have_true_as_default_fixed() throws Exception {
		Method method = XmlNodeWrapper.class.getDeclaredMethod("fixed");
		assertThat(method.getDefaultValue()).isEqualTo(true);
	}
}
