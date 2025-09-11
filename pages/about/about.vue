<template>
	<view class="about-container">
		<view class="header">
			<image class="logo" src="/static/logo.png" mode="aspectFit"></image>
			<text class="app-name">QuickTrip</text>
			<text class="app-subtitle">快约景</text>
		</view>
		
		<view class="content">
			<view class="section">
				<view class="section-title">产品说明</view>
				<view class="section-content">
					<text class="description">中国各大景点预约入口聚合，让用户快速找到预约入口，注重清爽简洁的交互体验。</text>
				</view>
			</view>
			
			<view class="section">
				<view class="section-title">重要声明</view>
				<view class="section-content">
					<view class="statement-item">
						<text class="bullet">•</text>
						<text class="statement-text">只做景点预约入口，不收集用户信息</text>
					</view>
					<view class="statement-item">
						<text class="bullet">•</text>
						<text class="statement-text">以官方发布为准</text>
					</view>
				</view>
			</view>
			
			<view class="section">
				<view class="section-title">联系我们</view>
				<view class="section-content">
					<view class="contact-item" @tap="goToFeedback">
						<text class="contact-text">用户反馈</text>
						<text class="arrow">></text>
					</view>
				</view>
			</view>
		</view>
		
		<view class="footer">
			<text class="version">版本 1.0.0</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			
		}
	},
	methods: {
		goToFeedback() {
			uni.navigateTo({
				url: '/pages/feedback/feedback'
			})
		}
	}
}
</script>

<style scoped>
.about-container {
	padding: 40rpx;
	background-color: #f5f5f5;
	min-height: 100vh;
}

.header {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 60rpx;
}

.logo {
	width: 120rpx;
	height: 120rpx;
	margin-bottom: 20rpx;
}

.app-name {
	font-size: 48rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 10rpx;
}

.app-subtitle {
	font-size: 28rpx;
	color: #666;
}

.section {
	background-color: #fff;
	border-radius: 16rpx;
	margin-bottom: 30rpx;
	overflow: hidden;
}

.section-title {
	padding: 30rpx;
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	border-bottom: 1rpx solid #f0f0f0;
}

.section-content {
	padding: 30rpx;
}

.description {
	font-size: 28rpx;
	color: #666;
	line-height: 1.6;
}

.statement-item {
	display: flex;
	align-items: flex-start;
	margin-bottom: 20rpx;
}

.statement-item:last-child {
	margin-bottom: 0;
}

.bullet {
	font-size: 28rpx;
	color: #3cc51f;
	margin-right: 15rpx;
	margin-top: 2rpx;
}

.statement-text {
	font-size: 28rpx;
	color: #666;
	line-height: 1.5;
	flex: 1;
}

.contact-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 0;
}

.contact-text {
	font-size: 28rpx;
	color: #333;
}

.arrow {
	font-size: 28rpx;
	color: #ccc;
}

.footer {
	display: flex;
	justify-content: center;
	margin-top: 60rpx;
}

.version {
	font-size: 24rpx;
	color: #999;
}
</style>