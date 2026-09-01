package com.bstek.dorado.view.widget;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class OrientationTest {

	@Test
	void should_have_three_values() {
		assertThat(Orientation.values()).containsExactly(Orientation.horizental, Orientation.horizontal,
				Orientation.vertical);
	}

	@Test
	void should_return_horizontal_for_deprecated_horizental() {
		assertThat(Orientation.horizental.toString()).isEqualTo("horizontal");
	}

	@Test
	void should_parse_from_string() {
		assertThat(Orientation.valueOf("horizontal")).isEqualTo(Orientation.horizontal);
		assertThat(Orientation.valueOf("vertical")).isEqualTo(Orientation.vertical);
	}
}
