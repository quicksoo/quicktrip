<template>
	<view class="city-container">
		<!-- 头部 -->
		<view class="header">
			<view class="nav-bar">
				<view class="nav-left" @tap="goBack">
					<text class="back-icon">‹</text>
				</view>
				<view class="nav-title">选择城市</view>
				<view class="nav-right">
					<text class="more-icon">⋯</text>
				</view>
			</view>
			
			<!-- 搜索框 -->
			<view class="search-section">
				<view class="search-box">
					<text class="search-icon">🔍</text>
					<input 
						class="search-input" 
						v-model="searchKeyword" 
						placeholder="城市/拼音"
						@input="onSearchInput"
						placeholder-style="color: #ccc"
					/>
				</view>
			</view>
		</view>
		
		<!-- 内容区域 -->
		<scroll-view class="content" scroll-y="true">
			<!-- 当前定位城市 -->
			<view class="location-section">
				<view class="location-item">
					<text class="location-icon">📍</text>
					<text class="location-text">当前定位城市：</text>
					<text class="current-city">{{currentLocationCity}}</text>
				</view>
			</view>
			
			<!-- 热门城市 -->
			<view class="hot-cities-section">
				<view class="section-title">热门城市</view>
				<view class="cities-grid">
					<view 
						class="city-item" 
						:class="{'active': item.code === selectedCityCode}"
						v-for="(item, index) in hotCities" 
						:key="index"
						@tap="selectCity(item)"
					>
						<text class="city-name">{{item.name}}</text>
					</view>
				</view>
			</view>
			
			<!-- 城市列表 -->
			<view class="cities-list-section">
				<!-- 字母索引对应的城市 -->
				<view 
					class="letter-section" 
					v-for="(letter, index) in sortedLetters" 
					:key="index"
					:id="'letter-' + letter"
				>
					<view class="letter-title">{{letter}}</view>
					<view class="cities-in-letter">
						<view 
							class="city-list-item"
							v-for="(city, cityIndex) in citiesByLetter[letter]" 
							:key="cityIndex"
							@tap="selectCity(city)"
						>
							<text class="city-list-name">{{city.name}}</text>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		
		<!-- 右侧字母索引 -->
		<view class="letter-index">
			<view 
				class="letter-index-item"
				v-for="(letter, index) in sortedLetters" 
				:key="index"
				@tap="scrollToLetter(letter)"
			>
				<text class="letter-index-text">{{letter}}</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			searchKeyword: '',
			selectedCityCode: '',
			currentLocationCity: '西安市',
			hotCities: [
				{ name: '北京', code: 'beijing', pinyin: 'beijing' },
				{ name: '成都', code: 'chengdu', pinyin: 'chengdu' },
				{ name: '重庆', code: 'chongqing', pinyin: 'chongqing' },
				{ name: '广州', code: 'guangzhou', pinyin: 'guangzhou' },
				{ name: '杭州', code: 'hangzhou', pinyin: 'hangzhou' },
				{ name: '南京', code: 'nanjing', pinyin: 'nanjing' },
				{ name: '上海', code: 'shanghai', pinyin: 'shanghai' },
				{ name: '深圳', code: 'shenzhen', pinyin: 'shenzhen' },
				{ name: '苏州', code: 'suzhou', pinyin: 'suzhou' },
				{ name: '天津', code: 'tianjin', pinyin: 'tianjin' },
				{ name: '武汉', code: 'wuhan', pinyin: 'wuhan' },
				{ name: '西安', code: 'xian', pinyin: 'xian' }
			],
			allCities: [
				// A
				{ name: '阿坝藏族羌族自治州', code: 'aba', pinyin: 'aba', letter: 'A' },
				{ name: '阿坝县', code: 'abaxian', pinyin: 'abaxian', letter: 'A' },
				{ name: '阿克苏地区', code: 'akesu', pinyin: 'akesu', letter: 'A' },
				{ name: '阿里地区', code: 'ali', pinyin: 'ali', letter: 'A' },
				{ name: '阿勒泰地区', code: 'aletai', pinyin: 'aletai', letter: 'A' },
				{ name: '阿拉善盟', code: 'alashan', pinyin: 'alashan', letter: 'A' },
				{ name: '安庆市', code: 'anqing', pinyin: 'anqing', letter: 'A' },
				{ name: '安阳市', code: 'anyang', pinyin: 'anyang', letter: 'A' },
				{ name: '鞍山市', code: 'anshan', pinyin: 'anshan', letter: 'A' },
				{ name: '安顺市', code: 'anshun', pinyin: 'anshun', letter: 'A' },
				
				// B
				{ name: '北京', code: 'beijing', pinyin: 'beijing', letter: 'B' },
				{ name: '保定市', code: 'baoding', pinyin: 'baoding', letter: 'B' },
				{ name: '包头市', code: 'baotou', pinyin: 'baotou', letter: 'B' },
				{ name: '本溪市', code: 'benxi', pinyin: 'benxi', letter: 'B' },
				{ name: '蚌埠市', code: 'bengbu', pinyin: 'bengbu', letter: 'B' },
				{ name: '白城市', code: 'baicheng', pinyin: 'baicheng', letter: 'B' },
				{ name: '白山市', code: 'baishan', pinyin: 'baishan', letter: 'B' },
				{ name: '白银市', code: 'baiyin', pinyin: 'baiyin', letter: 'B' },
				
				// C
				{ name: '成都', code: 'chengdu', pinyin: 'chengdu', letter: 'C' },
				{ name: '重庆', code: 'chongqing', pinyin: 'chongqing', letter: 'C' },
				{ name: '长沙市', code: 'changsha', pinyin: 'changsha', letter: 'C' },
				{ name: '长春市', code: 'changchun', pinyin: 'changchun', letter: 'C' },
				{ name: '常州市', code: 'changzhou', pinyin: 'changzhou', letter: 'C' },
				{ name: '承德市', code: 'chengde', pinyin: 'chengde', letter: 'C' },
				{ name: '沧州市', code: 'cangzhou', pinyin: 'cangzhou', letter: 'C' },
				{ name: '长治市', code: 'changzhi', pinyin: 'changzhi', letter: 'C' },
				
				// D
				{ name: '大连市', code: 'dalian', pinyin: 'dalian', letter: 'D' },
				{ name: '东莞市', code: 'dongguan', pinyin: 'dongguan', letter: 'D' },
				{ name: '大庆市', code: 'daqing', pinyin: 'daqing', letter: 'D' },
				{ name: '丹东市', code: 'dandong', pinyin: 'dandong', letter: 'D' },
				{ name: '大同市', code: 'datong', pinyin: 'datong', letter: 'D' },
				{ name: '德州市', code: 'dezhou', pinyin: 'dezhou', letter: 'D' },
				
				// F
				{ name: '福州市', code: 'fuzhou', pinyin: 'fuzhou', letter: 'F' },
				{ name: '佛山市', code: 'foshan', pinyin: 'foshan', letter: 'F' },
				{ name: '抚顺市', code: 'fushun', pinyin: 'fushun', letter: 'F' },
				{ name: '阜阳市', code: 'fuyang', pinyin: 'fuyang', letter: 'F' },
				
				// G
				{ name: '广州', code: 'guangzhou', pinyin: 'guangzhou', letter: 'G' },
				{ name: '贵阳市', code: 'guiyang', pinyin: 'guiyang', letter: 'G' },
				{ name: '桂林市', code: 'guilin', pinyin: 'guilin', letter: 'G' },
				{ name: '赣州市', code: 'ganzhou', pinyin: 'ganzhou', letter: 'G' },
				
				// H
				{ name: '杭州', code: 'hangzhou', pinyin: 'hangzhou', letter: 'H' },
				{ name: '哈尔滨市', code: 'haerbin', pinyin: 'haerbin', letter: 'H' },
				{ name: '合肥市', code: 'hefei', pinyin: 'hefei', letter: 'H' },
				{ name: '海口市', code: 'haikou', pinyin: 'haikou', letter: 'H' },
				{ name: '呼和浩特市', code: 'huhehaote', pinyin: 'huhehaote', letter: 'H' },
				{ name: '石家庄市', code: 'shijiazhuang', pinyin: 'shijiazhuang', letter: 'H' },
				
				// J
				{ name: '济南市', code: 'jinan', pinyin: 'jinan', letter: 'J' },
				{ name: '昆明市', code: 'kunming', pinyin: 'kunming', letter: 'J' },
				
				// 更多城市...
				{ name: '南京', code: 'nanjing', pinyin: 'nanjing', letter: 'N' },
				{ name: '宁波市', code: 'ningbo', pinyin: 'ningbo', letter: 'N' },
				{ name: '南昌市', code: 'nanchang', pinyin: 'nanchang', letter: 'N' },
				{ name: '南宁市', code: 'nanning', pinyin: 'nanning', letter: 'N' },
				
				{ name: '青岛市', code: 'qingdao', pinyin: 'qingdao', letter: 'Q' },
				
				{ name: '上海', code: 'shanghai', pinyin: 'shanghai', letter: 'S' },
				{ name: '深圳', code: 'shenzhen', pinyin: 'shenzhen', letter: 'S' },
				{ name: '苏州', code: 'suzhou', pinyin: 'suzhou', letter: 'S' },
				{ name: '沈阳市', code: 'shenyang', pinyin: 'shenyang', letter: 'S' },
				
				{ name: '天津', code: 'tianjin', pinyin: 'tianjin', letter: 'T' },
				{ name: '太原市', code: 'taiyuan', pinyin: 'taiyuan', letter: 'T' },
				
				{ name: '武汉', code: 'wuhan', pinyin: 'wuhan', letter: 'W' },
				{ name: '无锡市', code: 'wuxi', pinyin: 'wuxi', letter: 'W' },
				{ name: '温州市', code: 'wenzhou', pinyin: 'wenzhou', letter: 'W' },
				{ name: '乌鲁木齐市', code: 'wulumuqi', pinyin: 'wulumuqi', letter: 'W' },
				
				{ name: '西安', code: 'xian', pinyin: 'xian', letter: 'X' },
				{ name: '厦门市', code: 'xiamen', pinyin: 'xiamen', letter: 'X' },
				{ name: '西宁市', code: 'xining', pinyin: 'xining', letter: 'X' },
				
				{ name: '银川市', code: 'yinchuan', pinyin: 'yinchuan', letter: 'Y' },
				
				{ name: '郑州市', code: 'zhengzhou', pinyin: 'zhengzhou', letter: 'Z' },
				{ name: '珠海市', code: 'zhuhai', pinyin: 'zhuhai', letter: 'Z' },
				{ name: '中山市', code: 'zhongshan', pinyin: 'zhongshan', letter: 'Z' }
			]
		}
	},
	computed: {
		// 按字母分组的城市
		citiesByLetter() {
			const groups = {}
			this.filteredCities.forEach(city => {
				const letter = city.letter
				if (!groups[letter]) {
					groups[letter] = []
				}
				groups[letter].push(city)
			})
			return groups
		},
		
		// 排序后的字母列表
		sortedLetters() {
			return Object.keys(this.citiesByLetter).sort()
		},
		
		// 过滤后的城市列表
		filteredCities() {
			if (!this.searchKeyword.trim()) {
				return this.allCities
			}
			
			const keyword = this.searchKeyword.toLowerCase()
			return this.allCities.filter(city => 
				city.name.toLowerCase().includes(keyword) ||
				city.pinyin.toLowerCase().includes(keyword)
			)
		}
	},
	onLoad(options) {
		// 获取当前选中的城市
		if (options.current) {
			this.selectedCityCode = options.current
		}
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		
		onSearchInput(e) {
			this.searchKeyword = e.detail.value
		},
		
		selectCity(city) {
			// 返回选中的城市信息
			const pages = getCurrentPages()
			const prevPage = pages[pages.length - 2]
			
			if (prevPage) {
				prevPage.$vm.onCitySelected(city)
			}
			
			uni.navigateBack()
		},
		
		scrollToLetter(letter) {
			// 滚动到指定字母
			uni.pageScrollTo({
				selector: '#letter-' + letter,
				duration: 300
			})
		}
	}
}
</script>

