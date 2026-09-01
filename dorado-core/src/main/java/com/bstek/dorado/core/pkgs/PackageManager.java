package com.bstek.dorado.core.pkgs;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import org.apache.commons.lang3.BooleanUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.bstek.dorado.util.clazz.ClassUtils;

import jakarta.servlet.ServletContextListener;

public final class PackageManager {

	private static final Log logger = LogFactory.getLog(PackageManager.class);

	private static final String PACKAGE_PROPERTIES_LOCATION = "META-INF/dorado-package.properties";

	private static final String AGPL = "AGPL";

	private static final String BSDN_MEMBER = "BSDN-Member";

	private static final String BSDN_COMMERCIAL = "BSDN-Commercial";

	private static final String INHERITED = "Inherited";

	private static final String[] LICENSE_INHERITED = new String[] { AGPL, BSDN_MEMBER, BSDN_COMMERCIAL };

	private static final Map<String, PackageInfo> packageInfosMap = new LinkedHashMap<>();

	private static boolean packageInfoBuilded = false;

	private static class DependsVersion {

		private boolean includeMinVersion = true;

		private String minVersion;

		private boolean includeMaxVersion = true;

		private String maxVersion;

		public boolean isIncludeMinVersion() {
			return includeMinVersion;
		}

		public void setIncludeMinVersion(boolean includeMinVersion) {
			this.includeMinVersion = includeMinVersion;
		}

		public String getMinVersion() {
			return minVersion;
		}

		public void setMinVersion(String minVersion) {
			this.minVersion = minVersion;
		}

		public boolean isIncludeMaxVersion() {
			return includeMaxVersion;
		}

		public void setIncludeMaxVersion(boolean includeMaxVersion) {
			this.includeMaxVersion = includeMaxVersion;
		}

		public String getMaxVersion() {
			return maxVersion;
		}

		public void setMaxVersion(String maxVersion) {
			this.maxVersion = maxVersion;
		}

	}

	private PackageManager() {
	}

	private static String trimDependsVersion(String version) {
		if ("*".equals(version)) {
			return null;
		}
		else if (version.indexOf('*') >= 0) {
			throw new IllegalArgumentException();
		}
		return version;
	}

	private static DependsVersion parseDependsVersion(String text) {
		DependsVersion dependsVersion = new DependsVersion();

		boolean beforeContent = true, afterContent = false, inVersion = false, commaFound = false;
		StringBuilder version = new StringBuilder(16);
		char c;
		for (int i = 0, len = text.length(); i < len; i++) {
			c = text.charAt(i);
			if (c == ' ') {
				if (inVersion) {
					throw new IllegalArgumentException();
				}
				continue;
			}
			else if (afterContent) {
				throw new IllegalArgumentException();
			}
			else if (c == '[' || c == '(') {
				if (!beforeContent) {
					throw new IllegalArgumentException();
				}
				beforeContent = false;
				dependsVersion.setIncludeMinVersion(c == '[');
			}
			else if (c == ']' || c == ')') {
				if (beforeContent) {
					throw new IllegalArgumentException();
				}
				afterContent = true;
				dependsVersion.setIncludeMaxVersion(c == ']');
			}
			else if (c == ',') {
				if (beforeContent || commaFound) {
					throw new IllegalArgumentException();
				}
				if (version.length() > 0) {
					String v = trimDependsVersion(version.toString());
					dependsVersion.setMinVersion(v);
					version.setLength(0);
				}
			}
			else if (c >= '0' && c <= '9' || c >= 'a' && c <= 'z' || c >= 'A' && c <= 'A' || c == '.' || c == '-'
					|| c == '*') {
				version.append(c);
			}
			else {
				throw new IllegalArgumentException();
			}
		}

		if (version.length() > 0) {
			String v = trimDependsVersion(version.toString());
			if (commaFound) {
				dependsVersion.setMaxVersion(v);
			}
			else {
				dependsVersion.setMinVersion(v);
				dependsVersion.setMaxVersion(v);
			}
		}
		return dependsVersion;
	}

	private static int compareVersionSection(String section1, String section2) {
		if (StringUtils.isNumeric(section1) && StringUtils.isNumeric(section2)) {
			return Integer.parseInt(section1) - Integer.parseInt(section2);
		}
		else {
			return section1.compareTo(section2);
		}
	}

	private static int compareVersion(String version1, String version2) {
		String[] sections1 = StringUtils.split(version1, ".-");
		String[] sections2 = StringUtils.split(version2, ".-");
		for (int i = 0; i < sections1.length; i++) {
			if (i >= sections2.length) {
				break;
			}
			String section1 = sections1[i], section2 = sections2[i];
			int result = compareVersionSection(section1, section2);
			if (result != 0) {
				return result;
			}
		}
		return 0;
	}

