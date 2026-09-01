package com.bstek.dorado.view.loader;

import org.springframework.beans.factory.InitializingBean;

import com.bstek.dorado.spring.RemovableBean;

/**
 * 用于配置在Spring中以自动完成资源包配置文件装载的类。
 *
 */
public class PackagesConfigLoader implements InitializingBean, RemovableBean {

	private PackagesConfigManager packagesConfigManager;

	private String configLocation;

	/**
	 * 资源包配置的管理器。
	 */
	public void setPackagesConfigManager(PackagesConfigManager packagesConfigManager) {
		this.packagesConfigManager = packagesConfigManager;
	}

	/**
	 * 设置要装载的资源包配置文件的路径。
	 */
	public void setConfigLocation(String configLocation) {
		this.configLocation = configLocation;
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		if (configLocation != null) {
			packagesConfigManager.addConfigLocation(configLocation);
		}
	}

}
