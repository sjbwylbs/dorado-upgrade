package com.bstek.dorado.view.config.attachment;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.cache.Cache;

import com.bstek.dorado.core.el.Expression;
import com.bstek.dorado.core.el.ExpressionHandler;
import com.bstek.dorado.core.io.DefaultRefreshableResource;
import com.bstek.dorado.core.io.RefreshableResource;
import com.bstek.dorado.core.io.Resource;
import com.bstek.dorado.view.el.CombinedExpression;
import com.bstek.dorado.view.output.OutputContext;

public class AttachedResourceManager {

	private ExpressionHandler expressionHandler;

	private boolean supportsExpression = true;

	private Cache cache;

	private String charset;

	public ExpressionHandler getExpressionHandler() {
		return expressionHandler;
	}

	public void setExpressionHandler(ExpressionHandler expressionHandler) {
		this.expressionHandler = expressionHandler;
	}

	public boolean isSupportsExpression() {
		return supportsExpression;
	}

	public void setSupportsExpression(boolean supportsExpression) {
		this.supportsExpression = supportsExpression;
	}

	public Cache getCache() {
		return cache;
	}

	public void setCache(Cache cache) {
		this.cache = cache;
	}

	public String getCharset() {
		return charset;
	}

	public void setCharset(String charset) {
		this.charset = charset;
	}

	public Object getContent(Resource resource) throws Exception {
		Cache.ValueWrapper wrapper;
		synchronized (cache) {
			wrapper = cache.get(resource);
		}
		if (wrapper != null) {
			Object val = wrapper.get();
			if (val instanceof ResourceCacheElement) {
				ResourceCacheElement rce = (ResourceCacheElement) val;
				if (!rce.isExpired()) {
					return rce.getObjectValue();
				}
				cache.evict(resource);
			}
			else {
				return val;
			}
		}
		Object content = parseContent(resource);
		if (!(resource instanceof RefreshableResource)) {
			resource = new DefaultRefreshableResource(resource);
		}
		ResourceCacheElement cacheElement = new ResourceCacheElement((RefreshableResource) resource, content);
		synchronized (cache) {
			cache.put(resource, cacheElement);
		}
		return content;
	}

	public void outputContent(OutputContext context, Object content) throws Exception {
		if (content instanceof Expression) {
			content = ((Expression) content).evaluate();
		}
		context.getWriter().write(String.valueOf(content));
	}

	protected Object parseContent(Resource resource) throws Exception {
		InputStream in = resource.getInputStream();
		try {
			InputStreamReader reader;
			if (StringUtils.isNotEmpty(charset)) {
				reader = new InputStreamReader(in, charset);
			}
			else {
				reader = new InputStreamReader(in);
			}
			BufferedReader br = new BufferedReader(reader);

			List<Object> sections = new ArrayList<>();
			boolean hasExpression = false;
			int length = 0;
			String line;
			while ((line = br.readLine()) != null) {
				if (supportsExpression) {
					Expression expression = expressionHandler.compile(line);
					if (expression != null) {
						sections.add(expression);
						hasExpression = true;
						continue;
					}
				}
				sections.add(line);
				length += line.length();
			}

			br.close();
			reader.close();

			if (hasExpression) {
				return new CombinedExpression(sections);
			}
			else {
				StringBuffer buf = new StringBuffer(length + sections.size());
				for (Object l : sections) {
					buf.append((String) l).append('\n');
				}
				return buf.toString();
			}
		}
		finally {
			in.close();
		}
	}

}
