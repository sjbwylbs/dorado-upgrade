package com.bstek.dorado.view.registry;

import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.Map;

import com.bstek.dorado.util.clazz.ClassTypeRegistry;
import com.bstek.dorado.view.widget.layout.Layout;

/**
 * 默认的布局管理器类型的注册管理器。
 *
 */
public class DefaultLayoutTypeRegistry implements LayoutTypeRegistry {

	private String defaultType;

	private ClassTypeRegistry<LayoutTypeRegisterInfo> classTypeRegistry = new ClassTypeRegistry<>();

	private Map<String, LayoutTypeRegisterInfo> registerInfoMap = new LinkedHashMap<>();

	@Override
	public String getDefaultType() {
		return defaultType;
	}

	@Override
	public void setDefaultType(String defaultType) {
		this.defaultType = defaultType;
	}

	@Override
	public synchronized void registerType(LayoutTypeRegisterInfo registerInfo) {
		registerInfoMap.put(registerInfo.getType().toLowerCase(), registerInfo);
		classTypeRegistry.registerType(registerInfo.getClassType(), registerInfo);
	}

	@Override
	public synchronized LayoutTypeRegisterInfo getRegisterInfo(String type) {
		return registerInfoMap.get(type.toLowerCase());
	}

	@Override
	public synchronized LayoutTypeRegisterInfo getRegisterInfo(Class<? extends Layout> classType) {
		return classTypeRegistry.getMatchingValue(classType);
	}

	@Override
	public synchronized Collection<LayoutTypeRegisterInfo> getRegisterInfos() {
		return registerInfoMap.values();
	}

}
