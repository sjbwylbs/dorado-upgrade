package com.bstek.dorado.view.widget.layout;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class CommonLayoutConstraintTest {

	@Test
	void should_be_empty_by_default() {
		CommonLayoutConstraint constraint = new CommonLayoutConstraint();
		assertThat(constraint).isEmpty();
	}

	@Test
	void should_store_key_value_pairs() {
		CommonLayoutConstraint constraint = new CommonLayoutConstraint();
		constraint.put("width", "100px");
		constraint.put("height", 200);
		assertThat(constraint).hasSize(2);
		assertThat(constraint.get("width")).isEqualTo("100px");
		assertThat(constraint.get("height")).isEqualTo(200);
	}
}