<style scoped>
.city-container {
	background-color: #f5f5f5;
	min-height: 100vh;
	position: relative;
}

.header {
	background-color: #fff;
	position: sticky;
	top: 0;
	z-index: 100;
}

.nav-bar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 88rpx;
	padding: 0 30rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.nav-left, .nav-right {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.back-icon {
	font-size: 40rpx;
	color: #333;
	font-weight: bold;
}

.nav-title {
	font-size: 32rpx;
	color: #333;
	font-weight: 500;
}

.more-icon {
	font-size: 32rpx;
	color: #333;
}

.search-section {
	padding: 20rpx 30rpx 30rpx;
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
	height: calc(100vh - 200rpx);
	padding-bottom: 40rpx;
}

.location-section {
	background-color: #fff;
	margin-bottom: 20rpx;
}

.location-item {
	display: flex;
	align-items: center;
	padding: 30rpx;
}

.location-icon {
	font-size: 28rpx;
	margin-right: 15rpx;
}

.location-text {
	font-size: 28rpx;
	color: #666;
}

.current-city {
	font-size: 28rpx;
	color: #333;
	font-weight: 500;
}

.hot-cities-section {
	background-color: #fff;
	margin-bottom: 20rpx;
}

.section-title {
	padding: 30rpx 30rpx 20rpx;
	font-size: 28rpx;
	color: #666;
}

.cities-grid {
	display: flex;
	flex-wrap: wrap;
	padding: 0 20rpx 30rpx;
}

.city-item {
	width: calc(25% - 20rpx);
	margin: 10rpx;
	padding: 20rpx 0;
	background-color: #f8f8f8;
	border-radius: 12rpx;
	text-align: center;
}

.city-item.active {
	background-color: #3cc51f;
}

.city-name {
	font-size: 26rpx;
	color: #333;
}

.city-item.active .city-name {
	color: #fff;
}

.cities-list-section {
	background-color: #fff;
}

.letter-section {
	border-bottom: 1rpx solid #f0f0f0;
}

.letter-title {
	padding: 20rpx 30rpx;
	font-size: 24rpx;
	color: #999;
	background-color: #f8f8f8;
	font-weight: 500;
}

.cities-in-letter {
	
}

.city-list-item {
	padding: 25rpx 30rpx;
	border-bottom: 1rpx solid #f8f8f8;
}

.city-list-item:last-child {
	border-bottom: none;
}

.city-list-name {
	font-size: 28rpx;
	color: #333;
}

.letter-index {
	position: fixed;
	right: 20rpx;
	top: 50%;
	transform: translateY(-50%);
	z-index: 200;
}

.letter-index-item {
	width: 40rpx;
	height: 40rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 5rpx;
}

.letter-index-text {
	font-size: 20rpx;
	color: #666;
	font-weight: 500;
}
</style>