package com.bstek.dorado.view;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class ViewCacheModeTest {

	@Test
	void should_contain_none_value() {
		assertThat(ViewCacheMode.valueOf("none")).isEqualTo(ViewCacheMode.none);
	}

	@Test
	void should_contain_clientSide_value() {
		assertThat(ViewCacheMode.valueOf("clientSide")).isEqualTo(ViewCacheMode.clientSide);
	}

	@Test
	void should_have_exactly_two_values() {
		assertThat(ViewCacheMode.values()).hasSize(2);
	}

	@Test
	void should_return_correct_name() {
		assertThat(ViewCacheMode.none.name()).isEqualTo("none");
		assertThat(ViewCacheMode.clientSide.name()).isEqualTo("clientSide");
	}
}
