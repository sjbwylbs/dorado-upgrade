# dorado-hibernate 模块 Hibernate 6.2.10 升级记录

> **升级日期**: 2026-06-20
> **升级目标**: dorado-hibernate (8.0.0)
> **升级范围**: Spring 6.2.19 + Hibernate 6.2.10.Final + Jakarta EE 9

---

## 一、升级背景

本次升级旨在将 dorado-project 从 Spring 5.x / Hibernate 5.x 迁移到 Spring 6.2.19 / Hibernate 6.2.10.Final，以获得：
- Jakarta EE 9+ 支持（`jakarta.*` 命名空间）
- 更好的性能与安全性
- 现代化的 JPA Criteria API 支持

---

## 二、依赖版本变更

### 根项目 pom.xml 版本管理

| 依赖 | 旧版本 | 新版本 |
|------|--------|--------|
| Spring Framework | ~5.3.x | **6.2.19** |
| Hibernate Core | ~5.6.x | **6.2.10.Final** |
| Servlet API | 4.0.0 | **6.0.0** (jakarta) |
| JSP API | 2.3.x | **3.1.0** (jakarta) |
| EL API | 3.0.0 | **4.0.0** (jakarta) |
| JSTL | 1.2 | **3.0.0** (jakarta) |

---

## 三、核心迁移内容

### 3.1 javax.servlet → jakarta.servlet（全项目）

**影响文件（约 20+ 个）**：
- 所有 Controller、Filter、Servlet、Listener 类
- `HttpServletRequest` / `HttpServletResponse` / `HttpSession` 等接口
- Spring MVC 拦截器从 `HandlerInterceptorAdapter` 改为实现 `HandlerInterceptor`

**示例**：
```java
// 旧
import javax.servlet.http.HttpServlet;
// 新
import jakarta.servlet.http.HttpServlet;

// 旧
public class HtmlViewSecurityInterceptor extends HandlerInterceptorAdapter { ... }
// 新
public class HtmlViewSecurityInterceptor implements HandlerInterceptor {
    @Override
    public void postHandle(...) { }
    @Override
    public void afterCompletion(...) { }
}
```

### 3.2 CommonsMultipartResolver → StandardServletMultipartResolver

**影响文件**：`dorado-uploader/UploadResolver.java`

```java
// 旧
import org.springframework.web.multipart.commons.CommonsMultipartResolver;
// 新
import org.springframework.web.multipart.support.StandardServletMultipartResolver;
```

### 3.3 Hibernate Criteria API → JPA Criteria API（dorado-hibernate 核心）

这是本次升级工作量最大的部分。dorado-hibernate 模块从 Hibernate 专有 Criteria API 全面迁移到 JPA Criteria API。

#### 迁移对照表

| 旧 Hibernate API | 新 JPA API |
|-----------------|-----------|
| `org.hibernate.Criteria` / `DetachedCriteria` | `CriteriaQuery` + `CriteriaContext` |
| `org.hibernate.criterion.Criterion` | `jakarta.persistence.criteria.Predicate` |
| `org.hibernate.criterion.Projection` | `jakarta.persistence.criteria.Selection` |
| `org.hibernate.criterion.Order` | `jakarta.persistence.criteria.Order` |
| `org.hibernate.Query.list()` | `Query.getResultList()` |
| `org.hibernate.Query.uniqueResult()` | `Query.getSingleResult()` |
| `org.hibernate.transform.ResultTransformer` | 移除（改为 String 配置占位） |

---

## 四、新增文件

| 文件路径 | 说明 |
|----------|------|
| `dorado-hibernate/.../criteria/CriteriaContext.java` | **核心新增**：封装 JPA 查询上下文，持有 Session、CriteriaBuilder、CriteriaQuery、Root 及别名映射 |
| `dorado-hibernate/.../CriteriaImplHelper.java` | 重写：替代原基于反射操作 DetachedCriteria 的实现，改为持有 CriteriaContext |

---

## 五、修改文件清单

### 5.1 数据访问层

