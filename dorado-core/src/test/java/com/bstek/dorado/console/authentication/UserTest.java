package com.bstek.dorado.console.authentication;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class UserTest {

	@Test
	void should_store_name_and_password() {
		User user = new User("admin", "secret");
		assertThat(user.getName()).isEqualTo("admin");
		assertThat(user.getPassword()).isEqualTo("secret");
	}

	@Test
	void should_set_and_get_name() {
		User user = new User("admin", "secret");
		user.setName("newAdmin");
		assertThat(user.getName()).isEqualTo("newAdmin");
	}

	@Test
	void should_set_and_get_password() {
		User user = new User("admin", "secret");
		user.setPassword("newSecret");
		assertThat(user.getPassword()).isEqualTo("newSecret");
	}
}
