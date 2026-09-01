package com.bstek.dorado.data.entity;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class FilterTypeTest {

	// toInt tests
	@Test
	void should_return_0_for_toInt_NONE() {
		assertThat(FilterType.toInt(FilterType.NONE)).isEqualTo(0);
	}

	@Test
	void should_return_1_for_toInt_NEW() {
		assertThat(FilterType.toInt(FilterType.NEW)).isEqualTo(1);
	}

	@Test
	void should_return_2_for_toInt_MODIFIED() {
		assertThat(FilterType.toInt(FilterType.MODIFIED)).isEqualTo(2);
	}

	@Test
	void should_return_3_for_toInt_DELETED() {
		assertThat(FilterType.toInt(FilterType.DELETED)).isEqualTo(3);
	}

	@Test
	void should_return_4_for_toInt_MOVED() {
		assertThat(FilterType.toInt(FilterType.MOVED)).isEqualTo(4);
	}

	@Test
	void should_return_96_for_toInt_VISIBLE() {
		assertThat(FilterType.toInt(FilterType.VISIBLE)).isEqualTo(96);
	}

	@Test
	void should_return_97_for_toInt_DIRTY() {
		assertThat(FilterType.toInt(FilterType.DIRTY)).isEqualTo(97);
	}

	@Test
	void should_return_98_for_toInt_VISIBLE_DIRTY() {
		assertThat(FilterType.toInt(FilterType.VISIBLE_DIRTY)).isEqualTo(98);
	}

	@Test
	void should_return_99_for_toInt_ALL() {
		assertThat(FilterType.toInt(FilterType.ALL)).isEqualTo(99);
	}

	// fromInt tests
	@Test
	void should_return_NONE_for_fromInt_0() {
		assertThat(FilterType.fromInt(0)).isEqualTo(FilterType.NONE);
	}

	@Test
	void should_return_NEW_for_fromInt_1() {
		assertThat(FilterType.fromInt(1)).isEqualTo(FilterType.NEW);
	}

	@Test
	void should_return_MODIFIED_for_fromInt_2() {
		assertThat(FilterType.fromInt(2)).isEqualTo(FilterType.MODIFIED);
	}

	@Test
	void should_return_DELETED_for_fromInt_3() {
		assertThat(FilterType.fromInt(3)).isEqualTo(FilterType.DELETED);
	}

	@Test
	void should_return_MOVED_for_fromInt_4() {
		assertThat(FilterType.fromInt(4)).isEqualTo(FilterType.MOVED);
	}

	@Test
	void should_return_VISIBLE_for_fromInt_96() {
		assertThat(FilterType.fromInt(96)).isEqualTo(FilterType.VISIBLE);
	}

	@Test
	void should_return_DIRTY_for_fromInt_97() {
		assertThat(FilterType.fromInt(97)).isEqualTo(FilterType.DIRTY);
	}

	@Test
	void should_return_VISIBLE_DIRTY_for_fromInt_98() {
		assertThat(FilterType.fromInt(98)).isEqualTo(FilterType.VISIBLE_DIRTY);
	}

	@Test
	void should_return_ALL_for_fromInt_unknown() {
		assertThat(FilterType.fromInt(99)).isEqualTo(FilterType.ALL);
	}

	@Test
	void should_return_ALL_for_fromInt_default() {
		assertThat(FilterType.fromInt(123)).isEqualTo(FilterType.ALL);
	}
}
