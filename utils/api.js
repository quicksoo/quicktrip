// API 服务封装
class ApiService {
	
	/**
	 * 获取景点列表
	 * @param {string} city 城市代码
	 * @param {string} keyword 搜索关键词
	 */
	static async getScenicSpots(city, keyword) {
		try {
			// #ifdef MP-WEIXIN
			const result = await uniCloud.callFunction({
				name: 'getScenicSpots',
				data: {
					city,
					keyword
				}
			});
			
			if (result.result.code === 0) {
				return result.result.data;
			} else {
				throw new Error(result.result.message);
			}
			// #endif
			
			// #ifdef H5
			// H5环境下返回模拟数据
			throw new Error('H5环境，使用本地数据');
			// #endif
		} catch (error) {
			console.error('获取景点列表失败:', error);
			throw error;
		}
	}
	
	/**
	 * 提交用户反馈
	 * @param {Object} feedbackData 反馈数据
	 */
	static async submitFeedback(feedbackData) {
		try {
			// #ifdef MP-WEIXIN
			const result = await uniCloud.callFunction({
				name: 'submitFeedback',
				data: feedbackData
			});
			
			if (result.result.code === 0) {
				return result.result.data;
			} else {
				throw new Error(result.result.message);
			}
			// #endif
			
			// #ifdef H5
			// H5环境下模拟提交成功
			console.log('H5环境模拟提交反馈:', feedbackData);
			await new Promise(resolve => setTimeout(resolve, 1000));
			return { id: 'mock_' + Date.now() };
			// #endif
		} catch (error) {
			console.error('提交反馈失败:', error);
			throw error;
		}
	}
}

export default ApiService;