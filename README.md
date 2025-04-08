# Upzilla
简洁的UptimeRobot页面

## 部署
### 安装依赖

```bash
# 若没有 pnpm
npm install pnpm -g

# 安装依赖
pnpm i
```

### 开发

```bash
pnpm dev
```

### 构建

```bash
pnpm build
```

构建后的文件会存储于 dist 目录中。

## 事先准备

- 您需要先到 [UptimeRobot](https://uptimerobot.com/ "UptimeRobot") 添加站点监控，并在 My Settings 页面获取 API Key
- 您需要拥有一个网站空间，常见的 Nginx / PHP 等空间即可，甚至是阿里云的 OSS 等纯静态空间也行，也可以使用 `Vercel` 或者 `Cloudflare` 直接部署该项目。

## 如何部署：
- 所有配置均位于.env文件内
- 将所有文件上传到网站空间

## 鸣谢
 - [site-status](https://github.com/imsyy/site-status) 基于此项目进行修改