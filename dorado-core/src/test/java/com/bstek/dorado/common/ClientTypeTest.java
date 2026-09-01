package com.bstek.dorado.common;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class ClientTypeTest {

	@Test
	void should_have_correct_desktop_value() {
		assertThat(ClientType.DESKTOP).isEqualTo(0x00000001);
	}

	@Test
	void should_have_correct_touch_value() {
		assertThat(ClientType.TOUCH).isEqualTo(0x00000002);
	}

	@Test
	void should_have_correct_all_client_types() {
		assertThat(ClientType.ALL_CLIENT_TYPES).isEqualTo(ClientType.DESKTOP + ClientType.TOUCH);
	}

	@Test
	void should_have_correct_current_client_type_key() {
		assertThat(ClientType.CURRENT_CLIENT_TYPE_KEY).isEqualTo(ClientType.class.getName() + ".current");
	}

	// supports
	@Test
	void should_return_true_when_types_is_zero() {
		assertThat(ClientType.supports(0, ClientType.DESKTOP)).isTrue();
	}

	@Test
	void should_return_true_when_bitmask_contains_target() {
		assertThat(ClientType.supports(ClientType.DESKTOP | ClientType.TOUCH, ClientType.DESKTOP)).isTrue();
	}

	@Test
	void should_return_false_when_bitmask_does_not_contain_target() {
		assertThat(ClientType.supports(ClientType.DESKTOP, ClientType.TOUCH)).isFalse();
	}

	// supportsDesktop
	@Test
	void should_return_true_for_desktop_when_types_is_zero() {
		assertThat(ClientType.supportsDesktop(0)).isTrue();
	}

	@Test
	void should_return_true_for_desktop_when_desktop_bit_set() {
		assertThat(ClientType.supportsDesktop(ClientType.DESKTOP)).isTrue();
	}

	@Test
	void should_return_false_for_desktop_when_only_touch_set() {
		assertThat(ClientType.supportsDesktop(ClientType.TOUCH)).isFalse();
	}

	// supportsTouch
	@Test
	void should_return_true_for_touch_when_types_is_zero() {
		assertThat(ClientType.supportsTouch(0)).isTrue();
	}

	@Test
	void should_return_true_for_touch_when_touch_bit_set() {
		assertThat(ClientType.supportsTouch(ClientType.TOUCH)).isTrue();
	}

	@Test
	void should_return_false_for_touch_when_only_desktop_set() {
		assertThat(ClientType.supportsTouch(ClientType.DESKTOP)).isFalse();
	}

	// parseClientTypes(String)
	@Test
	void should_return_zero_for_null_string() {
		assertThat(ClientType.parseClientTypes((String) null)).isEqualTo(0);
	}

	@Test
	void should_return_zero_for_blank_string() {
		assertThat(ClientType.parseClientTypes("  ")).isEqualTo(0);
	}

	@Test
	void should_parse_desktop_from_string() {
		assertThat(ClientType.parseClientTypes("desktop")).isEqualTo(ClientType.DESKTOP);
	}

	@Test
	void should_parse_touch_from_string() {
		assertThat(ClientType.parseClientTypes("touch")).isEqualTo(ClientType.TOUCH);
	}

	@Test
	void should_parse_both_from_comma_separated_string() {
		assertThat(ClientType.parseClientTypes("desktop,touch")).isEqualTo(ClientType.DESKTOP | ClientType.TOUCH);
	}

	@Test
	void should_parse_both_from_semicolon_separated_string() {
		assertThat(ClientType.parseClientTypes("desktop;touch")).isEqualTo(ClientType.DESKTOP | ClientType.TOUCH);
	}

	@Test
	void should_parse_both_from_space_separated_string() {
		assertThat(ClientType.parseClientTypes("desktop touch")).isEqualTo(ClientType.DESKTOP | ClientType.TOUCH);
	}

	@Test
	void should_be_case_insensitive() {
		assertThat(ClientType.parseClientTypes("DESKTOP,TOUCH")).isEqualTo(ClientType.DESKTOP | ClientType.TOUCH);
	}

	// parseClientTypes(int[])
	@Test
	void should_return_zero_for_null_array() {
		assertThat(ClientType.parseClientTypes((int[]) null)).isEqualTo(0);
	}

	@Test
	void should_parse_int_array() {
		assertThat(ClientType.parseClientTypes(new int[] { ClientType.DESKTOP, ClientType.TOUCH }))
				.isEqualTo(ClientType.DESKTOP | ClientType.TOUCH);
	}

	@Test
	void should_parse_single_element_int_array() {
		assertThat(ClientType.parseClientTypes(new int[] { ClientType.TOUCH })).isEqualTo(ClientType.TOUCH);
	}

	// toString
	@Test
	void should_return_desktop_touch_for_zero_types() {
		// supportsDesktop(0) and supportsTouch(0) both return true (0 means "all")
		assertThat(ClientType.toString(0)).isEqualTo("desktop,touch");
	}

	@Test
	void should_return_desktop_for_desktop_only() {
		assertThat(ClientType.toString(ClientType.DESKTOP)).isEqualTo("desktop");
	}

	@Test
	void should_return_touch_for_touch_only() {
		assertThat(ClientType.toString(ClientType.TOUCH)).isEqualTo("touch");
	}

	@Test
	void should_return_both_for_all_types() {
		assertThat(ClientType.toString(ClientType.DESKTOP | ClientType.TOUCH)).isEqualTo("desktop,touch");
	}

	@Test
	void should_return_desktop_touch_when_all_bits_set() {
		// ALL_CLIENT_TYPES = DESKTOP + TOUCH
		assertThat(ClientType.toString(ClientType.ALL_CLIENT_TYPES)).isEqualTo("desktop,touch");
	}
}
