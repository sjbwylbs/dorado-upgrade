package com.bstek.dorado.view.widget.layout;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class AnchorLayoutConstraintTest {

	private AnchorLayoutConstraint constraint = new AnchorLayoutConstraint();

	@Test
	void should_have_null_left_by_default() {
		assertThat(constraint.getLeft()).isNull();
	}

	@Test
	void should_set_and_get_left() {
		constraint.setLeft("10px");
		assertThat(constraint.getLeft()).isEqualTo("10px");
	}

	@Test
	void should_set_and_get_top() {
		constraint.setTop("20px");
		assertThat(constraint.getTop()).isEqualTo("20px");
	}

	@Test
	void should_set_and_get_right() {
		constraint.setRight("30px");
		assertThat(constraint.getRight()).isEqualTo("30px");
	}

	@Test
	void should_set_and_get_bottom() {
		constraint.setBottom("40px");
		assertThat(constraint.getBottom()).isEqualTo("40px");
	}

	@Test
	void should_have_auto_anchor_left_by_default() {
		assertThat(constraint.getAnchorLeft()).isEqualTo(AnchorMode.auto);
	}

	@Test
	void should_set_and_get_anchor_left() {
		constraint.setAnchorLeft(AnchorMode.container);
		assertThat(constraint.getAnchorLeft()).isEqualTo(AnchorMode.container);
	}

	@Test
	void should_set_and_get_anchor_top() {
		constraint.setAnchorTop(AnchorMode.none);
		assertThat(constraint.getAnchorTop()).isEqualTo(AnchorMode.none);
	}

	@Test
	void should_set_and_get_anchor_right() {
		constraint.setAnchorRight(AnchorMode.previous);
		assertThat(constraint.getAnchorRight()).isEqualTo(AnchorMode.previous);
	}

	@Test
	void should_set_and_get_anchor_bottom() {
		constraint.setAnchorBottom(AnchorMode.container);
		assertThat(constraint.getAnchorBottom()).isEqualTo(AnchorMode.container);
	}

	@Test
	void should_set_and_get_offsets() {
		constraint.setLeftOffset(5);
		constraint.setTopOffset(10);
		constraint.setWidthOffset(15);
		constraint.setHeightOffset(20);
		assertThat(constraint.getLeftOffset()).isEqualTo(5);
		assertThat(constraint.getTopOffset()).isEqualTo(10);
		assertThat(constraint.getWidthOffset()).isEqualTo(15);
		assertThat(constraint.getHeightOffset()).isEqualTo(20);
	}

	@Test
	void should_set_and_get_padding() {
		constraint.setPadding(8);
		assertThat(constraint.getPadding()).isEqualTo(8);
	}
}
