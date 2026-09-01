package com.bstek.dorado.uploader;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class UserAgentTest {

	@Test
	void should_create_user_agent_with_all_fields() {
		UserAgent ua = new UserAgent("Chrome", "120.0", "Windows", "10", null);
		assertThat(ua.getBrowserType()).isEqualTo("Chrome");
		assertThat(ua.getBrowserVersion()).isEqualTo("120.0");
		assertThat(ua.getPlatformType()).isEqualTo("Windows");
		assertThat(ua.getPlatformSeries()).isEqualTo("10");
		assertThat(ua.getPlatformVersion()).isNull();
	}

	@Test
	void should_create_empty_user_agent() {
		UserAgent ua = new UserAgent();
		assertThat(ua.getBrowserType()).isNull();
		assertThat(ua.getBrowserVersion()).isNull();
		assertThat(ua.getPlatformType()).isNull();
		assertThat(ua.getPlatformSeries()).isNull();
		assertThat(ua.getPlatformVersion()).isNull();
	}

	@Test
	void should_set_and_get_browser_type() {
		UserAgent ua = new UserAgent();
		ua.setBrowserType("Firefox");
		assertThat(ua.getBrowserType()).isEqualTo("Firefox");
	}

	@Test
	void should_set_and_get_browser_version() {
		UserAgent ua = new UserAgent();
		ua.setBrowserVersion("115.0");
		assertThat(ua.getBrowserVersion()).isEqualTo("115.0");
	}

	@Test
	void should_set_and_get_platform_type() {
		UserAgent ua = new UserAgent();
		ua.setPlatformType("Mac OS X");
		assertThat(ua.getPlatformType()).isEqualTo("Mac OS X");
	}

	@Test
	void should_set_and_get_platform_series() {
		UserAgent ua = new UserAgent();
		ua.setPlatformSeries("14");
		assertThat(ua.getPlatformSeries()).isEqualTo("14");
	}

	@Test
	void should_set_and_get_platform_version() {
		UserAgent ua = new UserAgent();
		ua.setPlatformVersion("x64");
		assertThat(ua.getPlatformVersion()).isEqualTo("x64");
	}
}