	private static void calculateDepends(PackageInfo packageInfo, List<PackageInfo> calculatedPackages,
			Map<String, PackageInfo> packageMap) throws Exception {
		Dependence[] dependences = packageInfo.getDepends();
		if (dependences == null || dependences.length == 0) {
			pushPackageInfo(calculatedPackages, packageInfo);
			return;
		}

		for (Dependence dependence : dependences) {
			PackageInfo dependedPackageInfo = packageMap.get(dependence.getPackageName());
			if (dependedPackageInfo == null) {
				throw new IllegalArgumentException("Package  \"" + dependence.getPackageName()
						+ "\" not found, Which is depended by \"" + packageInfo.getName() + "\".");
			}

			if (StringUtils.isNotEmpty(dependence.getVersion())) {
				String dependedPackageVersion = dependedPackageInfo.getVersion();

				DependsVersion dependsVersion;
				try {
					dependsVersion = parseDependsVersion(dependence.getVersion());
				}
				catch (IllegalArgumentException e) {
					throw new IllegalArgumentException("Invalid depends version \"" + dependence.getVersion()
							+ "\" found in Package \"" + packageInfo.getName() + "\".");
				}

				boolean versionMatch = true;
				if (StringUtils.isNotEmpty(dependsVersion.getMinVersion())) {
					int i = compareVersion(dependsVersion.getMinVersion(), dependedPackageVersion);
					if (i > 0 || i == 0 && !dependsVersion.isIncludeMinVersion()) {
						versionMatch = false;
					}
				}

				if (StringUtils.isNotEmpty(dependsVersion.getMaxVersion())) {
					int i = compareVersion(dependsVersion.getMaxVersion(), dependedPackageVersion);
					if (i < 0 || i == 0 && !dependsVersion.isIncludeMaxVersion()) {
						versionMatch = false;
					}
				}

				if (!versionMatch) {
					throw new IllegalArgumentException("Depended version mismatch. Expect \"" + dependence.getVersion()
							+ "\" but \"" + dependedPackageVersion + "\" found.");
				}
			}

			calculateDepends(dependedPackageInfo, calculatedPackages, packageMap);
		}
		pushPackageInfo(calculatedPackages, packageInfo);
	}

	private static void pushPackageInfo(List<PackageInfo> calculatedPackages, PackageInfo packageInfo) {
		if (!calculatedPackages.contains(packageInfo)) {
			String packageName = packageInfo.getName();
			if (packageName.equals("dorado-hibernate") || packageName.equals("dorado-jdbc")) {
				calculatedPackages.add(1, packageInfo);
			}
			else {
				calculatedPackages.add(packageInfo);
			}
		}
	}

	private static Dependence parseDependence(String text) {
		Dependence dependence = new Dependence();

		StringBuilder packageName = new StringBuilder();
		StringBuilder version = new StringBuilder();
		boolean versionFound = false;
		char c;
		for (int i = 0, len = text.length(); i < len; i++) {
			c = text.charAt(i);
			if (!versionFound) {
				if (c == '[' || c == '(') {
					versionFound = true;
					version.append(c);
				}
				else {
					packageName.append(c);
				}
			}
			else {
				version.append(c);
			}
		}

		if (StringUtils.isEmpty(packageName.toString())) {
			throw new IllegalArgumentException("Depended packageName undefined.");
		}
		dependence.setPackageName(packageName.toString());

		dependence.setVersion(version.toString());
		return dependence;
	}

	private static void doBuildPackageInfos() throws Exception {
		Map<String, PackageInfo> packageMap = new HashMap<>();

		Enumeration<URL> defaultContextFileResources = org.springframework.util.ClassUtils.getDefaultClassLoader()
			.getResources(PACKAGE_PROPERTIES_LOCATION);
		while (defaultContextFileResources.hasMoreElements()) {
			URL url = defaultContextFileResources.nextElement();
			walkthroughPackage(packageMap, url);
		}

		List<PackageInfo> calculatedPackages = new ArrayList<>();
		for (PackageInfo packageInfo : packageMap.values()) {
			calculateDepends(packageInfo, calculatedPackages, packageMap);
		}

		packageInfosMap.clear();
		for (PackageInfo packageInfo : calculatedPackages) {
			packageInfosMap.put(packageInfo.getName(), packageInfo);
		}
	}

