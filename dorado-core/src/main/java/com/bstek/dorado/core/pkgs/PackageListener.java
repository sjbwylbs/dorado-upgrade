package com.bstek.dorado.core.pkgs;

import com.bstek.dorado.core.io.ResourceLoader;

public interface PackageListener {

	public void beforeLoadPackage(PackageInfo packageInfo, ResourceLoader resourceLoader) throws Exception;

}
