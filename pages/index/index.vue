<template>
	<view class="container">

		<!-- 顶部区域 -->
		<view class="header-section">
			<view class="header-bg"></view>
			<view class="header-content">
				<view class="location-selector" @tap="goToCitySelect">
					<view class="location-pill">
						<text class="location-pin">📍</text>
						<text class="location-name">{{currentCity.name}}</text>
						<text class="location-chevron">›</text>
					</view>
				</view>
				<view class="brand-area">
					<text class="brand-title">快约景</text>
					<text class="brand-subtitle">一站式约景小助手</text>
				</view>
			</view>
		</view>

		<!-- 主内容区域 -->
		<view class="main-content">

			<!-- 景点卡片列表 -->
			<view class="spots-grid">
				<view class="spot-card" v-for="(item, index) in filteredScenicSpots" :key="index"
					@tap="jumpToAnotherMiniProgram(item)">
					<view class="card-bg-pattern"></view>

					<view class="card-content">
						<view class="spot-avatar-container">
							<view class="spot-avatar">
								<text class="avatar-letter">{{item.name.charAt(0)}}</text>
								<view class="avatar-glow"></view>
							</view>
						</view>

						<view class="spot-info-area">
							<view class="title-with-arrow">
								<text class="spot-title">{{item.name}}</text>
								<view class="click-arrow">
									<image class="arrow-icon" src="/static/right-arr.png" mode="aspectFit"></image>
								</view>
							</view>
							<view class="spot-meta">
								<text class="spot-timing">{{item.reservationTime}}</text>
							</view>
						</view>

						<view class="price-display">
							<text class="price-amount">{{ item.price > 0 ? `¥${item.price}` : '免费' }}</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 空状态 -->
			<view class="empty-container" v-if="filteredScenicSpots.length === 0">
				<view class="empty-illustration">
					<text class="empty-icon">🗺️</text>
					<view class="empty-glow"></view>
				</view>
				<text class="empty-title">暂无景点信息</text>
				<text class="empty-subtitle">换个城市试试看吧</text>
			</view>
		</view>

		<!-- 预约引导模态框 -->
		<view v-if="showQrModal" class="modal-mask" @tap="closeQrCode">
			<view class="modal-body" @tap.stop>
				<view class="close-btn" @tap="closeQrCode">
					<text class="close-icon">✕</text>
				</view>
				
				<!-- 标题 -->
				<view class="modal-title">
					<text class="title-text">预约方式</text>
				</view>
				
				<!-- 主要操作 -->
				<view class="main-action">
					<button class="copy-btn" @tap="copyUrl">
						<text class="copy-icon">📋</text>
						<text class="copy-text">复制预约链接</text>
					</button>
				</view>
				
				<!-- 搜索框引导动画 -->
				<view class="guide-animation">
					<view class="wechat-guide-demo">
						<view class="phone-mockup">
							<view class="status-bar">
								<text class="time">14:02</text>
								<view class="signal-area">
									<text class="signal">5G</text>
									<text class="battery">67%</text>
								</view>
							</view>
							<view class="wechat-header">
								<text class="wechat-title">微信</text>
								<view class="header-icons">
									<view class="search-icon-btn">🔍</view>
								</view>
							</view>
							<view class="search-highlight">
								<view class="arrow-point">👆</view>
								<text class="guide-tip">点击这里，粘贴预约链接</text>
							</view>
						</view>
					</view>
				</view>
				
				<!-- 分割线 -->
				<view class="divider" v-if="currentScenic && currentScenic.wechatAccount">
					<text class="divider-text">或</text>
				</view>
				
				<!-- 公众号引导 -->
				<view class="wechat-guide" v-if="currentScenic && currentScenic.wechatAccount">
					<text class="guide-text">关注公众号</text>
					<text class="account-name">「{{currentScenic.wechatAccount}}」</text>
					<text class="guide-desc">获取更多预约服务</text>
				</view>
			</view>
		</view>

		<!-- 底部渐变 -->
		<view class="bottom-fade"></view>
	</view>
</template>

<script>
import drawQrcode from 'weapp-qrcode'

