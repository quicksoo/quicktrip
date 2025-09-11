<template>
	<view class="container">
		<!-- 头部区域 -->
		<view class="header">
			<!-- 导航栏 -->
			<view class="nav-bar">
				<view class="nav-left">
					<text class="app-title">QuickTrip</text>
				</view>
				<view class="nav-right" @tap="goToCitySelect">
					<text class="city-name">{{currentCity.name}}</text>
					<text class="city-arrow">▼</text>
				</view>
			</view>
			
			<!-- 搜索区域 -->
			<view class="search-section">
				<view class="search-box">
					<text class="search-icon">🔍</text>
					<input 
						class="search-input" 
						v-model="searchKeyword" 
						placeholder="搜索景点名称"
						@input="onSearchInput"
						placeholder-style="color: #ccc"
					/>
				</view>
			</view>
		</view>
		
		<!-- 景点列表 -->
		<view class="content">
			<view class="scenic-list">
				<view 
					class="scenic-item" 
					v-for="(item, index) in filteredScenicSpots" 
					:key="index"
					@tap="reserveScenic(item)"
				>
					<view class="scenic-logo">
						<text class="logo-text">{{item.name.charAt(0)}}</text>
					</view>
					<view class="scenic-info">
						<view class="scenic-name">{{item.name}}</view>
						<view class="scenic-time">{{item.reservationTime}}</view>
						<view class="scenic-address">{{item.address}}</view>
					</view>
					<view class="reserve-btn">
						<text class="reserve-text">预约</text>
					</view>
				</view>
			</view>
			
			<!-- 空状态 -->
			<view class="empty-state" v-if="filteredScenicSpots.length === 0">
				<text class="empty-text">暂无景点数据</text>
				<text class="empty-tip">可以通过"关于"页面反馈添加景点</text>
			</view>
		</view>
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
			// 本地示例数据，当云函数不可用时使用
			localScenicSpots: [
				{
					id: 1,
					name: '故宫博物院',
					city: 'beijing',
					reservationTime: '每日8:30开放预约',
					address: '北京市东城区景山前街4号',
					shortLink: '#小程序://故宫博物院/xxxxx'
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
					shortLink: '#小程序://上海博物馆/xxxxx'
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
			// 使用云数据或本地数据
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
		// 页面加载时初始化
		this.initPage()
	},
	methods: {
		async initPage() {
			// 恢复上次选择的城市 (H5环境简化处理)
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
			
			// 加载景点数据
			await this.loadScenicSpots()
		},
		
		async loadScenicSpots() {
			this.loading = true
			try {
				// H5环境直接使用本地数据
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
			// 从城市选择页面返回时调用
			const index = this.cityList.findIndex(c => c.code === city.code)
			if (index !== -1) {
				this.cityIndex = index
			} else {
				// 如果选择的城市不在默认列表中，添加到列表
				this.cityList.push(city)
				this.cityIndex = this.cityList.length - 1
			}
			
			// 保存选择的城市 (H5环境简化处理)
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
			
			// 跳转到其他小程序
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
			// H5环境下模拟跳转效果
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
.container {
	background-color: #f5f5f5;
	min-height: 100vh;
}

.header {
	background-color: #fff;
	border-bottom: 1rpx solid #f0f0f0;
}

.nav-bar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 88rpx;
	padding: 0 40rpx;
}

.nav-left {
	
}

.app-title {
	font-size: 36rpx;
	color: #333;
	font-weight: bold;
}

.nav-right {
	display: flex;
	align-items: center;
	padding: 12rpx 24rpx;
	background-color: #f8f8f8;
	border-radius: 50rpx;
}

.city-name {
	font-size: 26rpx;
	color: #333;
	font-weight: 500;
}

.city-arrow {
	font-size: 20rpx;
	color: #666;
	margin-left: 8rpx;
}

.search-section {
	padding: 20rpx 40rpx 30rpx;
}

.search-box {
	display: flex;
	align-items: center;
	background-color: #f8f8f8;
	border-radius: 50rpx;
	padding: 20rpx 30rpx;
}

.search-icon {
	font-size: 28rpx;
	color: #999;
	margin-right: 20rpx;
}

.search-input {
	flex: 1;
	font-size: 28rpx;
	color: #333;
	border: none;
	outline: none;
	background: transparent;
}

.content {
	padding: 30rpx 40rpx;
}

.scenic-list {
	
}

.scenic-item {
	display: flex;
	align-items: center;
	background-color: #fff;
	border-radius: 16rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

.scenic-logo {
	width: 80rpx;
	height: 80rpx;
	background: linear-gradient(135deg, #3cc51f, #2aa515);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 30rpx;
}

.logo-text {
	font-size: 32rpx;
	color: #fff;
	font-weight: bold;
}

.scenic-info {
	flex: 1;
}

.scenic-name {
	font-size: 32rpx;
	color: #333;
	font-weight: 500;
	margin-bottom: 10rpx;
}

.scenic-time {
	font-size: 24rpx;
	color: #3cc51f;
	margin-bottom: 8rpx;
}

.scenic-address {
	font-size: 24rpx;
	color: #999;
	line-height: 1.4;
}

.reserve-btn {
	padding: 15rpx 30rpx;
	background-color: #3cc51f;
	border-radius: 50rpx;
}

.reserve-text {
	font-size: 26rpx;
	color: #fff;
	font-weight: 500;
}

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 100rpx 40rpx;
}

.empty-text {
	font-size: 32rpx;
	color: #999;
	margin-bottom: 20rpx;
}

.empty-tip {
	font-size: 26rpx;
	color: #ccc;
	text-align: center;
}
</style>