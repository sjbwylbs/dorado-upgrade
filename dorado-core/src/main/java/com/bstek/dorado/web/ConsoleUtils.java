package com.bstek.dorado.web;

import org.apache.commons.lang3.StringUtils;

import com.bstek.dorado.core.Configure;

public abstract class ConsoleUtils {

	public static void outputConfigureItem(String item) {
		String value = Configure.getString(item);
		if (StringUtils.isEmpty(value)) {
			value = "<empty>";
		}
		outputLoadingInfo("[" + item + "=" + value + "]");
	}

	public static void outputLoadingInfo(String s) {
		System.out.println(" * " + s);
	}

	public static void outputLoadingInfo() {
		outputLoadingInfo("");
	}

}
