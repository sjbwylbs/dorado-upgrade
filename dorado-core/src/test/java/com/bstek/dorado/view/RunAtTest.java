package com.bstek.dorado.view;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class RunAtTest {

	@Test
	void should_contain_server_value() {
		assertThat(RunAt.valueOf("server")).isEqualTo(RunAt.server);
	}

	@Test
	void should_contain_client_value() {
		assertThat(RunAt.valueOf("client")).isEqualTo(RunAt.client);
	}

	@Test
	void should_contain_both_value() {
		assertThat(RunAt.valueOf("both")).isEqualTo(RunAt.both);
	}

	@Test
	void should_have_exactly_three_values() {
		assertThat(RunAt.values()).hasSize(3);
	}

	@Test
	void should_return_correct_name() {
		assertThat(RunAt.server.name()).isEqualTo("server");
		assertThat(RunAt.client.name()).isEqualTo("client");
		assertThat(RunAt.both.name()).isEqualTo("both");
	}
}
