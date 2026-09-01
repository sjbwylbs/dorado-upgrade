package com.bstek.dorado.console.addon;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class DependenceTest {

	private Dependence dependence;

	@BeforeEach
	void setUp() {
		dependence = new Dependence();
	}

	@Test
	void should_return_null_packageName_by_default() {
		assertThat(dependence.getPackageName()).isNull();
	}

	@Test
	void should_return_null_version_by_default() {
		assertThat(dependence.getVersion()).isNull();
	}

	@Test
	void should_set_and_get_packageName() {
		dependence.setPackageName("dorado-core");
		assertThat(dependence.getPackageName()).isEqualTo("dorado-core");
	}

	@Test
	void should_set_and_get_version() {
		dependence.setVersion("7.0.0");
		assertThat(dependence.getVersion()).isEqualTo("7.0.0");
	}
}
