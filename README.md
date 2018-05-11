# Ocean.activity.workflow
基于webpack的活动工作流统一解决方案

# 简介
>本套工作流基于webpack进行搭建，提供本地快速开发环境，并脱离业务依赖和平台依赖，适应于全平台的活动专题业务：

- 支持浏览器同步刷新，支持修改scss，js等资源时无刷新浏览器重绘，提高制作静态页面时的效率；
- 内置服务器支持mock接口数据功能，只需写非常简单的配置，简洁高效，与后端解耦合，非常明显提高了开发效率；
- 产出时js,css文件自动打包合并，自动压缩混淆，最终只产出一个js文件和一个css文件,大大减少了浏览器请求数和网络流量；
- 使用scss作为css编译器，并集成compass类库；
- 使用babel作为ES6编译器，可引入ES6作为开发手段；
- 使用px2rem针对于mobile.scss进行移动端单位自动转换；
- 使用urlLoader对html和css的小图片进行base64内联；
- 一个命令npm run dev启动本地开发工作流，并使用以上提及所有特性；
- 一个命令npm run build构建活动代码；
- 一个命令npm run deploy发布代码到远程服务器（测试机），方便在测试机提测；

# 使用指南
1.从github拉取工作流代码：
```bash
$ git clone https://github.com/37HWFE/Ocean.activity.workflow.v2.git
```

2.切换到该仓库本地目录；

3.安装工作流相关依赖：
```bash
$ npm install
```
4.启动本地开发环境：
```bash
$ npm run dev
```
（1）访问PC demo：http://localhost:2333/ujoyexchange/index.html；
（2）访问Mobile demo：http://localhost:2333/ujoyexchange/indexm.html；

5.执行构建命令：
```bash
$ npm run build
```
（1）构建成功后在dist目录会生成ujoyexchange文件夹，直接部署该文件夹到 /public 即可，资源路径均为相对路径引用。

6.构建资源到测试环境：
```bash
npm run deploy
```
（1）把dist目录下构建成功的文君通过gulp sftp插件进行上传。
（2）需要在gulpfile.js 的deploy修改上传配置（默认填充一台测试机，访问地址为：http://yourdomain.com/ujoyexchange/index.html，可自行修改为自己的服务器地址）；

# 目录规范
1、以ujoyexchange为例子，可得：

- PC模版位置：Ocean.activity.v2.workflow\src\ujoyexchange\index.html
- Mobile模版位置：Ocean.activity.v2.workflow\src\ujoyexchange\indexm.html
- PC-JS主入口：Ocean.activity.v2.workflow\src\ujoyexchange\js\pc.js（默认入口，可重写）
- Mobile-JS主入口：Ocean.activity.v2.workflow\src\ujoyexchange\js\mobile.js（默认入口，可重写）
- SCSS位置：Ocean.activity.v2.workflow\src\ujoyexchange\scss
- IMG位置：Ocean.activity.v2.workflow\src\ujoyexchange\img
