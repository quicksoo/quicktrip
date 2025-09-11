# QuickTrip - 快约景

> 中国各大景点预约入口聚合，让用户快速找到预约入口，注重清爽简洁的交互体验。

## 项目简介

QuickTrip（快约景）是一个微信小程序，旨在为用户提供中国各大景点的预约入口聚合服务。通过简洁清爽的界面设计，帮助用户快速找到所需景点的预约入口，提升出行体验。

## 功能特性

### 核心功能
- ✅ **城市筛选**: 支持按照城市筛选景点
- ✅ **常搜城市置顶**: 记录用户常用城市，提升使用体验
- ✅ **景点信息展示**: 
  - 景点logo（首字母头像）
  - 景点名称
  - 预约时间说明
  - 景点详细地址
  - 官网预约入口（小程序跳转）
- ✅ **景点搜索**: 支持在景点列表中搜索景点
- ✅ **关于页面**: 产品说明和重要声明
- ✅ **用户反馈**: 用户可提交新景点信息

### 技术特性
- 🎨 **现代化UI**: 清爽简洁的交互体验
- 📱 **响应式设计**: 适配不同屏幕尺寸
- ☁️ **云端数据**: 基于腾讯云云开发
- 💾 **本地缓存**: 智能缓存常用数据
- 🔄 **离线支持**: 网络异常时使用本地数据

## 技术架构

### 前端技术栈
- **框架**: Vue 3 + UniApp
- **构建工具**: Vite
- **样式**: 原生CSS + rpx单位
- **状态管理**: Vue 3 Composition API

### 后端技术栈
- **云服务**: 腾讯云云开发
- **云函数**: Node.js
- **数据库**: 云数据库
- **存储**: 云存储

### 项目结构
```
quickTrip/
├── pages/                  # 页面文件
│   ├── index/             # 首页
│   ├── about/             # 关于页面
│   └── feedback/          # 反馈页面
├── utils/                 # 工具类
│   ├── api.js            # API服务
│   └── storage.js        # 本地存储
├── cloudfunctions-aliyun/ # 云函数
│   ├── getScenicSpots/   # 获取景点列表
│   └── submitFeedback/   # 提交用户反馈
├── database/             # 数据库相关
│   └── init.js          # 数据库初始化
├── static/              # 静态资源
├── App.vue             # 应用入口
├── main.js             # 主文件
├── pages.json          # 页面配置
└── manifest.json       # 应用配置
```

## 快速开始

### 环境要求
- Node.js >= 14.0.0
- HBuilderX 最新版本
- 微信开发者工具

### 安装步骤

1. **克隆项目**
```bash
git clone [项目地址]
cd quickTrip
```

2. **配置云开发**
- 在HBuilderX中打开项目
- 配置腾讯云云开发环境
- 上传云函数到云端

3. **配置小程序**
- 在微信公众平台注册小程序
- 获取小程序AppID
- 在`manifest.json`中配置AppID

4. **运行项目**
- 在HBuilderX中选择"运行" -> "运行到小程序模拟器" -> "微信开发者工具"

### 云函数部署

1. **创建云开发环境**
```bash
# 在HBuilderX中右键cloudfunctions-aliyun文件夹
# 选择"创建云开发环境"
```

2. **上传云函数**
```bash
# 右键每个云函数文件夹
# 选择"上传并部署"
```

3. **初始化数据库**
```bash
# 在云开发控制台中创建集合
# 导入初始数据（参考database/init.js）
```

## 数据库设计

### 景点数据集合 (scenic_spots)
```javascript
{
  name: "景点名称",
  city: "城市代码",
  cityName: "城市名称", 
  province: "省份",
  address: "详细地址",
  reservationTime: "预约时间说明",
  shortLink: "小程序跳转链接",
  officialWebsite: "官方网站",
  // ... 更多字段
}
```

### 用户反馈集合 (user_feedback)
```javascript
{
  province: "省份",
  city: "城市",
  scenicSpotName: "景点名称",
  scenicSpotAddress: "景点地址",
  reservationInfo: "预约信息",
  status: "处理状态",
  // ... 更多字段
}
```

## 小程序跳转实现

```javascript
// 核心跳转代码
wx.navigateToMiniProgram({
  shortLink: '#小程序://景点名称/shortLinkId',
  envVersion: 'release',
  success(res) {
    console.log('跳转成功', res);
  },
  fail(err) {
    console.log('跳转失败', err);
  }
});
```

## 开发规范

### 代码规范
- 使用ES6+语法
- 组件采用单文件组件格式
- 样式使用scoped避免污染
- 遵循Vue 3最佳实践

### 命名规范
- 文件名：小写+连字符
- 组件名：PascalCase
- 变量名：camelCase
- 常量名：UPPER_CASE

### 提交规范
```bash
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建过程或辅助工具的变动
```

## 部署说明

### 小程序发布
1. 在HBuilderX中选择"发行" -> "小程序-微信"
2. 上传代码到微信公众平台
3. 提交审核
4. 审核通过后发布

### 云函数更新
1. 修改云函数代码
2. 右键选择"上传并部署"
3. 在云开发控制台验证部署结果

## 重要声明

- ✅ 只做景点预约入口聚合，不收集用户个人信息
- ✅ 所有景点信息以官方发布为准
- ✅ 本应用仅提供信息聚合服务，不承担预约相关责任

## 贡献指南

欢迎提交Issue和Pull Request来帮助改进项目。

### 提交反馈
- 通过小程序内的"用户反馈"功能
- 在GitHub上提交Issue
- 发送邮件到开发团队

## 许可证

本项目采用 MIT 许可证。详情请参阅 [LICENSE](LICENSE) 文件。

## 联系我们

- 项目地址: [GitHub仓库地址]
- 问题反馈: [Issues页面]
- 开发团队: [联系邮箱]

---

**QuickTrip - 让景点预约更简单** 🎯