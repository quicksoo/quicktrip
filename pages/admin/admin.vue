<template>
	<view class="admin-container">
		<!-- 头部区域 -->
		<view class="header">
			<text class="title">管理后台</text>
			<button class="back-btn" @tap="goBack">返回</button>
		</view>

		<!-- 城市选择和添加按钮 -->
		<view class="control-section">
			<view class="city-selector" @tap="goToCitySelect">
				<text class="city-name">{{currentCity.name}}</text>
				<text class="city-arrow">▼</text>
			</view>
			<button class="add-btn" @tap="showAddModal">+ 添加景点</button>
		</view>

		<!-- 景点列表 -->
		<view class="list-section">
			<view class="spot-item" v-for="item in filteredScenicSpots" :key="item._id">
				<view class="spot-info">
					<text class="spot-name">{{item.name}}</text>
					<view class="price-city">
						<text class="city">{{getCityName(item.city)}}</text>
						<text class="price">{{ item.price > 0 ? `¥${item.price}` : '免费' }}</text>
					</view>
					<text class="description">{{item.reservationTime}}</text>
				</view>
				<view class="spot-actions">
					<button class="edit-btn" @tap="editSpot(item)">编辑</button>
					<button class="delete-btn" @tap="deleteSpot(item)">删除</button>
				</view>
			</view>

			<view v-if="!filteredScenicSpots.length" class="empty-list">
				<text v-if="!scenicSpots.length">📌 暂无景点，请先添加</text>
				<text v-else>📍 {{currentCity.name}}暂无景点数据</text>
			</view>
		</view>

		<!-- 底部弹框 -->
		<view v-if="showModal" class="bottom-sheet-overlay" @tap="handleOverlayClick">
			<view class="bottom-sheet" :class="{ 'show': showModal }" @tap.stop>
				<!-- 拖拽指示器 -->
				<view class="drag-indicator"></view>
				
				<view class="sheet-header">
					<text class="sheet-title">{{isEdit ? '编辑景点' : '添加景点'}}</text>
					<button @tap="closeModal" class="close-btn">×</button>
				</view>
				
				<scroll-view class="sheet-content" scroll-y="true" enhanced="true" show-scrollbar="false">
					<view class="form">
						<view class="field">
							<text class="label">景点名称 *</text>
							<input v-model="formData.name" placeholder="请输入景点名称" class="input" />
						</view>
						
						<view class="field">
							<text class="label">排序序号</text>
							<input v-model="formData.sort" type="number" min="0" placeholder="数字越小排序越靠前" class="input" />
						</view>
						
						<view class="field">
							<text class="label">预约时间</text>
							<input v-model="formData.reservationTime" placeholder="如：提前7天预约" class="input" />
						</view>
						
						<view class="field">
							<text class="label">门票价格</text>
							<input v-model="formData.price" type="number" min="0" step="0.01" placeholder="0表示免费" class="input" />
						</view>
						
						<view class="field">
							<text class="label">小程序链接 *</text>
							<textarea v-model="formData.shortLink" placeholder="小程序链接/公众号链接二选一" class="textarea"></textarea>
						</view>
						
						<view class="field">
							<text class="label">公众号预约链接 *</text>
							<textarea v-model="formData.bookUrl" placeholder="请输入完整的预约链接（需以 http 开头）" class="textarea"></textarea>
						</view>
						
						
						
						<view class="field">
							<text class="label">公众号名称</text>
							<input v-model="formData.wechatAccount" placeholder="可选" class="input" />
						</view>
						
						<!-- 按钮区域 -->
						<view class="form-buttons">
							<button class="cancel-btn" :disabled="saving" @tap="closeModal">取消</button>
							<button class="confirm-btn" :disabled="saving" @tap="saveSpot">{{ saving ? '保存中...' : (isEdit ? '更新' : '添加') }}</button>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			scenicSpots: [],
			showModal: false,
			isEdit: false,
			currentEditId: '',
			currentSelectedCity: { name: '北京', code: 'beijing' }, // 当前选中的城市
			loading: false,
			saving: false,
			formData: {
				name: '',
				city: 'beijing',
				reservationTime: '',
				price: 0,
				bookUrl: '',
				shortLink: '',
				wechatAccount: '',
				sort: 0
			}
		}
	},
	computed: {
		currentCity() {
			return this.currentSelectedCity
		},
		filteredScenicSpots() {
			return this.scenicSpots
		}
	},
	onLoad() {
		this.initPage()
	},
	onShow() {
		// 从城市选择页面返回时更新城市
		this.checkCityUpdate()
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

		checkCityUpdate() {
			try {
				const lastCity = uni.getStorageSync('last_selected_city')
				if (lastCity) {
					const cityData = JSON.parse(lastCity)
					if (cityData.code !== this.currentSelectedCity.code) {
						this.currentSelectedCity = cityData
					}
				}
			} catch (e) {
				console.log('检查城市更新失败:', e)
			}
		},

		goToCitySelect() {
			uni.navigateTo({
				url: `/pages/city/city?current=${this.currentCity.code}`
			})
		},

		// 城市选择回调方法
		onCitySelected(city) {
			// 直接设置当前选中的城市
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

		goBack() {
			uni.navigateBack()
		},

		// 从云端加载景点
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
				console.error('加载失败:', error)
				uni.showToast({ title: '加载失败', icon: 'none' })
			} finally {
				this.loading = false
			}
		},

		getCityName(cityCode) {
			// 简单返回城市代码，或者可以维护一个城市代码到名称的映射
			return cityCode
		},

		showAddModal() {
			this.isEdit = false
			this.currentEditId = ''
			this.resetForm()
			// 设置城市为当前选择的城市
			this.formData.city = this.currentCity.code
			this.showModal = true
			// 阻止页面滚动
			this.disablePageScroll()
		},

		editSpot(spot) {
			this.isEdit = true
			this.currentEditId = spot._id || ''
			// 只回填表单字段
			this.formData = {
				name: spot.name || '',
				city: spot.city || 'beijing',
				reservationTime: spot.reservationTime || '',
				price: spot.price != null ? spot.price : 0,
				bookUrl: spot.bookUrl || '',
				shortLink: spot.shortLink || '',
				wechatAccount: spot.wechatAccount || '',
				sort: spot.sort != null ? spot.sort : 0
			}
			this.showModal = true
			// 阻止页面滚动
			this.disablePageScroll()
		},

		async deleteSpot(spot) {
			const res = await uni.showModal({
				title: '确认删除',
				content: `确定要删除"${spot.name}"吗？`
			})

			if (res.confirm) {
				try {
					uni.showLoading({ title: '删除中' })
					const db = wx.cloud.database()
					await db.collection('scenic_spots').doc(spot._id).remove()
					uni.showToast({ title: '删除成功' })
					this.loadScenicSpots()
				} catch (error) {
					console.error('删除失败', error)
					uni.showToast({ title: '删除失败', icon: 'none' })
				} finally {
					uni.hideLoading()
				}
			}
		},

		closeModal() {
			if (this.saving) return
			this.showModal = false
			this.resetForm()
			// 恢复页面滚动
			this.enablePageScroll()
		},

		// 禁用页面滚动
		disablePageScroll() {
			// #ifdef H5
			document.body.style.overflow = 'hidden'
			// #endif
			// #ifdef APP-PLUS || MP-WEIXIN
			uni.pageScrollTo({
				scrollTop: 0,
				duration: 0
			})
			// #endif
		},

		// 启用页面滚动
		enablePageScroll() {
			// #ifdef H5
			document.body.style.overflow = 'auto'
			// #endif
		},

		resetForm() {
			this.formData = {
				name: '',
				city: this.currentCity.code,
				reservationTime: '',
				price: 0,
				bookUrl: '',
				shortLink: '',
				wechatAccount: '',
				sort: 0
			}
		},

		handleOverlayClick(e) {
			// 点击遮罩层才关闭，且不在保存中
			if (e.target.classList.contains('bottom-sheet-overlay') && !this.saving) {
				this.closeModal()
			}
		},

		// 保存（添加/更新）
		async saveSpot() {
			if (this.saving) return

			// 校验
			if (!this.formData.name.trim()) {
				uni.showToast({ title: '请输入景点名称', icon: 'none' })
				return
			}
			if (!this.formData.bookUrl && !this.formData.shortLink) {
				uni.showToast({ title: '请输入预约链接', icon: 'none' })
				return
			}

			this.saving = true
			try {
				uni.showLoading({ title: this.isEdit ? '更新中' : '添加中' })
				const db = wx.cloud.database()

				// 构造要保存的对象
				const payload = {
					name: String(this.formData.name).trim(),
					city: this.formData.city || 'beijing',
					reservationTime: String(this.formData.reservationTime || '').trim(),
					price: Number(this.formData.price) || 0,
					bookUrl: String(this.formData.bookUrl).trim(),
					shortLink: String(this.formData.shortLink || '').trim(),
					wechatAccount: String(this.formData.wechatAccount || '').trim(),
					sort: Number(this.formData.sort) || 0,
					updatedAt: Date.now()
				}

				// 价格非负校验
				if (isNaN(payload.price) || payload.price < 0) {
					uni.showToast({ title: '价格不能为负数', icon: 'none' })
					return
				}

				if (this.isEdit && this.currentEditId) {
					await db.collection('scenic_spots').doc(this.currentEditId).update({ data: payload })
					uni.showToast({ title: '更新成功' })
				} else {
					payload.createdAt = Date.now()
					await db.collection('scenic_spots').add({ data: payload })
					uni.showToast({ title: '添加成功' })
				}

				// 成功后自动关闭弹窗并刷新列表
				this.showModal = false
				this.resetForm()
				this.enablePageScroll()
				this.loadScenicSpots()
			} catch (error) {
				console.error('保存失败', error)
				uni.showToast({ title: '保存失败', icon: 'none' })
			} finally {
				this.saving = false
				uni.hideLoading()
			}
		}
	}
}
</script>

