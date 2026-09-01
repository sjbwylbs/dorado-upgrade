package com.bstek.dorado.core.bean;

import org.springframework.beans.factory.InitializingBean;

import com.bstek.dorado.spring.RemovableBean;

/**
 * 用于配置在Spring文件中，自动初始化{@link com.bstek.dorado.core.bean.BeanFactoryUtils}的辅助类。
 *
 * @see com.bstek.dorado.core.bean.BeanFactoryUtils
 */
public class BeanFactoryUtilsInitializer implements InitializingBean, RemovableBean {

	private BeanFactoryRegistry beanFactoryRegistry;

	private ScopeManager scopeManager;

	/**
	 * 设置Bean工厂的注册管理器。
	 */
	public void setBeanFactoryRegistry(BeanFactoryRegistry beanFactoryRegistry) {
		this.beanFactoryRegistry = beanFactoryRegistry;
	}

	/**
	 * @param scopeManager the scopeManager to set
	 */
	public void setScopeManager(ScopeManager scopeManager) {
		this.scopeManager = scopeManager;
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		BeanFactoryUtils.setBeanFactoryRegistry(beanFactoryRegistry);
		BeanFactoryUtils.setScopeManager(scopeManager);
	}

}
