package com.bstek.dorado.springboot;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;
import org.springframework.beans.factory.support.RootBeanDefinition;
import org.springframework.beans.factory.xml.XmlBeanDefinitionReader;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.Ordered;
import org.springframework.core.env.Environment;
import org.springframework.core.io.ResourceLoader;

import com.bstek.dorado.core.CommonContext;
import com.bstek.dorado.core.Context;
import com.bstek.dorado.web.ConsoleUtils;
import com.bstek.dorado.web.loader.DoradoLoader;

/**
 * Registers the Dorado context configurations (declared by the
 * <code>contextConfigLocations</code> entries of every
 * <code>META-INF/dorado-package.properties</code>) into the Spring Boot
 * application context.
 * <p>
 * This is the Spring Boot counterpart of what
 * {@link com.bstek.dorado.web.servlet.SpringContextLoaderListener#customizeContext}
 * does in a classic web.xml deployment: without it, application configurations
 * such as {@code @Qualifier("dorado.packagesConfigManager")} would fail with a
 * "required a bean ... that could not be found" error, because the Dorado
 * configuration classes would never be part of the Spring Boot context.
 * </p>
 * <p>
 * The initializer runs before the context refresh, so every registered
 * {@code @Configuration} class is processed by the regular
 * {@code ConfigurationClassPostProcessor} of the Spring Boot application
 * context - exactly like in the classic deployment.
 * </p>
 */