export default {
	data() {
		return {
			searchKeyword: '',
			currentSelectedCity: { name: '北京', code: 'beijing' }, // 当前选中的城市
			scenicSpots: [],
			loading: false,
			showQrModal: false,   // 控制预约引导模态框
			currentQrUrl: '',    // 保存当前预约链接
			currentScenic: null, // 保存当前景点信息
		}
	},
	computed: {
		currentCity() {
			return this.currentSelectedCity
		},
		filteredScenicSpots() {
			const dataSource = this.scenicSpots.length > 0 ? this.scenicSpots : []
			
			if (this.searchKeyword.trim()) {
				return dataSource.filter(spot =>
					spot.name.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
					(spot.address && spot.address.toLowerCase().includes(this.searchKeyword.toLowerCase()))
				)
			}
			return dataSource
		}
	},
	onLoad() {
		this.initPage()
	},
	methods: {
		async initPage() {
			try {
				const lastCity = uni.getStorageSync('last_selected_city')
				if (lastCity) {
					const cityData = JSON.parse(lastCity)
					this.currentSelectedCity = cityData
				}
			} catch (e) {
				console.log('获取上次选择城市失败:', e)
			}
			await this.loadScenicSpots()
		},

		async loadScenicSpots() {
			this.loading = true
			try {
				const db = wx.cloud.database()
				const res = await db.collection('scenic_spots')
					.where({
						city: this.currentCity.code
					})
					.orderBy('sort', 'asc')
					.get()
				this.scenicSpots = res.data || []
			} catch (error) {
				console.error('加载云数据库失败:', error)
				this.scenicSpots = []
			} finally {
				this.loading = false
			}
		},

		goToCitySelect() {
			uni.navigateTo({
				url: `/pages/city/city?current=${this.currentCity.code}`
			})
		},

		// 城市选择回调方法
		onCitySelected(city) {
			// 直接设置当前选中的城市，不需要维护固定列表
			this.currentSelectedCity = city
			
			// 保存选择的城市到本地存储
			try {
				uni.setStorageSync('last_selected_city', JSON.stringify(city))
			} catch (e) {
				console.log('保存城市选择失败:', e)
			}
			// 重新加载当前城市的数据
			this.loadScenicSpots()
		},

		async jumpToAnotherMiniProgram(scenic) {
			const { shortLink, bookUrl } = scenic

			// 优先跳小程序
			if (shortLink) {
				// #ifdef MP-WEIXIN
				uni.showLoading({ title: '正在跳转...' })
				wx.navigateToMiniProgram({
					shortLink,
					envVersion: 'release',
					success: () => { uni.hideLoading() },
					fail: () => {
						uni.hideLoading()
						uni.showToast({ title: '跳转失败', icon: 'none' })
					}
				})
				// #endif
				return
			}

			// 次选：展示预约引导
			if (bookUrl) {
				this.currentQrUrl = bookUrl
				this.currentScenic = scenic // 保存当前景点信息
				this.showQrModal = true
				return
			}

			// 兜底
			uni.showToast({ title: '暂无预约渠道', icon: 'none' })
		},

		closeQrCode() {
			this.showQrModal = false
			this.currentScenic = null
		},

		// 复制链接到剪贴板
		copyUrl() {
			// #ifdef MP-WEIXIN
			wx.setClipboardData({
				data: this.currentQrUrl,
				success: () => {
					uni.showToast({
						title: '链接已复制，请到微信搜索框粘贴',
						icon: 'success',
						duration: 3000
					})
					// 2秒后自动关闭弹窗
					setTimeout(() => {
						this.closeQrCode()
					}, 2000)
				},
				fail: () => {
					uni.showToast({
						title: '复制失败',
						icon: 'none'
					})
				}
			})
			// #endif
			
			// #ifndef MP-WEIXIN
			uni.setClipboardData({
				data: this.currentQrUrl,
				success: () => {
					uni.showToast({
						title: '链接已复制，请到微信搜索框粘贴',
						icon: 'success',
						duration: 3000
					})
					setTimeout(() => {
						this.closeQrCode()
					}, 2000)
				}
			})
			// #endif
		}
	}
}
</script>

<style scoped>
/* 模态框样式 */
.modal-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0,0,0,0.6);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 999;
}
.modal-body {
	background: #fff;
	padding: 30px 20px 25px;
	border-radius: 16px;
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
	width: 320px;
	box-sizing: border-box;
}

.close-btn {
	position: absolute;
	top: 15px;
	right: 15px;
	width: 32px;
	height: 32px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(0, 0, 0, 0.1);
	border-radius: 50%;
	cursor: pointer;
	transition: all 0.2s ease;
	z-index: 10;
}

.close-btn:active {
	transform: scale(0.95);
	background: rgba(0, 0, 0, 0.2);
}

