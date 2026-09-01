package com.bstek.dorado.console;

import com.bstek.dorado.core.Configure;
import com.bstek.dorado.core.io.ResourceLoader;
import com.bstek.dorado.core.pkgs.AbstractPackageConfigurer;

public class ConsolePackageConfigurer extends AbstractPackageConfigurer {

	@Override
	public String[] getPropertiesConfigLocations(ResourceLoader resourceLoader) throws Exception {
		return null;
	}

	@Override
	public String[] getContextConfigLocations(ResourceLoader resourceLoader) throws Exception {
		if (Configure.getBoolean("console.enabled", false)) {
			return new String[] { "com.bstek.dorado.console.ConsoleContextConfig" };
		}
		return null;
	}

	public String[] getComponentConfigLocations(ResourceLoader resourceLoader) throws Exception {
		return null;
	}

	@Override
	public String[] getServletContextConfigLocations(ResourceLoader resourceLoader) throws Exception {
		if (Configure.getBoolean("console.enabled", false)) {
			return new String[] { "com.bstek.dorado.console.ConsoleServletContextConfig" };
		}
		return null;
	}

}
