package com.bstek.dorado.hibernate.config;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.bstek.dorado.core.Context;
import com.bstek.dorado.core.SpringApplicationContext;

/**
 * Dorado JPA配置辅助工具。
 *
 * <p>主要职责：从Spring容器中扫描 {@link EntityPackageRegister} bean，
 * 将其basePackage收集为JPA实体扫描包列表。调用方一般在构建
 * {@code LocalContainerEntityManagerFactoryBean} 时，
 * 用 {@code setPackagesToScan(...)} 合并这些包。</p>
 */
public class DoradoAnnotationConfiguration {

	private static final Log logger = LogFactory
			.getLog(DoradoAnnotationConfiguration.class);

	private DoradoAnnotationConfiguration() {
	}

	/**
	 * 返回应当扫描的所有包名（由 Spring context 中的 EntityPackageRegister 集合提供）。
	 * 调用方一般在构建 {@code LocalContainerEntityManagerFactoryBean} 时，
	 * 用 {@code setPackagesToScan(...)} 合并这些包。
	 */
	public static String[] getPackagesToScan() {
		List<String> result = new ArrayList<>();
		registerPackagesFromSpring(new PackageRegister() {
			@Override
			public void registerPackage(String packageName) {
				result.add(packageName);
			}
		});
		return result.toArray(new String[result.size()]);
	}

	private static void registerPackagesFromSpring(PackageRegister register) {
		try {
			Context context = Context.getCurrent();
			if (context instanceof SpringApplicationContext) {
				org.springframework.context.ApplicationContext applicationContext = ((SpringApplicationContext) context)
						.getApplicationContext();
				Map<String, EntityPackageRegister> beansMap = applicationContext
						.getBeansOfType(EntityPackageRegister.class);
				for (EntityPackageRegister packageRegister : beansMap
						.values()) {
					String basePackage = packageRegister.getBasePackage();
					if (StringUtils.isNotBlank(basePackage)) {
						register.registerPackage(basePackage);
					}
				}
			}
		} catch (Exception e) {
			logger.error(e, e);
		}
	}

	private interface PackageRegister {
		void registerPackage(String packageName);
	}
}