.close-icon {
	font-size: 18px;
	color: #666;
	font-weight: bold;
	line-height: 1;
}

/* 新的预约引导样式 */
.modal-title {
	margin-bottom: 25px;
}

.title-text {
	font-size: 20px;
	font-weight: 600;
	color: #333;
}

.main-action {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 20px;
}

.copy-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	background: #07c160;
	color: white;
	border: none;
	border-radius: 20px;
	padding: 10px 20px;
	font-size: 15px;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s ease;
}

.copy-btn:active {
	background: #06ad56;
	transform: scale(0.95);
}

.copy-icon {
	font-size: 15px;
}

.copy-text {
	font-size: 15px;
}

.guide-animation {
	margin: 15px 0;
	animation: fadeIn 0.3s ease-in;
}

.wechat-guide-demo {
	display: flex;
	justify-content: center;
}

.phone-mockup {
	width: 250px;
	background: #f7f7f7;
	border-radius: 12px;
	overflow: hidden;
	border: 2px solid #e0e0e0;
	position: relative;
}

.status-bar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 8px 15px 5px;
	background: #f7f7f7;
	font-size: 11px;
	color: #333;
}

.time {
	font-weight: 600;
}

.signal-area {
	display: flex;
	gap: 8px;
	align-items: center;
}

.signal, .battery {
	font-size: 10px;
	color: #333;
}

.wechat-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 12px 15px;
	background: #ededed;
	border-bottom: 1px solid #d0d0d0;
}

.wechat-title {
	font-size: 16px;
	font-weight: 600;
	color: #333;
}

.header-icons {
	display: flex;
	gap: 15px;
}

.search-icon-btn, .add-icon-btn {
	width: 24px;
	height: 24px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 16px;
	color: #333;
	border-radius: 50%;
	background: rgba(7, 193, 96, 0.1);
	animation: pulse 2s infinite;
}

.search-highlight {
	padding: 15px;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
	background: #fff;
}

.arrow-point {
	font-size: 20px;
	animation: bounce 1.5s infinite;
}

.guide-tip {
	font-size: 12px;
	color: #07c160;
	font-weight: 500;
	text-align: center;
	line-height: 1.2;
}

@keyframes pulse {
	0% { 
		background: rgba(7, 193, 96, 0.1);
		transform: scale(1);
	}
	50% { 
		background: rgba(7, 193, 96, 0.3);
		transform: scale(1.1);
	}
	100% { 
		background: rgba(7, 193, 96, 0.1);
		transform: scale(1);
	}
}

.divider {
	margin: 20px 0 15px;
	position: relative;
	width: 100%;
	text-align: center;
}

.divider::before {
	content: '';
	position: absolute;
	top: 50%;
	left: 0;
	right: 0;
	height: 1px;
	background: #e0e0e0;
}

.divider-text {
	background: #fff;
	padding: 0 15px;
	font-size: 14px;
	color: #999;
}

.wechat-guide {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 5px;
}

.guide-text {
	font-size: 14px;
	color: #666;
}

.account-name {
	font-size: 16px;
	font-weight: 600;
	color: #07c160;
}

.guide-desc {
	font-size: 12px;
	color: #999;
}

@keyframes fadeIn {
	from { opacity: 0; transform: translateY(-10px); }
	to { opacity: 1; transform: translateY(0); }
}

@keyframes bounce {
	0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
	40% { transform: translateY(-8px); }
	60% { transform: translateY(-4px); }
}

