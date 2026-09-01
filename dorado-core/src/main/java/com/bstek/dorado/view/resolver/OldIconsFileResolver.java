package com.bstek.dorado.view.resolver;

import java.util.regex.Pattern;

import org.apache.commons.lang3.math.NumberUtils;

import com.bstek.dorado.core.io.Resource;
import com.bstek.dorado.web.DoradoContext;
import com.bstek.dorado.web.resolver.AbstractWebFileResolver;
import com.bstek.dorado.web.resolver.ResourcesWrapper;

import jakarta.servlet.http.HttpServletRequest;

@Deprecated
public class OldIconsFileResolver extends AbstractWebFileResolver {

	private static final String MSIE = "MSIE";

	private final static String CHROME_FRAME = "chromeframe";

	private final static Pattern MSIE_VERSION_PATTERN = Pattern.compile("^.*?MSIE\\s+(\\d+).*$");

	private final static String ICON_PATH = "classpath:dorado/resources/icons/silk.deprecated/icons.";

	private final static String GIF = "gif";

	private final static String PNG = "png";

	@Deprecated
	@Override
	protected ResourcesWrapper createResourcesWrapper(HttpServletRequest request, DoradoContext context)
			throws Exception {
		String resourceType = PNG;
		String ua = request.getHeader("User-Agent");
		if (ua.indexOf(CHROME_FRAME) < 0) {
			boolean isMSIE = (ua != null && ua.indexOf(MSIE) != -1);
			if (isMSIE) {
				float version = NumberUtils.toFloat(MSIE_VERSION_PATTERN.matcher(ua).replaceAll("$1"), Float.MAX_VALUE);
				if (version < 7) {
					resourceType = GIF;
				}
			}
		}

		Resource[] resources = context.getResources(ICON_PATH + resourceType);
		return new ResourcesWrapper(resources, getResourceTypeManager().getResourceType(resourceType));
	}

}
