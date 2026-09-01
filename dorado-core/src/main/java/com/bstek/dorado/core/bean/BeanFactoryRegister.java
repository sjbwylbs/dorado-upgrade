package com.bstek.dorado.core.bean;

import java.util.List;

import org.springframework.beans.factory.InitializingBean;

import com.bstek.dorado.spring.RemovableBean;

/**
 * 用于利用外部的Spring配置文件完成Bean工厂注册功能的辅助类。
 *
 */
public class BeanFactoryRegister implements InitializingBean, RemovableBean {

	private BeanFactoryRegistry beanFactoryRegistry;

	private List<BeanFactory> beanFactories;

	public void setBeanFactoryRegistry(BeanFactoryRegistry beanFactoryRegistry) {
		this.beanFactoryRegistry = beanFactoryRegistry;
	}

	/**
	 * 设置要注册的Bean工厂的集合。
	 */
	public void setBeanFactories(List<BeanFactory> beanFactories) {
		this.beanFactories = beanFactories;
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		for (BeanFactory factory : beanFactories) {
			beanFactoryRegistry.registerBeanFactory(factory);
		}
	}

}
