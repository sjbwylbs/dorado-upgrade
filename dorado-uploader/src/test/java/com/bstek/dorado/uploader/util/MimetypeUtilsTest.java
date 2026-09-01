package com.bstek.dorado.uploader.util;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

class MimetypeUtilsTest {

	@TempDir
	File tempDir;

	@Test
	void should_return_non_null_mime_for_string() {
		String mime = MimetypeUtils.getMimetype("test.txt");
		assertThat(mime).isNotNull();
	}

	@Test
	void should_return_non_null_mime_for_file_object() {
		File file = new File("test.pdf");
		String mime = MimetypeUtils.getMimetype(file);
		assertThat(mime).isNotNull();
	}

	@Test
	void should_return_mime_for_real_txt_file(@TempDir File tempDir) throws IOException {
		File file = new File(tempDir, "test.txt");
		Files.writeString(file.toPath(), "hello");
		String mime = MimetypeUtils.getMimetype(file);
		assertThat(mime).isNotNull();
	}

	@Test
	void should_return_mime_for_real_html_file(@TempDir File tempDir) throws IOException {
		File file = new File(tempDir, "page.html");
		Files.writeString(file.toPath(), "<html></html>");
		String mime = MimetypeUtils.getMimetype(file);
		assertThat(mime).isNotNull();
	}

	@Test
	void should_return_mime_for_unknown_extension() {
		String mime = MimetypeUtils.getMimetype("file.xyz123");
		assertThat(mime).isNotNull();
		assertThat(mime).isEqualTo("application/octet-stream");
	}
}
