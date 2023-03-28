# Feishu-Docs-workflow

Feishu-Docs-workflow 是一个用于搜索飞书文档的 alfred workflow。

![Feishu-Docs-workflow](https://s2.ax1x.com/2019/07/11/Z2aDdP.png)

## 安装

0. 安装 nodejs（版本不能低于 18.0.0）和 chrome/chromium

1. 在[这里](https://github.com/zeronight/feishu-docs-workflow/releases)下载最新的 Feishu-Docs-workflow

2. 当你导入 Feishu-Docs-workflow 时，设置 alfred 环境变量 **NODE_PATH** 和 **CHROME_PATH**，说明如下：

* **NODE_PATH**: nodejs 的绝对地址，用于执行 js 脚本，默认值是 **/usr/local/bin/node**
* **CHROME_PATH**: chrome/chromium 的绝对地址，获取登录授权信息， 默认值是 **/Applications/Google Chrome.app/Contents/MacOS/Google Chrome**

## 使用

#### `dc`: 搜索

`dc keyword` 用于搜索文档，当 **keyword** 为空时，会展示最近访问过的文档。

> 注意：doc 文档默认点击行为是在浏览器中打开，当按住 cmd 键时，点击的行为是复制文档链接。

#### `dcf`: 收藏

`dcf keywork` 用于过滤收藏的文档，当 **keywork** 为空时，会展示所有收藏的文档。

> 注意：doc 文档默认点击行为是在浏览器中打开，当按住 cmd 键时，点击的行为是复制文档链接。

#### `dcs`: 设置

共两个设置选项，分别是「登录」和 「登出」，登录会调起 chrome/chromium 来进行授权，并自动存储凭证；登出则是删除本地存储的凭证。