<template>
	<view class="admin-container">
		<!-- 头部区域 -->
		<view class="header">
			<text class="title">管理后台</text>
			<button class="back-btn" @tap="goBack">返回</button>
		</view>

		<!-- 添加按钮 -->
		<view class="add-section">
			<button class="add-btn" @tap="showAddModal">+ 添加景点</button>
		</view>

		<!-- 景点列表 -->
		<view class="list-section">
			<view class="spot-item" v-for="item in scenicSpots" :key="item._id">
				<view class="spot-info">
					<text class="spot-name">{{item.name}}</text>
					<view class="price-city">
						<text class="city">{{getCityName(item.city)}}</text>
						<text class="price">¥{{item.price || '免费'}}</text>
					</view>
					<text class="description">{{item.reservationTime ? `提前${item.reservationTime}天预约` : '每日开放预约'}}</text>
					<text class="book-url">预约链接: {{item.bookUrl || '暂无'}}</text>
				</view>
				<view class="spot-actions">
					<button class="edit-btn" @tap="editSpot(item)">编辑</button>
					<button class="delete-btn" @tap="deleteSpot(item)">删除</button>
				</view>
			</view>

			<view v-if="!scenicSpots.length" class="empty-list">暂无景点，请先添加</view>
		</view>

		<!-- 简单模态框 -->
		<view v-if="showModal" class="modal-overlay" @tap="closeModal">
			<view class="modal-content" @tap.stop>
				<view class="modal-header">
					<text>{{isEdit ? '编辑景点' : '添加景点'}}</text>
					<button @tap="closeModal" class="close-btn">×</button>
				</view>
				
				<view class="form">
					<view class="field">
						<text class="label">景点名称 *</text>
						<input v-model="formData.name" placeholder="请输入景点名称" class="input" />
					</view>
					
					<view class="field">
						<text class="label">所属城市 *</text>
						<picker @change="onCityChange" :value="cityIndex" :range="cityOptions" range-key="name">
							<view class="picker">{{ cityOptions[cityIndex] ? cityOptions[cityIndex].name + ' ▼' : '选择城市 ▼' }}</view>
						</picker>
					</view>
					
					<view class="field">
						<text class="label">预约时间</text>
						<input v-model="formData.reservationTime" placeholder="如：提前7天预约" class="input" />
					</view>
					
					<view class="field">
						<text class="label">门票价格</text>
						<input v-model="formData.price" type="number" placeholder="0表示免费" class="input" />
					</view>
					
					<view class="field">
						<text class="label">预约链接 *</text>
						<textarea v-model="formData.bookUrl" placeholder="请输入完整的预约链接" class="textarea"></textarea>
					</view>
					
					<view class="field">
						<text class="label">小程序链接</text>
						<textarea v-model="formData.shortLink" placeholder="可选" class="textarea"></textarea>
					</view>
					
					<view class="field">
						<text class="label">公众号名称</text>
						<input v-model="formData.wechatAccount" placeholder="可选" class="input" />
					</view>
				</view>
				
				<view class="modal-footer">
					<button class="cancel-btn" :disabled="saving" @tap="closeModal">取消</button>
					<button class="confirm-btn" :disabled="saving" @tap="saveSpot">{{ saving ? '保存中...' : (isEdit ? '更新' : '添加') }}</button>
				</view>
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
			cityIndex: 0,
			loading: false,
			saving: false,
			cityOptions: [
				{ name: '北京', code: 'beijing' },
				{ name: '上海', code: 'shanghai' },
				{ name: '广州', code: 'guangzhou' },
				{ name: '深圳', code: 'shenzhen' },
				{ name: '杭州', code: 'hangzhou' },
				{ name: '南京', code: 'nanjing' },
				{ name: '西安', code: 'xian' },
				{ name: '成都', code: 'chengdu' }
			],
			formData: {
				name: '',
				city: 'beijing',
				reservationTime: '',
				price: 0,
				bookUrl: '',
				shortLink: '',
				wechatAccount: ''
			}
		}
	},
	onLoad() {
		this.loadScenicSpots()
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},

		// 从云端加载景点（按 createdAt 降序）
		async loadScenicSpots() {
			this.loading = true
			try {
				const db = wx.cloud.database()
				const res = await db.collection('scenic_spots').orderBy('createdAt', 'desc').get()
				this.scenicSpots = res.data || []
			} catch (error) {
				console.error('加载失败:', error)
				uni.showToast({ title: '加载失败', icon: 'none' })
			} finally {
				this.loading = false
			}
		},

		getCityName(cityCode) {
			const city = this.cityOptions.find(c => c.code === cityCode)
			return city ? city.name : cityCode
		},

		showAddModal() {
			this.isEdit = false
			this.currentEditId = ''
			this.resetForm()
			this.showModal = true
			// 防止页面滚动
			document.body.style.overflow = 'hidden'
		},

		editSpot(spot) {
			this.isEdit = true
			this.currentEditId = spot._id || ''
			// 只回填你表单里的字段，避免把 _id 等也放入 formData
			this.formData = {
				name: spot.name || '',
				city: spot.city || 'beijing',
				reservationTime: spot.reservationTime || '',
				price: spot.price != null ? spot.price : 0,
				bookUrl: spot.bookUrl || '',
				shortLink: spot.shortLink || '',
				wechatAccount: spot.wechatAccount || ''
			}
			const idx = this.cityOptions.findIndex(c => c.code === this.formData.city)
			this.cityIndex = idx >= 0 ? idx : 0
			this.showModal = true
			// 防止页面滚动
			document.body.style.overflow = 'hidden'
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
			document.body.style.overflow = 'auto'
		},

		resetForm() {
			this.formData = {
				name: '',
				city: 'beijing',
				reservationTime: '',
				price: 0,
				bookUrl: '',
				shortLink: '',
				wechatAccount: ''
			}
			this.cityIndex = 0
		},

		onCityChange(e) {
			this.cityIndex = e.detail.value
			this.formData.city = this.cityOptions[this.cityIndex].code
		},

		// 保存（添加/更新）
		async saveSpot() {
			if (this.saving) return
			// 基本校验（保留你字段的要求）
			if (!this.formData.name.trim()) {
				uni.showToast({ title: '请输入景点名称', icon: 'none' })
				return
			}
			if (!this.formData.bookUrl || !this.formData.bookUrl.trim()) {
				uni.showToast({ title: '请输入预约链接', icon: 'none' })
				return
			}

			this.saving = true
			try {
				uni.showLoading({ title: this.isEdit ? '更新中' : '添加中' })
				const db = wx.cloud.database()

				// 构造要保存的对象（只包含表单字段）
				const payload = {
					name: String(this.formData.name).trim(),
					city: this.formData.city || 'beijing',
					reservationTime: String(this.formData.reservationTime || '').trim(),
					price: Number(this.formData.price) || 0,
					bookUrl: String(this.formData.bookUrl).trim(),
					shortLink: String(this.formData.shortLink || '').trim(),
					wechatAccount: String(this.formData.wechatAccount || '').trim(),
					updatedAt: Date.now()
				}

				if (this.isEdit && this.currentEditId) {
					// 更新：注意 uniCloud/wx cloud update 接口期望 { data: {...} }
					await db.collection('scenic_spots').doc(this.currentEditId).update({ data: payload })
					uni.showToast({ title: '更新成功' })
				} else {
					// 添加：带上 createdAt
					payload.createdAt = Date.now()
					await db.collection('scenic_spots').add({ data: payload })
					uni.showToast({ title: '添加成功' })
				}

				this.closeModal()
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
	position: relative; /* 确保容器相对定位 */
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

/* add */
.add-section {
	margin-bottom: 20rpx;
}

.add-btn {
	background: linear-gradient(90deg, #6a5acd, #8e44ad);
	color: white;
	border: none;
	padding: 20rpx;
	border-radius: 10rpx;
	width: 100%;
	font-size: 32rpx;
	box-shadow: 0 6rpx 18rpx rgba(11,176,111,0.12);
	font-weight: bold;
	text-align: center;
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
	padding: 40rpx 0;
	text-align: center;
	color: #999;
	font-size: 26rpx;
}

/* modal */
.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0,0,0,0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 9999; /* 确保在最上层 */
}

.modal-content {
	background: white;
	width: 90%;
	max-width: 600rpx;
	max-height: 80vh;
	border-radius: 16rpx;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	box-shadow: 0 10rpx 30rpx rgba(0,0,0,0.3);
	position: relative;
	animation: modalFadeIn 0.3s ease-out;
}

@keyframes modalFadeIn {
	from {
		opacity: 0;
		transform: scale(0.9);
	}
	to {
		opacity: 1;
		transform: scale(1);
	}
}

.modal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx;
	border-bottom: 1rpx solid #eee;
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	background: #f8f9fa;
}

.close-btn {
	background: none;
	border: none;
	font-size: 40rpx;
	color: #999;
	padding: 0;
	width: 40rpx;
	height: 40rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
}

.close-btn:hover {
	color: #333;
	background: #f0f0f0;
}

.form {
	flex: 1;
	padding: 30rpx;
	overflow-y: auto;
}

.field {
	margin-bottom: 30rpx;
}

.label {
	display: block;
	margin-bottom: 12rpx;
	font-size: 28rpx;
	color: #333;
	font-weight: 500;
}

.input, .textarea {
	width: 100%;
	padding: 20rpx;
	border: 1rpx solid #ddd;
	border-radius: 12rpx;
	font-size: 28rpx;
	box-sizing: border-box;
	background: #fafafa;
	color: #333;
}

.input:focus, .textarea:focus {
	border-color: #6a5acd;
	outline: none;
	background: #fff;
	box-shadow: 0 0 0 2rpx rgba(106, 90, 205, 0.2);
}

.textarea {
	height: 120rpx;
	resize: none;
}

.picker {
	padding: 20rpx;
	border: 1rpx solid #ddd;
	border-radius: 12rpx;
	font-size: 28rpx;
	background: #fafafa;
	color: #333;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.picker:after {
	content: '▼';
	margin-left: 10rpx;
	color: #999;
	font-size: 24rpx;
}

.modal-footer {
	display: flex;
	gap: 20rpx;
	padding: 30rpx;
	border-top: 1rpx solid #eee;
	background: #fafafa;
}

.cancel-btn, .confirm-btn {
	flex: 1;
	padding: 20rpx;
	border: none;
	border-radius: 12rpx;
	font-size: 28rpx;
	font-weight: bold;
}

.cancel-btn {
	background: #6c757d;
	color: white;
}

.confirm-btn {
	background: #6a5acd;
	color: white;
}

.cancel-btn:disabled, .confirm-btn:disabled {
	opacity: 0.6;
}

/* 滚动条样式 */
.form::-webkit-scrollbar {
	width: 8rpx;
}

.form::-webkit-scrollbar-thumb {
	background: #ddd;
	border-radius: 4rpx;
}

.form::-webkit-scrollbar-track {
	background: #f5f5f5;
}

/* 响应式设计 */
@media (max-width: 768px) {
	.modal-content {
		width: 95%;
		margin: 20rpx;
	}
	
	.form {
		padding: 20rpx;
	}
	
	.modal-header {
		padding: 20rpx;
	}
	
	.modal-footer {
		padding: 20rpx;
	}
}
</style>