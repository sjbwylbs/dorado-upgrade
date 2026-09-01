package com.bstek.dorado.web.resolver;

import org.springframework.web.servlet.mvc.Controller;

import com.bstek.dorado.util.SingletonBeanFactory;

public class ClassNameControllerResolver extends AbstractControllerResolver {

	@Override
	protected Controller getController(String controllerName) throws Exception {
		return (Controller) SingletonBeanFactory.getInstance(controllerName);
	}

}
