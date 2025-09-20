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
					<input class="search-input" v-model="searchKeyword" placeholder="城市/拼音" @input="onSearchInput"
						placeholder-style="color: #ccc" />
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
					<text class="current-city">{{ currentLocationCity }}</text>
				</view>
			</view>

			<!-- 热门城市 -->
			<view class="hot-cities-section">
				<view class="section-title">热门城市</view>
				<view class="cities-grid">
					<view class="city-item" :class="{ 'active': item.code === selectedCityCode }"
						v-for="(item, index) in hotCities" :key="index" @tap="selectCity(item)">
						<text class="city-name">{{ item.name }}</text>
					</view>
				</view>
			</view>

			<!-- 城市列表 -->
			<view class="cities-list-section">
				<!-- 字母索引对应的城市 -->
				<view class="letter-section" v-for="(letter, index) in sortedLetters" :key="index"
					:id="'letter-' + letter">
					<view class="letter-title">{{ letter }}</view>
					<view class="cities-in-letter">
						<view class="city-list-item" v-for="(city, cityIndex) in citiesByLetter[letter]"
							:key="cityIndex" @tap="selectCity(city)">
							<text class="city-list-name">{{ city.name }}</text>
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

.nav-left,
.nav-right {
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

.cities-in-letter {}

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