package com.bstek.dorado.web;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.handler.SimpleMappingExceptionResolver;
import org.springframework.web.servlet.mvc.SimpleControllerHandlerAdapter;

import com.bstek.dorado.core.ConfigurePropertiesConfigurer;
import com.bstek.dorado.web.resolver.ResolverRegister;
import com.bstek.dorado.web.resolver.ResolverRegisterProcessor;
import com.bstek.dorado.web.resolver.SpringBeanControllerResolver;
import com.bstek.dorado.web.resolver.UriResolverMapping;

@Configuration
public class WebServletContextConfig {

	@Bean("dorado.servletConfigurePropertiesConfigurer")
	public ConfigurePropertiesConfigurer servletConfigurePropertiesConfigurer() {
		return new ConfigurePropertiesConfigurer();
	}

	@Bean("dorado.simpleControllerHandlerAdapter")
	public SimpleControllerHandlerAdapter simpleControllerHandlerAdapter() {
		return new SimpleControllerHandlerAdapter();
	}

	@Bean("dorado.resolverRegisterProcessor")
	public ResolverRegisterProcessor resolverRegisterProcessor(
			@Qualifier("dorado.urlResolverMapping") UriResolverMapping urlResolverMapping) {
		ResolverRegisterProcessor bean = new ResolverRegisterProcessor();
		bean.setUrlResolverMapping(urlResolverMapping);
		return bean;
	}

	@Bean("dorado.urlResolverMapping")
	public UriResolverMapping urlResolverMapping() {
		UriResolverMapping bean = new UriResolverMapping();
		bean.setLazyInitHandlers(true);
//		bean.setAlwaysUseFullPath(true);
		return bean;
	}

	@Bean("dorado.mappingExceptionResolver")
	public SimpleMappingExceptionResolver mappingExceptionResolver() {
		SimpleMappingExceptionResolver bean = new SimpleMappingExceptionResolver();
		bean.setDefaultErrorView("/dorado/ErrorPage");
		return bean;
	}

	/**
	 * Abstract bean definition helper for dorado.resolverRegister.
	 */
	protected ResolverRegister resolverRegister(ResolverRegisterProcessor resolverRegisterProcessor) {
		ResolverRegister bean = new ResolverRegister();
		bean.setResolverRegisterProcessor(resolverRegisterProcessor);
		return bean;
	}

	@Bean("dorado.controllerResolverRegister")
	public ResolverRegister controllerResolverRegister(
			@Qualifier("dorado.resolverRegisterProcessor") ResolverRegisterProcessor resolverRegisterProcessor,
			@Qualifier("dorado.controllerResolver") SpringBeanControllerResolver controllerResolver) {
		ResolverRegister bean = resolverRegister(resolverRegisterProcessor);
		bean.setOrder(1000);
		// 合法的 PathPattern：开头的 "**" 匹配零个或多个路径段（等价于
		// Ant 风格的 "**\/*.c"，任意深度下以 .c 结尾的 URL）。
		bean.setUrl("**/*.c");
		bean.setResolver(controllerResolver);
		return bean;
	}

}
