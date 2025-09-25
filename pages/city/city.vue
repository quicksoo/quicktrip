<template>
	<view class="city-container">
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
					<view class="nav-right">
					</view>
				</view>

				<!-- 搜索框 -->
				<view class="search-section">
					<view class="search-box">
						<text class="search-icon">🔍</text>
						<input class="search-input" v-model="searchKeyword" placeholder="城市/拼音" @input="onSearchInput"
							placeholder-style="color: rgba(255,255,255,0.6)" />
					</view>
				</view>
			</view>
		</view>

		<!-- 内容区域 -->
		<scroll-view class="content" scroll-y="true" :scroll-into-view="scrollIntoView">
			<!-- 历史选择城市 -->
			<view class="history-section" v-if="historyQueue.length > 0">
				<view class="section-header">
					<view class="section-left">
						<view class="section-icon">🕒</view>
						<text class="section-title">历史选择</text>
					</view>
					<view class="section-right">
						<view class="edit-button" @tap="toggleEditMode">
							<text class="edit-icon">{{ isEditMode ? '完成' : '编辑' }}</text>
						</view>
						<view class="history-actions" v-if="isEditMode">
							<button class="clear-all-btn" @tap="clearAllHistory">清空</button>
						</view>
					</view>
				</view>
				<view class="cities-grid">
					<view class="city-item history-item" :class="{ 'active': item.code === selectedCityCode, 'edit-mode': isEditMode }"
						v-for="(item, index) in historyQueue" :key="index" @tap="handleHistoryItemClick(item, index)">
						<view class="delete-btn" v-if="isEditMode" @tap.stop="removeHistoryItem(index)">
							<text class="delete-icon">×</text>
						</view>
						<text class="city-name">{{ item.name }}</text>
						<view class="city-glow" v-if="item.code === selectedCityCode && !isEditMode"></view>
					</view>
				</view>
			</view>

			<!-- 热门城市 -->
			<view class="hot-cities-section">
				<view class="section-header">
					<view class="section-left">
						<view class="section-icon">🔥</view>
						<text class="section-title">热门城市</text>
					</view>
				</view>
				<view class="cities-grid">
					<view class="city-item" :class="{ 'active': item.code === selectedCityCode }"
						v-for="(item, index) in hotCities" :key="index" @tap="selectCity(item)">
						<text class="city-name">{{ item.name }}</text>
						<view class="city-glow" v-if="item.code === selectedCityCode"></view>
					</view>
				</view>
			</view>

			<!-- 城市列表 -->
			<view class="cities-list-section">
				<view class="list-header">
					<view class="section-left">
						<view class="section-icon">🏙️</view>
						<text class="section-title">全部城市</text>
					</view>
				</view>
				<!-- 字母索引对应的城市 -->
				<view class="letter-section" v-for="(letter, index) in sortedLetters" :key="index"
					:id="'letter-' + letter">
					<view class="letter-title">{{ letter }}</view>
					<view class="cities-in-letter">
						<view class="city-list-item" v-for="(city, cityIndex) in citiesByLetter[letter]"
							:key="cityIndex" @tap="selectCity(city)">
							<text class="city-list-name">{{ city.name }}</text>
							<view class="city-arrow">
								<image class="arrow-icon" src="/static/right-arr.png" mode="aspectFit"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>

		<!-- 右侧字母索引 -->
		<view class="letter-index">
			<view class="letter-index-item" v-for="(letter, index) in sortedLetters" :key="index"
				@tap="scrollToLetter(letter)">
				<text class="letter-index-text">{{ letter }}</text>
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
			selectedCityCode: '',
			isEditMode: false, // 编辑模式
			historyQueue: [], // 历史选择城市队列，最大8个
			maxHistorySize: 8, // 历史记录最大数量
			scrollIntoView: '', // 滚动到指定元素
			hotCities: [
				{ name: '北京', code: 'beijing', pinyin: 'beijing' },
				{ name: '西安', code: 'xian', pinyin: 'xian' },
				{ name: '成都', code: 'chengdu', pinyin: 'chengdu' },
				{ name: '重庆', code: 'chongqing', pinyin: 'chongqing' },
				{ name: '广州', code: 'guangzhou', pinyin: 'guangzhou' },
				{ name: '杭州', code: 'hangzhou', pinyin: 'hangzhou' },
				{ name: '南京', code: 'nanjing', pinyin: 'nanjing' },
				{ name: '上海', code: 'shanghai', pinyin: 'shanghai' },
				{ name: '苏州', code: 'suzhou', pinyin: 'suzhou' },
				{ name: '武汉', code: 'wuhan', pinyin: 'wuhan' },
				{ name: '昆明', code: 'kunming', pinyin: 'kunming'},
				{ name: '三亚', code: 'sanya', pinyin: 'sanya' }
			],
			allCities:[
				// A
				{ name: '阿坝藏族羌族自治州', code: 'abazangzuqiangzuzizhizhou', pinyin: 'abazangzuqiangzuzizhizhou', letter: 'A' },
				{ name: '阿克苏地区', code: 'akesu', pinyin: 'akesu', letter: 'A' },
				{ name: '阿拉善盟', code: 'alashanmeng', pinyin: 'alashanmeng', letter: 'A' },
				{ name: '阿里地区', code: 'ali', pinyin: 'ali', letter: 'A' },
				{ name: '阿勒泰地区', code: 'aletai', pinyin: 'aletai', letter: 'A' },
				{ name: '安康市', code: 'ankang', pinyin: 'ankang', letter: 'A' },
				{ name: '安庆市', code: 'anqing', pinyin: 'anqing', letter: 'A' },
				{ name: '鞍山市', code: 'anshan', pinyin: 'anshan', letter: 'A' },
				{ name: '安顺市', code: 'anshun', pinyin: 'anshun', letter: 'A' },
				{ name: '安阳市', code: 'anyang', pinyin: 'anyang', letter: 'A' },

				// B
				{ name: '巴彦淖尔市', code: 'bayannaoer', pinyin: 'bayannaoer', letter: 'B' },
				{ name: '巴中市', code: 'bazhong', pinyin: 'bazhong', letter: 'B' },
				{ name: '白城市', code: 'baicheng', pinyin: 'baicheng', letter: 'B' },
				{ name: '白银市', code: 'baiyin', pinyin: 'baiyin', letter: 'B' },
				{ name: '百色市', code: 'baise', pinyin: 'baise', letter: 'B' },
				{ name: '蚌埠市', code: 'bengbu', pinyin: 'bengbu', letter: 'B' },
				{ name: '保定市', code: 'baoding', pinyin: 'baoding', letter: 'B' },
				{ name: '北海市', code: 'beihai', pinyin: 'beihai', letter: 'B' },
				{ name: '北京市', code: 'beijing', pinyin: 'beijing', letter: 'B' },
				{ name: '本溪市', code: 'benxi', pinyin: 'benxi', letter: 'B' },
				{ name: '毕节市', code: 'bijie', pinyin: 'bijie', letter: 'B' },
				{ name: '滨州市', code: 'binzhou', pinyin: 'binzhou', letter: 'B' },

				// C
				{ name: '沧州市', code: 'cangzhou', pinyin: 'cangzhou', letter: 'C' },
				{ name: '长沙市', code: 'changsha', pinyin: 'changsha', letter: 'C' },
				{ name: '长春市', code: 'changchun', pinyin: 'changchun', letter: 'C' },
				{ name: '常州市', code: 'changzhou', pinyin: 'changzhou', letter: 'C' },
				{ name: '长治市', code: 'changzhi', pinyin: 'changzhi', letter: 'C' },
				{ name: '巢湖市', code: 'chaohu', pinyin: 'chaohu', letter: 'C' },
				{ name: '朝阳市', code: 'chaoyang', pinyin: 'chaoyang', letter: 'C' },
				{ name: '潮州市', code: 'chaozhou', pinyin: 'chaozhou', letter: 'C' },
				{ name: '郴州市', code: 'chenzhou', pinyin: 'chenzhou', letter: 'C' },
				{ name: '成都市', code: 'chengdu', pinyin: 'chengdu', letter: 'C' },
				{ name: '承德市', code: 'chengde', pinyin: 'chengde', letter: 'C' },
				{ name: '重庆市', code: 'chongqing', pinyin: 'chongqing', letter: 'C' },
				{ name: '楚雄彝族自治州', code: 'chuxiongyizuzizhizhou', pinyin: 'chuxiongyizuzizhizhou', letter: 'C' },
				{ name: '滁州市', code: 'chuzhou', pinyin: 'chuzhou', letter: 'C' },
				{ name: '崇左市', code: 'chongzuo', pinyin: 'chongzuo', letter: 'C' },
				{ name: '常德市', code: 'changde', pinyin: 'changde', letter: 'C' },

				// D
				{ name: '大理白族自治州', code: 'dalibaizuzizhizhou', pinyin: 'dalibaizuzizhizhou', letter: 'D' },
				{ name: '大同市', code: 'datong', pinyin: 'datong', letter: 'D' },
				{ name: '大连市', code: 'dalian', pinyin: 'dalian', letter: 'D' },
				{ name: '丹东市', code: 'dandong', pinyin: 'dandong', letter: 'D' },
				{ name: '大庆市', code: 'daqing', pinyin: 'daqing', letter: 'D' },
				{ name: '德宏傣族景颇族自治州', code: 'dehongdaizujingpozuzizhizhou', pinyin: 'dehongdaizujingpozuzizhizhou', letter: 'D' },
				{ name: '德阳市', code: 'deyang', pinyin: 'deyang', letter: 'D' },
				{ name: '迪庆藏族自治州', code: 'diqingzangzuzizhizhou', pinyin: 'diqingzangzuzizhizhou', letter: 'D' },
				{ name: '定西市', code: 'dingxi', pinyin: 'dingxi', letter: 'D' },
				{ name: '东营市', code: 'dongying', pinyin: 'dongying', letter: 'D' },
				{ name: '东莞市', code: 'dongguan', pinyin: 'dongguan', letter: 'D' },
				{ name: '儋州市', code: 'danzhou', pinyin: 'danzhou', letter: 'D' },

				// E
				{ name: '鄂尔多斯市', code: 'eerduosi', pinyin: 'eerduosi', letter: 'E' },
				{ name: '恩施土家族苗族自治州', code: 'enshitujiazumiaozuzizhizhou', pinyin: 'enshitujiazumiaozuzizhizhou', letter: 'E' },
				{ name: '鄂州市', code: 'ezhou', pinyin: 'ezhou', letter: 'E' },

				// F
				{ name: '防城港市', code: 'fangchenggang', pinyin: 'fangchenggang', letter: 'F' },
				{ name: '佛山市', code: 'foshan', pinyin: 'foshan', letter: 'F' },
				{ name: '抚顺市', code: 'fushun', pinyin: 'fushun', letter: 'F' },
				{ name: '阜新市', code: 'fuxin', pinyin: 'fuxin', letter: 'F' },
				{ name: '阜阳市', code: 'fuyang', pinyin: 'fuyang', letter: 'F' },
				{ name: '福州市', code: 'fuzhou', pinyin: 'fuzhou', letter: 'F' },

				// G
				{ name: '赣州市', code: 'ganzhou', pinyin: 'ganzhou', letter: 'G' },
				{ name: '甘孜藏族自治州', code: 'ganzzizangzuzizhizhou', pinyin: 'ganzzizangzuzizhizhou', letter: 'G' },
				{ name: '广安市', code: 'guangan', pinyin: 'guangan', letter: 'G' },
				{ name: '广元市', code: 'guangyuan', pinyin: 'guangyuan', letter: 'G' },
				{ name: '贵港市', code: 'guigang', pinyin: 'guigang', letter: 'G' },
				{ name: '桂林市', code: 'guilin', pinyin: 'guilin', letter: 'G' },
				{ name: '贵阳市', code: 'guiyang', pinyin: 'guiyang', letter: 'G' },
				{ name: '果洛藏族自治州', code: 'guoluo', pinyin: 'guoluo', letter: 'G' },
				{ name: '固原市', code: 'guyuan', pinyin: 'guyuan', letter: 'G' },
				{ name: '广州市', code: 'guangzhou', pinyin: 'guangzhou', letter: 'G' },

				// H
				{ name: '哈尔滨市', code: 'haerbin', pinyin: 'haerbin', letter: 'H' },
				{ name: '海北藏族自治州', code: 'haibei', pinyin: 'haibei', letter: 'H' },
				{ name: '海口市', code: 'haikou', pinyin: 'haikou', letter: 'H' },
				{ name: '海西蒙古族藏族自治州', code: 'haixi', pinyin: 'haixi', letter: 'H' },
				{ name: '海东市', code: 'haidong', pinyin: 'haidong', letter: 'H' },
				{ name: '邯郸市', code: 'handan', pinyin: 'handan', letter: 'H' },
				{ name: '汉中市', code: 'hanzhong', pinyin: 'hanzhong', letter: 'H' },
				{ name: '杭州市', code: 'hangzhou', pinyin: 'hangzhou', letter: 'H' },
				{ name: '合肥市', code: 'hefei', pinyin: 'hefei', letter: 'H' },
				{ name: '和田地区', code: 'hetian', pinyin: 'hetian', letter: 'H' },
				{ name: '河池市', code: 'hechi', pinyin: 'hechi', letter: 'H' },
				{ name: '鹤壁市', code: 'hebi', pinyin: 'hebi', letter: 'H' },
				{ name: '黑河市', code: 'heihe', pinyin: 'heihe', letter: 'H' },
				{ name: '衡水市', code: 'hengshui', pinyin: 'hengshui', letter: 'H' },
				{ name: '衡阳市', code: 'hengyang', pinyin: 'hengyang', letter: 'H' },
				{ name: '呼和浩特市', code: 'huhehaote', pinyin: 'huhehaote', letter: 'H' },
				{ name: '葫芦岛市', code: 'huludao', pinyin: 'huludao', letter: 'H' },
				{ name: '淮安市', code: 'huaian', pinyin: 'huaian', letter: 'H' },
				{ name: '怀化市', code: 'huaihua', pinyin: 'huaihua', letter: 'H' },
				{ name: '淮南市', code: 'huainan', pinyin: 'huainan', letter: 'H' },
				{ name: '黄冈市', code: 'huanggang', pinyin: 'huanggang', letter: 'H' },
				{ name: '黄山市', code: 'huangshan', pinyin: 'huangshan', letter: 'H' },
				{ name: '黄石市', code: 'huangshi', pinyin: 'huangshi', letter: 'H' },
				{ name: '惠州市', code: 'huizhou', pinyin: 'huizhou', letter: 'H' },
				{ name: '湘西土家族苗族自治州', code: 'xiangxitujiazumiaozuzizhizhou', pinyin: 'xiangxitujiazumiaozuzizhizhou', letter: 'H' },

				// J
				{ name: '济南市', code: 'jinan', pinyin: 'jinan', letter: 'J' },
				{ name: '济宁市', code: 'jining', pinyin: 'jining', letter: 'J' },
				{ name: '晋城市', code: 'jincheng', pinyin: 'jincheng', letter: 'J' },
				{ name: '景德镇市', code: 'jingdezhen', pinyin: 'jingdezhen', letter: 'J' },
				{ name: '荆门市', code: 'jingmen', pinyin: 'jingmen', letter: 'J' },
				{ name: '荆州市', code: 'jingzhou', pinyin: 'jingzhou', letter: 'J' },
				{ name: '金华市', code: 'jinhua', pinyin: 'jinhua', letter: 'J' },
				{ name: '锦州市', code: 'jinzhou', pinyin: 'jinzhou', letter: 'J' },
				{ name: '九江市', code: 'jiujiang', pinyin: 'jiujiang', letter: 'J' },
				{ name: '酒泉市', code: 'jiuquan', pinyin: 'jiuquan', letter: 'J' },
				{ name: '吉林市', code: 'jilin', pinyin: 'jilin', letter: 'J' },
				{ name: '吉安市', code: 'jian', pinyin: 'jian', letter: 'J' },
				{ name: '佳木斯市', code: 'jiamusi', pinyin: 'jiamusi', letter: 'J' },
				{ name: '焦作市', code: 'jiaozuo', pinyin: 'jiaozuo', letter: 'J' },
				{ name: '揭阳市', code: 'jieyang', pinyin: 'jieyang', letter: 'J' },
				{ name: '金昌市', code: 'jinchang', pinyin: 'jinchang', letter: 'J' },
				{ name: '鸡西市', code: 'jixi', pinyin: 'jixi', letter: 'J' },
				{ name: '嘉峪关市', code: 'jiayuguan', pinyin: 'jiayuguan', letter: 'J' },
				{ name: '江门市', code: 'jiangmen', pinyin: 'jiangmen', letter: 'J' },


				// K
				{ name: '开封市', code: 'kaifeng', pinyin: 'kaifeng', letter: 'K' },
				{ name: '克拉玛依市', code: 'kelamayi', pinyin: 'kelamayi', letter: 'K' },
				{ name: '喀什地区', code: 'kashi', pinyin: 'kashi', letter: 'K' },
				{ name: '昆明市', code: 'kunming', pinyin: 'kunming', letter: 'K' },

				// L
				{ name: '拉萨市', code: 'lasa', pinyin: 'lasa', letter: 'L' },
				{ name: '来宾市', code: 'laibin', pinyin: 'laibin', letter: 'L' },
				{ name: '廊坊市', code: 'langfang', pinyin: 'langfang', letter: 'L' },
				{ name: '兰州市', code: 'lanzhou', pinyin: 'lanzhou', letter: 'L' },
				{ name: '辽阳市', code: 'liaoyang', pinyin: 'liaoyang', letter: 'L' },
				{ name: '辽源市', code: 'liaoyuan', pinyin: 'liaoyuan', letter: 'L' },
				{ name: '聊城市', code: 'liaocheng', pinyin: 'liaocheng', letter: 'L' },
				{ name: '临沧市', code: 'lincang', pinyin: 'lincang', letter: 'L' },
				{ name: '临汾市', code: 'linfen', pinyin: 'linfen', letter: 'L' },
				{ name: '临夏回族自治州', code: 'linxiahuizuzizhizhou', pinyin: 'linxiahuizuzizhizhou', letter: 'L' },
				{ name: '临沂市', code: 'linyi', pinyin: 'linyi', letter: 'L' },
				{ name: '丽水市', code: 'lishui', pinyin: 'lishui', letter: 'L' },
				{ name: '丽江市', code: 'lijiang', pinyin: 'lijiang', letter: 'L' },
				{ name: '漯河市', code: 'luohe', pinyin: 'luohe', letter: 'L' },
				{ name: '洛阳市', code: 'luoyang', pinyin: 'luoyang', letter: 'L' },
				{ name: '六安市', code: 'liuan', pinyin: 'liuan', letter: 'L' },
				{ name: '六盘水市', code: 'liupanshui', pinyin: 'liupanshui', letter: 'L' },
				{ name: '柳州市', code: 'liuzhou', pinyin: 'liuzhou', letter: 'L' },
				{ name: '陇南市', code: 'longnan', pinyin: 'longnan', letter: 'L' },
				{ name: '龙岩市', code: 'longyan', pinyin: 'longyan', letter: 'L' },
				{ name: '娄底市', code: 'loudi', pinyin: 'loudi', letter: 'L' },
				{ name: '泸州市', code: 'luzhou', pinyin: 'luzhou', letter: 'L' },

				// M
				{ name: '马鞍山市', code: 'maanshan', pinyin: 'maanshan', letter: 'M' },
				{ name: '茂名市', code: 'maoming', pinyin: 'maoming', letter: 'M' },
				{ name: '眉山市', code: 'meishan', pinyin: 'meishan', letter: 'M' },
				{ name: '梅州市', code: 'meizhou', pinyin: 'meizhou', letter: 'M' },
				{ name: '绵阳市', code: 'mianyang', pinyin: 'mianyang', letter: 'M' },
				{ name: '牡丹江市', code: 'mudanjiang', pinyin: 'mudanjiang', letter: 'M' },
				// N
				{ name: '南昌市', code: 'nanchang', pinyin: 'nanchang', letter: 'N' },
				{ name: '南充市', code: 'nanchong', pinyin: 'nanchong', letter: 'N' },
				{ name: '南通市', code: 'nantong', pinyin: 'nantong', letter: 'N' },
				{ name: '南宁市', code: 'nanning', pinyin: 'nanning', letter: 'N' },
				{ name: '南京市', code: 'nanjing', pinyin: 'nanjing', letter: 'N' },
				{ name: '宁波市', code: 'ningbo', pinyin: 'ningbo', letter: 'N' },
				{ name: '宁德市', code: 'ningde', pinyin: 'ningde', letter: 'N' },
				{ name: '怒江傈僳族自治州', code: 'nujiang', pinyin: 'nujiang', letter: 'N' },

				// P
				{ name: '攀枝花市', code: 'panzhihua', pinyin: 'panzhihua', letter: 'P' },
				{ name: '盘锦市', code: 'panjin', pinyin: 'panjin', letter: 'P' },
				{ name: '平顶山市', code: 'pingdingshan', pinyin: 'pingdingshan', letter: 'P' },
				{ name: '萍乡市', code: 'pingxiang', pinyin: 'pingxiang', letter: 'P' },
				{ name: '平凉市', code: 'pingliang', pinyin: 'pingliang', letter: 'P' },
				{ name: '普洱市', code: 'puer', pinyin: 'puer', letter: 'P' },

				// Q
				{ name: '青岛市', code: 'qingdao', pinyin: 'qingdao', letter: 'Q' },
				{ name: '清远市', code: 'qingyuan', pinyin: 'qingyuan', letter: 'Q' },
				{ name: '庆阳市', code: 'qingyang', pinyin: 'qingyang', letter: 'Q' },
				{ name: '衢州市', code: 'quzhou', pinyin: 'quzhou', letter: 'Q' },
				{ name: '七台河市', code: 'qitaihe', pinyin: 'qitaihe', letter: 'Q' },
				{ name: '齐齐哈尔市', code: 'qiqihaer', pinyin: 'qiqihaer', letter: 'Q' },
				{ name: '黔东南苗族侗族自治州', code: 'qiandongnan', pinyin: 'qiandongnan', letter: 'Q' },
				{ name: '黔南布依族苗族自治州', code: 'qiannan', pinyin: 'qiannan', letter: 'Q' },
				{ name: '黔西南布依族苗族自治州', code: 'qianxinan', pinyin: 'qianxinan', letter: 'Q' },
				{ name: '曲靖市', code: 'qujing', pinyin: 'qujing', letter: 'Q' },

				// R
				{ name: '日照市', code: 'rizhao', pinyin: 'rizhao', letter: 'R' },

				// S
				{ name: '上海市', code: 'shanghai', pinyin: 'shanghai', letter: 'S' },
				{ name: '深圳市', code: 'shenzhen', pinyin: 'shenzhen', letter: 'S' },
				{ name: '沈阳市', code: 'shenyang', pinyin: 'shenyang', letter: 'S' },
				{ name: '石家庄市', code: 'shijiazhuang', pinyin: 'shijiazhuang', letter: 'S' },
				{ name: '苏州市', code: 'suzhou', pinyin: 'suzhou', letter: 'S' },
				{ name: '绍兴市', code: 'shaoxing', pinyin: 'shaoxing', letter: 'S' },
				{ name: '三亚市', code: 'sanya', pinyin: 'sanya', letter: 'S' },
				{ name: '三明市', code: 'sanming', pinyin: 'sanming', letter: 'S' },
				{ name: '三门峡市', code: 'sanmenxia', pinyin: 'sanmenxia', letter: 'S' },
				{ name: '商洛市', code: 'shangluo', pinyin: 'shangluo', letter: 'S' },
				{ name: '商丘市', code: 'shangqiu', pinyin: 'shangqiu', letter: 'S' },
				{ name: '上饶市', code: 'shangrao', pinyin: 'shangrao', letter: 'S' },
				{ name: '韶关市', code: 'shaoguan', pinyin: 'shaoguan', letter: 'S' },
				{ name: '汕尾市', code: 'shanwei', pinyin: 'shanwei', letter: 'S' },
				{ name: '汕头市', code: 'shantou', pinyin: 'shantou', letter: 'S' },
				{ name: '山南市', code: 'shannan', pinyin: 'shannan', letter: 'S' },
				{ name: '十堰市', code: 'shiyan', pinyin: 'shiyan', letter: 'S' },
				{ name: '石河子市', code: 'shihezi', pinyin: 'shihezi', letter: 'S' },
				{ name: '双鸭山市', code: 'shuangyashan', pinyin: 'shuangyashan', letter: 'S' },
				{ name: '朔州市', code: 'shuozhou', pinyin: 'shuozhou', letter: 'S' },
				{ name: '遂宁市', code: 'suining', pinyin: 'suining', letter: 'S' },
				{ name: '宿迁市', code: 'suqian', pinyin: 'suqian', letter: 'S' },
				{ name: '宿州市', code: 'suuzhou', pinyin: 'suuzhou', letter: 'S' }, // 注意与“苏州市”区分

				// T
				{ name: '天津市', code: 'tianjin', pinyin: 'tianjin', letter: 'T' },
				{ name: '太原市', code: 'taiyuan', pinyin: 'taiyuan', letter: 'T' },
				{ name: '泰安市', code: 'taian', pinyin: 'taian', letter: 'T' },
				{ name: '台州', code: 'taizhou', pinyin: 'taizhou', letter: 'T' },
				{ name: '塔城地区', code: 'tacheng', pinyin: 'tacheng', letter: 'T' },
				{ name: '吐鲁番市', code: 'tulufan', pinyin: 'tulufan', letter: 'T' },
				{ name: '通化市', code: 'tonghua', pinyin: 'tonghua', letter: 'T' },
				{ name: '通辽市', code: 'tongliao', pinyin: 'tongliao', letter: 'T' },
				{ name: '铜川市', code: 'tongchuan', pinyin: 'tongchuan', letter: 'T' },
				{ name: '铜陵市', code: 'tongling', pinyin: 'tongling', letter: 'T' },
				{ name: '铁岭市', code: 'tieling', pinyin: 'tieling', letter: 'T' },
				{ name: '天门市', code: 'tianmen', pinyin: 'tianmen', letter: 'T' },
				{ name: '天水市', code: 'tianshui', pinyin: 'tianshui', letter: 'T' },

				// W
				{ name: '武汉市', code: 'wuhan', pinyin: 'wuhan', letter: 'W' },
				{ name: '乌鲁木齐市', code: 'wulumuqi', pinyin: 'wulumuqi', letter: 'W' },
				{ name: '威海市', code: 'weihai', pinyin: 'weihai', letter: 'W' },
				{ name: '渭南市', code: 'weinan', pinyin: 'weinan', letter: 'W' },
				{ name: '文山壮族苗族自治州', code: 'wenshan', pinyin: 'wenshan', letter: 'W' },
				{ name: '乌海市', code: 'wuhai', pinyin: 'wuhai', letter: 'W' },
				{ name: '芜湖市', code: 'wuhu', pinyin: 'wuhu', letter: 'W' },
				{ name: '梧州市', code: 'wuzhou', pinyin: 'wuzhou', letter: 'W' },
				{ name: '武威市', code: 'wuwei', pinyin: 'wuwei', letter: 'W' },
				{ name: '无锡市', code: 'wuxi', pinyin: 'wuxi', letter: 'W' },
				{ name: '吴忠市', code: 'wuzhong', pinyin: 'wuzhong', letter: 'W' },
				{ name: '五指山市', code: 'wuzhishan', pinyin: 'wuzhishan', letter: 'W' },
				{ name: '温州市', code: 'wenzhou', pinyin: 'wenzhou', letter: 'W' },

				// X
				{ name: '西安市', code: 'xian', pinyin: 'xian', letter: 'X' },
				{ name: '厦门市', code: 'xiamen', pinyin: 'xiamen', letter: 'X' },
				{ name: '西宁市', code: 'xining', pinyin: 'xining', letter: 'X' },
				{ name: '咸宁市', code: 'xianning', pinyin: 'xianning', letter: 'X' },
				{ name: '咸阳市', code: 'xianyang', pinyin: 'xianyang', letter: 'X' },
				{ name: '湘潭市', code: 'xiangtan', pinyin: 'xiangtan', letter: 'X' },
				{ name: '襄阳市', code: 'xiangyang', pinyin: 'xiangyang', letter: 'X' },
				{ name: '孝感市', code: 'xiaogan', pinyin: 'xiaogan', letter: 'X' },
				{ name: '新乡市', code: 'xinxiang', pinyin: 'xinxiang', letter: 'X' },
				{ name: '信阳市', code: 'xinyang', pinyin: 'xinyang', letter: 'X' },
				{ name: '忻州市', code: 'xinzhou', pinyin: 'xinzhou', letter: 'X' },
				{ name: '兴安盟', code: 'xinganmeng', pinyin: 'xinganmeng', letter: 'X' },
				{ name: '宣城市', code: 'xuancheng', pinyin: 'xuancheng', letter: 'X' },
				{ name: '许昌市', code: 'xuchang', pinyin: 'xuchang', letter: 'X' },
				{ name: '徐州市', code: 'xuzhou', pinyin: 'xuzhou', letter: 'X' },
				{ name: '邢台市', code: 'xingtai', pinyin: 'xingtai', letter: 'X' },
				{ name: '锡林郭勒盟', code: 'xilinguole', pinyin: 'xilinguole', letter: 'X' },

				// Y
				{ name: '雅安市', code: 'yaan', pinyin: 'yaan', letter: 'Y' },
				{ name: '延安市', code: 'yanan', pinyin: 'yanan', letter: 'Y' },
				{ name: '延边朝鲜族自治州', code: 'yanbian', pinyin: 'yanbian', letter: 'Y' },
				{ name: '盐城市', code: 'yancheng', pinyin: 'yancheng', letter: 'Y' },
				{ name: '阳江市', code: 'yangjiang', pinyin: 'yangjiang', letter: 'Y' },
				{ name: '扬州市', code: 'yangzhou', pinyin: 'yangzhou', letter: 'Y' },
				{ name: '烟台市', code: 'yantai', pinyin: 'yantai', letter: 'Y' },
				{ name: '宜宾市', code: 'yibin', pinyin: 'yibin', letter: 'Y' },
				{ name: '伊犁哈萨克自治州', code: 'yilihasakezizhizhou', pinyin: 'yilihasakezizhizhou', letter: 'Y' },
				{ name: '宜春市', code: 'yichun', pinyin: 'yichun', letter: 'Y' },
				{ name: '宜昌市', code: 'yichang', pinyin: 'yichang', letter: 'Y' },
				{ name: '银川市', code: 'yinchuan', pinyin: 'yinchuan', letter: 'Y' },
				{ name: '鹰潭市', code: 'yingtan', pinyin: 'yingtan', letter: 'Y' },
				{ name: '营口市', code: 'yingkou', pinyin: 'yingkou', letter: 'Y' },
				{ name: '永州市', code: 'yongzhou', pinyin: 'yongzhou', letter: 'Y' },
				{ name: '榆林市', code: 'yulin', pinyin: 'yulin', letter: 'Y' },
				{ name: '玉林市', code: 'yulin', pinyin: 'yulin', letter: 'Y' },
				{ name: '玉树藏族自治州', code: 'yushu', pinyin: 'yushu', letter: 'Y' },
				{ name: '岳阳市', code: 'yueyang', pinyin: 'yueyang', letter: 'Y' },
				{ name: '云浮市', code: 'yunfu', pinyin: 'yunfu', letter: 'Y' },
				{ name: '运城市', code: 'yuncheng', pinyin: 'yuncheng', letter: 'Y' },
				{ name: '玉溪市', code: 'yuxi', pinyin: 'yuxi', letter: 'Y' },

				// Z
				{ name: '张家界市', code: 'zhangjiajie', pinyin: 'zhangjiajie', letter: 'Z' },
				{ name: '张家口市', code: 'zhangjiakou', pinyin: 'zhangjiakou', letter: 'Z' },
				{ name: '张掖市', code: 'zhangye', pinyin: 'zhangye', letter: 'Z' },
				{ name: '漳州市', code: 'zhangzhou', pinyin: 'zhangzhou', letter: 'Z' },
				{ name: '昭通市', code: 'zhaotong', pinyin: 'zhaotong', letter: 'Z' },
				{ name: '肇庆市', code: 'zhaoqing', pinyin: 'zhaoqing', letter: 'Z' },
				{ name: '郑州市', code: 'zhengzhou', pinyin: 'zhengzhou', letter: 'Z' },
				{ name: '镇江市', code: 'zhenjiang', pinyin: 'zhenjiang', letter: 'Z' },
				{ name: '中山市', code: 'zhongshan', pinyin: 'zhongshan', letter: 'Z' },
				{ name: '中卫市', code: 'zhongwei', pinyin: 'zhongwei', letter: 'Z' },
				{ name: '舟山市', code: 'zhoushan', pinyin: 'zhoushan', letter: 'Z' },
				{ name: '周口市', code: 'zhoukou', pinyin: 'zhoukou', letter: 'Z' },
				{ name: '株洲市', code: 'zhuzhou', pinyin: 'zhuzhou', letter: 'Z' },
				{ name: '驻马店市', code: 'zhumadian', pinyin: 'zhumadian', letter: 'Z' },
				{ name: '自贡市', code: 'zigong', pinyin: 'zigong', letter: 'Z' },
				{ name: '资阳市', code: 'ziyang', pinyin: 'ziyang', letter: 'Z' },
				{ name: '淄博市', code: 'zibo', pinyin: 'zibo', letter: 'Z' },
				{ name: '遵义市', code: 'zunyi', pinyin: 'zunyi', letter: 'Z' }
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
		// 加载历史选择记录
		this.loadHistoryQueue()
		console.log('页面加载完成，历史记录数量:', this.historyQueue.length)
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},

		onSearchInput(e) {
			this.searchKeyword = e.detail.value
		},

		selectCity(city) {
			// 添加到历史记录
			this.addToHistoryQueue(city)
			
			// 返回选中的城市信息
			const pages = getCurrentPages()
			const prevPage = pages[pages.length - 2]

			if (prevPage) {
				prevPage.$vm.onCitySelected(city)
			}

			uni.navigateBack()
		},

		// 加载历史选择记录
		loadHistoryQueue() {
			try {
				const history = uni.getStorageSync('city_history_queue')
				if (history) {
					this.historyQueue = JSON.parse(history)
				}
			} catch (e) {
				console.log('加载历史记录失败:', e)
				this.historyQueue = []
			}
		},

		// 保存历史选择记录
		saveHistoryQueue() {
			try {
				uni.setStorageSync('city_history_queue', JSON.stringify(this.historyQueue))
			} catch (e) {
				console.log('保存历史记录失败:', e)
			}
		},

		// 添加城市到历史队列
		addToHistoryQueue(city) {
			console.log('添加城市到历史队列:', city.name)
			
			// 检查是否已存在，如果存在则移除旧的
			const existingIndex = this.historyQueue.findIndex(item => item.code === city.code)
			if (existingIndex !== -1) {
				console.log('城市已存在，移除旧记录:', existingIndex)
				this.historyQueue.splice(existingIndex, 1)
			}

			// 添加到队列头部
			this.historyQueue.unshift(city)
			console.log('当前历史队列长度:', this.historyQueue.length)

			// 如果超过最大数量，移除队列尾部元素
			if (this.historyQueue.length > this.maxHistorySize) {
				const removed = this.historyQueue.pop()
				console.log('队列已满，移除:', removed.name)
			}

			// 保存到本地存储
			this.saveHistoryQueue()
		},

		// 切换编辑模式
		toggleEditMode() {
			this.isEditMode = !this.isEditMode
			console.log('切换编辑模式:', this.isEditMode, '历史记录数量:', this.historyQueue.length)
			
			if (this.isEditMode) {
				uni.showToast({
					title: '进入编辑模式',
					icon: 'none',
					duration: 1000
				})
			} else {
				uni.showToast({
					title: '退出编辑模式',
					icon: 'none',
					duration: 1000
				})
			}
		},

		// 处理历史记录项点击
		handleHistoryItemClick(city, index) {
			if (this.isEditMode) {
				// 编辑模式下不执行选择操作
				return
			}
			this.selectCity(city)
		},

		// 移除单个历史记录
		removeHistoryItem(index) {
			console.log('删除历史记录项:', index, this.historyQueue[index])
			
			if (index >= 0 && index < this.historyQueue.length) {
				this.historyQueue.splice(index, 1)
				this.saveHistoryQueue()
				
				uni.showToast({
					title: '已删除',
					icon: 'success',
					duration: 1000
				})
				
				// 如果历史记录为空，退出编辑模式
				if (this.historyQueue.length === 0) {
					this.isEditMode = false
				}
			}
		},

		// 清空所有历史记录
		clearAllHistory() {
			uni.showModal({
				title: '确认清空',
				content: '确定要清空所有历史选择记录吗？',
				success: (res) => {
					if (res.confirm) {
						this.historyQueue = []
						this.saveHistoryQueue()
						this.isEditMode = false
						uni.showToast({
							title: '已清空',
							icon: 'success'
						})
					}
				}
			})
		},

		scrollToLetter(letter) {
			// 使用 scroll-into-view 属性滚动到指定字母
			this.scrollIntoView = 'letter-' + letter
			
			// 清除滚动标记，避免影响后续滚动
			setTimeout(() => {
				this.scrollIntoView = ''
			}, 500)
		}
	}
}
</script>

