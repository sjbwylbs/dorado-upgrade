package com.bstek.dorado.view.widget.layout;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.bstek.dorado.view.widget.VerticalAlign;

class HBoxLayoutConstraintSupportTest {

	@Test
	void should_have_center_align_by_default() {
		HBoxLayoutConstraintSupport constraint = new HBoxLayoutConstraintSupport();
		assertThat(constraint.getAlign()).isEqualTo(VerticalAlign.center);
	}

	@Test
	void should_set_and_get_align() {
		HBoxLayoutConstraintSupport constraint = new HBoxLayoutConstraintSupport();
		constraint.setAlign(VerticalAlign.top);
		assertThat(constraint.getAlign()).isEqualTo(VerticalAlign.top);
	}

	@Test
	void should_inherit_padding() {
		HBoxLayoutConstraintSupport constraint = new HBoxLayoutConstraintSupport();
		constraint.setPadding(10);
		assertThat(constraint.getPadding()).isEqualTo(10);
	}
}