/* 其他样式保持你的原样 */
/* ==================== 基础容器 ==================== */
	.container {
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
		height: 300rpx;
		background: linear-gradient(135deg, #f6d55c 0%, #ed8936 100%);
		border-radius: 0 0 50rpx 50rpx;
		box-shadow: 0 10rpx 40rpx rgba(237, 137, 54, 0.3);
	}

	.header-content {
		position: relative;
		z-index: 2;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		padding: 40rpx 40rpx 60rpx;
		padding-top: calc(150rpx + env(safe-area-inset-top));
	}

	.brand-area {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
		padding-right: 20rpx;
	}

	.brand-title {
		font-size: 52rpx;
		font-weight: 800;
		color: #ffffff;
		text-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
		letter-spacing: -1rpx;
		margin-bottom: 8rpx;
		text-align: left;
	}

	.brand-subtitle {
		font-size: 26rpx;
		color: rgba(255, 255, 255, 0.9);
		font-weight: 500;
		letter-spacing: 1rpx;
		text-align: left;
	}

	.location-selector {
		margin-right: 32rpx;
	}

	.location-pill {
		display: flex;
		align-items: center;
		background: rgba(255, 255, 255, 0.25);
		backdrop-filter: blur(20rpx);
		border: 1rpx solid rgba(255, 255, 255, 0.3);
		border-radius: 50rpx;
		padding: 18rpx 28rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
	}

	.location-pin {
		font-size: 24rpx;
		margin-right: 8rpx;
	}

	.location-name {
		font-size: 28rpx;
		color: #ffffff;
		font-weight: 600;
		margin-right: 8rpx;
	}

	.location-chevron {
		font-size: 24rpx;
		color: rgba(255, 255, 255, 0.8);
		transform: rotate(90deg);
	}

	/* ==================== 主内容区域 ==================== */
	.main-content {
		padding: 10rpx 40rpx 40rpx;
	}



	/* ==================== 景点卡片 ==================== */
	.spots-grid {
		display: flex;
		flex-direction: column;
		gap: 32rpx;
		width: 100%;
	}

	.spot-card {
		position: relative;
		background: #ffffff;
		border-radius: 32rpx;
		padding: 40rpx;
		box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);
		border: 1rpx solid rgba(255, 255, 255, 0.8);
		overflow: hidden;
		transition: all 0.3s ease;
		cursor: pointer;
	}

	.spot-card:hover {
		transform: translateY(-2rpx);
		box-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.12);
	}

	.spot-card:active {
		transform: translateY(1rpx);
		box-shadow: 0 6rpx 24rpx rgba(0, 0, 0, 0.15);
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

	.card-content {
		display: flex;
		align-items: flex-start;
		position: relative;
		z-index: 2;
	}

	.spot-avatar-container {
		position: relative;
		margin-right: 32rpx;
	}

	.spot-avatar {
		width: 96rpx;
		height: 96rpx;
		background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
		border-radius: 24rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		box-shadow: 0 6rpx 20rpx rgba(74, 222, 128, 0.3);
	}

	.avatar-letter {
		font-size: 36rpx;
		color: #ffffff;
		font-weight: 700;
	}

	.avatar-glow {
		position: absolute;
		inset: -4rpx;
		background: linear-gradient(135deg, #4ade80, #22c55e);
		border-radius: 28rpx;
		opacity: 0.3;
		filter: blur(8rpx);
		z-index: -1;
	}



	.spot-info-area {
		flex: 1;
	}

	.spot-title {
		font-size: 32rpx;
		font-weight: 700;
		color: #2d3748;
		margin-bottom: 16rpx;
		line-height: 1.3;
	}

	.spot-meta {
		display: flex;
		flex-direction: column;
		gap: 8rpx;
	}

	.spot-timing {
		font-size: 26rpx;
		color: #4299e1;
		font-weight: 600;
	}

	.spot-location {
		font-size: 24rpx;
		color: #718096;
		line-height: 1.4;
	}

	.title-with-arrow {
		display: flex;
		align-items: baseline;
		gap: 8rpx;
		margin-bottom: 16rpx;
	}

	.price-display {
		margin-left: 24rpx;
	}

	.price-amount {
		font-size: 24rpx;
		font-weight: 700;
		color: #e53e3e;
		background: linear-gradient(135deg, #fed7d7 0%, #fbb6ce 100%);
		padding: 8rpx 16rpx;
		border-radius: 16rpx;
		border: 1rpx solid rgba(229, 62, 62, 0.2);
	}

	.click-arrow {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32rpx;
		height: 32rpx;
		flex-shrink: 0;
		transform: translateY(4rpx);
	}

	.arrow-icon {
		width: 32rpx;
		height: 32rpx;
		opacity: 0.8;
	}

	/* ==================== 空状态 ==================== */
	.empty-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 120rpx 40rpx;
	}

	.empty-illustration {
		position: relative;
		margin-bottom: 40rpx;
	}

	.empty-icon {
		font-size: 120rpx;
		opacity: 0.6;
	}

	.empty-glow {
		position: absolute;
		inset: -20rpx;
		background: radial-gradient(circle, rgba(246, 213, 92, 0.2) 0%, transparent 70%);
		border-radius: 50%;
		filter: blur(20rpx);
		z-index: -1;
	}

	.empty-title {
		font-size: 32rpx;
		color: #4a5568;
		font-weight: 600;
		margin-bottom: 12rpx;
	}

	.empty-subtitle {
		font-size: 26rpx;
		color: #718096;
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

