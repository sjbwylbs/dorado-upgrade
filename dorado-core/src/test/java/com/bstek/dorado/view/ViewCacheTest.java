package com.bstek.dorado.view;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class ViewCacheTest {

	private ViewCache cache = new ViewCache();

	@Test
	void should_have_none_mode_by_default() {
		assertThat(cache.getMode()).isEqualTo(ViewCacheMode.none);
	}

	@Test
	void should_set_and_get_mode() {
		cache.setMode(ViewCacheMode.clientSide);
		assertThat(cache.getMode()).isEqualTo(ViewCacheMode.clientSide);
	}

	@Test
	void should_have_zero_max_age_by_default() {
		assertThat(cache.getMaxAge()).isZero();
	}

	@Test
	void should_set_and_get_max_age() {
		cache.setMaxAge(3600L);
		assertThat(cache.getMaxAge()).isEqualTo(3600L);
	}
}
