package com.bstek.dorado.view.widget.layout;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class DockLayoutConstraintTest {

	private DockLayoutConstraint constraint = new DockLayoutConstraint();

	@Test
	void should_have_center_type_by_default() {
		assertThat(constraint.getType()).isEqualTo(DockMode.center);
	}

	@Test
	void should_set_and_get_type() {
		constraint.setType(DockMode.top);
		assertThat(constraint.getType()).isEqualTo(DockMode.top);
	}

	@Test
	void should_set_and_get_padding() {
		constraint.setPadding(5);
		assertThat(constraint.getPadding()).isEqualTo(5);
	}
}
