# pathfinder-web

这是一个基于vue的前端页面，后端代码页面参见[PathFinder](https://github.com/zhanglake/PathFinder)

## 初始化步骤

npm在国内较慢，推荐使用淘宝镜像cnpm，[安装方法](http://www.runoob.com/nodejs/nodejs-npm.html#taobaonpm)

``` bash
# 安装
cnpm install

# 直接运行
# 修改端口可以再config/index.js文件中的port
# 此处代码中端口设置为8087
cnpm run dev
```

## 运行项目

这里开发的时候使用的是前后端分离的技术，所以要用nginx进行反向代理

### 1. 下载nginx

下载对应版本的nginx，直接解压缩
[下载地址](http://nginx.org/en/download.html)

### 2. 修改nginx配置

配置文件在nginx目录下的conf/nginx.conf

> 我把我的nginx配置文件也放在了代码中

```
server {
    listen       8086;      #访问nginx的端口号
    server_name  localhost;

    location /pf {  #访问服务器路径
        proxy_pass   http://localhost:8085;
        proxy_connect_timeout 1;
        proxy_send_timeout 30;
        proxy_read_timeout 60;
    }

    location / {    #访问客户端路径
        proxy_pass http://localhost:8087;
        proxy_connect_timeout 1;
        proxy_send_timeout 30;
        proxy_read_timeout 60;
    }
}
```

### 3. 确认启动前后端服务，并且启动nginx

如果前后端服务都正常启动后启动nginx

进入nginx目录下执行

``` bash
# 启动nginx
start nginx

# 重启nginx
nginx -s reload

# 关闭nginx
nginx -s stop
```

此时可以通过 http://localhost:8086 来进行访问（即访问nginx，nginx会通过代理访问前后端并进行交互）


## 编译项目

``` bash
cnpm run build
```

修改nginx.conf文件

```
server {
    listen       8086;      #访问nginx的端口号
    server_name  localhost;

    location /pf {  #访问服务器路径
        proxy_pass   http://localhost:8085;
        proxy_connect_timeout 1;
        proxy_send_timeout 30;
        proxy_read_timeout 60;
    }

    location / {    #将原来的前端服务打包后变为静态文件，直接访问静态文件内容
        root   D:\****\pathfinder-web\dist;
        index  index.html;
    }
}
```