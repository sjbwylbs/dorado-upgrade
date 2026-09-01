package com.bstek.dorado.view.widget;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class DirectionTest {

	@Test
	void should_have_four_values() {
		assertThat(Direction.values()).containsExactly(Direction.left, Direction.top, Direction.right, Direction.bottom);
	}

	@Test
	void should_parse_from_string() {
		assertThat(Direction.valueOf("left")).isEqualTo(Direction.left);
		assertThat(Direction.valueOf("top")).isEqualTo(Direction.top);
		assertThat(Direction.valueOf("right")).isEqualTo(Direction.right);
		assertThat(Direction.valueOf("bottom")).isEqualTo(Direction.bottom);
	}
}
