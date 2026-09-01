package com.bstek.dorado.console.web;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import com.bstek.dorado.annotation.DataProvider;
import com.bstek.dorado.view.loader.Package;
import com.bstek.dorado.view.loader.PackagesConfig;
import com.bstek.dorado.view.loader.PackagesConfigManager;
import com.bstek.dorado.web.DoradoContext;

/**
 * Packages Config Service
 *
 */

public class PackageController {

	@DataProvider
	public Collection<PackageVO> getPackageList() throws Exception {
		PackagesConfigManager manager = (PackagesConfigManager) DoradoContext.getAttachedWebApplicationContext()
			.getBean("dorado.packagesConfigManager");
		PackagesConfig config = manager.getPackagesConfig();
		Map<String, Package> map = config.getPackages();
		List<PackageVO> list = new ArrayList<>();
		PackageVO doradoPackage;
		for (String name : map.keySet()) {
			doradoPackage = new PackageVO(map.get(name));
			list.add(doradoPackage);
		}

		return list;

	}

}
