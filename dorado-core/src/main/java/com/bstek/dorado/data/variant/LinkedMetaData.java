package com.bstek.dorado.data.variant;

import java.math.BigDecimal;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * 有序的元数据对象。
 *
 */
public class LinkedMetaData extends LinkedHashMap<String, Object> implements VariantSet {

	private static final long serialVersionUID = -5206947024602715722L;

	private static final Log logger = LogFactory.getLog(MetaData.class);

	private static VariantConvertor variantConvertor;

	private static VariantConvertor getVariantConvertor() {
		try {
			variantConvertor = VariantUtils.getVariantConvertor();
		}
		catch (Exception e) {
			logger.error(e, e);
		}
		return variantConvertor;
	}

	public LinkedMetaData() {
	}

	public LinkedMetaData(Map<String, ?> map) {
		super(map);
	}

	@Override
	public String getString(String key) {
		return getVariantConvertor().toString(super.get(key));
	}

	@Override
	public void setString(String key, String s) {
		put(key, s);
	}

	@Override
	public boolean getBoolean(String key) {
		return getVariantConvertor().toBoolean(super.get(key));
	}

	@Override
	public void setBoolean(String key, boolean b) {
		put(key, Boolean.valueOf(b));
	}

	@Override
	public int getInt(String key) {
		return getVariantConvertor().toInt(super.get(key));
	}

	@Override
	public void setInt(String key, int i) {
		put(key, i);
	}

	@Override
	public long getLong(String key) {
		return getVariantConvertor().toLong(super.get(key));
	}

	@Override
	public void setLong(String key, long l) {
		put(key, l);
	}

	@Override
	public float getFloat(String key) {
		return getVariantConvertor().toFloat(super.get(key));
	}

	@Override
	public void setFloat(String key, float f) {
		put(key, f);
	}

	@Override
	public double getDouble(String key) {
		return getVariantConvertor().toDouble(super.get(key));
	}

	@Override
	public void setDouble(String key, double d) {
		put(key, d);
	}

	@Override
	public BigDecimal getBigDecimal(String key) {
		return getVariantConvertor().toBigDecimal(super.get(key));
	}

	@Override
	public void setBigDecimal(String key, BigDecimal bd) {
		put(key, bd);
	}

	@Override
	public Date getDate(String key) {
		return getVariantConvertor().toDate(super.get(key));
	}

	@Override
	public void setDate(String key, Date date) {
		put(key, date);
	}

	@Override
	public Object get(String key) {
		return super.get(key);
	}

	@Override
	public void set(String key, Object value) {
		put(key, value);
	}

	@Override
	public Map<String, Object> toMap() {
		return this;
	}

}
