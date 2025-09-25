<template>
	<view class="feedback-container">
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
					<view class="header-icon">💬</view>
					<view class="header-text">
						<text class="form-title">用户反馈</text>
						<text class="form-subtitle">请填写您想要添加的景点信息</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 表单区域 -->
		<view class="form-section">
			<view class="form-card">
				<view class="card-bg-pattern"></view>
				<view class="form-header">
					<view class="form-icon">📍</view>
					<text class="form-section-label">选择城市：</text>
			
					<view class="location-selector" @tap="goToCitySelect">
						<view class="location-pill">
							<text class="location-name">{{currentCity.name}}</text>
							<text class="location-chevron">›</text>
						</view>
					</view>

				</view>
				
				
			</view>
			
			<view class="form-card">
				<view class="card-bg-pattern"></view>
				<view class="form-header">
					<view class="form-icon">🏙️</view>
					<text class="form-section-title">景点信息</text>
				</view>
				
				<view class="form-item">
					<view class="label">
						<text class="label-text">景点名称</text>
						<text class="required">*</text>
					</view>
					<view class="input-wrapper">
						<input 
							class="input" 
							v-model="scenicSpotName" 
							placeholder="请输入景点名称"
							placeholder-style="color: #a0aec0"
						/>
					</view>
				</view>
				
				<view class="form-item">
					<view class="label">
						<text class="label-text">景点地址</text>
						<text class="optional">（可选）</text>
					</view>
					<view class="input-wrapper">
						<input 
							class="input" 
							v-model="scenicSpotAddress" 
							placeholder="请输入景点详细地址"
							placeholder-style="color: #a0aec0"
						/>
					</view>
				</view>
				
				<view class="form-item">
					<view class="label">
						<text class="label-text">预约入口信息</text>
						<text class="optional">（可选）</text>
					</view>
					<view class="textarea-wrapper">
						<textarea 
							class="textarea" 
							v-model="reservationInfo" 
							placeholder="请提供景点预约入口信息，如小程序名称、官网链接等"
							placeholder-style="color: #a0aec0"
						/>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 提交按钮 -->
		<view class="submit-section">
			<view class="submit-wrapper">
				<button class="submit-btn" @tap="submitFeedback" :disabled="!canSubmit" :class="{'active': canSubmit}">
					<text class="submit-text">提交反馈</text>
					<view class="submit-glow" v-if="canSubmit"></view>
				</button>
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
			cities: [],
			provinceIndex: 0,
			cityIndex: 0,
			selectedProvince: '',
			selectedCity: '',
			currentSelectedCity: { name: '北京', code: 'beijing' }, 
			scenicSpotName: '',
			scenicSpotAddress: '',
			reservationInfo: ''
		}
	},
	computed: {
		canSubmit() {
			return this.currentSelectedCity && this.scenicSpotName.trim()
		},
		currentCity() {
			return this.currentSelectedCity
		},
	},
	methods: {
		goBack() {
			uni.navigateBack()
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
		},

		async submitFeedback() {
			if (!this.canSubmit) {
				uni.showToast({
					title: '请填写必要信息',
					icon: 'none'
				})
				return
			}
			
			uni.showLoading({
				title: '提交中...'
			})
			
			try {
				const feedbackData = {
					province: this.selectedProvince,
					city: this.selectedCity,
					scenicSpotName: this.scenicSpotName.trim(),
					scenicSpotAddress: this.scenicSpotAddress.trim(),
					reservationInfo: this.reservationInfo.trim()
				}
				
				// H5环境模拟提交
				console.log('模拟提交反馈:', feedbackData)
				await new Promise(resolve => setTimeout(resolve, 1000))
				
				uni.hideLoading()
				uni.showToast({
					title: '提交成功',
					icon: 'success'
				})
				
				// 清空表单
				this.resetForm()
				
				// 延迟返回上一页
				setTimeout(() => {
					uni.navigateBack()
				}, 1500)
				
			} catch (error) {
				uni.hideLoading()
				uni.showToast({
					title: error.message || '提交失败，请重试',
					icon: 'none'
				})
			}
		},
		
		resetForm() {
			this.selectedProvince = ''
			this.selectedCity = ''
			this.scenicSpotName = ''
			this.scenicSpotAddress = ''
			this.reservationInfo = ''
			this.provinceIndex = 0
			this.cityIndex = 0
			this.cities = []
		}
	}
}
</script>

