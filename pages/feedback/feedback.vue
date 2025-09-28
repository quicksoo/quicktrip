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
						<text class="form-title">建议反馈</text>
						<text class="form-subtitle">您的宝贵意见是我们前进的动力</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 表单区域 -->
		<view class="form-section">
			<view class="form-card">
				<view class="card-bg-pattern"></view>
				<view class="form-header">
					<view class="form-icon">✍️</view>
					<text class="form-section-title" @tap="onTitleClick">意见建议</text>
				</view>
				
				<view class="form-item">
					<view class="label">
						<text class="label-text">您的建议</text>
						<text class="required">*</text>
					</view>
					<view class="textarea-wrapper">
						<textarea 
							class="textarea" 
							v-model="content" 
							placeholder="请输入您的宝贵建议或意见，我们会认真对待每一条反馈..."
							placeholder-style="color: #a0aec0"
							maxlength="500"
						/>
					</view>
					<view class="char-count">{{content.length}}/500</view>
				</view>
			</view>
		</view>
		
		<!-- 提交按钮 -->
		<view class="submit-section">
			<view class="submit-wrapper">
				<button class="submit-btn" @tap="submitFeedback" :disabled="!canSubmit || submitting" :class="{'active': canSubmit && !submitting}">
					<text class="submit-text">{{ submitting ? '提交中...' : '提交建议' }}</text>
					<view class="submit-glow" v-if="canSubmit && !submitting"></view>
				</button>
			</view>
		</view>
		
		<!-- 成功提示 -->
		<view class="success-overlay" v-if="showSuccess" @tap="hideSuccess">
			<view class="success-modal">
				<view class="success-icon">✓</view>
				<text class="success-title">提交成功</text>
				<text class="success-message">感谢您的宝贵建议，我们会认真考虑！</text>
				<button class="success-btn" @tap="hideSuccess">确定</button>
			</view>
		</view>

		<!-- 反馈列表底部弹窗 -->
		<view v-if="showFeedbackList" class="feedback-overlay" data-overlay="feedback" @tap="handleOverlayClick">
			<view class="feedback-sheet" @tap.stop>
				<!-- 拖拽指示器 -->
				<view class="drag-indicator"></view>
				
				<view class="sheet-header">
					<text class="sheet-title">用户反馈 ({{feedbackList.length}}条)</text>
					<button @tap="closeFeedbackList" class="close-btn">×</button>
				</view>
				
				<scroll-view class="sheet-content" scroll-y="true" enhanced="true" show-scrollbar="false">
					<view class="feedback-list">
						<view class="feedback-item" v-for="(item, index) in feedbackList" :key="item._id">
							<view class="feedback-header">
								<text class="feedback-index">#{{index + 1}}</text>
								<text class="feedback-time">{{formatTime(item.createdAt)}}</text>
							</view>
							<view class="feedback-content">
								<text>{{item.content}}</text>
							</view>
						</view>
						
						<view v-if="!feedbackList.length" class="empty-feedback">
							<text class="empty-icon">📝</text>
							<text class="empty-text">暂无用户反馈</text>
						</view>
					</view>
				</scroll-view>
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
			content: '',
			submitting: false,
			showSuccess: false,
			clickCount: 0,
			clickTimer: null,
			showFeedbackList: false,
			feedbackList: []
		}
	},
	computed: {
		canSubmit() {
			return this.content.trim().length > 0
		}
	},
	onLoad() {
		// 确保弹窗初始状态为关闭
		this.showFeedbackList = false
		console.log('页面加载，弹窗状态:', this.showFeedbackList)
	},
	onShow() {
		// 每次显示页面时重置弹窗状态
		this.showFeedbackList = false
		console.log('页面显示，弹窗状态:', this.showFeedbackList)
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},

		async submitFeedback() {
			if (!this.canSubmit || this.submitting) {
				return
			}
			
			if (this.content.trim().length < 5) {
				uni.showToast({
					title: '请输入至少5个字符的建议',
					icon: 'none'
				})
				return
			}
			
			this.submitting = true
			
			try {
				// 提交到微信云数据库
				const db = wx.cloud.database()
				await db.collection('feedback').add({
					data: {
						content: this.content.trim(),
						createdAt: Date.now(),
						userInfo: {
							timestamp: new Date().toISOString()
						}
					}
				})
				
				// 显示成功提示
				this.showSuccess = true
				
				// 清空表单
				this.content = ''
				
			} catch (error) {
				console.error('提交反馈失败:', error)
				uni.showToast({
					title: '提交失败，请重试',
					icon: 'none'
				})
			} finally {
				this.submitting = false
			}
		},
		
		hideSuccess() {
			this.showSuccess = false
			// 延迟返回上一页
			setTimeout(() => {
				uni.navigateBack()
			}, 300)
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
				console.log('触发查看反馈功能')
				this.clickCount = 0
				this.viewUserFeedbacks()
			}
		},

		// 查看用户意见
		async viewUserFeedbacks() {
			console.log('开始查看用户反馈')
			
			uni.showLoading({
				title: '加载中...'
			})
			
			try {
				const db = wx.cloud.database()
				const res = await db.collection('feedback')
					.orderBy('createdAt', 'desc')
					.limit(50)
					.get()
				
				console.log('获取到反馈数据:', res.data)
				uni.hideLoading()
				
				// 设置反馈列表数据
				this.feedbackList = res.data || []
				
				// 显示底部弹窗
				this.showFeedbackList = true
				console.log('弹窗状态设置为:', this.showFeedbackList)
				
			} catch (error) {
				uni.hideLoading()
				console.error('获取反馈失败:', error)
				uni.showToast({
					title: '获取反馈失败',
					icon: 'none'
				})
			}
		},

		// 关闭反馈列表
		closeFeedbackList() {
			this.showFeedbackList = false
			console.log('手动关闭弹窗，状态:', this.showFeedbackList)
		},

		// 处理遮罩层点击
		handleOverlayClick(e) {
			// 小程序环境兼容处理
			const target = e.target || e.currentTarget
			if (target && (target.dataset && target.dataset.overlay === 'feedback')) {
				this.closeFeedbackList()
			}
		},

		// 格式化时间
		formatTime(timestamp) {
			const date = new Date(timestamp)
			const year = date.getFullYear()
			const month = String(date.getMonth() + 1).padStart(2, '0')
			const day = String(date.getDate()).padStart(2, '0')
			const hours = String(date.getHours()).padStart(2, '0')
			const minutes = String(date.getMinutes()).padStart(2, '0')
			
			return `${year}-${month}-${day} ${hours}:${minutes}`
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
	height: 300rpx;
	background: linear-gradient(135deg, #f6d55c 0%, #ed8936 100%);
	border-radius: 0 0 38rpx 38rpx;
	box-shadow: 0 10rpx 40rpx rgba(237, 137, 54, 0.22);
	z-index: 1;
}

/* 内容放在背景之上 */
.header-content {
	position: relative;
	z-index: 2;
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

/* ==================== 输入框样式 ==================== */
.textarea-wrapper {
	background: #f7fafc;
	border-radius: 14rpx;
	border: 1rpx solid rgba(0,0,0,0.02);
	transition: all 0.18s ease;
}

.textarea-wrapper:focus-within {
	border-color: #4299e1;
	background: #ebf8ff;
	box-shadow: 0 0 0 4rpx rgba(66, 153, 225, 0.06);
}

.textarea {
	width: 100%;
	min-height: 200rpx;
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

.char-count {
	font-size: 22rpx;
	color: #a0aec0;
	text-align: right;
	margin-top: 8rpx;
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

/* ==================== 成功提示 ==================== */
.success-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
	animation: fadeIn 0.3s ease;
}

.success-modal {
	background: white;
	border-radius: 24rpx;
	padding: 60rpx 40rpx 40rpx;
	margin: 0 40rpx;
	text-align: center;
	box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.2);
	animation: slideUp 0.3s ease;
}

.success-icon {
	font-size: 80rpx;
	color: #48bb78;
	margin-bottom: 20rpx;
}

.success-title {
	font-size: 32rpx;
	font-weight: 700;
	color: #2d3748;
	margin-bottom: 16rpx;
	display: block;
}

.success-message {
	font-size: 26rpx;
	color: #718096;
	line-height: 1.5;
	margin-bottom: 40rpx;
	display: block;
}

.success-btn {
	background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
	color: white;
	border: none;
	border-radius: 22rpx;
	padding: 16rpx 40rpx;
	font-size: 28rpx;
	font-weight: 600;
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

/* ==================== 动画 ==================== */
@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

@keyframes slideUp {
	from {
		transform: translateY(60rpx);
		opacity: 0;
	}
	to {
		transform: translateY(0);
		opacity: 1;
	}
}

/* ==================== 反馈列表弹窗 ==================== */
.feedback-overlay {
	position: fixed !important;
	top: 0 !important;
	left: 0 !important;
	right: 0 !important;
	bottom: 0 !important;
	background: rgba(0,0,0,0.5) !important;
	z-index: 99999 !important;
	display: flex !important;
	align-items: flex-end !important;
}

.feedback-sheet {
	width: 100% !important;
	background: white !important;
	border-radius: 24rpx 24rpx 0 0 !important;
	max-height: 80vh !important;
	display: flex !important;
	flex-direction: column !important;
	box-shadow: 0 -10rpx 30rpx rgba(0,0,0,0.2) !important;
}

.feedback-sheet.show {
	transform: translateY(0);
}

.drag-indicator {
	width: 80rpx;
	height: 8rpx;
	background: #d0d0d0;
	border-radius: 4rpx;
	margin: 20rpx auto 16rpx;
	flex-shrink: 0;
}

.sheet-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 32rpx 30rpx 24rpx;
	border-bottom: 2rpx solid #f0f0f0;
	flex-shrink: 0;
	background: #fff;
}

.sheet-title {
	font-size: 36rpx;
	font-weight: 700;
	color: #333;
}

.close-btn {
	background: #f5f5f5;
	border: none;
	font-size: 32rpx;
	color: #666;
	padding: 0;
	width: 56rpx;
	height: 56rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	transition: all 0.3s ease;
}

.close-btn:active {
	background: #e8e8e8;
	color: #333;
}

.sheet-content {
	flex: 1;
	min-height: 0;
	max-height: calc(80vh - 200rpx);
}

.feedback-list {
	padding: 20rpx 30rpx 40rpx;
}

.feedback-item {
	background: #f8f9fa;
	border-radius: 16rpx;
	padding: 24rpx;
	margin-bottom: 20rpx;
	border-left: 6rpx solid #4299e1;
}

.feedback-item:last-child {
	margin-bottom: 0;
}

.feedback-header {
	display: flex;
	align-items: center;
	margin-bottom: 16rpx;
	gap: 16rpx;
}

.feedback-index {
	font-size: 24rpx;
	color: #4299e1;
	font-weight: 700;
	background: rgba(66, 153, 225, 0.1);
	padding: 4rpx 12rpx;
	border-radius: 12rpx;
}

.feedback-time {
	font-size: 22rpx;
	color: #718096;
	flex: 1;
}

.feedback-content {
	line-height: 1.6;
}

.feedback-content text {
	font-size: 26rpx;
	color: #2d3748;
	word-break: break-all;
}

.empty-feedback {
	text-align: center;
	padding: 80rpx 0;
}

.empty-icon {
	font-size: 80rpx;
	margin-bottom: 20rpx;
	display: block;
}

.empty-text {
	font-size: 28rpx;
	color: #a0aec0;
}

/* 滚动条样式 */
.sheet-content::-webkit-scrollbar {
	width: 8rpx;
}

.sheet-content::-webkit-scrollbar-thumb {
	background: #ddd;
	border-radius: 4rpx;
}

.sheet-content::-webkit-scrollbar-track {
	background: #f5f5f5;
}
</style>