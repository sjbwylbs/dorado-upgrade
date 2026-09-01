package com.bstek.dorado.view.resolver;

import java.util.regex.Pattern;

import org.apache.commons.lang3.math.NumberUtils;

import com.bstek.dorado.core.io.LocationTransformer;
import com.bstek.dorado.util.PathUtils;
import com.bstek.dorado.web.DoradoContext;

import jakarta.servlet.http.HttpServletRequest;

@Deprecated
public class FontAwesomeLocationTransformer implements LocationTransformer {

	private static final String MSIE = "MSIE";

	private final static String CHROME_FRAME = "chromeframe";

	private final static Pattern MSIE_VERSION_PATTERN = Pattern.compile("^.*?MSIE\\s+(\\d+).*$");

	private final static String NORMAL_DIR = "classpath:dorado/resources/icons/font-awesome";

	private final static String FAILSAFE_DIR = "classpath:dorado/resources/icons/font-awesome.deprecated";

	@Deprecated
	@Override
	public String transform(String protocal, String location) {
		HttpServletRequest request = DoradoContext.getAttachedRequest();
		if (request != null) {
			String ua = request.getHeader("User-Agent");
			if (ua.indexOf(CHROME_FRAME) < 0) {
				boolean isMSIE = (ua != null && ua.indexOf(MSIE) != -1);
				if (isMSIE) {
					float version = NumberUtils.toFloat(MSIE_VERSION_PATTERN.matcher(ua).replaceAll("$1"),
							Float.MAX_VALUE);
					if (version < 8) {
						return PathUtils.concatPath(FAILSAFE_DIR, location.substring(protocal.length()));
					}
				}
			}
		}
		return PathUtils.concatPath(NORMAL_DIR, location.substring(protocal.length()));
	}

}
