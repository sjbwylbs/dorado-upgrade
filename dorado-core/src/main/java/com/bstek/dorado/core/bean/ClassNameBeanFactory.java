package com.bstek.dorado.core.bean;

import org.aopalliance.intercept.MethodInterceptor;

import com.bstek.dorado.util.clazz.ClassUtils;
import com.bstek.dorado.util.proxy.ProxyBeanUtils;

/**
 * 用于根据Bean的类名创建相应的Bean实例的工厂。
 *
 */
public class ClassNameBeanFactory implements BeanFactory {

	private static final String PREFIX = "class";

	@Override
	public String getBeanNamePrefix() {
		return PREFIX;
	}

	private Class<?> getBeanType(String beanName) throws ClassNotFoundException {
		Class<?> cl = ClassUtils.forName(beanName);
		if (cl == null) {
			throw new IllegalArgumentException("Can not resolve bean type [" + beanName + "].");
		}
		return cl;
	}

	@Override
	public Object getBean(String beanName) throws Exception {
		Class<?> cl = getBeanType(beanName);
		return cl.getDeclaredConstructor().newInstance();
	}

	@Override
	public Object getBean(String beanName, MethodInterceptor[] methodInterceptors) throws Exception {
		Object bean = null;
		if (methodInterceptors == null || methodInterceptors.length == 0) {
			bean = getBean(beanName);
		}
		else {
			bean = ProxyBeanUtils.createBean(getBeanType(beanName), methodInterceptors);
		}
		return bean;
	}

}
