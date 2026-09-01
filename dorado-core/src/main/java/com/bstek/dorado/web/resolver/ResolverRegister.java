package com.bstek.dorado.web.resolver;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

import com.bstek.dorado.spring.RemovableBean;

public class ResolverRegister implements ApplicationContextAware, RemovableBean {

	private ResolverRegisterProcessor resolverRegisterProcessor;

	private String url;

	private Object resolver;

	private int order = 999;

	public void setResolverRegisterProcessor(ResolverRegisterProcessor resolverRegisterProcessor) {
		this.resolverRegisterProcessor = resolverRegisterProcessor;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public Object getResolver() {
		return resolver;
	}

	public void setResolver(Object resolver) {
		this.resolver = resolver;
	}

	public int getOrder() {
		return order;
	}

	public void setOrder(int order) {
		this.order = order;
	}

	@Override
	public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
		resolverRegisterProcessor.addResolverRegister(this);
	}

}