<style scoped>
/* ==================== 基础容器 ==================== */
.feedback-container {
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

/* 背景色区域（底层橙色）*/
.header-bg {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 300rpx; /* 提高高度以容纳内容 */
	background: linear-gradient(135deg, #f6d55c 0%, #ed8936 100%);
	border-radius: 0 0 38rpx 38rpx;
	box-shadow: 0 10rpx 40rpx rgba(237, 137, 54, 0.22);
	z-index: 1;
}

/* 内容放在背景之上 */
.header-content {
	position: relative;
	z-index: 2;
	/* 将 padding-top 调整为合适的高度，避免把内容压在背景之外 */
	padding-top: calc(40rpx + env(safe-area-inset-top));
	padding-left: 24rpx;
	padding-right: 24rpx;
}

/* 顶部导航 */
.nav-bar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 88rpx;
	/* 使用与 header-content 一致的内边距，不要重复大幅偏移 */
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

/* 返回按钮 */
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

/* 头部信息（图标 + 文案） */
.header-info {
	display: flex;
	align-items: center;
	gap: 18rpx;
	/* 使 header-info 距离 nav-bar 有一个适当 margin */
	margin-top: 6rpx;
	padding-bottom: 18rpx;
}

/* 大图标 */
.header-icon {
	font-size: 44rpx;
	margin-right: 10rpx;
}

/* 标题与副标题容器 */
.header-text {
	display: flex;
	flex-direction: column;
}

/* 标题大小略微缩小，防止在小屏设备换行 */
.form-title {
	font-size: 36rpx;
	font-weight: 800;
	color: #ffffff;
	text-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.12);
	letter-spacing: -0.5rpx;
	margin-bottom: 6rpx;
}

.form-subtitle {
	font-size: 22rpx;
	color: rgba(255, 255, 255, 0.95);
	font-weight: 500;
	letter-spacing: 0.3rpx;
}

/* ==================== 表单区域 ==================== */
.form-section {
	padding: 40rpx 28rpx 60rpx;
}

/* 卡片样式 */
.form-card {
	position: relative;
	background: #ffffff;
	border-radius: 24rpx;
	padding: 48rpx; /* 原32rpx → 48rpx，内部更宽松 */
	margin-bottom: 44rpx; /* 原28rpx → 44rpx，卡片之间更分明 */
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
	background: radial-gradient(circle, rgba(246, 213, 92, 0.08) 0%, transparent 70%);
	border-radius: 50%;
	transform: translate(40rpx, -40rpx);
	opacity: 0.9;
}

/* 卡片头部 */
.form-header {
	display: flex;
	align-items: center;
	margin-bottom: 24rpx;
	position: relative;
	z-index: 2;
}

.form-icon {
	font-size: 30rpx;
	margin-right: 12rpx;
}

.form-section-title {
	font-size: 26rpx;
	font-weight: 700;
	color: #2d3748;
}

/* 表单项 */
.form-item {
	margin-bottom: 24rpx;
	position: relative;
	z-index: 2;
}

.form-item:last-child {
	margin-bottom: 0;
}

.label {
	display: flex;
	align-items: center;
	margin-bottom: 12rpx;
}

.label-text {
	font-size: 26rpx;
	color: #2d3748;
	font-weight: 600;
}

.required {
	font-size: 22rpx;
	color: #e53e3e;
	margin-left: 6rpx;
}

.optional {
	font-size: 22rpx;
	color: #718096;
	margin-left: 6rpx;
}

/* ==================== 选择器样式 ==================== */
.picker {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 18rpx 16rpx;
	background: #f7fafc;
	border-radius: 14rpx;
	border: 1rpx solid rgba(0,0,0,0.02);
	transition: all 0.18s ease;
}

.picker:active {
	border-color: #4299e1;
	background: #ebf8ff;
}

.picker.disabled {
	opacity: 0.6;
	background: #edf2f7;
}

.picker-text {
	font-size: 26rpx;
	color: #2d3748;
	font-weight: 500;
}

.picker-text.placeholder {
	color: #a0aec0;
}

.picker-arrow {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 32rpx;
	height: 32rpx;
	background: rgba(66, 153, 225, 0.08);
	border-radius: 50%;
	border: 1rpx solid rgba(66, 153, 225, 0.12);
}

.arrow-icon {
	font-size: 18rpx;
	color: #4299e1;
	font-weight: 600;
}

/* ==================== 输入框样式 ==================== */
.input-wrapper,
.textarea-wrapper {
	background: #f7fafc;
	border-radius: 14rpx;
	border: 1rpx solid rgba(0,0,0,0.02);
	transition: all 0.18s ease;
}

.input-wrapper:focus-within,
.textarea-wrapper:focus-within {
	border-color: #4299e1;
	background: #ebf8ff;
	box-shadow: 0 0 0 4rpx rgba(66, 153, 225, 0.06);
}

.input {
	width: 100%;
	padding: 18rpx 16rpx;
	font-size: 26rpx;
	color: #2d3748;
	border: none;
	outline: none;
	background: transparent;
	font-weight: 500;
}

.textarea {
	width: 100%;
	min-height: 110rpx;
	padding: 18rpx 16rpx;
	font-size: 26rpx;
	color: #2d3748;
	border: none;
	outline: none;
	background: transparent;
	resize: none;
	font-weight: 500;
	line-height: 1.5;
}

/* ==================== 提交按钮 ==================== */
.submit-section {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 100;
}

.submit-wrapper {
	padding: 22rpx 24rpx;
	background: rgba(255, 255, 255, 0.95);
	backdrop-filter: blur(10rpx);
	border-top: 1rpx solid rgba(255, 255, 255, 0.6);
	box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.06);
}

.submit-btn {
	position: relative;
	width: 100%;
	height: 84rpx;
	background: #cbd5e0;
	border: none;
	border-radius: 44rpx;
	font-size: 30rpx;
	font-weight: 600;
	transition: all 0.22s ease;
	overflow: hidden;
}

.submit-btn.active {
	background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
	box-shadow: 0 8rpx 28rpx rgba(66, 153, 225, 0.32);
}

.submit-btn:active.active {
	transform: translateY(2rpx);
	box-shadow: 0 4rpx 16rpx rgba(66, 153, 225, 0.5);
}

.submit-text {
	color: #a0aec0;
	position: relative;
	z-index: 2;
	font-size: 28rpx;
}

.submit-btn.active .submit-text {
	color: #ffffff;
}

.submit-glow {
	position: absolute;
	inset: -4rpx;
	background: linear-gradient(135deg, #4299e1, #3182ce);
	border-radius: 48rpx;
	opacity: 0.22;
	filter: blur(8rpx);
	z-index: 1;
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