<style scoped>
/* ==================== 基础容器 ==================== */
.city-container {
	min-height: 100vh;
	background: linear-gradient(180deg, #faf9f7 0%, #f5f3f0 100%);
	position: relative;
}

/* ==================== 头部区域 ==================== */
.header-section {
	position: relative;
	position: sticky;
	top: 0;
	z-index: 100;
}

.header-bg {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 100%;
	background: linear-gradient(135deg, #f6d55c 0%, #ed8936 100%);
	box-shadow: 0 4rpx 20rpx rgba(237, 137, 54, 0.3);
}

.header-content {
	position: relative;
	z-index: 2;
	padding-top: calc(60rpx + env(safe-area-inset-top));
}

.nav-bar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 88rpx;
	padding: 0 30rpx;
}

.nav-left,
.nav-right {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.edit-button {
	background: #f7fafc;
	border: 1rpx solid #e2e8f0;
	border-radius: 16rpx;
	padding: 8rpx 16rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
	min-width: 60rpx;
	text-align: center;
}

.edit-button:active {
	background: #edf2f7;
}

.edit-icon {
	font-size: 24rpx;
	color: #4a5568;
	font-weight: 500;
}

.back-button {
	width: 48rpx;
	height: 48rpx;
	background: rgba(255, 255, 255, 0.25);
	backdrop-filter: blur(20rpx);
	border: 1rpx solid rgba(255, 255, 255, 0.3);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.back-icon {
	font-size: 28rpx;
	color: #ffffff;
	font-weight: 700;
}

.nav-center {
	flex: 1;
}

.search-section {
	padding: 20rpx 30rpx 30rpx;
}

.search-box {
	display: flex;
	align-items: center;
	background: rgba(255, 255, 255, 0.25);
	backdrop-filter: blur(20rpx);
	border: 1rpx solid rgba(255, 255, 255, 0.3);
	border-radius: 50rpx;
	padding: 20rpx 30rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.search-icon {
	font-size: 28rpx;
	color: rgba(255, 255, 255, 0.8);
	margin-right: 20rpx;
}

.search-input {
	flex: 1;
	font-size: 28rpx;
	color: #ffffff;
	border: none;
	outline: none;
	background: transparent;
}

/* ==================== 内容区域 ==================== */
.content {
	height: calc(100vh - 200rpx);
	padding: 20rpx 0 40rpx;
}

/* ==================== 历史选择区域 ==================== */
.history-section {
	padding: 0 40rpx 20rpx;
}

.section-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 24rpx;
}

.history-actions {
	display: flex;
	align-items: center;
}

.clear-all-btn {
	background: rgba(239, 68, 68, 0.1);
	color: #ef4444;
	border: 1rpx solid rgba(239, 68, 68, 0.2);
	border-radius: 16rpx;
	padding: 8rpx 16rpx;
	font-size: 24rpx;
	font-weight: 500;
}

.clear-all-btn:active {
	background: rgba(239, 68, 68, 0.2);
}

.history-item {
	position: relative;
}

.history-item.edit-mode {
	animation: shake 0.3s ease-in-out;
}

.delete-btn {
	position: absolute;
	top: -8rpx;
	right: -8rpx;
	width: 32rpx;
	height: 32rpx;
	background: #ef4444;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 10;
	box-shadow: 0 2rpx 8rpx rgba(239, 68, 68, 0.3);
}

.delete-icon {
	font-size: 20rpx;
	color: #ffffff;
	font-weight: bold;
	line-height: 1;
}

@keyframes shake {
	0%, 100% { transform: translateX(0); }
	25% { transform: translateX(-2rpx); }
	75% { transform: translateX(2rpx); }
}

/* ==================== 热门城市 ==================== */
.hot-cities-section {
	padding: 0 40rpx 20rpx;
}

.section-header,
.list-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 24rpx;
}

.section-left {
	display: flex;
	align-items: center;
}

.section-right {
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.section-icon {
	font-size: 28rpx;
	margin-right: 12rpx;
}

.section-title {
	font-size: 28rpx;
	color: #2d3748;
	font-weight: 600;
}

.cities-grid {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 16rpx;
}

.city-item {
	position: relative;
	padding: 24rpx 12rpx;
	background: #ffffff;
	border-radius: 20rpx;
	text-align: center;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
	border: 1rpx solid rgba(255, 255, 255, 0.8);
	transition: all 0.3s ease;
	overflow: hidden;
}

.city-item:active {
	transform: translateY(1rpx);
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.12);
}

.city-item.active {
	background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
	box-shadow: 0 6rpx 24rpx rgba(66, 153, 225, 0.4);
}

.city-name {
	font-size: 26rpx;
	color: #2d3748;
	font-weight: 500;
	position: relative;
	z-index: 2;
}

.city-item.active .city-name {
	color: #ffffff;
}

.city-glow {
	position: absolute;
	inset: -4rpx;
	background: linear-gradient(135deg, #4299e1, #3182ce);
	border-radius: 24rpx;
	opacity: 0.3;
	filter: blur(8rpx);
	z-index: 1;
}

/* ==================== 城市列表 ==================== */
.cities-list-section {
	padding: 0 40rpx;
}

.list-header {
	margin-bottom: 16rpx;
}

.letter-section {
	background: #ffffff;
	border-radius: 24rpx;
	margin-bottom: 16rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
	border: 1rpx solid rgba(255, 255, 255, 0.8);
}

.letter-title {
	padding: 20rpx 32rpx;
	font-size: 24rpx;
	color: #718096;
	background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
	font-weight: 600;
}

.city-list-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 24rpx 32rpx;
	border-bottom: 1rpx solid #f7fafc;
	transition: all 0.2s ease;
}

.city-list-item:last-child {
	border-bottom: none;
}

.city-list-item:active {
	background: #f7fafc;
}

.city-list-name {
	font-size: 28rpx;
	color: #2d3748;
	font-weight: 500;
}

.city-arrow {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 40rpx;
	height: 40rpx;
}

.city-arrow .arrow-icon {
	width: 32rpx;
	height: 32rpx;
	opacity: 0.8;
}

/* ==================== 字母索引 ==================== */
.letter-index {
	position: fixed;
	right: 20rpx;
	top: 50%;
	transform: translateY(-50%);
	z-index: 200;
	background: rgba(255, 255, 255, 0.9);
	backdrop-filter: blur(20rpx);
	border: 1rpx solid rgba(255, 255, 255, 0.3);
	border-radius: 20rpx;
	padding: 8rpx 0;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.letter-index-item {
	width: 40rpx;
	height: 32rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 2rpx 0;
	transition: all 0.2s ease;
}

.letter-index-item:active {
	background: rgba(66, 153, 225, 0.1);
	border-radius: 8rpx;
}

.letter-index-text {
	font-size: 20rpx;
	color: #4a5568;
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
</style>