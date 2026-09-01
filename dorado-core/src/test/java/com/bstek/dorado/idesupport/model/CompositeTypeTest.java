package com.bstek.dorado.idesupport.model;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class CompositeTypeTest {

	@Test
	void should_have_three_values() {
		assertThat(CompositeType.values()).hasSize(3);
	}

	@Test
	void should_contain_unsupport() {
		assertThat(CompositeType.valueOf("Unsupport")).isEqualTo(CompositeType.Unsupport);
	}

	@Test
	void should_contain_fixed() {
		assertThat(CompositeType.valueOf("Fixed")).isEqualTo(CompositeType.Fixed);
	}

	@Test
	void should_contain_open() {
		assertThat(CompositeType.valueOf("Open")).isEqualTo(CompositeType.Open);
	}

	@Test
	void should_have_correct_ordinal_order() {
		assertThat(CompositeType.Unsupport.ordinal()).isLessThan(CompositeType.Fixed.ordinal());
		assertThat(CompositeType.Fixed.ordinal()).isLessThan(CompositeType.Open.ordinal());
	}
}
