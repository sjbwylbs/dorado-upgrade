package com.bstek.dorado.view.widget.layout;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class PackTest {

	@Test
	void should_have_three_values() {
		assertThat(Pack.values()).containsExactly(Pack.start, Pack.center, Pack.end);
	}

	@Test
	void should_parse_from_string() {
		assertThat(Pack.valueOf("start")).isEqualTo(Pack.start);
		assertThat(Pack.valueOf("center")).isEqualTo(Pack.center);
		assertThat(Pack.valueOf("end")).isEqualTo(Pack.end);
	}
}
