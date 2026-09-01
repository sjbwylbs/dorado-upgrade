package com.bstek.dorado.view.widget.layout;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.bstek.dorado.view.widget.Align;
import com.bstek.dorado.view.widget.VerticalAlign;

class FormLayoutConstraintTest {

	private FormLayoutConstraint constraint = new FormLayoutConstraint();

	@Test
	void should_have_col_span_one_by_default() {
		assertThat(constraint.getColSpan()).isEqualTo(1);
	}

	@Test
	void should_set_and_get_col_span() {
		constraint.setColSpan(3);
		assertThat(constraint.getColSpan()).isEqualTo(3);
	}

	@Test
	void should_enforce_minimum_col_span_of_one() {
		constraint.setColSpan(0);
		assertThat(constraint.getColSpan()).isEqualTo(1);
		constraint.setColSpan(-1);
		assertThat(constraint.getColSpan()).isEqualTo(1);
	}

	@Test
	void should_have_row_span_one_by_default() {
		assertThat(constraint.getRowSpan()).isEqualTo(1);
	}

	@Test
	void should_set_and_get_row_span() {
		constraint.setRowSpan(2);
		assertThat(constraint.getRowSpan()).isEqualTo(2);
	}

	@Test
	void should_enforce_minimum_row_span_of_one() {
		constraint.setRowSpan(0);
		assertThat(constraint.getRowSpan()).isEqualTo(1);
		constraint.setRowSpan(-1);
		assertThat(constraint.getRowSpan()).isEqualTo(1);
	}

	@Test
	void should_have_left_align_by_default() {
		assertThat(constraint.getAlign()).isEqualTo(Align.left);
	}

	@Test
	void should_set_and_get_align() {
		constraint.setAlign(Align.center);
		assertThat(constraint.getAlign()).isEqualTo(Align.center);
	}

	@Test
	void should_have_top_vertical_align_by_default() {
		assertThat(constraint.getvAlign()).isEqualTo(VerticalAlign.top);
	}

	@Test
	void should_set_and_get_vertical_align() {
		constraint.setvAlign(VerticalAlign.center);
		assertThat(constraint.getvAlign()).isEqualTo(VerticalAlign.center);
	}
}
