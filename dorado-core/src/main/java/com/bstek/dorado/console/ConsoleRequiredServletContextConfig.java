package com.bstek.dorado.console;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.bstek.dorado.console.resolver.ShortPathResolver;
import com.bstek.dorado.web.resolver.ResolverRegister;
import com.bstek.dorado.web.resolver.ResolverRegisterProcessor;
import com.bstek.dorado.web.resolver.WebFileResolver;

@Configuration
public class ConsoleRequiredServletContextConfig {

	@Bean("dorado.console.shortPathResolverRegister")
	public ResolverRegister shortPathResolverRegister(
			@Qualifier("dorado.resolverRegisterProcessor") ResolverRegisterProcessor resolverRegisterProcessor) {
		ResolverRegister bean = new ResolverRegister();
		bean.setResolverRegisterProcessor(resolverRegisterProcessor);
		bean.setOrder(1);
		bean.setUrl("/dorado/console");

		ShortPathResolver resolver = new ShortPathResolver();
		resolver.setMainUrl("/com.bstek.dorado.console.Main.d");
		resolver.setWelcomeUrl("/com.bstek.dorado.console.Welcome.d");
		resolver.setLoginUrl("/com.bstek.dorado.console.Login.d");
		bean.setResolver(resolver);
		return bean;
	}

	@Bean("dorado.console.scriptsFileResolverRegister")
	public ResolverRegister scriptsFileResolverRegister(
			@Qualifier("dorado.resolverRegisterProcessor") ResolverRegisterProcessor resolverRegisterProcessor) {
		ResolverRegister bean = new ResolverRegister();
		bean.setResolverRegisterProcessor(resolverRegisterProcessor);
		bean.setOrder(41);
		bean.setUrl("/dorado/console/scripts/**");

		WebFileResolver resolver = new WebFileResolver();
		resolver.setBaseUri("/dorado/console/scripts");
		resolver.setResourcePrefix("classpath:/dorado/console/scripts");
		bean.setResolver(resolver);
		return bean;
	}

	@Bean("dorado.console.stylesFileResolverRegister")
	public ResolverRegister stylesFileResolverRegister(
			@Qualifier("dorado.resolverRegisterProcessor") ResolverRegisterProcessor resolverRegisterProcessor) {
		ResolverRegister bean = new ResolverRegister();
		bean.setResolverRegisterProcessor(resolverRegisterProcessor);
		bean.setOrder(42);
		bean.setUrl("/dorado/console/styles/**");

		WebFileResolver resolver = new WebFileResolver();
		resolver.setBaseUri("/dorado/console/styles");
		resolver.setResourcePrefix("classpath:/dorado/console/styles");
		bean.setResolver(resolver);
		return bean;
	}

	@Bean("dorado.console.imagesFileResolverRegister")
	public ResolverRegister imagesFileResolverRegister(
			@Qualifier("dorado.resolverRegisterProcessor") ResolverRegisterProcessor resolverRegisterProcessor) {
		ResolverRegister bean = new ResolverRegister();
		bean.setResolverRegisterProcessor(resolverRegisterProcessor);
		bean.setOrder(43);
		bean.setUrl("/dorado/console/images/**");

		WebFileResolver resolver = new WebFileResolver();
		resolver.setBaseUri("/dorado/console/images");
		resolver.setResourcePrefix("classpath:/dorado/console/images");
		bean.setResolver(resolver);
		return bean;
	}

}
