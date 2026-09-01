package com.bstek.dorado.util;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

class FileUtilsTest {

	@Test
	void should_clear_directory(@TempDir File tempDir) throws IOException {
		File subDir = new File(tempDir, "subdir");
		subDir.mkdirs();
		Files.writeString(new File(tempDir, "file1.txt").toPath(), "content1");
		Files.writeString(new File(subDir, "file2.txt").toPath(), "content2");

		FileUtils.clearDirectory(tempDir);

		assertThat(tempDir.listFiles()).isEmpty();
	}

	@Test
	void should_remove_directory(@TempDir File tempDir) throws IOException {
		File toDelete = new File(tempDir, "toDelete");
		toDelete.mkdirs();
		Files.writeString(new File(toDelete, "file.txt").toPath(), "content");

		FileUtils.removeDirectory(toDelete);

		assertThat(toDelete.exists()).isFalse();
	}

	@Test
	void should_do_nothing_for_clear_non_directory(@TempDir File tempDir) throws IOException {
		File file = new File(tempDir, "file.txt");
		Files.writeString(file.toPath(), "content");

		// Should not throw
		FileUtils.clearDirectory(file);
	}

	@Test
	void should_do_nothing_for_remove_non_directory(@TempDir File tempDir) throws IOException {
		File file = new File(tempDir, "file.txt");
		Files.writeString(file.toPath(), "content");

		// Should not throw
		FileUtils.removeDirectory(file);
	}

	@Test
	void should_clear_nested_directories(@TempDir File tempDir) throws IOException {
		File level1 = new File(tempDir, "level1");
		File level2 = new File(level1, "level2");
		level2.mkdirs();
		Files.writeString(new File(level2, "deep.txt").toPath(), "deep content");

		FileUtils.clearDirectory(tempDir);

		assertThat(tempDir.listFiles()).isEmpty();
	}
}
