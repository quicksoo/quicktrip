// 简单的本地服务器，用于预览H5版本
const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 8080;

// MIME类型映射
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // 处理根路径
  let filePath = req.url === '/' ? '/index.html' : req.url;
  
  // 移除查询参数
  filePath = filePath.split('?')[0];
  
  // 构建完整文件路径
  const fullPath = path.join(__dirname, 'unpackage/dist/build/h5', filePath);
  
  // 获取文件扩展名
  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeType = mimeTypes[extname] || 'application/octet-stream';

  // 检查文件是否存在
  fs.access(fullPath, fs.constants.F_OK, (err) => {
    if (err) {
      // 文件不存在，返回404
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>QuickTrip - 文件未找到</title>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .container { max-width: 600px; margin: 0 auto; }
            .error { color: #e74c3c; }
            .info { color: #3498db; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1 class="error">文件未找到 (404)</h1>
            <p>请求的文件: <code>${filePath}</code></p>
            <div class="info">
              <h3>如何运行H5版本：</h3>
              <ol style="text-align: left;">
                <li>在HBuilderX中打开项目</li>
                <li>点击菜单栏"运行" -> "运行到浏览器" -> "Chrome"</li>
                <li>或者点击工具栏的运行按钮，选择浏览器运行</li>
              </ol>
              <p><strong>注意：</strong>需要先在HBuilderX中编译H5版本才能通过此服务器访问。</p>
            </div>
          </div>
        </body>
        </html>
      `);
      return;
    }

    // 读取文件
    fs.readFile(fullPath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end(`服务器错误: ${err.code}`);
      } else {
        res.writeHead(200, { 
          'Content-Type': mimeType,
          'Access-Control-Allow-Origin': '*'
        });
        res.end(content, 'utf-8');
      }
    });
  });
});

server.listen(port, () => {
  console.log(`
===========================================
  QuickTrip H5 预览服务器已启动
===========================================

  本地地址: http://localhost:${port}
  网络地址: http://127.0.0.1:${port}

===========================================
  使用说明：
===========================================

1. 在HBuilderX中运行H5版本：
   - 打开HBuilderX
   - 选择"运行" -> "运行到浏览器" -> "Chrome"
   
2. 或者手动编译后访问：
   - 在HBuilderX中选择"发行" -> "网站-PC Web或手机H5"
   - 编译完成后访问上述地址

===========================================
  按 Ctrl+C 停止服务器
===========================================
  `);
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n服务器已停止');
  server.close();
  process.exit(0);
});