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
				<view 
					class="spot-card" 
					v-for="(item, index) in filteredScenicSpots" 
					:key="index"
					@tap="reserveScenic(item)"
				>
					<!-- 卡片背景装饰 -->
					<view class="card-bg-pattern"></view>
					
					<!-- 卡片内容 -->
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
									<text class="arrow-icon">›</text>
								</view>
							</view>
							<view class="spot-meta">
								<text class="spot-timing">{{item.reservationTime}}</text>
							</view>
						</view>
						
						<view class="price-display">
							<text class="price-amount">{{ item.shortLink ? '¥60' : '免费' }}</text>
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
		
		<!-- 底部渐变 -->
		<view class="bottom-fade"></view>
	</view>
</template>

<script>
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
			localScenicSpots: [
				{
					id: 1,
					name: '故宫博物院',
					city: 'beijing',
					reservationTime: '每日8:30开放预约',
					address: '北京市东城区景山前街4号',
					shortLink: '#小程序://故宫博物院/zFDRqvEcHovytUs',
					isHot: true
				},
				{
					id: 2,
					name: '天坛公园',
					city: 'beijing',
					reservationTime: '提前7天预约',
					address: '北京市东城区天坛路甲1号',
					shortLink: '#小程序://天坛公园/xxxxx'
				},
				{
					id: 3,
					name: '上海博物馆',
					city: 'shanghai',
					reservationTime: '提前7天9:00开放预约',
					address: '上海市黄浦区人民大道201号',
					shortLink: '#小程序://上海博物馆/xxxxx',
					isHot: true
				},
				{
					id: 4,
					name: '外滩',
					city: 'shanghai',
					reservationTime: '无需预约',
					address: '上海市黄浦区中山东一路',
					shortLink: ''
				},
				{
					id: 5,
					name: '广州塔',
					city: 'guangzhou',
					reservationTime: '提前3天预约',
					address: '广州市海珠区阅江西路222号',
					shortLink: '#小程序://广州塔/xxxxx'
				},
				{
					id: 6,
					name: '西湖',
					city: 'hangzhou',
					reservationTime: '无需预约',
					address: '浙江省杭州市西湖区龙井路1号',
					shortLink: ''
				}
			]
		}
	},
	computed: {
		currentCity() {
			return this.cityList[this.cityIndex] || this.cityList[0]
		},
		filteredScenicSpots() {
			const dataSource = this.scenicSpots.length > 0 ? this.scenicSpots : this.localScenicSpots
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
					if (index !== -1) {
						this.cityIndex = index
					}
				}
			} catch (e) {
				console.log('获取上次选择城市失败:', e)
			}
			
			await this.loadScenicSpots()
		},
		
		async loadScenicSpots() {
			this.loading = true
			try {
				console.log('使用本地示例数据')
				this.scenicSpots = []
			} catch (error) {
				console.log('加载数据失败:', error)
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
		
		onCitySelected(city) {
			const index = this.cityList.findIndex(c => c.code === city.code)
			if (index !== -1) {
				this.cityIndex = index
			} else {
				this.cityList.push(city)
				this.cityIndex = this.cityList.length - 1
			}
			
			try {
				uni.setStorageSync('last_selected_city', JSON.stringify(city))
			} catch (e) {
				console.log('保存城市失败:', e)
			}
		},
		
		onSearchInput(e) {
			this.searchKeyword = e.detail.value
		},
		
		reserveScenic(scenic) {
			if (!scenic.shortLink) {
				uni.showToast({
					title: '该景点无需预约',
					icon: 'none'
				})
				return
			}
			
			this.jumpToAnotherMiniProgram(scenic)
		},
		
		jumpToAnotherMiniProgram(scenic) {
			// #ifdef MP-WEIXIN
			uni.showLoading({
				title: '正在跳转...'
			})
			
			wx.navigateToMiniProgram({
				shortLink: scenic.shortLink,
				envVersion: 'release',
				success(res) {
					console.log('跳转成功', res)
					uni.hideLoading()
				},
				fail(err) {
					console.log('跳转失败', err)
					uni.hideLoading()
					uni.showToast({
						title: '跳转失败，请稍后重试',
						icon: 'none'
					})
				}
			})
			// #endif
			
			// #ifdef H5
			uni.showModal({
				title: '预约提示',
				content: `即将为您跳转到${scenic.name}的官方预约页面。在微信小程序中可直接跳转，H5版本仅供预览。`,
				confirmText: '我知道了',
				showCancel: false
			})
			// #endif
			
			// #ifndef MP-WEIXIN || H5
			uni.showToast({
				title: '请在微信小程序中使用',
				icon: 'none'
			})
			// #endif
		}
	}
}
</script>

<style scoped>
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
	padding-top: calc(140rpx + env(safe-area-inset-top));
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

/* ==================== 搜索卡片 ==================== */
.search-card {
	position: relative;
	z-index: 3;
	margin: 0 40rpx;
	margin-top: -20rpx;
}

.search-container {
	background: rgba(255, 255, 255, 0.95);
	backdrop-filter: blur(20rpx);
	border-radius: 28rpx;
	padding: 28rpx 32rpx;
	display: flex;
	align-items: center;
	box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.12);
	border: 1rpx solid rgba(255, 255, 255, 0.8);
}

.search-icon-wrapper {
	margin-right: 24rpx;
}

.search-icon {
	font-size: 32rpx;
	color: #ed8936;
}

.search-field {
	flex: 1;
	font-size: 30rpx;
	color: #2d3748;
	background: transparent;
	border: none;
	outline: none;
}

.search-placeholder {
	color: #a0aec0;
}

/* ==================== 主内容区域 ==================== */
.main-content {
	padding: 20rpx 40rpx 40rpx;
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
	background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
	border-radius: 24rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	box-shadow: 0 6rpx 20rpx rgba(66, 153, 225, 0.3);
}

.avatar-letter {
	font-size: 36rpx;
	color: #ffffff;
	font-weight: 700;
}

.avatar-glow {
	position: absolute;
	inset: -4rpx;
	background: linear-gradient(135deg, #4299e1, #3182ce);
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
	width: 28rpx;
	height: 28rpx;
	background: rgba(255, 20, 147, 0.1);
	border-radius: 50%;
	border: 1rpx solid rgba(255, 20, 147, 0.2);
	flex-shrink: 0;
	transform: translateY(-2rpx);
}

.arrow-icon {
	font-size: 18rpx;
	color: #ff1493;
	font-weight: 600;
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