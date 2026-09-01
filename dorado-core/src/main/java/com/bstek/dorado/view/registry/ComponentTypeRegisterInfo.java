package com.bstek.dorado.view.registry;

import org.apache.commons.lang3.ClassUtils;
import org.apache.commons.lang3.StringUtils;

import com.bstek.dorado.view.widget.Component;

/**
 * 组件类型注册信息。
 *
 */
public class ComponentTypeRegisterInfo {

	private String name;

	private Class<? extends Component> classType;

	private int clientTypes;

	private String category;

	private String dependsPackage;

	public ComponentTypeRegisterInfo(String name) {
		this.name = name;
	}

	/**
	 * 返回组件名。
	 */
	public String getName() {
		return name;
	}

	/**
	 * @param classType
	 */
	public void setClassType(Class<? extends Component> classType) {
		this.classType = classType;
		if (StringUtils.isEmpty(name)) {
			name = ClassUtils.getShortClassName(classType);
		}
	}

	/**
	 * 返回组件的Class类型。
	 */
	public Class<? extends Component> getClassType() {
		return classType;
	}

	public int getClientTypes() {
		return clientTypes;
	}

	public void setClientTypes(int clientTypes) {
		this.clientTypes = clientTypes;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	/**
	 * 返回该组件依赖的JavaScript Package。
	 *
	 * @see com.bstek.dorado.view.registry.DefaultComponentTypeRegister#setDependsPackage(String)
	 */
	public String getDependsPackage() {
		return dependsPackage;
	}

	/**
	 * 设置该组件依赖的JavaScript Package。
	 *
	 * @see com.bstek.dorado.view.registry.DefaultComponentTypeRegister#setDependsPackage(String)
	 */
	public void setDependsPackage(String dependsPackage) {
		this.dependsPackage = dependsPackage;
	}

}
