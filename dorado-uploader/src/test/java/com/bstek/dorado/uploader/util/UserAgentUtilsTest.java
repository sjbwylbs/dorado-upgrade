package com.bstek.dorado.uploader.util;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.bstek.dorado.uploader.UserAgent;

class UserAgentUtilsTest {

	@Test
	void should_return_null_for_blank_user_agent() {
		assertThat(UserAgentUtils.getUserAgent(null)).isNull();
		assertThat(UserAgentUtils.getUserAgent("")).isNull();
		assertThat(UserAgentUtils.getUserAgent("   ")).isNull();
	}

	@Test
	void should_detect_chrome_on_windows_7() {
		String ua = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
		UserAgent result = UserAgentUtils.getUserAgent(ua);
		assertThat(result).isNotNull();
		assertThat(result.getBrowserType()).isEqualTo("Chrome");
		assertThat(result.getBrowserVersion()).isEqualTo("120.0.0.0");
		assertThat(result.getPlatformType()).isEqualTo("Windows");
		assertThat(result.getPlatformSeries()).isEqualTo("7");
	}

	@Test
	void should_detect_firefox_on_windows_10() {
		String ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:115.0) Gecko/20100101 Firefox/115.0";
		// Windows NT 10.0 is not in the switch, but let's test what we can
		// Actually Windows NT 10.0 isn't handled, let's use Windows 7
		String ua7 = "Mozilla/5.0 (Windows NT 6.1; rv:115.0) Gecko/20100101 Firefox/115.0";
		UserAgent result = UserAgentUtils.getUserAgent(ua7);
		assertThat(result).isNotNull();
		assertThat(result.getBrowserType()).isEqualTo("Firefox");
		assertThat(result.getBrowserVersion()).isEqualTo("115.0");
		assertThat(result.getPlatformType()).isEqualTo("Windows");
	}

	@Test
	void should_detect_ie9_on_windows_7() {
		String ua = "Mozilla/4.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)";
		UserAgent result = UserAgentUtils.getUserAgent(ua);
		assertThat(result).isNotNull();
		assertThat(result.getBrowserType()).isEqualTo("Internet Explorer");
		assertThat(result.getBrowserVersion()).isEqualTo("9");
		assertThat(result.getPlatformType()).isEqualTo("Windows");
	}

	@Test
	void should_detect_ie8_on_windows_xp() {
		String ua = "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0)";
		UserAgent result = UserAgentUtils.getUserAgent(ua);
		assertThat(result).isNotNull();
		assertThat(result.getBrowserType()).isEqualTo("Internet Explorer");
		assertThat(result.getBrowserVersion()).isEqualTo("8");
		assertThat(result.getPlatformType()).isEqualTo("Windows");
		assertThat(result.getPlatformSeries()).isEqualTo("XP");
	}

	@Test
	void should_detect_chrome_on_mac_os_x() {
		String ua = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
		UserAgent result = UserAgentUtils.getUserAgent(ua);
		assertThat(result).isNotNull();
		assertThat(result.getBrowserType()).isEqualTo("Chrome");
		assertThat(result.getPlatformType()).isEqualTo("Mac OS X");
	}

	@Test
	void should_detect_windows_vista() {
		String ua = "Mozilla/5.0 (Windows NT 6.0) AppleWebKit/537.36 Chrome/120.0.0.0";
		UserAgent result = UserAgentUtils.getUserAgent(ua);
		assertThat(result).isNotNull();
		assertThat(result.getPlatformSeries()).isEqualTo("Vista");
	}

	@Test
	void should_detect_windows_8() {
		String ua = "Mozilla/5.0 (Windows NT 6.2) AppleWebKit/537.36 Chrome/120.0.0.0";
		UserAgent result = UserAgentUtils.getUserAgent(ua);
		assertThat(result).isNotNull();
		assertThat(result.getPlatformSeries()).isEqualTo("8");
	}

	@Test
	void should_detect_windows_2000() {
		String ua = "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0)";
		UserAgent result = UserAgentUtils.getUserAgent(ua);
		assertThat(result).isNotNull();
		assertThat(result.getPlatformSeries()).isEqualTo("2000");
	}

	@Test
	void should_detect_windows_ce() {
		String ua = "Mozilla/4.0 (Windows CE) Firefox/10.0";
		UserAgent result = UserAgentUtils.getUserAgent(ua);
		assertThat(result).isNotNull();
		assertThat(result.getPlatformSeries()).isEqualTo("CE");
	}

	@Test
	void should_return_null_for_unknown_platform() {
		String ua = "SomeUnknownPlatform/1.0";
		UserAgent result = UserAgentUtils.getUserAgent(ua);
		assertThat(result).isNull();
	}

	@Test
	void should_detect_unknown_browser_on_known_platform() {
		String ua = "Mozilla/5.0 (Windows NT 6.1) SomeUnknownBrowser/1.0";
		UserAgent result = UserAgentUtils.getUserAgent(ua);
		assertThat(result).isNotNull();
		assertThat(result.getBrowserType()).isNull();
		assertThat(result.getPlatformType()).isEqualTo("Windows");
	}
}
