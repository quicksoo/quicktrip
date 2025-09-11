// 本地存储工具类
class StorageService {
	
	/**
	 * 获取常用城市列表
	 */
	static getFrequentCities() {
		try {
			const cities = uni.getStorageSync('frequent_cities');
			return cities ? JSON.parse(cities) : [];
		} catch (error) {
			console.error('获取常用城市失败:', error);
			return [];
		}
	}
	
	/**
	 * 保存常用城市
	 * @param {Array} cities 城市列表
	 */
	static setFrequentCities(cities) {
		try {
			uni.setStorageSync('frequent_cities', JSON.stringify(cities));
		} catch (error) {
			console.error('保存常用城市失败:', error);
		}
	}
	
	/**
	 * 添加城市到常用列表
	 * @param {Object} city 城市对象
	 */
	static addFrequentCity(city) {
		try {
			let cities = this.getFrequentCities();
			
			// 检查是否已存在
			const existIndex = cities.findIndex(c => c.code === city.code);
			if (existIndex !== -1) {
				// 如果存在，移到第一位
				cities.splice(existIndex, 1);
			}
			
			// 添加到第一位
			cities.unshift(city);
			
			// 最多保存10个常用城市
			if (cities.length > 10) {
				cities = cities.slice(0, 10);
			}
			
			this.setFrequentCities(cities);
		} catch (error) {
			console.error('添加常用城市失败:', error);
		}
	}
	
	/**
	 * 获取上次选择的城市
	 */
	static getLastSelectedCity() {
		try {
			const city = uni.getStorageSync('last_selected_city');
			return city ? JSON.parse(city) : null;
		} catch (error) {
			console.error('获取上次选择城市失败:', error);
			return null;
		}
	}
	
	/**
	 * 保存上次选择的城市
	 * @param {Object} city 城市对象
	 */
	static setLastSelectedCity(city) {
		try {
			uni.setStorageSync('last_selected_city', JSON.stringify(city));
		} catch (error) {
			console.error('保存上次选择城市失败:', error);
		}
	}
}

export default StorageService;