public class DoradoContextImportInitializer
		implements ApplicationContextInitializer<ConfigurableApplicationContext>, Ordered {

	private static final Log logger = LogFactory.getLog(DoradoContextImportInitializer.class);

	/**
	 * Default dorado home location when no {@code dorado.home} property is
	 * configured. Uses classpath so that files under
	 * {@code src/main/resources/dorado-home} are found in Spring Boot
	 * deployments.
	 */
	private static final String DEFAULT_DORADO_HOME = "classpath:dorado-home";

	@Override
	public int getOrder() {
		// Run as early as possible so that the Dorado configuration classes are
		// registered before the context is refreshed.
		return Ordered.HIGHEST_PRECEDENCE + 100;
	}

	@Override
	public void initialize(ConfigurableApplicationContext applicationContext) {
		if (!(applicationContext instanceof BeanDefinitionRegistry)) {
			logger.warn("Skipping Dorado context import: application context ["
					+ applicationContext.getClass().getName() + "] is not a BeanDefinitionRegistry.");
			return;
		}
		BeanDefinitionRegistry registry = (BeanDefinitionRegistry) applicationContext;

		try {
			DoradoLoader doradoLoader = DoradoLoader.getInstance();
			if (!doradoLoader.isPreloaded()) {
				configureDoradoHome(applicationContext.getEnvironment());
				doradoLoader.preload(null, false);
				// preload(null, false) 会创建一个仅包含 XML 配置的内部
				// CommonContext 并设为 failSafeContext。Spring Boot 下该内部
				// 上下文不含任何 bean 定义（dorado 配置已改为 Java @Configuration，
				// 注册在 Boot 上下文中），启动期静态初始化器（如 DataOutputter 中的
				// ResourceManagerUtils.get）解析 dorado.resourceManager 会抛
				// NoSuchBeanDefinitionException。这里将 failSafeContext 替换为
				// 委托 Boot 上下文的实现。
				new BootDoradoContext(applicationContext).install();
			}

			// In a classic web.xml deployment, contextConfigLocations are registered
			// into the root WebApplicationContext while servletContextConfigLocations
			// are registered into the DispatcherServlet's child context. Spring Boot
			// uses a single application context, so both location sets must be
			// imported here for servlet-level beans (e.g. dorado.viewServiceResolver,
			// required by application-level ViewServiceInterceptorRegister beans) to
			// be resolvable.
			List<String> locations = new ArrayList<>(doradoLoader.getContextLocations(false));
			List<String> servletLocations = doradoLoader.getServletContextLocations(false);
			if (servletLocations != null) {
				locations.addAll(servletLocations);
			}
			if (locations.isEmpty()) {
				return;
			}

			ConsoleUtils.outputLoadingInfo("Importing dorado context configurations into spring boot context...");

			for (String location : locations) {
				location = (location == null) ? "" : location.trim();
				if (location.isEmpty()) {
					continue;
				}
				if (isJavaConfigClass(location)) {
					registerJavaConfiguration(registry, location);
				}
				else {
					loadXmlConfiguration(applicationContext, registry, location);
				}
			}
		}
		catch (Exception e) {
			throw new IllegalStateException("Failed to import dorado context configurations into spring boot context.",
					e);
		}
	}

	/**
	 * Registers a Java {@code @Configuration} class as a bean definition in the
	 * Spring registry. The {@code ConfigurationClassPostProcessor} will process
	 * it during context refresh.
	 */
	private void registerJavaConfiguration(BeanDefinitionRegistry registry, String className) {
		try {
			Class<?> configClass = Class.forName(className);
			if (!registry.containsBeanDefinition(className)) {
				RootBeanDefinition bd = new RootBeanDefinition(configClass);
				bd.setRole(BeanDefinition.ROLE_INFRASTRUCTURE);
				registry.registerBeanDefinition(className, bd);
				if (logger.isDebugEnabled()) {
					logger.debug("Registered dorado Java @Configuration [" + className + "]");
				}
			}
		}
		catch (ClassNotFoundException ex) {
			logger.warn("Dorado Java config class not found: " + className);
		}
	}

	/**
	 * Loads bean definitions from an XML configuration resource (for example
	 * <code>home:context.xml</code> entries contributed by dorado packages).
	 */
	private void loadXmlConfiguration(ConfigurableApplicationContext applicationContext, BeanDefinitionRegistry registry,
			String location) {
		try {
			XmlBeanDefinitionReader reader = new XmlBeanDefinitionReader(registry);
			reader.setEnvironment(applicationContext.getEnvironment());
			if (applicationContext instanceof ResourceLoader) {
				reader.setResourceLoader((ResourceLoader) applicationContext);
			}
			int importCount = reader.loadBeanDefinitions(location);
			if (logger.isDebugEnabled()) {
				logger.debug("Imported " + importCount + " bean definitions from dorado-context [" + location + "]");
			}
		}
		catch (Exception ex) {
			logger.warn("Skipping invalid dorado-context [" + location + "]: " + ex.getMessage());
		}
	}

	private static boolean isJavaConfigClass(String location) {
		if (location.startsWith("classpath:") || location.startsWith("file:") || location.endsWith(".xml")) {
			return false;
		}
		if (location.contains("/") || location.contains("*") || location.contains("?")) {
			return false;
		}
		try {
			Class.forName(location.trim());
			return true;
		}
		catch (ClassNotFoundException e) {
			return false;
		}
	}

	/**
	 * Sets the {@code doradoHome} system property before DoradoLoader.preload
	 * runs, so that the home directory is resolved from the classpath
	 * ({@code classpath:dorado-home}) instead of the default
	 * {@code /WEB-INF/dorado-home} which does not exist in a Spring Boot
	 * deployment.
	 * <p>
	 * Priority (highest first):
	 * <ol>
	 * <li>{@code DORADO_HOME} environment variable</li>
	 * <li>{@code doradoHome} system property (if already set)</li>
	 * <li>{@code dorado.home} Spring Boot property (from
	 * {@code application.properties / .yml})</li>
	 * <li>{@code classpath:dorado-home} fallback</li>
	 * </ol>
	 * </p>
	 */
	private void configureDoradoHome(Environment environment) {
		if (StringUtils.isNotEmpty(System.getenv("DORADO_HOME"))) {
			return;
		}
		if (StringUtils.isNotEmpty(System.getProperty("doradoHome"))) {
			return;
		}
		String home = environment.getProperty("dorado.home", DEFAULT_DORADO_HOME);
		System.setProperty("doradoHome", home);
		if (logger.isDebugEnabled()) {
			logger.debug("Set doradoHome system property to [" + home + "]");
		}
	}

	/**
	 * A {@link CommonContext} that delegates bean lookups to the Spring Boot
	 * application context instead of the (empty) internal Dorado XML context.
	 * <p>
	 * Before the context refresh begins ({@code isActive() == false}) it returns
	 * {@code null}, so that early lookups fail with
	 * {@code ApplicationContextNotInitException} and fall back to
	 * {@code LazyInitResourceManager} - exactly like in a classic web.xml
	 * deployment where the root WebApplicationContext is not yet published
	 * during startup.
	 * </p>
	 */
	private static class BootDoradoContext extends CommonContext {

		private final ConfigurableApplicationContext bootApplicationContext;

		BootDoradoContext(ConfigurableApplicationContext bootApplicationContext) {
			this.bootApplicationContext = bootApplicationContext;
		}

		@Override
		public ApplicationContext getApplicationContext() {
			return bootApplicationContext.isActive() ? bootApplicationContext : null;
		}

		/**
		 * Replaces the failSafeContext installed by
		 * {@code DoradoLoader.preload} and re-attaches to the current (main)
		 * thread, so that static initializers running during the context
		 * refresh resolve dorado services from the Spring Boot context.
		 */
		void install() {
			Context.setFailSafeContext(this);
			attachToThreadLocal(this);
		}
	}
}
