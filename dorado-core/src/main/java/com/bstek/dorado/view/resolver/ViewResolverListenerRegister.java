package com.bstek.dorado.view.resolver;

import org.springframework.beans.factory.InitializingBean;

import com.bstek.dorado.spring.RemovableBean;

public class ViewResolverListenerRegister implements InitializingBean, RemovableBean {

	private HtmlViewResolver viewResolver;

	private ViewResolverListener listener;

	public void setViewResolver(HtmlViewResolver viewResolver) {
		this.viewResolver = viewResolver;
	}

	public void setListener(ViewResolverListener listener) {
		this.listener = listener;
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		if (listener != null) {
			viewResolver.addViewResolverListener(listener);
		}
	}

}
