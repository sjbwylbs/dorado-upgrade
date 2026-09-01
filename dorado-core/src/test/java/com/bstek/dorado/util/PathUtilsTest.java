package com.bstek.dorado.util;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class PathUtilsTest {

	// match tests
	@Test
	void should_match_exact_path() {
		assertThat(PathUtils.match("/foo/bar", "/foo/bar")).isTrue();
	}

	@Test
	void should_match_wildcard() {
		assertThat(PathUtils.match("/foo/*", "/foo/bar")).isTrue();
	}

	@Test
	void should_match_double_wildcard() {
		assertThat(PathUtils.match("/foo/**", "/foo/bar/baz")).isTrue();
	}

	@Test
	void should_not_match_different_path() {
		assertThat(PathUtils.match("/foo/bar", "/foo/baz")).isFalse();
	}

	@Test
	void should_not_match_empty_text() {
		assertThat(PathUtils.match("/foo/*", "")).isFalse();
	}

	@Test
	void should_not_match_null_text() {
		assertThat(PathUtils.match("/foo/*", null)).isFalse();
	}

	// concatPath tests
	@Test
	void should_concat_two_paths() {
		assertThat(PathUtils.concatPath("foo", "bar")).isEqualTo("foo/bar");
	}

	@Test
	void should_concat_with_trailing_slash() {
		assertThat(PathUtils.concatPath("foo/", "bar")).isEqualTo("foo/bar");
	}

	@Test
	void should_concat_with_leading_slash() {
		assertThat(PathUtils.concatPath("foo", "/bar")).isEqualTo("foo/bar");
	}

	@Test
	void should_concat_both_with_slashes() {
		assertThat(PathUtils.concatPath("foo/", "/bar")).isEqualTo("foo/bar");
	}

	@Test
	void should_concat_multiple_paths() {
		assertThat(PathUtils.concatPath("a", "b", "c")).isEqualTo("a/b/c");
	}

	@Test
	void should_skip_empty_paths() {
		assertThat(PathUtils.concatPath("foo", "", "bar")).isEqualTo("foo/bar");
	}

	@Test
	void should_skip_null_paths() {
		assertThat(PathUtils.concatPath("foo", null, "bar")).isEqualTo("foo/bar");
	}

	// isSafePath tests
	@Test
	void should_accept_safe_path() {
		assertThat(PathUtils.isSafePath("/foo/bar.txt")).isTrue();
	}

	@Test
	void should_reject_path_with_dotdot() {
		assertThat(PathUtils.isSafePath("/foo/../bar")).isFalse();
	}

	@Test
	void should_reject_path_with_comma() {
		assertThat(PathUtils.isSafePath("/foo,bar")).isFalse();
	}

	@Test
	void should_reject_path_with_colon() {
		assertThat(PathUtils.isSafePath("C:/foo")).isFalse();
	}

	@Test
	void should_reject_path_with_newline() {
		assertThat(PathUtils.isSafePath("/foo\nbar")).isFalse();
	}

	@Test
	void should_reject_path_with_space() {
		assertThat(PathUtils.isSafePath("/foo bar")).isFalse();
	}
}