<style scoped>
.admin-container {
	padding: 20rpx;
	min-height: 100vh;
	background: #f5f5f5;
	position: relative;
}

/* header */
.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx;
	background: linear-gradient(90deg, #6a5acd, #8e44ad);
	border-radius: 10rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.03);
}

.title {
	font-size: 36rpx;
	font-weight: bold;
	color: white;
}

.back-btn {
	background: none;
	color: white;
	border: none;
	padding: 10rpx 20rpx;
	border-radius: 5rpx;
	font-size: 28rpx;
}

/* 控制区域 */
.control-section {
	margin-bottom: 20rpx;
	display: flex;
	gap: 16rpx;
	align-items: stretch;
}

.city-selector {
	display: flex;
	align-items: center;
	padding: 0 24rpx;
	height: 88rpx;
	background: linear-gradient(90deg, #6a5acd, #8e44ad);
	border-radius: 16rpx;
	box-shadow: 0 4rpx 12rpx rgba(106, 90, 205, 0.15);
	flex: 1;
	min-width: 0;
}

.city-name {
	color: white;
	font-size: 30rpx;
	font-weight: 600;
	flex: 1;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.city-arrow {
	color: white;
	font-size: 24rpx;
	margin-left: 12rpx;
	opacity: 0.8;
}

.add-btn {
	background: linear-gradient(90deg, #6a5acd, #8e44ad);
	color: white;
	border: none;
	padding: 0 32rpx;
	height: 88rpx;
	border-radius: 16rpx;
	font-size: 30rpx;
	box-shadow: 0 4rpx 12rpx rgba(106, 90, 205, 0.15);
	font-weight: 600;
	white-space: nowrap;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.2s ease;
}

.add-btn:active {
	transform: scale(0.98);
	box-shadow: 0 2rpx 8rpx rgba(106, 90, 205, 0.2);
}

/* list */
.list-section {
	background: #fff;
	border-radius: 10rpx;
	padding: 10rpx 20rpx;
}

.spot-item {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	padding: 20rpx;
	border-bottom: 1rpx solid #eee;
	background: #fff;
	border-radius: 10rpx;
	margin-bottom: 10rpx;
}

.spot-item:last-child {
	border-bottom: none;
}

.spot-info {
	flex: 1;
}

.spot-name {
	font-size: 32rpx;
	font-weight: bold;
	margin-bottom: 10rpx;
	color: #333;
}

.price-city {
	display: flex;
	align-items: center;
	margin-bottom: 10rpx;
}

.city {
	background: #e6e6fa;
	padding: 5rpx 10rpx;
	border-radius: 5rpx;
	font-size: 24rpx;
	color: #6a5acd;
	margin-right: 10rpx;
}

.price {
	background: #ffcccc;
	padding: 5rpx 10rpx;
	border-radius: 5rpx;
	font-size: 24rpx;
	color: #cc0000;
}

.description {
	font-size: 24rpx;
	color: #666;
	margin-bottom: 10rpx;
}

.book-url {
	font-size: 24rpx;
	color: #999;
}

.spot-actions {
	display: flex;
	flex-direction: column;
	gap: 10rpx;
}

.edit-btn, .delete-btn {
	padding: 10rpx 20rpx;
	border: none;
	border-radius: 5rpx;
	font-size: 24rpx;
	width: 100rpx;
}

.edit-btn {
	background: #6a5acd;
	color: white;
}

.delete-btn {
	background: #cc0000;
	color: white;
}

.empty-list {
	padding: 80rpx 0;
	text-align: center;
	color: #999;
	font-size: 28rpx;
	background: #fafafa;
	border-radius: 10rpx;
	margin-top: 20rpx;
}

/* 底部弹框 */
.bottom-sheet-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0,0,0,0.5);
	z-index: 9999;
	opacity: 0;
	animation: overlayFadeIn 0.3s ease-out forwards;
}

@keyframes overlayFadeIn {
	to {
		opacity: 1;
	}
}

.bottom-sheet {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	background: white;
	border-radius: 24rpx 24rpx 0 0;
	max-height: 80vh;
	display: flex;
	flex-direction: column;
	box-shadow: 0 -10rpx 30rpx rgba(0,0,0,0.2);
	transform: translateY(100%);
	transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
	overflow: hidden;
}

.bottom-sheet.show {
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

/* #ifdef H5 */
.close-btn:hover {
	color: #333;
	background: #e8e8e8;
}
/* #endif */

.sheet-content {
	flex: 1;
	min-height: 0;
	max-height: calc(80vh - 200rpx);
}

.form {
	padding: 30rpx 30rpx 40rpx;
}

.field {
	margin-bottom: 32rpx;
}

.field:last-child {
	margin-bottom: 0;
}

.label {
	display: block;
	margin-bottom: 16rpx;
	font-size: 30rpx;
	color: #333;
	font-weight: 600;
}

.input, .textarea {
	width: 100%;
	height: 88rpx;
	padding: 0 24rpx;
	border: 2rpx solid #e5e5e5;
	border-radius: 16rpx;
	font-size: 30rpx;
	box-sizing: border-box;
	background: #fff;
	color: #333;
	line-height: 88rpx;
	transition: all 0.3s ease;
}

.input:focus, .textarea:focus {
	border-color: #6a5acd;
	outline: none;
	background: #fff;
	box-shadow: 0 0 0 4rpx rgba(106, 90, 205, 0.1);
}

.textarea {
	height: 140rpx;
	line-height: 1.5;
	padding: 24rpx;
	resize: none;
}

.picker {
	width: 100%;
	height: 88rpx;
	padding: 0 24rpx;
	border: 2rpx solid #e5e5e5;
	border-radius: 16rpx;
	font-size: 30rpx;
	background: #fff;
	color: #333;
	display: flex;
	align-items: center;
	justify-content: space-between;
	box-sizing: border-box;
	transition: all 0.3s ease;
}

.picker:active {
	border-color: #6a5acd;
	background: #f8f9ff;
}

.form-buttons {
	display: flex;
	gap: 24rpx;
	margin-top: 48rpx;
	padding-top: 32rpx;
	border-top: 2rpx solid #f0f0f0;
}

.cancel-btn, .confirm-btn {
	flex: 1;
	height: 88rpx;
	border: none;
	border-radius: 16rpx;
	font-size: 32rpx;
	font-weight: 600;
	transition: all 0.3s ease;
	display: flex;
	align-items: center;
	justify-content: center;
}

.cancel-btn {
	background: #f5f5f5;
	color: #666;
	border: 2rpx solid #e5e5e5;
}

.cancel-btn:active {
	background: #e8e8e8;
}

.confirm-btn {
	background: linear-gradient(135deg, #6a5acd, #8e44ad);
	color: white;
	box-shadow: 0 4rpx 12rpx rgba(106, 90, 205, 0.3);
}

.confirm-btn:active {
	transform: translateY(1rpx);
	box-shadow: 0 2rpx 8rpx rgba(106, 90, 205, 0.3);
}

.cancel-btn:disabled, .confirm-btn:disabled {
	opacity: 0.5;
	transform: none;
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

/* 响应式设计 */
@media (max-width: 768px) {
	.bottom-sheet {
		max-height: 90vh;
	}
	
	.form {
		padding: 20rpx;
		padding-bottom: calc(40rpx + env(safe-area-inset-bottom));
	}
	
	.sheet-header {
		padding: 15rpx 20rpx;
	}
}

/* 键盘弹起时的适配 */
@media (max-height: 600px) {
	.bottom-sheet {
		max-height: 95vh;
	}
}
</style>