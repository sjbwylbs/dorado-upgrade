package com.bstek.dorado.core.pkgs;

import com.bstek.dorado.core.io.ResourceLoader;

public interface PackageConfigurer {

	public String[] getPropertiesConfigLocations(ResourceLoader resourceLoader) throws Exception;

	public String[] getContextConfigLocations(ResourceLoader resourceLoader) throws Exception;

	public String[] getServletContextConfigLocations(ResourceLoader resourceLoader) throws Exception;

}
