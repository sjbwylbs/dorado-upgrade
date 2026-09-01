package com.bstek.dorado.core.pkgs;

import com.bstek.dorado.core.io.ResourceLoader;

public class AbstractPackageConfigurer implements PackageConfigurer {

	@Override
	public String[] getPropertiesConfigLocations(ResourceLoader resourceLoader) throws Exception {
		return null;
	}

	@Override
	public String[] getContextConfigLocations(ResourceLoader resourceLoader) throws Exception {
		return null;
	}

	@Override
	public String[] getServletContextConfigLocations(ResourceLoader resourceLoader) throws Exception {
		return null;
	}

}