	private static void walkthroughPackage(Map<String, PackageInfo> packageMap, URL url) throws IOException {
		InputStream in = null;
		try {
			URLConnection con = url.openConnection();
			con.setUseCaches(false);
			in = con.getInputStream();
			Properties properties = new Properties();
			properties.load(in);

			String packageName = properties.getProperty("name");
			if (StringUtils.isEmpty(packageName)) {
				throw new IllegalArgumentException("Package name undefined.");
			}

			PackageInfo packageInfo = new PackageInfo(packageName);

			packageInfo.setAddonVersion(properties.getProperty("addonVersion"));
			packageInfo.setVersion(properties.getProperty("version"));

			String dependsText = properties.getProperty("depends");
			if (StringUtils.isNotBlank(dependsText)) {
				List<Dependence> dependences = new ArrayList<>();
				for (String depends : StringUtils.split(dependsText, "; ")) {
					if (StringUtils.isNotEmpty(depends)) {
						Dependence dependence = parseDependence(depends);
						dependences.add(dependence);
					}
				}
				if (!dependences.isEmpty()) {
					packageInfo.setDepends(dependences.toArray(new Dependence[0]));
				}
			}

			String license = StringUtils.trim(properties.getProperty("license"));
			if (StringUtils.isNotEmpty(license)) {
				if (INHERITED.equals(license)) {
					packageInfo.setLicense(LICENSE_INHERITED);
				}
				else {
					String[] licenses = StringUtils.split(license);
					licenses = StringUtils.stripAll(licenses);
					packageInfo.setLicense(licenses);
				}
			}

			packageInfo.setLoadUnlicensed(BooleanUtils.toBoolean(properties.getProperty("loadUnlicensed")));

			packageInfo.setClassifier(properties.getProperty("classifier"));
			packageInfo.setHomePage(properties.getProperty("homePage"));
			packageInfo.setDescription(properties.getProperty("description"));

			packageInfo.setPropertiesLocations(properties.getProperty("propertiesConfigLocations"));
			packageInfo.setContextLocations(properties.getProperty("contextConfigLocations"));
			packageInfo.setComponentLocations(properties.getProperty("componentConfigLocations"));
			packageInfo.setServletContextLocations(properties.getProperty("servletContextConfigLocations"));

			String configurerClass = properties.getProperty("configurer");
			if (StringUtils.isNotBlank(configurerClass)) {
				Class<?> type = ClassUtils.forName(configurerClass);
				packageInfo.setConfigurer((PackageConfigurer) type.getDeclaredConstructor().newInstance());
			}

			String listenerClass = properties.getProperty("listener");
			if (StringUtils.isNotBlank(listenerClass)) {
				Class<?> type = ClassUtils.forName(listenerClass);
				packageInfo.setListener((PackageListener) type.getDeclaredConstructor().newInstance());
			}

			String servletContextListenerClass = properties.getProperty("servletContextListener");
			if (StringUtils.isNotBlank(servletContextListenerClass)) {
				Class<?> type = ClassUtils.forName(servletContextListenerClass);
				packageInfo
					.setServletContextListener((ServletContextListener) type.getDeclaredConstructor().newInstance());
			}

			if (packageMap.containsKey(packageName)) {
				PackageInfo conflictPackageInfo = packageMap.get(packageName);
				String conflictInfo = '[' + conflictPackageInfo.getName() + " - " + conflictPackageInfo.getVersion()
						+ ']' + " and " + '[' + packageInfo.getName() + " - " + packageInfo.getVersion() + ']';

				Exception e = new IllegalArgumentException(
						"More than one package \"" + packageName + "\" found. They are " + conflictInfo);
				logger.warn(e, e);

				if (comparePackages(conflictPackageInfo, packageInfo) > 0) {
					packageMap.put(packageName, packageInfo);
				}
			}
			else {
				packageMap.put(packageName, packageInfo);
			}
		}
		catch (Exception e) {
			throw new IllegalArgumentException("Error occured during parsing \"" + url.getPath() + "\".", e);
		}
		finally {
			if (in != null) {
				in.close();
			}
		}
	}

	private static int parseVersionSection(String section) {
		if (StringUtils.isNumeric(section)) {
			return Integer.parseInt(section) * 10;
		}
		else if ("RELEASE".equalsIgnoreCase(section)) {
			return 6;
		}
		else if ("STABLE".equalsIgnoreCase(section)) {
			return 7;
		}
		else if ("BETA".equalsIgnoreCase(section)) {
			return 4;
		}
		else if ("ALPHA".equalsIgnoreCase(section)) {
			return 3;
		}
		else if ("SNAPSHOT".equalsIgnoreCase(section)) {
			return 2;
		}
		else {
			return 5;
		}
	}

	private static int comparePackages(PackageInfo pkg1, PackageInfo pkg2) {
		String[] version1 = StringUtils.split(pkg1.getVersion(), '.'),
				version2 = StringUtils.split(pkg2.getVersion(), '.');
		if (version1 == null || version1.length == 0) {
			version1 = new String[] { "9999" };
		}
		if (version2 == null || version2.length == 0) {
			version2 = new String[] { "9999" };
		}

		for (int i = 0; i < version1.length && i < version2.length; i++) {
			int v1 = parseVersionSection(version1[i]), v2 = parseVersionSection(version1[i]);
			if (v1 != v2) {
				return v2 - v1;
			}
		}
		return 0;
	}

	private static void buildPackageInfos() throws Exception {
		if (!packageInfoBuilded) {
			packageInfoBuilded = true;
			doBuildPackageInfos();
		}
	}

	public static Map<String, PackageInfo> getPackageInfoMap() throws Exception {
		buildPackageInfos();
		return packageInfosMap;
	}

}
