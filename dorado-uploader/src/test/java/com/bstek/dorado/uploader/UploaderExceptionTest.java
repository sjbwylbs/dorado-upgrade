package com.bstek.dorado.uploader;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class UploaderExceptionTest {

	@Test
	void should_have_default_status_code_500() {
		UploaderException ex = new UploaderException();
		assertThat(ex.getStatusCode()).isEqualTo(500);
	}

	@Test
	void should_create_with_message() {
		UploaderException ex = new UploaderException("upload failed");
		assertThat(ex.getMessage()).isEqualTo("upload failed");
		assertThat(ex.getStatusCode()).isEqualTo(500);
	}

	@Test
	void should_create_with_message_and_cause() {
		Throwable cause = new RuntimeException("root cause");
		UploaderException ex = new UploaderException("upload failed", cause);
		assertThat(ex.getMessage()).isEqualTo("upload failed");
		assertThat(ex.getCause()).isEqualTo(cause);
	}

	@Test
	void should_create_with_cause() {
		Throwable cause = new RuntimeException("root cause");
		UploaderException ex = new UploaderException(cause);
		assertThat(ex.getCause()).isEqualTo(cause);
	}

	@Test
	void should_create_with_status_code() {
		UploaderException ex = new UploaderException(404);
		assertThat(ex.getStatusCode()).isEqualTo(404);
	}

	@Test
	void should_set_status_code() {
		UploaderException ex = new UploaderException();
		ex.setStatusCode(403);
		assertThat(ex.getStatusCode()).isEqualTo(403);
	}
}
