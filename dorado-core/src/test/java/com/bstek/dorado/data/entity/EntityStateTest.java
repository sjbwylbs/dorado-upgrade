package com.bstek.dorado.data.entity;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class EntityStateTest {

	@Test
	void should_return_true_for_isDirty_when_state_is_NEW() {
		assertThat(EntityState.isDirty(EntityState.NEW)).isTrue();
	}

	@Test
	void should_return_true_for_isDirty_when_state_is_MODIFIED() {
		assertThat(EntityState.isDirty(EntityState.MODIFIED)).isTrue();
	}

	@Test
	void should_return_true_for_isDirty_when_state_is_DELETED() {
		assertThat(EntityState.isDirty(EntityState.DELETED)).isTrue();
	}

	@Test
	void should_return_true_for_isDirty_when_state_is_MOVED() {
		assertThat(EntityState.isDirty(EntityState.MOVED)).isTrue();
	}

	@Test
	void should_return_false_for_isDirty_when_state_is_NONE() {
		assertThat(EntityState.isDirty(EntityState.NONE)).isFalse();
	}

	@Test
	void should_return_false_for_isVisible_when_state_is_DELETED() {
		assertThat(EntityState.isVisible(EntityState.DELETED)).isFalse();
	}

	@Test
	void should_return_true_for_isVisible_when_state_is_NONE() {
		assertThat(EntityState.isVisible(EntityState.NONE)).isTrue();
	}

	@Test
	void should_return_true_for_isVisible_when_state_is_NEW() {
		assertThat(EntityState.isVisible(EntityState.NEW)).isTrue();
	}

	@Test
	void should_return_true_for_isVisible_when_state_is_MODIFIED() {
		assertThat(EntityState.isVisible(EntityState.MODIFIED)).isTrue();
	}

	@Test
	void should_return_false_for_isVisibleDirty_when_state_is_NONE() {
		assertThat(EntityState.isVisibleDirty(EntityState.NONE)).isFalse();
	}

	@Test
	void should_return_false_for_isVisibleDirty_when_state_is_DELETED() {
		assertThat(EntityState.isVisibleDirty(EntityState.DELETED)).isFalse();
	}

	@Test
	void should_return_true_for_isVisibleDirty_when_state_is_NEW() {
		assertThat(EntityState.isVisibleDirty(EntityState.NEW)).isTrue();
	}

	@Test
	void should_return_true_for_isVisibleDirty_when_state_is_MODIFIED() {
		assertThat(EntityState.isVisibleDirty(EntityState.MODIFIED)).isTrue();
	}

	@Test
	void should_return_true_for_isVisibleDirty_when_state_is_MOVED() {
		assertThat(EntityState.isVisibleDirty(EntityState.MOVED)).isTrue();
	}

	// toInt tests
	@Test
	void should_return_0_for_toInt_NONE() {
		assertThat(EntityState.toInt(EntityState.NONE)).isEqualTo(0);
	}

	@Test
	void should_return_1_for_toInt_NEW() {
		assertThat(EntityState.toInt(EntityState.NEW)).isEqualTo(1);
	}

	@Test
	void should_return_2_for_toInt_MODIFIED() {
		assertThat(EntityState.toInt(EntityState.MODIFIED)).isEqualTo(2);
	}

	@Test
	void should_return_3_for_toInt_DELETED() {
		assertThat(EntityState.toInt(EntityState.DELETED)).isEqualTo(3);
	}

	@Test
	void should_return_4_for_toInt_MOVED() {
		assertThat(EntityState.toInt(EntityState.MOVED)).isEqualTo(4);
	}

	// fromInt tests
	@Test
	void should_return_NONE_for_fromInt_0() {
		assertThat(EntityState.fromInt(0)).isEqualTo(EntityState.NONE);
	}

	@Test
	void should_return_NEW_for_fromInt_1() {
		assertThat(EntityState.fromInt(1)).isEqualTo(EntityState.NEW);
	}

	@Test
	void should_return_MODIFIED_for_fromInt_2() {
		assertThat(EntityState.fromInt(2)).isEqualTo(EntityState.MODIFIED);
	}

	@Test
	void should_return_DELETED_for_fromInt_3() {
		assertThat(EntityState.fromInt(3)).isEqualTo(EntityState.DELETED);
	}

	@Test
	void should_return_MOVED_for_fromInt_4() {
		assertThat(EntityState.fromInt(4)).isEqualTo(EntityState.MOVED);
	}

	@Test
	void should_return_NONE_for_fromInt_unknown() {
		assertThat(EntityState.fromInt(99)).isEqualTo(EntityState.NONE);
	}
}
