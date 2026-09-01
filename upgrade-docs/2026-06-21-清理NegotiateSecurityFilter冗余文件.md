# 清理 NegotiateSecurityFilter 冗余文件

## 日期
2026-06-21

## 目标
移除项目内自定义的 `NegotiateSecurityFilter.java` 和 `DoradoNegotiateSecurityFilter.java`，统一使用 waffle 原生 `waffle.servlet.NegotiateSecurityFilter`，清理不再被引用的 import。

---

## 一、背景
在 Spring 7.0.8 / Hibernate 7.2 升级后，项目内自定义的 `com.oking.base.ldap.NegotiateSecurityFilter` 与 waffle 原生 `waffle.servlet.NegotiateSecurityFilter` 存在类名冲突；同时自定义 `DoradoNegotiateSecurityFilter` 也已不再使用。`web.xml` 已配置为使用 waffle 原生类，因此删除这两个项目内自定义类并清理残留 import。

## 二、删除的文件

| 文件 | 说明 |
|------|------|
| `examples/webapp/src/main/java/com/oking/base/ldap/NegotiateSecurityFilter.java` | 自定义 NegotiateSecurityFilter，删除 |
| `examples/webapp/src/main/java/com/oking/base/ldap/DoradoNegotiateSecurityFilter.java` | 自定义 DoradoNegotiateSecurityFilter，删除 |

> `examples/webapp-backup-ldap/NegotiateSecurityFilter.java` 为项目外部独立备份文件，保留未删。

## 三、清理的残留 import

| 文件 | 清理内容 |
|------|----------|
| `examples/webapp/src/main/java/com/oking/base/controller/LoginController.java` | 移除 `import waffle.servlet.NegotiateSecurityFilter;`（未被使用，PRINCIPAL 常量已硬编码为字符串 `"waffle.servlet.NegotiateSecurityFilter.PRINCIPAL"`） |
| `examples/webapp/src/main/java/com/oking/base/controller/IndexController.java` | 移除 `import waffle.servlet.NegotiateSecurityFilter;`（未被使用） |

## 四、web.xml 现状
`examples/webapp/src/main/webapp/WEB-INF/web.xml` 中的 filter-class 已使用 waffle 原生类：

```xml
<filter-class>waffle.servlet.NegotiateSecurityFilter</filter-class>
```

与 `waffle.servlet.spi.NegotiateSecurityFilterProvider` 等 init-param 配置保持一致。

## 五、验证

| 步骤 | 结果 |
|------|------|
| `mvnd clean compile`（example/webapp） | **BUILD SUCCESS**，535 source files 编译通过 |
| grep `com.oking.base.ldap` / `DoradoNegotiateSecurityFilter` | 项目源码（除备份目录外）**无残留引用** |
