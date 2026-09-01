package com.bstek.dorado.view.output;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Writer;

import com.bstek.dorado.core.io.Resource;
import com.bstek.dorado.web.DoradoContext;

public class ResourceCalloutOutputter implements Outputter {

	@Override
	public void output(Object object, OutputContext context) throws Exception {
		Callout callout = (Callout) object;
		Writer writer = context.getWriter();

		writer.append("<script id=\"").append(callout.getId()).append("\" type=\"d-template\">");

		String path = (String) callout.getObject();
		DoradoContext doradoContext = DoradoContext.getCurrent();

		Resource resource = doradoContext.getResource(path);
		InputStream in = resource.getInputStream();
		BufferedReader reader = new BufferedReader(new InputStreamReader(in));
		try {
			String s;
			while ((s = reader.readLine()) != null) {
				writer.append(s).append('\n');
			}
		}
		catch (IOException e) {
			// do nothing
		}
		finally {
			in.close();
			reader.close();
		}

		writer.append("</script>\n");
	}

}
