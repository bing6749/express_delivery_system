<div>
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>
  <h3 align="center">express_delivery_system</h3>

  <p align="center">
    一个轻量级的校园快递管理系统小项目
    <br />
    <a href="https://github.com/bing6749/express_delivery_system"><strong>跳转到项目 »</strong></a>
    <br />
    <br />
    <a href="https://github.com/bing6749/express_delivery_system">展示模板</a>
    ·
    <a href="https://github.com/bing6749/express_delivery_system/issues">反馈 Bug</a>
    ·
    <a href="https://github.com/bing6749/express_delivery_system/issues">提供需求</a>
  </p>

<!-- ABOUT THE PROJECT -->

## 项目概况

![view](https://s2.loli.net/2023/12/22/UyugT1bVYnWweDS.jpg)

这是一个非常轻量化的校园快递管理系统，欢迎您使用它。

优势:

- 这个项目非常轻量化，没有繁重的SpringBoot，只有前端的Vue和nodejs
- 你可以根据README很轻松的跑起来本项目，前提只是需要你的电脑上安装了一个高版本的node
- 你可以很容易的修改代码，代码功能非常简洁，没有鉴权没有复杂的交互，仅有最直白的数据传递
- 你可以很容易以本项目为基础完成你的课程设计 :smile:

使用 `README.md` 去运行项目.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### 构建方式

以下是本项目用于引导项目的主要框架/库

- Vue3
- TypeScript
- pnpm
- node.js
- Vite
- Vitesse

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 如何启动

这是一个示例，说明如何在本地设置项目。

要启动并运行本地副本，请执行以下简单的示例步骤。

### 前提

首先你要确保你的电脑有安装Node.( Node >=14.18 )

### 安装

本项目需要安装前端、后端以及配置数据库

1. 克隆到本地

   ```sh
   git clone https://github.com/bing6749/express_delivery_system.git
   ```

2. 安装包
   ```sh
   cd express_delivery_system
   pnpm install
   ```
3. 安装后端依赖

   ```sh
   cd /express_delivery_back
   pnpm install
   ```

4. 配置数据库环境（mysql8为例）

   ```
   配置成自己的： /express_delivery_back/db/db.js
   导入数据库的结构与数据：~/school_post.sql
   ```

5. 启动

   ```sh
   cd /express_delivery_back
   pnpm run dev
   cd /express_delivery_back
   pnpm run start
   ```

<!-- USAGE EXAMPLES -->

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 使用

部署完成就以可以访问并使用 [http://localhost:3333](http://localhost:3333/)

更多功能展示

![admin_login](https://s2.loli.net/2023/12/22/NJkBbr1ZdCVn3qW.jpg)

![package](https://s2.loli.net/2023/12/22/ZqJ7BUkPOywhzu5.jpg)

![order](https://s2.loli.net/2023/12/22/XasQdgFwvh3HpIk.jpg)

![user](https://s2.loli.net/2023/12/22/EpTaGqxtURSjrdV.jpg)

<p align="right">(<a href="#readme-top">back to top</a>)

<!-- LICENSE -->

## License

本项目仅供学习与交流，禁止私自贩卖与销售。如有问题可以再issues中发出提问。

<p align="right">(<a href="#readme-top">back to top</a>)
