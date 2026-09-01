package com.bstek.dorado.common.proxy;

import org.aopalliance.intercept.MethodInterceptor;
import org.aopalliance.intercept.MethodInvocation;
import org.apache.commons.lang3.StringUtils;

import com.bstek.dorado.util.PathUtils;
import com.bstek.dorado.util.proxy.MethodInterceptorFilter;

public class PatternMethodInterceptorFilter implements MethodInterceptorFilter {

	private String targetName;

	public PatternMethodInterceptorFilter(String targetName) {
		this.targetName = targetName;
	}

	@Override
	public boolean filter(MethodInterceptor methodInterceptor, MethodInvocation methodInvocation) {
		boolean accept = true;
		if (methodInterceptor instanceof PatternMethodInterceptor) {
			PatternMethodInterceptor patternMethodInterceptor = (PatternMethodInterceptor) methodInterceptor;
			String pattern = patternMethodInterceptor.getPattern();
			if (StringUtils.isNotEmpty(pattern)) {
				accept = PathUtils.match(pattern, targetName);
			}
			if (accept) {
				String excludePattern = patternMethodInterceptor.getExcludePattern();
				if (StringUtils.isNotEmpty(excludePattern)) {
					accept = !PathUtils.match(excludePattern, targetName);
				}
			}
		}
		return accept;
	}

}
