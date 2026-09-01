# Spring 7.0.8 + Hibernate 7.2 升级日志

## 升级日期
2026-06-21

## 升级目标
- 根项目：Spring Framework 6.2.19 → 7.0.8，Hibernate 6.2 → 7.2，Spring Boot 4.1.0
- example/webapp：Dorado 依赖同步（Spring 7 / Hibernate 7），解决编译问题（Lombok、NegotiateSecurityFilter 类名冲突、JSTL 缺失）

---

## 一、根项目版本变更（pom.xml）

| 属性 | 旧版本 | 新版本 |
|------|--------|--------|
| spring.version | 6.2.19 | **7.0.8** |
| hibernate.version | 6.2.10.Final | **7.2.19.Final** |
| spring-boot.version | 2.4.13 | **4.1.0** |
| servlet-api.version | 6.0.0 | **6.1.0** |
| jsp-api.version | 3.1.0 | **4.0.0** |
| javax.el-api.version | 4.0.0 | **5.0.0** |
| h2.version | 1.3.168 | **2.4.240** |

### Hibernate 7.x groupId 变更
Hibernate 从 7.x 起将 artifact groupId 从 `org.hibernate` 迁移到 `org.hibernate.orm`。所有模块 pom.xml 中的依赖声明需同步变更。

### Maven Compiler Plugin
根 `pom.xml` 中 `maven-compiler-plugin` 添加 `annotationProcessorPaths` 配置，以确保 Lombok 在所有子模块中生效：

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <configuration>
        <annotationProcessorPaths>
            <path>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok</artifactId>
                <version>${lombok.version}</version>
            </path>
        </annotationProcessorPaths>
    </configuration>
</plugin>
```

### javax.activation 迁移
`javax.activation:activation` 在 Maven Central 中已不可用，迁移至 `jakarta.activation:jakarta.activation-api:2.1.0`。

- dorado-uploader/pom.xml
- examples/webapp/pom.xml
- dorado-uploader/MimetypeUtils.java 中的 `javax.activation` → `jakarta.activation`

---

## 二、dorado-hibernate 模块

`dorado-hibernate/pom.xml`：
- `org.hibernate` → `org.hibernate.orm`

编译：BUILD SUCCESS（仅有 `@Deprecated` API 的警告，无错误）

---

## 三、example/webapp 模块适配

### 3.1 Lombok 注解处理器问题（根因）
在 Java 17 + Maven compiler plugin 配置下，`@Data`、`@Slf4j`、`@EqualsAndHashCode` 等 Lombok 注解未正确生成代码，导致编译时报「找不到符号」（如 `setId`、`log` 等）。

修复方法：
- 将 `maven-compiler-plugin` 升级到 **3.14.0**
- 显式配置 `<annotationProcessorPaths>`

### 3.2 JSTL 版本问题
`jakarta.servlet.jsp.jstl:3.0.0` 在 Maven Central 不可用，升级至 **3.0.1**（Servlet API 6 兼容版本），并将实现包 `org.glassfish.web:jakarta.servlet.jsp.jstl` 同步升级到 3.0.1。

### 3.3 NegotiateSecurityFilter 类名冲突
原代码：

```java
package com.oking.base.ldap;

import waffle.servlet.NegotiateSecurityFilter;

public class NegotiateSecurityFilter extends NegotiateSecurityFilter { ... }
```

编译错误：`包 waffle.servlet 已存在于另一个模块中: waffle.servlet.NegotiateSecurityFilter`

修复方式：
1. 降 `com.oking.base.ldap.NegotiateSecurityFilter.java` 为空占位文件，避免与 waffle 原生类同名。
2. `web.xml` filter-class 直接使用 `waffle.servlet.NegotiateSecurityFilter`。
3. `LoginController.java` / `IndexController.java` 中的 import 从 `com.oking.base.ldap.NegotiateSecurityFilter` 改为 `waffle.servlet.NegotiateSecurityFilter`。
4. `PRINCIPAL_SESSION_KEY` 常量在新版 waffle-jna-jakarta 中不存在，改为硬编码字符串 `"waffle.servlet.NegotiateSecurityFilter.PRINCIPAL"`。

### 3.4 javax.activation 命名空间
将以下文件中的 `javax.activation` 改为 `jakarta.activation`：

- `com.bstek.dorado.uploader.util.MimetypeUtils.java`
- `pom.xml` 依赖声明

---

## 四、编译验证

### 根项目（6 个模块）
```
mvnd clean install -DskipTests
BUILD SUCCESS
```

- dorado-core
- dorado-uploader
- dorado-hibernate
- dorado-core-test
- dorado-springboot-starter
- dorado-starter

### example/webapp
```
mvnd clean compile       → BUILD SUCCESS
mvnd test-compile        → BUILD SUCCESS (35 test files)
```

主代码（537 个 Java 文件） + 测试代码（35 个 Java 文件）全部编译通过。

---

## 五、变更文件汇总

| 层级 | 文件 | 变更 |
|------|------|------|
| 根项目 | `pom.xml` | spring 7.0.8, hibernate 7.2.19, spring-boot 4.1.0, javax.activation → jakarta.activation, 加 annotationProcessorPaths |
| dorado-hibernate | `pom.xml` | `org.hibernate` → `org.hibernate.orm` |
| dorado-uploader | `pom.xml` | `javax.activation` → `jakarta.activation` |
| dorado-uploader | `src/.../MimetypeUtils.java` | `javax.activation` → `jakarta.activation` |
| example/webapp | `pom.xml` | 加 `maven-compiler-plugin 3.14.0` 及 `annotationProcessorPaths`；JSTL 升级到 3.0.1；`javax.activation` → `jakarta.activation` |
| example/webapp | `src/main/java/com/oking/base/ldap/NegotiateSecurityFilter.java` | 降为占位文件，避免与 `waffle.servlet.NegotiateSecurityFilter` 类名冲突 |
| example/webapp | `src/main/java/com/oking/base/controller/LoginController.java` | import 改为 `waffle.servlet.NegotiateSecurityFilter`；`PRINCIPAL_SESSION_KEY` 改为硬编码 |
| example/webapp | `src/main/java/com/oking/base/controller/IndexController.java` | import 改为 `waffle.servlet.NegotiateSecurityFilter`；`PRINCIPAL_SESSION_KEY` 改为硬编码 |
| example/webapp | `src/main/webapp/WEB-INF/web.xml` | filter-class 改为 `waffle.servlet.NegotiateSecurityFilter` |

---

## 六、已知注意事项

1. `NegotiateSecurityFilter` 已恢复为 waffle 原生类，自动登录（SSO）功能依赖运行时环境中的 Tomcat Waffle Valve 配置。
2. Lombok 问题在旧版本下 `compile` 时被增量编译隐藏，本轮通过 `clean compile` 暴露出来并修复。
3. Spring Framework 7.0 移除了 `javax.annotation` 支持，相关 `@Resource` 已全部迁移至 `jakarta.annotation`（在上一轮修改中完成）。
4. 如有需要，可后续将 `NegotiateSecurityFilter.java` 彻底删除并清理相关文件。
