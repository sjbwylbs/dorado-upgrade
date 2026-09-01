package com.bstek.dorado.view.resolver;

import java.util.regex.Pattern;

import org.apache.commons.lang3.math.NumberUtils;

import com.bstek.dorado.core.io.Resource;
import com.bstek.dorado.web.DoradoContext;
import com.bstek.dorado.web.resolver.ResourceFileResolver;

@Deprecated
public class IE6PngFileResolver extends ResourceFileResolver {

	private static final String MSIE = "MSIE";

	private final static String CHROME_FRAME = "chromeframe";

	private final static Pattern MSIE_VERSION_PATTERN = Pattern.compile("^.*?MSIE\\s+(\\d+).*$");

	private final static String PNG24_DIR = "/silk/";

	private final static String PNG8_DIR = "/silk.deprecated/";

	@Deprecated
	@Override
	protected Resource[] getResourcesByFileName(DoradoContext context, String resourcePrefix, String fileName,
			String resourceSuffix) throws Exception {
		String ua = context.getRequest().getHeader("User-Agent");
		if (ua.indexOf(CHROME_FRAME) < 0) {
			boolean isMSIE = (ua != null && ua.indexOf(MSIE) != -1);
			if (isMSIE) {
				float version = NumberUtils.toFloat(MSIE_VERSION_PATTERN.matcher(ua).replaceAll("$1"), Float.MAX_VALUE);
				if (version < 7) {
					fileName = fileName.replace(PNG24_DIR, PNG8_DIR);
				}
			}
		}
		return super.getResourcesByFileName(context, resourcePrefix, fileName, resourceSuffix);
	}

}
