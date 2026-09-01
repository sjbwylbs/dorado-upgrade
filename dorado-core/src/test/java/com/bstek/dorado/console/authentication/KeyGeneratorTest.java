package com.bstek.dorado.console.authentication;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class KeyGeneratorTest {

	@Test
	void should_generate_key_with_specified_length() {
		String key = KeyGenerator.randomKey(10);
		assertThat(key).hasSize(10);
	}

	@Test
	void should_generate_empty_string_for_zero_length() {
		String key = KeyGenerator.randomKey(0);
		assertThat(key).isEmpty();
	}

	@Test
	void should_generate_empty_string_for_negative_length() {
		String key = KeyGenerator.randomKey(-1);
		assertThat(key).isEmpty();
	}

	@Test
	void should_generate_key_with_valid_characters() {
		String key = KeyGenerator.randomKey(100);
		assertThat(key).matches("[0-9a-z]+");
	}

	@Test
	void should_generate_different_keys_each_time() {
		String key1 = KeyGenerator.randomKey(20);
		String key2 = KeyGenerator.randomKey(20);
		// With 36^20 possibilities, collision is virtually impossible
		assertThat(key1).isNotEqualTo(key2);
	}

	@Test
	void should_generate_single_character_key() {
		String key = KeyGenerator.randomKey(1);
		assertThat(key).hasSize(1);
		assertThat(key).matches("[0-9a-z]");
	}
}
