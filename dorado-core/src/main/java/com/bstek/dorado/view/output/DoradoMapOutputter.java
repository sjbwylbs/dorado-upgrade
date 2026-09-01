package com.bstek.dorado.view.output;

import java.io.Writer;
import java.util.Collection;

import com.bstek.dorado.core.el.Expression;
import com.bstek.dorado.data.entity.EntityUtils;
import com.bstek.dorado.data.provider.Page;

public class DoradoMapOutputter extends DataOutputter {

	@Override
	public void output(Object object, OutputContext context) throws Exception {
		if (object != null && !EntityUtils.isSimpleValue(object) && !(object instanceof Collection<?>)
				&& !(object instanceof Page<?>) && !(object instanceof Expression)) {
			JsonBuilder json = context.getJsonBuilder();
			json.beginValue();
			Writer writer = context.getWriter();
			writer.write("$map(");
			super.output(object, context);
			writer.write(")");
			json.endValue();
		}
		else {
			super.output(object, context);
		}
	}

}