| 文件 | 修改说明 |
|------|----------|
| `HibernateDao.java` | 使用 JPA CriteriaBuilder/CriteriaQuery 替代旧 API；`createQuery` 返回 `org.hibernate.query.Query`；修复 `getClassMetadata()` → `getMetamodel().entity()`；`EntityState` → `FilterType` |

### 5.2 Criteria 转换层（criterion 包，约 15 个文件）

所有条件类从 `toHibernate()` 返回 `Criterion` 改为 `toPredicate()` 返回 `Predicate`：

| 文件 | 修改说明 |
|------|----------|
| `BaseCriterion.java` | 方法签名：`toPredicate(CriteriaContext, parameter, transformer)` |
| `SingleCriterion.java` | OP 枚举（eq/ne/gt/lt/ge/le/like 等）全部改为 JPA Predicate 构建 |
| `AndCriterion.java` | `cb.and(predicates)` |
| `OrCriterion.java` | `cb.or(predicates)` |
| `InCriterion.java` | `path.in(values)` / `cb.equal()` |
| `BetweenCriterion.java` | `cb.between(path, v1, v2)` |
| `NonValueCriterion.java` | `cb.isNull/isNotNull/isEmpty/isNotEmpty`，新增 `Expression` import |
| `IdEqCriterion.java` | `cb.equal(root, value)` |
| `SizeCriterion.java` | `cb.isEmpty/isNotEmpty`，cast 为 raw 类型 |
| `JunctionCriterion.java` | 递归处理子条件 |
| `MisValueStrategy.java` | 接口方法增加 `CriteriaContext` 参数 |
| `DefaultMisValueStrategy.java` | 实现 MisValueStrategy |
| `SingleProperyCriterion.java` | 基类，解析属性路径 |

### 5.3 Projection 包（11 个文件）

所有投影类从 `toHibernate()` 返回 `Projection` 改为 `toSelection()` 返回 `Selection`：

| 文件 | 修改说明 |
|------|----------|
| `BaseProjection.java` | `toSelection(CriteriaContext)` + `isAggregation()` |
| `CountProjection.java` | `cb.count(path)` / `cb.countDistinct(path)` |
| `RowCountProjection.java` | `cb.count(root)` |
| `AvgProjection.java` | `cb.avg((Expression) path)` |
| `MaxProjection.java` | `cb.max((Expression) path)` — 修复泛型上限问题 |
| `MinProjection.java` | `cb.min((Expression) path)` — 修复泛型上限问题 |
| `SumProjection.java` | `cb.sum((Expression) path)` |
| `PropertyProjection.java` | `context.resolvePath(propertyName)` |
| `GroupByProjection.java` | 提供 `applyGroupBy(context)` |
| `SinglePropertyProjection.java` | 基类，解析单属性路径 |
| `BaseProjectionTest.java` | 测试基类 |

### 5.4 Criteria 核心类

| 文件 | 修改说明 |
|------|----------|
| `HibernateCriteriaTransformer.java` | 接口方法变更：`buildQuery(context, topCriteria, parameter)`、`listPredicates(...)` |
| `BaseHibernateCriteriaTransformer.java` | 重写 alias/projection/criterion/order/fetchMode/subCriteria 处理逻辑；修复 Selection 泛型 wildcard 不兼容问题 |
| `DefaultHibernateCriteriaTransformer.java` | alias 处理与 parameter 提取 |
| `JoinType.java` | 枚举定义 |
| `FetchMode.java` | 枚举定义 |
| `AliasCriterion.java` | alias 处理 |
| `Order.java` | JPA Order 构建 |

### 5.5 Provider 包

| 文件 | 修改说明 |
|------|----------|
| `CriteriaDataProvider.java` | `prepareCriteriaContext()` 构建数据查询，`prepareCountQuery()` 独立构建分页计数查询；修复 `Metamodel.entity(String)` → 遍历查找 entityName |
| `HqlDataProvider.java` | `resultTransformer` 改为 String |

### 5.6 辅助工具

