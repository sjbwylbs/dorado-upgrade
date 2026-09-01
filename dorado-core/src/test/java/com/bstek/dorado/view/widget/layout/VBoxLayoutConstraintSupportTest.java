package com.bstek.dorado.view.widget.layout;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.bstek.dorado.view.widget.Align;

class VBoxLayoutConstraintSupportTest {

	@Test
	void should_have_left_align_by_default() {
		VBoxLayoutConstraintSupport constraint = new VBoxLayoutConstraintSupport();
		assertThat(constraint.getAlign()).isEqualTo(Align.left);
	}

	@Test
	void should_set_and_get_align() {
		VBoxLayoutConstraintSupport constraint = new VBoxLayoutConstraintSupport();
		constraint.setAlign(Align.center);
		assertThat(constraint.getAlign()).isEqualTo(Align.center);
	}

	@Test
	void should_inherit_padding() {
		VBoxLayoutConstraintSupport constraint = new VBoxLayoutConstraintSupport();
		constraint.setPadding(5);
		assertThat(constraint.getPadding()).isEqualTo(5);
	}
}
