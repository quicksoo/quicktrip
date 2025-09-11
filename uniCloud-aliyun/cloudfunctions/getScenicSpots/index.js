'use strict';

const db = uniCloud.database();

exports.main = async (event, context) => {
	const { city, keyword } = event;
	
	try {
		let query = db.collection('scenic_spots');
		
		// 按城市筛选
		if (city) {
			query = query.where({
				city: city
			});
		}
		
		// 关键词搜索
		if (keyword) {
			query = query.where({
				name: new RegExp(keyword, 'i')
			});
		}
		
		const result = await query.orderBy('sort', 'asc').get();
		
		return {
			code: 0,
			message: 'success',
			data: result.data
		};
	} catch (error) {
		return {
			code: -1,
			message: error.message,
			data: []
		};
	}
};