package com.bstek.dorado.view.widget;

import org.apache.commons.lang3.StringUtils;

import com.bstek.dorado.common.event.DefaultClientEvent;
import com.bstek.dorado.view.output.Callout;
import com.bstek.dorado.view.output.OutputContext;
import com.bstek.dorado.view.output.Outputter;

public class HtmlContainerOutputter extends ContainerOutputter {

	private Outputter contentFileOutputter;

	public void setContentFileOutputter(Outputter contentFileOutputter) {
		this.contentFileOutputter = contentFileOutputter;
	}

	@Override
	public void output(Object object, OutputContext context) throws Exception {
		HtmlContainer htmlContainer = (HtmlContainer) object;
		if (StringUtils.isNotEmpty(htmlContainer.getContentFile())) {
			String calloutId = "html_" + context.newCalloutId();
			Callout callout = new Callout();
			callout.setId(calloutId);
			callout.setObject(htmlContainer.getContentFile());
			callout.setOutputter(contentFileOutputter);
			context.addCallout(callout);

			StringBuffer script = new StringBuffer();
			script.append("var script = jQuery(\"#").append(calloutId).append("\");\n");
			script.append("self.set(\"content\", script.html());\n");
			script.append("script.remove();\n");

			htmlContainer.addClientEventListener("onCreate", new DefaultClientEvent(script.toString()));
		}
		super.output(object, context);
	}

}
