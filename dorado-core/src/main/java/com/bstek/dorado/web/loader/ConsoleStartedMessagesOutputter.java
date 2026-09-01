package com.bstek.dorado.web.loader;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;
import java.io.Writer;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.BeanFactoryAware;
import org.springframework.beans.factory.ListableBeanFactory;

import com.bstek.dorado.spring.RemovableBean;
import com.bstek.dorado.web.ConsoleUtils;

public class ConsoleStartedMessagesOutputter implements BeanFactoryAware, RemovableBean {

	private BeanFactory beanFactory;

	private List<ConsoleStartedMessageOutputter> messageOutputters;

	@Override
	public void setBeanFactory(BeanFactory beanFactory) throws BeansException {
		this.beanFactory = beanFactory;
	}

	public void setMessageOutputters(List<ConsoleStartedMessageOutputter> messageOutputters) {
		this.messageOutputters = messageOutputters;
	}

	public void addMessageOutputter(ConsoleStartedMessageOutputter messageOutputter) {
		if (messageOutputters == null) {
			messageOutputters = new ArrayList<>();
		}
		messageOutputters.add(messageOutputter);
	}

	public static void outputLoadingInfo(Writer writer) throws IOException {
		outputLoadingInfo(writer, "");
	}

	public static void outputLoadingInfo(Writer writer, String s) throws IOException {
		writer.append(" * ").append(s).append('\n');
	}

	public void output(Writer writer) throws Exception {
		Map<String, ConsoleStartedMessageOutputter> outputterMap = ((ListableBeanFactory) beanFactory)
			.getBeansOfType(ConsoleStartedMessageOutputter.class);

		boolean headerOutputted = false;
		Set<ConsoleStartedMessageOutputter> outputters = new TreeSet<>(
				new Comparator<ConsoleStartedMessageOutputter>() {
					@Override
					public int compare(ConsoleStartedMessageOutputter o1, ConsoleStartedMessageOutputter o2) {
						int gap = o1.getOrder() - o2.getOrder();
						if (gap != 0) {
							return gap;
						}
						return (o1 == o2) ? 0 : 1;
					}
				});

		outputters.addAll(outputterMap.values());
		if (messageOutputters != null) {
			outputters.addAll(messageOutputters);
		}

		for (ConsoleStartedMessageOutputter outputter : outputters) {
			StringWriter buffer = new StringWriter();
			try {
				outputter.output(buffer);
				String content = buffer.toString();

				if (content.length() > 0) {
					if (!headerOutputted) {
						headerOutputted = true;
						outputLoadingInfo(writer);
						outputLoadingInfo(writer, "========================");
						outputLoadingInfo(writer);
					}
					else {
						outputLoadingInfo(writer);
						outputLoadingInfo(writer, "------------------------");
						outputLoadingInfo(writer);
						ConsoleUtils.outputLoadingInfo();
					}

					StringReader sr = new StringReader(content);
					BufferedReader reader = new BufferedReader(sr);
					String line = reader.readLine();
					while (line != null) {
						outputLoadingInfo(writer, line);
						line = reader.readLine();
					}
				}
			}
			finally {
				buffer.close();
			}
		}

		if (headerOutputted) {
			outputLoadingInfo(writer);
			outputLoadingInfo(writer, "========================");
			outputLoadingInfo(writer);
		}
	}

}
