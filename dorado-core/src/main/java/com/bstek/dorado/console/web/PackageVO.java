package com.bstek.dorado.console.web;

import java.util.LinkedHashSet;
import java.util.Set;

import com.bstek.dorado.view.loader.Package;

/**
 * Dorado Package
 *
 */

public class PackageVO extends Package {

	private Set<String> depends = new LinkedHashSet<>();

	private Set<String> dependedBy = new LinkedHashSet<>();

	public PackageVO() {
		super(null);
	}

	public void setDepends(Set<String> depends) {
		this.depends = depends;
	}

	public void setDependedBy(Set<String> dependedBy) {
		this.dependedBy = dependedBy;
	}

	/**
	 * 返回此资源包依赖的其他资源包的集合。集合中的项为依赖的资源包的名称。
	 */
	@Override
	public Set<String> getDepends() {
		return depends;
	}

	@Override
	public Set<String> getDependedBy() {
		return dependedBy;
	}

	public PackageVO(Package package1) {
		super(package1.getName());
		this.setBaseUri(package1.getBaseUri());
		this.setCharset(package1.getCharset());
		this.setContentType(package1.getContentType());
		this.setFileNames(package1.getFileNames());
		this.setPattern(package1.getPattern());
		this.setDepends(package1.getDepends());
		this.setDependedBy(package1.getDependedBy());
	}

}
