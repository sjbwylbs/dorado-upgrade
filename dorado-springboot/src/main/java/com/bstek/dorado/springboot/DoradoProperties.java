package com.bstek.dorado.springboot;

import org.jspecify.annotations.NonNull;
import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Getter;
import lombok.Setter;

/**
 * Configurable properties for the Dorado framework.
 */
@Setter
@Getter
@ConfigurationProperties(prefix = "dorado")
public class DoradoProperties {

	/**
	 * Path to the dorado home directory.
	 * <p>
	 * Default is {@code "classpath:dorado-home"} which resolves the home
	 * directory from the classpath (i.e. {@code src/main/resources/dorado-home}
	 * at build time). In a classic web.xml deployment this can be overridden
	 * to {@code "/WEB-INF/dorado-home"} via the {@code dorado.home} property.
	 * </p>
	 */
	private @NonNull String home = "classpath:dorado-home";

	/**
	 * Comma-separated URL patterns for the Dorado servlet.
	 */
	private @NonNull String urlPatterns = "*.d,*.do,*.dpkg,/dorado/*,/index,/login,/rePassword,/goLogin,/welcome";
}
