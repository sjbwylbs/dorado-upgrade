package com.bstek.dorado.view.resolver;

import java.util.List;

import com.bstek.dorado.view.View;
import com.bstek.dorado.view.output.Callout;
import com.bstek.dorado.view.output.OutputContext;
import com.bstek.dorado.view.output.Outputter;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class PageFooterOutputter implements Outputter {

	public static class ViewWrapper {

		private View view;

		private HttpServletRequest request;

		private HttpServletResponse response;

		public ViewWrapper(View view, HttpServletRequest request, HttpServletResponse response) {
			this.view = view;
			this.request = request;
			this.response = response;
		}

		public View getView() {
			return view;
		}

		public HttpServletRequest getRequest() {
			return request;
		}

		public HttpServletResponse getResponse() {
			return response;
		}

	}

	@Override
	public void output(Object object, OutputContext context) throws Exception {
		ViewWrapper wrapper = (ViewWrapper) object;
		output(wrapper.getView(), wrapper.getRequest(), wrapper.getResponse(), context);
	}

	protected void output(View view, HttpServletRequest request, HttpServletResponse response,
			OutputContext outputContext) throws Exception {
		List<Callout> callouts = outputContext.getCallouts();
		if (callouts != null) {
			for (Callout callout : callouts) {
				outputCallout(request, response, callout, outputContext);
			}
		}
	}

	protected void outputCallout(HttpServletRequest request, HttpServletResponse response, Callout callout,
			OutputContext outputContext) throws Exception {
		callout.getOutputter().output(callout, outputContext);
	}

}
