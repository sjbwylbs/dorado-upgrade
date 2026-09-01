package com.bstek.dorado.uploader.resolver;

import java.io.BufferedInputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.lang.annotation.Annotation;
import java.lang.reflect.Method;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.ModelAndView;

import com.bstek.dorado.config.definition.DefaultDefinitionReference;
import com.bstek.dorado.core.resource.ResourceManager;
import com.bstek.dorado.core.resource.ResourceManagerUtils;
import com.bstek.dorado.uploader.DownloadFile;
import com.bstek.dorado.uploader.UploaderException;
import com.bstek.dorado.uploader.annotation.FileProvider;
import com.bstek.dorado.uploader.util.MimetypeUtils;
import com.bstek.dorado.uploader.widget.InlineMode;
import com.bstek.dorado.util.proxy.ProxyBeanUtils;
import com.bstek.dorado.web.DoradoContext;
import com.bstek.dorado.web.resolver.AbstractResolver;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class DownloadResolver extends AbstractResolver {

	private static final ResourceManager resourceManager = ResourceManagerUtils
			.get(DefaultDefinitionReference.class);

	private final static Logger logger = LoggerFactory
			.getLogger(DownloadResolver.class);

	public DownloadResolver() {
	}

	@SuppressWarnings("rawtypes")
	@Override
	protected ModelAndView doHandleRequest(HttpServletRequest req,
			HttpServletResponse res) throws Exception {
		OutputStream out = null;
		String provider = req.getParameter("_fileProvider");
		String inlineMode = req.getParameter("_inlineMode");
		try {
			Map<String, Object> parameters = new HashMap<>();
			Enumeration paraNames = req.getParameterNames();
			for (Enumeration e = paraNames; e.hasMoreElements();) {
				String thisName = e.nextElement().toString();
				String thisValue = req.getParameter(thisName);
				parameters.put(thisName, thisValue);
			}
			String[] providers = provider.split("#");
			Object processor = DoradoContext.getCurrent()
					.getWebApplicationContext().getBean(providers[0]);
			Class<?> target = processor.getClass();
			if (ProxyBeanUtils.isProxy(processor)){
				target = ProxyBeanUtils.getProxyTargetType(processor);
			}
			String methodName = providers[1];
			Method method = target.getDeclaredMethod(methodName,
					new Class[] { Map.class });
			Annotation annotation = method.getAnnotation(FileProvider.class);
			if (annotation != null) {
				DownloadFile file = (DownloadFile) method.invoke(processor,
						parameters);
				res.reset();
				res.setContentType(getContentType(file));
				res.setHeader("Content-Disposition", getContentDisposition(inlineMode, file));
				out = res.getOutputStream();
				InputStream fis = new BufferedInputStream(file.getInputStream());
				byte[] buf = new byte[Integer.valueOf(file.getBufferSize())];
				int len = 0;
				try{
					while ((len = fis.read(buf)) > 0){
						out.write(buf, 0, len);
					}
				} finally {
					file.getInputStream().close();
					fis.close();
				}
			} else {
				throw new UploaderException(resourceManager.getString(
						"dorado.common/unknownDefinition", provider));
			}
		} catch (Throwable throwable) {
			if (logger.isInfoEnabled()) {
				logger.info("Download Error", throwable);
			}
			res.sendError(500, throwable.getMessage());
		} finally {
			if (out != null){
				try{
					out.flush();
					out.close();
				}catch(Exception e){
					e.printStackTrace();
				}
			}
		}
		return null;
	}

	private String getContentDisposition(String inlineMode, DownloadFile file) throws UnsupportedEncodingException{
		InlineMode inline = file.getInlineMode();
		if (inline == InlineMode.none && InlineMode.browser.toString().equals(inlineMode)){
			inline = InlineMode.browser;
		}

		if (inline == InlineMode.browser){
			return "inline; filename=" + getFileName(file);
		}
		else {
			return "attachment; filename=" + getFileName(file);
		}
	}

	private String getContentType(DownloadFile file) throws UnsupportedEncodingException{
		String contentType = file.getContentType();
		if (StringUtils.isEmpty(contentType)) {
			if (file.getFile()!=null){
				contentType = MimetypeUtils.getMimetype(file.getFile());
			}else{
				contentType = MimetypeUtils.getMimetype(file.getName());
			}
			if (StringUtils.isEmpty(contentType)){
				contentType = "application/octet-stream";
			}
//			String ua = DoradoContext.getCurrent().getRequest().getHeader("User-Agent");
//			UserAgent userAgent = UserAgentUtils.getUserAgent(ua);
//			if ("Chrome".equals(userAgent.getBrowserType())) {
//				if (contentType.indexOf("text/xml")>-1){
//					contentType = "text/plain";
//				}
//			}
//			if ("Windows".equals(userAgent.getPlatformType())){
//				if ("Internet Explorer".equals(userAgent.getBrowserType())){
//					int version = Integer.valueOf(userAgent.getBrowserVersion());
//					if (version>8){
//						if (contentType.indexOf("text/xml")>-1 || contentType.indexOf("application/javascript")>-1  || contentType.indexOf("text/x-java-source")>-1){
//							contentType = "text/plain";
//						}
//					}else {
//						if (contentType.indexOf("application/javascript")>-1  || contentType.indexOf("text/x-java-source")>-1){
//							contentType = "text/html";
//						}
//					}
//				}
//			}
		}

		if (contentType.indexOf("text")>-1 && contentType.indexOf("charset") < 0){
			contentType += ";charset="+file.getCharset();
		}
		return contentType;
	}

	private String getFileName(DownloadFile file) throws UnsupportedEncodingException{
		String fileName = file.getFileName();
		if (StringUtils.isEmpty(fileName)){
			fileName = new String(file.getName().getBytes("UTF-8"),"iso8859-1");
		}
		return fileName;
	}
}
