package com.bstek.dorado.springboot;

import java.util.Objects;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jspecify.annotations.NonNull;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.web.servlet.ServletListenerRegistrationBean;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.web.context.ServletContextAware;

import com.bstek.dorado.web.filter.DelegatingFilterProxy;
import com.bstek.dorado.web.listener.DelegatingServletContextListenersManager;
import com.bstek.dorado.web.listener.DelegatingSessionListenersManager;
import com.bstek.dorado.web.loader.DoradoLoader;
import com.bstek.dorado.web.servlet.DoradoServlet;

import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.http.HttpSessionEvent;
import jakarta.servlet.http.HttpSessionListener;

/**
 * Spring Boot auto-configuration for the Dorado framework.
 * <p>
 * Replaces the traditional web.xml + SpringContextLoaderListener setup:
 * <ul>
 * <li>Calls {@link DoradoLoader#preload} to initialize the dorado engine</li>
 * <li>Registers {@link DoradoServlet} with configurable URL patterns</li>
 * <li>Registers dorado's {@link DelegatingFilterProxy} for all requests</li>
 * <li>Registers dorado's delegating session/servlet-context listeners</li>
 * </ul>
 */
@AutoConfiguration
@ConditionalOnWebApplication(type = ConditionalOnWebApplication.Type.SERVLET)
@EnableConfigurationProperties(DoradoProperties.class)
public class DoradoAutoConfiguration implements ServletContextAware {

	private static final Log logger = LogFactory.getLog(DoradoAutoConfiguration.class);

	private final DoradoProperties doradoProperties;

	public DoradoAutoConfiguration(DoradoProperties doradoProperties) {
		this.doradoProperties = doradoProperties;
	}

	@Override
	public void setServletContext(@NonNull ServletContext servletContext) {
		try {
			DoradoLoader doradoLoader = DoradoLoader.getInstance();
			// Set the dorado home path as a servlet context init parameter so
			// that DoradoLoader.preload picks it up (only if not already set
			// by env var / system property / the initializer).
			if (!doradoLoader.isPreloaded()) {
				String home = doradoProperties.getHome();
				if (StringUtils.isNotEmpty(home) && servletContext.getInitParameter("doradoHome") == null
						&& StringUtils.isEmpty(System.getenv("DORADO_HOME"))
						&& StringUtils.isEmpty(System.getProperty("doradoHome"))) {
					try {
						servletContext.setInitParameter("doradoHome", home);
					}
					catch (Exception ignored) {
						// servletContext may be read-only in some containers;
						// the initializer already set the system property as fallback.
					}
				}
				doradoLoader.preload(servletContext, true);
			}
		}
		catch (Exception e) {
			logger.error("Failed to preload Dorado engine", e);
		}
	}

	@Bean ServletRegistrationBean<DoradoServlet> doradoServletRegistration(DoradoProperties properties) {
		DoradoServlet servlet = new DoradoServlet();
		String[] patterns = Objects.requireNonNull(properties.getUrlPatterns().split(","));
		ServletRegistrationBean<DoradoServlet> registration = new ServletRegistrationBean<>(servlet, patterns);
		registration.setName("doradoServlet");
		registration.setLoadOnStartup(1);
		return registration;
	}

	@Bean FilterRegistrationBean<DelegatingFilterProxy> doradoDelegatingFilterProxy() {
		FilterRegistrationBean<DelegatingFilterProxy> registration = new FilterRegistrationBean<>();
		registration.setFilter(new DelegatingFilterProxy());
		registration.setName("doradoDelegatingFilterProxy");
		registration.addUrlPatterns("/*");
		registration.setOrder(Integer.MIN_VALUE);
		return registration;
	}

	@Bean ServletListenerRegistrationBean<ServletContextListener> doradoServletContextListener() {
		ServletContextListener listener = new ServletContextListener() {
			@Override
			public void contextInitialized(ServletContextEvent event) {
				try {
					DelegatingServletContextListenersManager.fireContextInitialized(event);
				}
				catch (Exception e) {
					logger.error(e, e);
				}
			}

			@Override
			public void contextDestroyed(ServletContextEvent event) {
				try {
					DelegatingServletContextListenersManager.fireContextDestroyed(event);
				}
				catch (Exception e) {
					logger.error(e, e);
				}
			}
		};
		return new ServletListenerRegistrationBean<>(listener);
	}

	@Bean ServletListenerRegistrationBean<HttpSessionListener> doradoSessionListener() {
		HttpSessionListener listener = new HttpSessionListener() {
			@Override
			public void sessionCreated(HttpSessionEvent se) {
				try {
					DelegatingSessionListenersManager.fireSessionCreated(se);
				}
				catch (Exception e) {
					logger.error(e, e);
				}
			}

			@Override
			public void sessionDestroyed(HttpSessionEvent se) {
				try {
					DelegatingSessionListenersManager.fireSessionDestroyed(se);
				}
				catch (Exception e) {
					logger.error(e, e);
				}
			}
		};
		return new ServletListenerRegistrationBean<>(listener);
	}
}
