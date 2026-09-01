package com.bstek.dorado.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

import com.bstek.dorado.core.Configure;

public final class DateUtils {

	private static final TimeZone GMT = TimeZone.getTimeZone("GMT");

	private DateUtils() {
	}

	public static TimeZone getGMTTimeZone() {
		return GMT;
	}

	private static TimeZone getDefaultTimeZone() {
		return (Configure.getBoolean("core.useGMTTimeZone")) ? GMT : null;
	}

	public static Date parse(String dateText) throws ParseException {
		SimpleDateFormat sdf = new SimpleDateFormat();
		TimeZone timeZone = getDefaultTimeZone();
		if (timeZone != null) {
			sdf.setTimeZone(timeZone);
		}
		return sdf.parse(dateText);
	}

	public static Date parse(String format, String dateText) throws ParseException {
		SimpleDateFormat sdf = new SimpleDateFormat(format);
		TimeZone timeZone = getDefaultTimeZone();
		if (timeZone != null) {
			sdf.setTimeZone(timeZone);
		}
		return sdf.parse(dateText);
	}

	public static String format(Date date) {
		SimpleDateFormat sdf = new SimpleDateFormat();
		TimeZone timeZone = getDefaultTimeZone();
		if (timeZone != null) {
			sdf.setTimeZone(timeZone);
		}
		return sdf.format(date);
	}

	public static String format(String format, Date date) {
		SimpleDateFormat sdf = new SimpleDateFormat(format);
		TimeZone timeZone = getDefaultTimeZone();
		if (timeZone != null) {
			sdf.setTimeZone(timeZone);
		}
		return sdf.format(date);
	}

}
