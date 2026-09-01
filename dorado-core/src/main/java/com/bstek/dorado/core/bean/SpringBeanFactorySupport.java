package com.bstek.dorado.core.bean;

import org.aopalliance.intercept.MethodInterceptor;

import com.bstek.dorado.util.proxy.ProxyBeanUtils;

/**
 * 根据Spring中定义个Bean的名称获得相应的Bean实例的工厂抽象支持类。
 *
 */
public abstract class SpringBeanFactorySupport implements BeanFactory {

	/**
	 * 返回Spring的Bean工厂。
	 * @throws Exception
	 */
	protected abstract org.springframework.beans.factory.BeanFactory getBeanFactory() throws Exception;

	@Override
	public Object getBean(String beanName) throws Exception {
		return getBeanFactory().getBean(beanName);
	}

	@Override
	public Object getBean(String beanName, MethodInterceptor[] methodInterceptors) throws Exception {
		Object bean = getBean(beanName);
		if (bean != null && methodInterceptors != null && methodInterceptors.length > 0) {
			bean = ProxyBeanUtils.proxyBean(bean, methodInterceptors);
		}
		return bean;
	}

}
