package com.bstek.dorado.console;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.bstek.dorado.console.performance.CreateViewLogOutputter;
import com.bstek.dorado.console.performance.DefaultExecuteLogOutputter;
import com.bstek.dorado.console.performance.interceptor.DataProviderGetResultMethodInterceptor;
import com.bstek.dorado.console.performance.interceptor.DataResolveMethodInterceptor;
import com.bstek.dorado.console.performance.interceptor.RemoteServiceMethodInterceptor;
import com.bstek.dorado.console.performance.listener.ViewResolverListener;
import com.bstek.dorado.console.security.HtmlViewSecurityInterceptor;
import com.bstek.dorado.console.security.ViewServiceSecurityInterceptor;
import com.bstek.dorado.data.config.definition.DataProviderDefinitionManager;
import com.bstek.dorado.data.config.definition.DataResolverDefinitionManager;
import com.bstek.dorado.data.provider.manager.DataProviderInterceptorRegister;
import com.bstek.dorado.data.resolver.manager.DataResolverInterceptorRegister;
import com.bstek.dorado.view.resolver.HtmlViewResolver;
import com.bstek.dorado.view.resolver.ViewResolverListenerRegister;
import com.bstek.dorado.view.resolver.ViewServiceInterceptorRegister;
import com.bstek.dorado.view.resolver.ViewServiceResolver;

@Configuration
public class ConsoleServletContextConfig {

	@Bean("dorado.console.dataProviderInterceptorRegister")
	public DataProviderInterceptorRegister dataProviderInterceptorRegister(
			@Qualifier("dorado.dataProviderDefinitionManager") DataProviderDefinitionManager dataProviderDefinitionManager,
			@Qualifier("dorado.console.DefaultExecuteLogOutputter") DefaultExecuteLogOutputter defaultExecuteLogOutputter) {
		DataProviderInterceptorRegister bean = new DataProviderInterceptorRegister();
		bean.setDataProviderDefinitionManager(dataProviderDefinitionManager);

		DataProviderGetResultMethodInterceptor interceptor = new DataProviderGetResultMethodInterceptor();
		interceptor.setOrder(0);
		interceptor.setNamePattern("dorado.console.*");
		interceptor.setExecuteLogOutputter(defaultExecuteLogOutputter);
		bean.setMethodInterceptor(interceptor);
		return bean;
	}

	@Bean("dorado.console.dataResolverInterceptorRegister")
	public DataResolverInterceptorRegister dataResolverInterceptorRegister(
			@Qualifier("dorado.dataResolverDefinitionManager") DataResolverDefinitionManager dataResolverDefinitionManager,
			@Qualifier("dorado.console.DefaultExecuteLogOutputter") DefaultExecuteLogOutputter defaultExecuteLogOutputter) {
		DataResolverInterceptorRegister bean = new DataResolverInterceptorRegister();
		bean.setDataResolverDefinitionManager(dataResolverDefinitionManager);

		DataResolveMethodInterceptor interceptor = new DataResolveMethodInterceptor();
		interceptor.setOrder(0);
		interceptor.setNamePattern("dorado.console.*");
		interceptor.setExecuteLogOutputter(defaultExecuteLogOutputter);
		bean.setMethodInterceptor(interceptor);
		return bean;
	}

	@Bean("dorado.console.viewServiceSecurityInterceptorRegister")
	public ViewServiceInterceptorRegister viewServiceSecurityInterceptorRegister(
			@Qualifier("dorado.viewServiceResolver") ViewServiceResolver viewServiceResolver) {
		ViewServiceInterceptorRegister bean = new ViewServiceInterceptorRegister();
		bean.setViewServiceResolver(viewServiceResolver);

		ViewServiceSecurityInterceptor interceptor = new ViewServiceSecurityInterceptor();
		interceptor.setOrder(1);
		interceptor.setServiceNamePattern("dorado.console.*");
		bean.setMethodInterceptor(interceptor);
		return bean;
	}

	@Bean("dorado.console.remoteServiceInterceptorRegister")
	public ViewServiceInterceptorRegister remoteServiceInterceptorRegister(
			@Qualifier("dorado.viewServiceResolver") ViewServiceResolver viewServiceResolver,
			@Qualifier("dorado.console.DefaultExecuteLogOutputter") DefaultExecuteLogOutputter defaultExecuteLogOutputter) {
		ViewServiceInterceptorRegister bean = new ViewServiceInterceptorRegister();
		bean.setViewServiceResolver(viewServiceResolver);

		RemoteServiceMethodInterceptor interceptor = new RemoteServiceMethodInterceptor();
		interceptor.setOrder(0);
		interceptor.setNamePattern("dorado.console.*");
		interceptor.setExecuteLogOutputter(defaultExecuteLogOutputter);
		bean.setMethodInterceptor(interceptor);
		return bean;
	}

	@Bean("dorado.console.viewResolverListenerRegister")
	public ViewResolverListenerRegister viewResolverListenerRegister(
			@Qualifier("dorado.htmlViewResolver") HtmlViewResolver htmlViewResolver,
			@Qualifier("dorado.console.CreateViewLogOutputter") CreateViewLogOutputter createViewLogOutputter) {
		ViewResolverListenerRegister bean = new ViewResolverListenerRegister();
		bean.setViewResolver(htmlViewResolver);

		ViewResolverListener listener = new ViewResolverListener();
		listener.setViewNamePattern("*.dorado.console.*");
		listener.setExecuteLogOutputter(createViewLogOutputter);
		bean.setListener(listener);
		return bean;
	}

	@Bean("dorado.console.htmlViewSecurityInterceptor")
	public HtmlViewSecurityInterceptor htmlViewSecurityInterceptor() {
		HtmlViewSecurityInterceptor bean = new HtmlViewSecurityInterceptor();
		bean.setInterceptedNamePattern("*.dorado.console.*");
		return bean;
	}

}
