<script>
export default {
	onLaunch: function() {
		console.log('QuickTrip App Launch')
		// 初始化云开发环境
		// #ifdef MP-WEIXIN
		if (typeof wx !== 'undefined' && wx.cloud) {
			wx.cloud.init({
				env: 'cloud1-6gf1u4bif4e072cf',
				traceUser: true
			})
		}
		// #endif
	},
	onShow: function() {
		console.log('QuickTrip App Show')
	},
	onHide: function() {
		console.log('QuickTrip App Hide')
	}
}
</script>

<style>
/* 全局样式 */
page {
	background-color: #f5f5f5;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
}

/* 通用类 */
.container {
	padding: 0;
	margin: 0;
}

.flex {
	display: flex;
}

.flex-center {
	display: flex;
	align-items: center;
	justify-content: center;
}

.flex-between {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.text-center {
	text-align: center;
}

.text-left {
	text-align: left;
}

.text-right {
	text-align: right;
}

/* 颜色变量 */
.primary-color {
	color: #3cc51f;
}

.secondary-color {
	color: #666;
}

.text-color {
	color: #333;
}

.light-color {
	color: #999;
}

/* 背景色 */
.bg-white {
	background-color: #fff;
}

.bg-primary {
	background-color: #3cc51f;
}

.bg-light {
	background-color: #f5f5f5;
}

/* 边距 */
.m-0 { margin: 0; }
.mt-10 { margin-top: 10rpx; }
.mt-20 { margin-top: 20rpx; }
.mt-30 { margin-top: 30rpx; }
.mb-10 { margin-bottom: 10rpx; }
.mb-20 { margin-bottom: 20rpx; }
.mb-30 { margin-bottom: 30rpx; }

.p-0 { padding: 0; }
.pt-10 { padding-top: 10rpx; }
.pt-20 { padding-top: 20rpx; }
.pt-30 { padding-top: 30rpx; }
.pb-10 { padding-bottom: 10rpx; }
.pb-20 { padding-bottom: 20rpx; }
.pb-30 { padding-bottom: 30rpx; }

/* 圆角 */
.radius-8 { border-radius: 8rpx; }
.radius-16 { border-radius: 16rpx; }
.radius-50 { border-radius: 50rpx; }

/* 阴影 */
.shadow-light {
	box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

.shadow-normal {
	box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.1);
}

/* 字体大小 */
.font-24 { font-size: 24rpx; }
.font-26 { font-size: 26rpx; }
.font-28 { font-size: 28rpx; }
.font-30 { font-size: 30rpx; }
.font-32 { font-size: 32rpx; }
.font-36 { font-size: 36rpx; }
.font-48 { font-size: 48rpx; }

/* 字体粗细 */
.font-normal { font-weight: normal; }
.font-bold { font-weight: bold; }
.font-500 { font-weight: 500; }

/* 按钮样式重置 */
button {
	border: none;
	outline: none;
	background: none;
	padding: 0;
	margin: 0;
	border-radius: 0;
}

button::after {
	border: none;
}

/* 输入框样式重置 */
input, textarea {
	border: none;
	outline: none;
	background: transparent;
}

/* 滚动条隐藏 */
::-webkit-scrollbar {
	display: none;
}
</style>
