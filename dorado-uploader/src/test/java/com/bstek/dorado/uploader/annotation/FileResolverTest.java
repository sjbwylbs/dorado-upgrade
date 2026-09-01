package com.bstek.dorado.uploader.annotation;

import static org.assertj.core.api.Assertions.assertThat;

import java.lang.annotation.ElementType;
import java.lang.annotation.RetentionPolicy;

import org.junit.jupiter.api.Test;

class FileResolverTest {

	@Test
	void should_have_runtime_retention() {
		assertThat(FileResolver.class.getAnnotation(java.lang.annotation.Retention.class).value())
				.isEqualTo(RetentionPolicy.RUNTIME);
	}

	@Test
	void should_target_methods() {
		assertThat(FileResolver.class.getAnnotation(java.lang.annotation.Target.class).value())
				.containsExactly(ElementType.METHOD);
	}

	@Test
	void should_be_inherited() {
		assertThat(FileResolver.class.getAnnotation(java.lang.annotation.Inherited.class)).isNotNull();
	}

	@Test
	void should_have_default_empty_name() throws Exception {
		assertThat(FileResolver.class.getMethod("name").getDefaultValue()).isEqualTo("");
	}
}
