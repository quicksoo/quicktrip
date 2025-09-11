<template>
	<view class="feedback-container">
		<view class="form-section">
			<view class="form-title">用户反馈</view>
			<view class="form-subtitle">请填写您想要添加的景点信息</view>
			
			<view class="form-item">
				<view class="label">选择省份</view>
				<picker @change="onProvinceChange" :value="provinceIndex" :range="provinces">
					<view class="picker">
						<text class="picker-text">{{selectedProvince || '请选择省份'}}</text>
						<text class="arrow">></text>
					</view>
				</picker>
			</view>
			
			<view class="form-item">
				<view class="label">选择城市</view>
				<picker @change="onCityChange" :value="cityIndex" :range="cities" :disabled="!selectedProvince">
					<view class="picker" :class="{'disabled': !selectedProvince}">
						<text class="picker-text">{{selectedCity || '请选择城市'}}</text>
						<text class="arrow">></text>
					</view>
				</picker>
			</view>
			
			<view class="form-item">
				<view class="label">景点名称</view>
				<input 
					class="input" 
					v-model="scenicSpotName" 
					placeholder="请输入景点名称"
					placeholder-style="color: #ccc"
				/>
			</view>
			
			<view class="form-item">
				<view class="label">景点地址（可选）</view>
				<input 
					class="input" 
					v-model="scenicSpotAddress" 
					placeholder="请输入景点详细地址"
					placeholder-style="color: #ccc"
				/>
			</view>
			
			<view class="form-item">
				<view class="label">预约入口信息（可选）</view>
				<textarea 
					class="textarea" 
					v-model="reservationInfo" 
					placeholder="请提供景点预约入口信息，如小程序名称、官网链接等"
					placeholder-style="color: #ccc"
				/>
			</view>
		</view>
		
		<view class="submit-section">
			<button class="submit-btn" @tap="submitFeedback" :disabled="!canSubmit">提交反馈</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			provinces: [
				'北京市', '天津市', '河北省', '山西省', '内蒙古自治区',
				'辽宁省', '吉林省', '黑龙江省', '上海市', '江苏省',
				'浙江省', '安徽省', '福建省', '江西省', '山东省',
				'河南省', '湖北省', '湖南省', '广东省', '广西壮族自治区',
				'海南省', '重庆市', '四川省', '贵州省', '云南省',
				'西藏自治区', '陕西省', '甘肃省', '青海省', '宁夏回族自治区',
				'新疆维吾尔自治区', '台湾省', '香港特别行政区', '澳门特别行政区'
			],
			cities: [],
			provinceIndex: 0,
			cityIndex: 0,
			selectedProvince: '',
			selectedCity: '',
			scenicSpotName: '',
			scenicSpotAddress: '',
			reservationInfo: '',
			cityData: {
				'北京市': ['东城区', '西城区', '朝阳区', '丰台区', '石景山区', '海淀区', '门头沟区', '房山区', '通州区', '顺义区', '昌平区', '大兴区', '怀柔区', '平谷区', '密云区', '延庆区'],
				'上海市': ['黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', '虹口区', '杨浦区', '闵行区', '宝山区', '嘉定区', '浦东新区', '金山区', '松江区', '青浦区', '奉贤区', '崇明区'],
				'广东省': ['广州市', '深圳市', '珠海市', '汕头市', '佛山市', '韶关市', '湛江市', '肇庆市', '江门市', '茂名市', '惠州市', '梅州市', '汕尾市', '河源市', '阳江市', '清远市', '东莞市', '中山市', '潮州市', '揭阳市', '云浮市'],
				'浙江省': ['杭州市', '宁波市', '温州市', '嘉兴市', '湖州市', '绍兴市', '金华市', '衢州市', '舟山市', '台州市', '丽水市'],
				'江苏省': ['南京市', '无锡市', '徐州市', '常州市', '苏州市', '南通市', '连云港市', '淮安市', '盐城市', '扬州市', '镇江市', '泰州市', '宿迁市']
			}
		}
	},
	computed: {
		canSubmit() {
			return this.selectedProvince && this.selectedCity && this.scenicSpotName.trim()
		}
	},
	methods: {
		onProvinceChange(e) {
			const index = e.detail.value
			this.provinceIndex = index
			this.selectedProvince = this.provinces[index]
			this.selectedCity = ''
			this.cityIndex = 0
			
			// 根据省份获取城市列表
			this.cities = this.cityData[this.selectedProvince] || []
		},
		
		onCityChange(e) {
			const index = e.detail.value
			this.cityIndex = index
			this.selectedCity = this.cities[index]
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
.feedback-container {
	background-color: #f5f5f5;
	min-height: 100vh;
	padding-bottom: 120rpx;
}

.form-section {
	padding: 40rpx;
}

.form-title {
	font-size: 48rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 10rpx;
}

.form-subtitle {
	font-size: 28rpx;
	color: #666;
	margin-bottom: 60rpx;
}

.form-item {
	background-color: #fff;
	border-radius: 16rpx;
	padding: 30rpx;
	margin-bottom: 30rpx;
}

.label {
	font-size: 28rpx;
	color: #333;
	margin-bottom: 20rpx;
	font-weight: 500;
}

.picker {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 0;
}

.picker.disabled {
	opacity: 0.5;
}

.picker-text {
	font-size: 28rpx;
	color: #333;
}

.arrow {
	font-size: 28rpx;
	color: #ccc;
}

.input {
	width: 100%;
	padding: 20rpx 0;
	font-size: 28rpx;
	color: #333;
	border: none;
	outline: none;
}

.textarea {
	width: 100%;
	min-height: 120rpx;
	padding: 20rpx 0;
	font-size: 28rpx;
	color: #333;
	border: none;
	outline: none;
	resize: none;
}

.submit-section {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 30rpx 40rpx;
	background-color: #fff;
	border-top: 1rpx solid #f0f0f0;
}

.submit-btn {
	width: 100%;
	height: 88rpx;
	background-color: #3cc51f;
	color: #fff;
	border: none;
	border-radius: 44rpx;
	font-size: 32rpx;
	font-weight: 500;
}

.submit-btn:disabled {
	background-color: #ccc;
}
</style>