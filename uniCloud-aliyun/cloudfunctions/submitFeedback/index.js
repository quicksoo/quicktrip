'use strict';

const db = uniCloud.database();

exports.main = async (event, context) => {
	const { province, city, scenicSpotName, scenicSpotAddress, reservationInfo } = event;
	
	try {
		// 验证必填字段
		if (!province || !city || !scenicSpotName) {
			return {
				code: -1,
				message: '省份、城市和景点名称为必填项',
				data: null
			};
		}
		
		// 插入反馈数据
		const result = await db.collection('user_feedback').add({
			province,
			city,
			scenicSpotName,
			scenicSpotAddress: scenicSpotAddress || '',
			reservationInfo: reservationInfo || '',
			status: 'pending', // pending: 待处理, processed: 已处理
			createTime: new Date(),
			updateTime: new Date()
		});
		
		return {
			code: 0,
			message: '反馈提交成功',
			data: {
				id: result.id
			}
		};
	} catch (error) {
		return {
			code: -1,
			message: error.message,
			data: null
		};
	}
};