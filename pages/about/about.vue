<template>
	<view class="about-container">
		<!-- 头部区域 -->
		<view class="header-section">
			<view class="header-bg"></view>
			<view class="header-content">
				<view class="brand-area">
					<text class="brand-title">快约景</text>
					<text class="brand-subtitle">让旅行更简单</text>
				</view>
			</view>
		</view>
		
		<!-- 主内容区域 -->
		<view class="main-content">
			<view class="section-card">
				<view class="card-bg-pattern"></view>
				<view class="section-header">
					<view class="section-icon">📖</view>
					<text class="section-title">产品说明</text>
				</view>
				<view class="section-content">
					<text class="description">中国各大景点预约入口聚合，让用户快速找到预约入口，注重清爽简洁的交互体验。</text>
				</view>
			</view>
			
			<view class="section-card">
				<view class="card-bg-pattern"></view>
				<view class="section-header">
					<view class="section-icon">⚠️</view>
					<text class="section-title">重要声明</text>
				</view>
				<view class="section-content">
					<view class="statement-item">
						<view class="bullet-container">
							<view class="bullet"></view>
						</view>
						<text class="statement-text">只做景点预约入口，不收集用户信息</text>
					</view>
					<view class="statement-item">
						<view class="bullet-container">
							<view class="bullet"></view>
						</view>
						<text class="statement-text">以官方发布为准</text>
					</view>
				</view>
			</view>
			
			<view class="section-card contact-card" @tap="goToFeedback">
				<view class="card-bg-pattern"></view>
				<view class="contact-content">
					<view class="contact-left">
						<view class="contact-icon">💬</view>
						<view class="contact-info">
							<text class="contact-title">用户反馈</text>
							<text class="contact-subtitle">告诉我们您的建议</text>
						</view>
					</view>
					<view class="contact-arrow">
						<image class="arrow-icon" src="/static/right-arr.png" mode="aspectFit"></image>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 底部版本信息 -->
		<view class="footer">
			<view class="version-container">
				<text class="version">版本 1.0.0</text>
			</view>
		</view>
		
		<!-- 底部渐变 -->
		<view class="bottom-fade"></view>
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
/* ==================== 基础容器 ==================== */
.about-container {
	min-height: 100vh;
	background: linear-gradient(180deg, #faf9f7 0%, #f5f3f0 100%);
	position: relative;
}

/* ==================== 头部区域 ==================== */
.header-section {
	position: relative;
	padding-bottom: 40rpx;
}

.header-bg {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 280rpx;
	background: linear-gradient(135deg, #f6d55c 0%, #ed8936 100%);
	border-radius: 0 0 50rpx 50rpx;
	box-shadow: 0 10rpx 40rpx rgba(237, 137, 54, 0.3);
}

.header-content {
	position: relative;
	z-index: 2;
	display: flex;
	align-items: flex-end;
	justify-content: flex-start;
	padding: 40rpx;
	padding-top: calc(env(safe-area-inset-top) + 80rpx);
	padding-bottom: 60rpx;
	min-height: 280rpx;
	box-sizing: border-box;
}

.brand-area {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: flex-end;
}

.brand-title {
	font-size: 52rpx;
	font-weight: 800;
	color: #ffffff;
	text-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
	letter-spacing: -1rpx;
	margin-bottom: 8rpx;
	line-height: 1.2;
}

.brand-subtitle {
	font-size: 26rpx;
	color: rgba(255, 255, 255, 0.9);
	font-weight: 500;
	letter-spacing: 1rpx;
}

/* ==================== 主内容区域 ==================== */
.main-content {
	padding: 10rpx 40rpx 40rpx;
}

.section-card {
	position: relative;
	background: #ffffff;
	border-radius: 32rpx;
	padding: 40rpx;
	margin-bottom: 32rpx;
	box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);
	border: 1rpx solid rgba(255, 255, 255, 0.8);
	overflow: hidden;
	transition: all 0.3s ease;
}

.section-card:hover {
	transform: translateY(-2rpx);
	box-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.12);
}

.card-bg-pattern {
	position: absolute;
	top: 0;
	right: 0;
	width: 200rpx;
	height: 200rpx;
	background: radial-gradient(circle, rgba(246, 213, 92, 0.1) 0%, transparent 70%);
	border-radius: 50%;
	transform: translate(50rpx, -50rpx);
}

.section-header {
	display: flex;
	align-items: center;
	margin-bottom: 32rpx;
	position: relative;
	z-index: 2;
}

.section-icon {
	font-size: 32rpx;
	margin-right: 16rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: 700;
	color: #2d3748;
}

.section-content {
	position: relative;
	z-index: 2;
}

.description {
	font-size: 28rpx;
	color: #4a5568;
	line-height: 1.6;
}

.statement-item {
	display: flex;
	align-items: flex-start;
	margin-bottom: 24rpx;
}

.statement-item:last-child {
	margin-bottom: 0;
}

.bullet-container {
	margin-right: 16rpx;
	margin-top: 8rpx;
}

.bullet {
	width: 8rpx;
	height: 8rpx;
	background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
	border-radius: 50%;
	box-shadow: 0 2rpx 8rpx rgba(66, 153, 225, 0.3);
}

.statement-text {
	font-size: 28rpx;
	color: #4a5568;
	line-height: 1.6;
	flex: 1;
}

/* ==================== 联系卡片 ==================== */
.contact-card {
	cursor: pointer;
}

.contact-card:active {
	transform: translateY(1rpx);
	box-shadow: 0 6rpx 24rpx rgba(0, 0, 0, 0.15);
}

.contact-content {
	display: flex;
	align-items: center;
	justify-content: space-between;
	position: relative;
	z-index: 2;
}

.contact-left {
	display: flex;
	align-items: center;
}

.contact-icon {
	font-size: 40rpx;
	margin-right: 24rpx;
}

.contact-info {
	display: flex;
	flex-direction: column;
}

.contact-title {
	font-size: 32rpx;
	font-weight: 700;
	color: #2d3748;
	margin-bottom: 8rpx;
}

.contact-subtitle {
	font-size: 24rpx;
	color: #718096;
}

.contact-arrow {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 40rpx;
	height: 40rpx;
}

.arrow-icon {
	width: 32rpx;
	height: 32rpx;
	opacity: 0.8;
}

/* ==================== 底部区域 ==================== */
.footer {
	display: flex;
	justify-content: center;
	padding: 40rpx;
}

.version-container {
	background: rgba(255, 255, 255, 0.8);
	backdrop-filter: blur(20rpx);
	border: 1rpx solid rgba(255, 255, 255, 0.3);
	border-radius: 20rpx;
	padding: 16rpx 32rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.version {
	font-size: 24rpx;
	color: #718096;
	font-weight: 500;
}

/* ==================== 底部渐变 ==================== */
.bottom-fade {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	height: 40rpx;
	background: linear-gradient(180deg, transparent 0%, rgba(245, 243, 240, 0.8) 100%);
	pointer-events: none;
}
</style>