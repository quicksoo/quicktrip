<template>
	<view class="about-container">
		<!-- 头部区域 -->
		<view class="header-section">
			<view class="header-bg"></view>
			<view class="header-content">
				<view class="nav-bar">
					<view class="nav-left" @tap="goBack">
						<view class="back-button">
							<text class="back-icon">‹</text>
						</view>
					</view>
					<view class="nav-center"></view>
					<view class="nav-right"></view>
				</view>
				<view class="header-info">
					<view class="header-text">
						<text class="page-title">关于我们</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 内容区域 -->
		<view class="content-section">
			<!-- 应用信息 -->
			<view class="info-card">
				<view class="card-bg-pattern"></view>
				<view class="app-info">
					<view class="app-icon">
						<image src="/static/logo.png" class="logo-image" mode="aspectFit"></image>
					</view>
					<view class="app-details"  @tap="onTitleClick">
						<text class="app-name">快约景</text>
						<text class="app-version">版本 1.0.0</text>
						<text class="app-description">一站式旅游小助手</text>
					</view>
				</view>
			</view>
			
			<!-- 产品声明 -->
			<view class="feature-card">
				<view class="card-bg-pattern"></view>
				<view class="feature-header">
					<view class="feature-icon">📋</view>
					<text class="feature-title">产品声明</text>
				</view>
				<view class="feature-list">
					<view class="feature-item">
						<view class="feature-dot">🏛️</view>
						<text class="feature-text">只做官方景点预约入口聚合</text>
					</view>
					<view class="feature-item">
						<view class="feature-dot">🔒</view>
						<text class="feature-text">不收集用户信息</text>
					</view>
					<view class="feature-item">
						<view class="feature-dot">✅</view>
						<text class="feature-text">以官方发布为准</text>
					</view>
				</view>
			</view>
			
			<!-- 联系我们 -->
			<view class="contact-card">
				<view class="card-bg-pattern"></view>
				<view class="contact-header">
					<view class="contact-icon">📞</view>
					<text class="contact-title">联系我们</text>
				</view>
				<view class="contact-list">
					<view class="contact-item" @tap="goToFeedback">
						<view class="contact-left">
							<view class="contact-icon">💬</view>
							<view class="contact-info">
								<text class="contact-title">用户反馈</text>
								<text class="contact-subtitle">您的宝贵意见是我们前进的动力</text>
							</view>
						</view>
						<view class="contact-arrow">
									<image class="arrow-icon" src="/static/right-arr.png" mode="aspectFit"></image>
								</view>
					</view>
					<view class="contact-item" @tap="copyEmail">
						<view class="contact-left">
							<view class="contact-icon">📧</view>
							<view class="contact-info">
								<text class="contact-title">联系邮箱</text>
								<text class="contact-subtitle">quickso_top@163.com</text>
							</view>
						</view>
						<view class="contact-arrow">
							<text class="copy-icon">📋</text>
						</view>
					</view>
				</view>
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
			clickCount: 0
		}
	},

	methods: {
		goBack() {
			uni.navigateBack()
		},
		
		goToFeedback() {
			uni.navigateTo({
				url: '/pages/feedback/feedback'
			})
		},

			// 标题点击事件 - 连续点击10次查看用户意见
		onTitleClick() {
			this.clickCount++
			console.log('点击次数:', this.clickCount)
			
			// 清除之前的定时器
			if (this.clickTimer) {
				clearTimeout(this.clickTimer)
			}
			
			// 设置3秒后重置点击计数
			this.clickTimer = setTimeout(() => {
				this.clickCount = 0
				console.log('点击计数已重置')
			}, 3000)
			
			// 连续点击10次触发查看功能
			if (this.clickCount >= 10) {
				uni.navigateTo({
				url: '/pages/admin/admin'
			})
			}
		},
		
		copyEmail() {
			const email = 'quickso_top@163.com'
			
			// 尝试使用系统剪贴板API
			if (uni.setClipboardData) {
				uni.setClipboardData({
					data: email,
					success: () => {
						uni.showToast({
							title: '邮箱已复制',
							icon: 'success',
							duration: 2000
						})
					},
					fail: () => {
						uni.showToast({
							title: '复制失败，请手动复制',
							icon: 'none',
							duration: 2000
						})
					}
				})
			} else {
				// 降级处理
				uni.showModal({
					title: '联系邮箱',
					content: email,
					showCancel: false,
					confirmText: '知道了'
				})
			}
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
	padding-bottom: 120rpx;
}

/* ==================== 头部区域 ==================== */
.header-section {
	position: relative;
	padding-bottom: 60rpx;
}

.header-bg {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 300rpx;
	background: linear-gradient(135deg, #f6d55c 0%, #ed8936 100%);
	border-radius: 0 0 38rpx 38rpx;
	box-shadow: 0 10rpx 40rpx rgba(237, 137, 54, 0.3);
	z-index: 1;
}

.header-content {
	position: relative;
	z-index: 2;
	padding-top: calc(40rpx + env(safe-area-inset-top));
	padding-left: 24rpx;
	padding-right: 24rpx;
}

.nav-bar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 88rpx;
}

.nav-left,
.nav-right {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.nav-center {
	flex: 1;
}

.back-button {
	width: 48rpx;
	height: 48rpx;
	background: rgba(255, 255, 255, 0.12);
	backdrop-filter: blur(10rpx);
	border: 1rpx solid rgba(255, 255, 255, 0.18);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.back-icon {
	font-size: 28rpx;
	color: #ffffff;
	font-weight: 700;
}

.header-info {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 18rpx;
	margin-top: 20rpx;
	padding-bottom: 30rpx;
}

.header-icon {
	font-size: 44rpx;
	margin-right: 10rpx;
}

.header-text {
	display: flex;
	flex-direction: column;
}

.page-title {
	font-size: 36rpx;
	font-weight: 800;
	color: #ffffff;
	text-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.12);
	letter-spacing: -0.5rpx;
	margin-bottom: 6rpx;
}

.page-subtitle {
	font-size: 22rpx;
	color: rgba(255, 255, 255, 0.95);
	font-weight: 500;
	letter-spacing: 0.3rpx;
}

/* ==================== 内容区域 ==================== */
.content-section {
	padding: 40rpx 28rpx 60rpx;
}

/* ==================== 卡片通用样式 ==================== */
.info-card,
.feature-card,
.contact-card,
.copyright-card {
	position: relative;
	background: #ffffff;
	border-radius: 24rpx;
	padding: 48rpx;
	margin-bottom: 44rpx;
	box-shadow: 0 8rpx 28rpx rgba(0, 0, 0, 0.06);
	border: 1rpx solid rgba(255, 255, 255, 0.85);
	overflow: hidden;
}

.card-bg-pattern {
	position: absolute;
	top: 0;
	right: 0;
	width: 180rpx;
	height: 180rpx;
	background: radial-gradient(circle, rgba(102, 126, 234, 0.08) 0%, transparent 70%);
	border-radius: 50%;
	transform: translate(40rpx, -40rpx);
	opacity: 0.9;
}

/* ==================== 应用信息 ==================== */
.app-info {
	display: flex;
	align-items: center;
	gap: 24rpx;
	position: relative;
	z-index: 2;
}

.app-icon {
	width: 96rpx;
	height: 96rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #ffffff;
	border: 3rpx solid #667eea;
	border-radius: 50%;
	box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.3);
	overflow: hidden;
}

.logo-image {
	width: 80rpx;
	height: 80rpx;
}

.app-details {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.app-name {
	font-size: 32rpx;
	font-weight: 800;
	color: #2d3748;
	letter-spacing: -0.5rpx;
}

.app-version {
	font-size: 24rpx;
	color: #718096;
	font-weight: 600;
}

.app-description {
	font-size: 26rpx;
	color: #4a5568;
	line-height: 1.5;
	margin-top: 8rpx;
}

/* ==================== 功能特色 ==================== */
.feature-header {
	display: flex;
	align-items: center;
	margin-bottom: 32rpx;
	position: relative;
	z-index: 2;
}

.feature-icon {
	font-size: 30rpx;
	margin-right: 12rpx;
}

.feature-title {
	font-size: 26rpx;
	font-weight: 700;
	color: #2d3748;
}

.feature-list {
	position: relative;
	z-index: 2;
}

.feature-item {
	display: flex;
	align-items: center;
	margin-bottom: 24rpx;
}

.feature-item:last-child {
	margin-bottom: 0;
}

.feature-dot {
	font-size: 24rpx;
	margin-right: 16rpx;
	width: 32rpx;
	text-align: center;
}

.feature-text {
	font-size: 26rpx;
	color: #4a5568;
	font-weight: 500;
}

/* ==================== 联系我们 ==================== */
.contact-header {
	display: flex;
	align-items: center;
	margin-bottom: 32rpx;
	position: relative;
	z-index: 2;
}

.contact-icon {
	font-size: 30rpx;
	margin-right: 12rpx;
}

.contact-title {
	font-size: 26rpx;
	font-weight: 700;
	color: #2d3748;
}

.contact-list {
	position: relative;
	z-index: 2;
}

.contact-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 24rpx 0;
	border-bottom: 1rpx solid #f7fafc;
	transition: all 0.2s ease;
}

.contact-item:last-child {
	border-bottom: none;
}

.contact-item:active {
	background: #f7fafc;
	border-radius: 12rpx;
	margin: 0 -12rpx;
	padding: 24rpx 12rpx;
}

.contact-left {
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.contact-icon {
	font-size: 28rpx;
	width: 48rpx;
	height: 48rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #f7fafc;
	border-radius: 12rpx;
}

.contact-info {
	display: flex;
	flex-direction: column;
	gap: 4rpx;
}

.contact-title {
	font-size: 26rpx;
	font-weight: 600;
	color: #2d3748;
}

.contact-subtitle {
	font-size: 22rpx;
	color: #718096;
}

.contact-arrow {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 32rpx;
	height: 32rpx;
}

.arrow-icon {
	font-size: 24rpx;
	color: #a0aec0;
	font-weight: 600;
}

.copy-icon {
	font-size: 32rpx;
	opacity: 0.8;
}

/* ==================== 版权信息 ==================== */
.copyright-card {
	background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
	border: 1rpx solid #e2e8f0;
}

.copyright-content {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12rpx;
	position: relative;
	z-index: 2;
}

.copyright-text {
	font-size: 24rpx;
	color: #4a5568;
	font-weight: 600;
}

.copyright-desc {
	font-size: 22rpx;
	color: #718096;
	text-align: center;
	line-height: 1.5;
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