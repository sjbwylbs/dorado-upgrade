package com.bstek.dorado.idesupport.model;

import com.bstek.dorado.annotation.XmlNode;
import com.bstek.dorado.annotation.XmlProperty;

@XmlNode(nodeName = "ClientEvent", parser = "spring:dorado.idesupport.childTemplateParser",
		properties = @XmlProperty(propertyName = "*", parser = "spring:dorado.staticPropertyParser"))
public class ClientEvent {

	private String name;

	private String[] parameters;

	private int clientTypes;

	private boolean deprecated;

	private String reserve;

	private Object userData;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String[] getParameters() {
		return parameters;
	}

	public void setParameters(String[] parameters) {
		this.parameters = parameters;
	}

	public int getClientTypes() {
		return clientTypes;
	}

	public void setClientTypes(int clientTypes) {
		this.clientTypes = clientTypes;
	}

	public boolean isDeprecated() {
		return deprecated;
	}

	public void setDeprecated(boolean deprecated) {
		this.deprecated = deprecated;
	}

	public String getReserve() {
		return reserve;
	}

	public void setReserve(String reserve) {
		this.reserve = reserve;
	}

	public Object getUserData() {
		return userData;
	}

	public void setUserData(Object userData) {
		this.userData = userData;
	}

}
