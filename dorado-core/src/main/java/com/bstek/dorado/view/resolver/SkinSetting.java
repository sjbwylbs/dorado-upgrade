package com.bstek.dorado.view.resolver;

public class SkinSetting {

	private String name;

	private String version;

	private String author;

	private String description;

	private String dependedPackages;

	private int clientTypes;

	private String userAgent;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	public String getAuthor() {
		return author;
	}

	public void setAuthor(String author) {
		this.author = author;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getDependedPackages() {
		return dependedPackages;
	}

	public void setDependedPackages(String dependedPackages) {
		this.dependedPackages = dependedPackages;
	}

	public int getClientTypes() {
		return clientTypes;
	}

	public void setClientTypes(int clientTypes) {
		this.clientTypes = clientTypes;
	}

	public String getUserAgent() {
		return userAgent;
	}

	public void setUserAgent(String userAgent) {
		this.userAgent = userAgent;
	}

}
