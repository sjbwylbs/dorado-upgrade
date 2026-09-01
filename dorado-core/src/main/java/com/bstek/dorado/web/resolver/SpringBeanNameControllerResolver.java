package com.bstek.dorado.web.resolver;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.BeanFactoryAware;
import org.springframework.web.servlet.mvc.Controller;

public class SpringBeanNameControllerResolver extends AbstractControllerResolver implements BeanFactoryAware {

	private BeanFactory beanFactory;

	@Override
	public void setBeanFactory(BeanFactory beanFactory) throws BeansException {
		this.beanFactory = beanFactory;
	}

	@Override
	protected Controller getController(String controllerName) throws Exception {
		return (Controller) beanFactory.getBean(controllerName);
	}

}