| 文件 | 修改说明 |
|------|----------|
| `CriteriaImplHelper.java` | 完全重写，持有 CriteriaContext，提供 `getPath/addPredicate/andPredicates/orPredicates` |
| `HibernateUtils.java` | `applyFilter/mergeFilter/createCriterion` 全部改为 JPA 方式 |
| `ResultTransformerParser.java` | 简化为返回字符串值 |
| `SessionStrategy.java` | 无变更（仅使用 Session API） |
| `UnByteCodeProxyInterceptor.java` | 从继承 `EmptyInterceptor` 改为实现 `Interceptor` |

### 5.7 Config 包

| 文件 | 修改说明 |
|------|----------|
| `DoradoAnnotationConfiguration.java` | 不再继承 `org.hibernate.cfg.Configuration`，改为提供静态辅助方法 |

### 5.8 HQL 相关

| 文件 | 修改说明 |
|------|----------|
| `DefaultHqlQuerier.java` | `Query` → `org.hibernate.query.Query`；`list()` → `getResultList()`；`uniqueResult()` → `getSingleResult()` |

---

## 六、编译错误修复记录

本次升级过程中遇到的编译错误及修复：

| # | 错误位置 | 错误原因 | 修复方案 |
|---|----------|----------|----------|
| 1 | `HibernateDao.java:73` | `SessionFactory.getClassMetadata(Class)` 在 Hibernate 6 中已移除 | 改用 `getMetamodel().entity(Class)` + `getId(idType).getName()`，失败回退 `"id"` |
| 2 | `HibernateDao.java:104-129` | `EntityUtils.getIterable(Collection, EntityState)` 参数类型错误 | `EntityState` → `FilterType`（`DELETED/MODIFIED/MOVED/NEW`） |
| 3 | `HibernateDao.java:233,238` | `List<T>` 无法赋值给 `List<X>` | 返回处显式 cast `(List<X>)` + `@SuppressWarnings({"unchecked", "rawtypes"})` |
| 4 | `CriteriaDataProvider.java:127` | JPA `Metamodel.entity()` 不接受 String 参数 | 改为先 `Class.forName(entityName)`，再遍历 `getEntities()` 匹配 |
| 5 | `NonValueCriterion.java:44,55` | 缺少 `Expression` import | 补充 `import jakarta.persistence.criteria.Expression;` |
| 6 | `MinProjection/MaxProjection:16` | `cb.min/max(Expression<Comparable>)` — JPA 要求 `N extends Number` | 改为 raw `(Expression) path` |
| 7 | `BaseHibernateCriteriaTransformer:103` | `Selection<capture#1>` 与 `Selection<? extends capture#2>` 不兼容 | CriteriaQuery 改为 raw 类型 + `@SuppressWarnings` |

---

## 七、编译结果

```
[INFO] BUILD SUCCESS
[INFO] Total time: 3.449 s
[INFO] Compiling 70 source files with javac [debug release 17] to target\classes
```

- **编译警告（2 个，无关紧要）**：
  - `Session.createQuery(String)` 已过时标记
  - `SizeCriterion.java` unchecked 操作警告

---

## 八、保留不变的内容

- 所有 dorado XML 注解（`@XmlNode`、`@XmlProperty`、`@XmlSubNode`、`@ClientProperty`、`@IdeProperty`）完全保留
- 所有配置类的 `getter/setter` 名称不变，保证 Spring XML 配置向后兼容
- `dorado-core` 依赖接口（如 `Page`、`ParameterWrapper`、`FilterOperator` 等）保持不变
- 所有枚举值名称不变

---

## 九、后续建议

1. **运行时测试**：编译通过后需在 example/webapp 中进行实际功能验证
2. **HQL 兼容性**：检查项目中的 HQL 查询，确保语法符合 Hibernate 6 规范
3. **SessionFactory 配置**：如果项目使用了原生 Hibernate 配置方式，需验证 `DoradoAnnotationConfiguration.apply()` 方法调用
4. **Lazy Loading**：Hibernate 6 对懒加载有更严格的控制，可能需要调整抓取策略
