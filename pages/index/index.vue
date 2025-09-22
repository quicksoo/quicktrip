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

		<!-- 二维码模态框 -->
		<view v-if="showQrModal" class="modal-mask" @tap="closeQrCode">
			<view class="modal-body" @tap.stop>
				<canvas canvas-id="qrcode" style="width: 200px; height: 200px;"></canvas>
				<button class="close-btn" @tap="closeQrCode">关闭</button>
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
			cityIndex: 0,
			cityList: [
				{ name: '北京', code: 'beijing' },
				{ name: '上海', code: 'shanghai' },
				{ name: '广州', code: 'guangzhou' },
				{ name: '深圳', code: 'shenzhen' },
				{ name: '杭州', code: 'hangzhou' },
				{ name: '南京', code: 'nanjing' },
				{ name: '西安', code: 'xian' },
				{ name: '成都', code: 'chengdu' }
			],
			scenicSpots: [],
			loading: false,
			showQrModal: false,   // 控制二维码模态框
			currentQrUrl: '',    // 保存当前二维码链接
		}
	},
	computed: {
		currentCity() {
			return this.cityList[this.cityIndex] || this.cityList[0]
		},
		filteredScenicSpots() {
			const dataSource = this.scenicSpots.length > 0 ? this.scenicSpots : []
			let spots = dataSource.filter(spot => spot.city === this.currentCity.code)

			if (this.searchKeyword.trim()) {
				spots = spots.filter(spot =>
					spot.name.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
					spot.address.toLowerCase().includes(this.searchKeyword.toLowerCase())
				)
			}
			return spots
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
					const index = this.cityList.findIndex(city => city.code === cityData.code)
					if (index !== -1) this.cityIndex = index
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
				const res = await db.collection('scenic_spots').get()
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

			// 次选：展示二维码
			if (bookUrl) {
				this.currentQrUrl = bookUrl
				this.showQrModal = true
				this.$nextTick(() => {
					drawQrcode({
						width: 200,
						height: 200,
						canvasId: 'qrcode',
						text: bookUrl
					})
				})
				return
			}

			// 兜底
			uni.showToast({ title: '暂无预约渠道', icon: 'none' })
		},

		closeQrCode() {
			this.showQrModal = false
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
	padding: 40rpx;
	border-radius: 20rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
}
.close-btn {
	margin-top: 20rpx;
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

