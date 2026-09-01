package com.bstek.dorado.view.registry;

import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.bstek.dorado.util.clazz.ClassTypeRegistry;
import com.bstek.dorado.view.widget.Component;

/**
 * 默认的组件类型信息注册管理器。
 *
 */
public class DefaultComponentTypeRegistry implements ComponentTypeRegistry {

	private static final Log logger = LogFactory.getLog(DefaultComponentTypeRegistry.class);

	private ClassTypeRegistry<ComponentTypeRegisterInfo> classTypeRegistry = new ClassTypeRegistry<>();

	private Map<String, ComponentTypeRegisterInfo> registerInfoMap = new HashMap<>();

	private Set<ComponentTypeRegisterInfo> registerInfoSet = new LinkedHashSet<>();

	@Override
	public synchronized void registerType(ComponentTypeRegisterInfo registerInfo) {
		registerInfoMap.put(registerInfo.getName(), registerInfo);
		Class<? extends Component> classType = registerInfo.getClassType();
		if (classType != null) {
			classTypeRegistry.registerType(classType, registerInfo);
		}
		registerInfoSet.add(registerInfo);
	}

	private ComponentTypeRegisterInfo initializeRefisterInfo(ComponentTypeRegisterInfo registerInfo) {
		try {
			if (registerInfo instanceof LazyInitailizeComponentTypeRegistryInfo) {
				LazyInitailizeComponentTypeRegistryInfo lazyRegistryInfo = (LazyInitailizeComponentTypeRegistryInfo) registerInfo;
				if (!lazyRegistryInfo.isInitialized()) {
					lazyRegistryInfo.initialize();
				}
			}
			return registerInfo;
		}
		catch (Exception e) {
			logger.error(e, e);
			return null;
		}
	}

	@Override
	public synchronized ComponentTypeRegisterInfo getRegisterInfo(String componentName) {
		ComponentTypeRegisterInfo registerInfo = registerInfoMap.get(componentName);
		return initializeRefisterInfo(registerInfo);
	}

	@Override
	public synchronized ComponentTypeRegisterInfo getRegisterInfo(Class<?> componentType) {
		ComponentTypeRegisterInfo registerInfo = classTypeRegistry.getMatchingValue(componentType);
		return initializeRefisterInfo(registerInfo);
	}

	@Override
	@SuppressWarnings("unchecked")
	public synchronized Collection<ComponentTypeRegisterInfo> getRegisterInfos() {
		for (ComponentTypeRegisterInfo registerInfo : registerInfoSet) {
			initializeRefisterInfo(registerInfo);
		}
		return Collections.unmodifiableSet(registerInfoSet);
	}

}
