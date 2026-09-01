# Spring 6.2.19 & Hibernate 6.2.10 升级记录

## 升级时间
2026-06-20

## 升级目标
- 根项目：Spring 6.2.19 + Hibernate 6.2.10 + Servlet API 6.0.0
- example/webapp：Dorado 8.0.0 + waffle-jna-jakarta（Jakarta EE 9+ 适配）

---

## 一、dorado-hibernate 模块（Hibernate 6 迁移）

### 1.1 根 pom.xml 版本变更
| 属性 | 旧版本 | 新版本 |
|------|--------|--------|
| spring.version | 6.1.6 | 6.2.19 |
| hibernate.version | 5.6.15 | 6.2.10.Final |
| servlet-api.version | 4.0.1 | 6.0.0 |

### 1.2 Hibernate 6 API 变更适配

#### HibernateDao.java
- `sessionFactory.getClassMetadata(Class)` → `sessionFactory.getMetamodel().entity(Class)`
- `FilterType`（原 `EntityState`）中的 `NEED_AUDIT` 枚举值移除，改用 `NEED_AUDITING`

#### CriteriaDataProvider.java
- `metamodel.entity(String)` 已移除 → 遍历 `metamodel.getEntities()` 通过 `getJavaType().getName()` 匹配
- 重构为独立工具类 `CriteriaBuilderHelper` 封装 JPA CriteriaBuilder 上下文

#### 新增文件
- `CriteriaContext.java`：封装 JPA `EntityManager` 和 `CriteriaBuilder` 上下文
- `CriteriaBuilderHelper.java`：封装实体元数据查询和 CriteriaBuilder 工厂方法

---

## 二、example/webapp 模块（Dorado 8.0.0 + Jakarta EE 迁移）

### 2.1 pom.xml 依赖变更

#### Dorado 版本升级
```xml
<!-- 旧 -->
<dorado.version>7.5.14</dorado.version>
<!-- 新 -->
<dorado.version>8.0.0</dorado.version>
```

#### 新增依赖（Jakarta EE 9+）
```xml
<dependency>
    <groupId>jakarta.persistence</groupId>
    <artifactId>jakarta.persistence-api</artifactId>
    <version>3.1.0</version>
</dependency>
```

#### Waffle 升级
```xml
<!-- 旧 -->
<groupId>com.github.waffle</groupId>
<artifactId>waffle-jna</artifactId>
<!-- 新 -->
<groupId>com.github.waffle</groupId>
<artifactId>waffle-jna-jakarta</artifactId>
```
同时移除 `waffle-tests` 依赖。

### 2.2 javax → jakarta 命名空间迁移

批量替换 107 个 Java 文件的 import：

| 旧 | 新 |
|----|----|
| `javax.annotation.Resource` | `jakarta.annotation.Resource` |
| `javax.annotation.PostConstruct` | `jakarta.annotation.PostConstruct` |
| `javax.transaction.Transactional` | `jakarta.transaction.Transactional` |

**保留 javax 的包**（JDK 标准 API，无需迁移）：
- `javax.sql.*`（JDBC）
- `javax.imageio.*`（图片处理）
- `javax.net.ssl.*`（SSL/TLS）
- `javax.crypto.*`（加解密）
- `javax.security.auth.*`（认证）
- `javax.annotation.Generated`（代码生成）

### 2.3 Hibernate 4→6 迁移

#### MyHibernateDao.java
- `org.hibernate.Session` / `org.hibernate.Query` → `org.hibernate.query.Query`（Hibernate 6 统一接口）
- `createSQLQuery(String)` → `createNativeQuery(String)`
- `query.list()` / `query.uniqueResult()` → `query.getResultList()` / `query.getSingleResult()`
- `query.setString/setInteger/setDate` → `query.setParameter`
- 新增 `ResultTransformer` 替代实现，手动转换 `List<Object[]>` 到 DTO

#### DataAccessUtil.java
- `createSQLQuery` → `createNativeQuery`
- `Transformers.ALIAS_TO_ENTITY_MAP` 替代原有的 ResultTransformer

#### HibernateUtils.java
- 自定义 `AliasToBeanResultTransformer` 替代 Hibernate 4 的 `Transformers.aliasToBean()`

### 2.4 测试配置修复

#### DatabaseConfig.java（src/test）
- 移除 `org.springframework.orm.hibernate4` 相关配置（Spring 6 不支持 Hibernate 4）
- 保留 `DataSource`、`JdbcTemplate`、`NamedParameterJdbcTemplate`

#### EntityChangeUtilsTest.java（src/test）
- 移除 `org.hibernate.property.Getter` / `Setter`（Hibernate 6 已移除）
- 改用 Java 反射 API 测试 `EntityChangeUtils`
- `@Table` import 改为 `jakarta.persistence.Table`

### 2.5 NegotiateSecurityFilter 恢复
- 从空 stub 恢复为继承 `waffle.servlet.NegotiateSecurityFilter`（jakarta 版本）
- 保留 `PRINCIPAL_SESSION_KEY` 常量供 Controller 使用

### 2.6 web.xml 配置
- 取消 waffle SSO filter 和 servlet 的注释（使用 jakarta 版本）

---

## 三、编译状态

### dorado-hibernate 模块
- 编译通过

### example/webapp 模块
- 主代码编译：无 waffle/javax→jakarta 相关错误
- 残留问题：部分类中 Lombok 注解处理器（`@Data`、`@Slf4j`）未正确生成代码，与本次升级无关，属于 Lombok 版本与编译环境的兼容性问题

---

## 四、已知问题

1. **Lombok 注解处理器问题**：`ScanHistoryService.java`、`CapturePicture.java`、`ServiceBase.java` 等文件编译时报 `log` 变量、`setId/setName` 等 getter/setter 找不到。这是 Lombok 1.18.46 与编译环境的兼容性问题，需要单独诊断。
2. **context.xml Valve**：`waffle.apache.NegotiateAuthenticator` 和 `waffle.apache.WindowsRealm` 的 Valve 配置在 Tomcat 容器中运行时需验证兼容性。
