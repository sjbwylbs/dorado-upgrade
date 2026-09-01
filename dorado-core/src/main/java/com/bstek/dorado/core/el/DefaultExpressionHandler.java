package com.bstek.dorado.core.el;

import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.jexl3.JexlBuilder;
import org.apache.commons.jexl3.JexlContext;
import org.apache.commons.jexl3.JexlEngine;
import org.apache.commons.jexl3.JexlExpression;
import org.apache.commons.jexl3.MapContext;
import org.apache.commons.jexl3.introspection.JexlPermissions;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.bstek.dorado.core.Context;

import javassist.ClassPool;
import javassist.CtClass;
import javassist.CtMethod;
import javassist.CtNewMethod;

/**
 * 默认的EL表达式处理器的实现类。
 *
 */
public class DefaultExpressionHandler implements ExpressionHandler {

	private static final Log logger = LogFactory.getLog(ExpressionHandler.class);

	private final static String DORADO_VAR = "dorado";

	private final static String CONTEXT_ATTRIBUTE_KEY = DefaultExpressionHandler.class.getName();

	private static final String DORADO_EXPRESSION_UTILS_TYPE = "com.bstek.dorado.core.el.$DoradoExpressionUtils";

	private static ThreadLocal<JexlEngine> threadLocal = new ThreadLocal<>();

	private static Object doradoExpressionUtilsBean;

	private List<ContextVarsInitializer> contextInitializers;

	/**
	 * 设置所有的隐式变量初始化器。
	 */
	public void setContextInitializers(List<ContextVarsInitializer> contextInitializers) {
		this.contextInitializers = contextInitializers;
	}

	/**
	 * 返回所有的隐式变量初始化器。
	 */
	public List<ContextVarsInitializer> getContextInitializers() {
		return contextInitializers;
	}

	@Override
	public Expression compile(String text) {
		List<Object> sections = new ExpressionCompiler(this).compileSections(text);
		if (sections != null && sections.size() > 0) {
			for (Object section : sections) {
				if (section instanceof Expression) {
					EvaluateMode evaluateMode = text.startsWith("$${") ? EvaluateMode.onRead
							: EvaluateMode.onInstantiate;
					Expression expression = this.createExpression(sections, evaluateMode);
					if (expression instanceof ExpressionHandlerAware) {
						((ExpressionHandlerAware) expression).setExpressionHandler(this);
					}
					return expression;
				}
			}
		}
		return null;
	}

	/**
	 * 根据与解析的结果创建具体的表达式对象。
	 * @param sections
	 * @param evaluateMode
	 * @return
	 */
	protected Expression createExpression(List<Object> sections, EvaluateMode evaluateMode) {
		Expression expression;
		if (sections.size() == 1) {
			expression = new SingleExpression((JexlExpression) sections.get(0), evaluateMode);

		}
		else {
			expression = new CombinedExpression(sections, evaluateMode);
		}
		return expression;
	}

	@Override
	public JexlEngine getJexlEngine() throws Exception {
		JexlEngine engine = threadLocal.get();
		if (engine == null) {
			// permissions(UNRESTRICTED): JEXL 3.3+默认RESTRICTED权限会阻止对JavaBean属性的反射访问，
			// 需设为UNRESTRICTED以恢复JEXL 2.x的行为
			// strict(false): 关闭严格模式，允许更宽松的属性解析
			// silent(true): 对未定义属性返回null而非抛出异常，保持与JEXL 2.x的向后兼容性
			engine = new JexlBuilder()
				.permissions(JexlPermissions.UNRESTRICTED)
				.strict(false)
				.silent(true)
				.create();
			threadLocal.set(engine);
		}
		return engine;
	}

	@Override
	public JexlContext getJexlContext() {
		Context context = Context.getCurrent();
		JexlContext ctx = (JexlContext) context.getAttribute(Context.THREAD, CONTEXT_ATTRIBUTE_KEY);
		if (ctx == null) {
			ctx = new MapContext();
			if (contextInitializers != null) {
				try {
					Map<String, Method> utilMethods = new HashMap<>();

					Map<String, Object> vars = new HashMap<>();
					for (ContextVarsInitializer initializer : contextInitializers) {
						initializer.initializeContext(vars);
					}
					for (Map.Entry<String, Object> entry : vars.entrySet()) {
						String key = entry.getKey();
						Object value = entry.getValue();
						if (value instanceof Method) {
							utilMethods.put(key, (Method) value);
						}
						else {
							ctx.set(key, value);
						}
					}

					if (!utilMethods.isEmpty()) {
						ctx.set(DORADO_VAR, createDoradoExpressionUtilsBean(utilMethods));
					}
				}
				catch (Exception e) {
					logger.error(e, e);
				}
			}

			try {
				context.setAttribute(Context.THREAD, CONTEXT_ATTRIBUTE_KEY, ctx);
			}
			catch (NullPointerException e) {
				// do nothing
			}
		}
		return ctx;
	}

	protected synchronized static Object createDoradoExpressionUtilsBean(Map<String, Method> utilMethods)
			throws Exception {
		if (doradoExpressionUtilsBean == null) {
			ClassPool pool = ClassPool.getDefault();
			CtClass ctClass = null;
			try {
				ctClass = pool.get(DORADO_EXPRESSION_UTILS_TYPE);
			}
			catch (Exception e) {
				// do nothing
			}
			if (ctClass == null) {
				ctClass = pool.makeClass(DORADO_EXPRESSION_UTILS_TYPE);
			}
			if (ctClass.isFrozen()) {
				ctClass.defrost();
			}
			else {
				for (Map.Entry<String, Method> entry : utilMethods.entrySet()) {
					String name = entry.getKey();
					Method method = entry.getValue();
					int methodIndex = ArrayUtils.indexOf(method.getDeclaringClass().getMethods(), method);

					StringBuffer buf = new StringBuffer();
					StringBuffer args = new StringBuffer();
					buf.append("public ").append("Object").append(' ').append(name).append('(');
					Class<?>[] parameterTypes = method.getParameterTypes();
					for (int i = 0; i < parameterTypes.length; i++) {
						if (i > 0) {
							buf.append(',');
							args.append(',');
						}
						buf.append("Object").append(' ').append("p" + i);
						args.append("p" + i);
					}
					buf.append(")");
					if (method.getExceptionTypes().length > 0) {
						buf.append(" throws ");
						int i = 0;
						for (Class<?> exceptionType : method.getExceptionTypes()) {
							if (i > 0) {
								buf.append(',');
							}
							buf.append(exceptionType.getName());
							i++;
						}
					}
					buf.append("{\n")
						.append("return Class.forName(\"" + method.getDeclaringClass().getName())
						.append("\").getMethods()[")
						.append(methodIndex)
						.append("].invoke(null, new Object[]{")
						.append(args)
						.append("});")
						.append("\n}");
					CtMethod delegator = CtNewMethod.make(buf.toString(), ctClass);
					delegator.setName(name);
					ctClass.addMethod(delegator);
				}
			}
			Class<?> cl = ctClass.toClass();
			doradoExpressionUtilsBean = cl.getDeclaredConstructor().newInstance();
		}
		return doradoExpressionUtilsBean;
	}

}
