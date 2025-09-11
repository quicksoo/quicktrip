// 数据库初始化脚本
// 这个文件用于初始化云数据库的集合和数据

// 景点数据集合结构
const scenicSpotsSchema = {
	collection: 'scenic_spots',
	fields: {
		name: 'string',           // 景点名称
		city: 'string',           // 城市代码
		cityName: 'string',       // 城市名称
		province: 'string',       // 省份
		address: 'string',        // 详细地址
		reservationTime: 'string', // 预约时间说明
		shortLink: 'string',      // 小程序跳转链接
		officialWebsite: 'string', // 官方网站
		phone: 'string',          // 联系电话
		openTime: 'string',       // 开放时间
		ticketPrice: 'string',    // 门票价格
		description: 'string',    // 景点描述
		images: 'array',          // 景点图片
		tags: 'array',           // 标签
		rating: 'number',        // 评分
		sort: 'number',          // 排序
		status: 'string',        // 状态: active, inactive
		createTime: 'date',      // 创建时间
		updateTime: 'date'       // 更新时间
	}
};

// 用户反馈集合结构
const userFeedbackSchema = {
	collection: 'user_feedback',
	fields: {
		province: 'string',           // 省份
		city: 'string',              // 城市
		scenicSpotName: 'string',    // 景点名称
		scenicSpotAddress: 'string', // 景点地址
		reservationInfo: 'string',   // 预约信息
		status: 'string',            // 处理状态: pending, processed, rejected
		adminNote: 'string',         // 管理员备注
		createTime: 'date',          // 创建时间
		updateTime: 'date'           // 更新时间
	}
};

// 初始化景点数据
const initScenicSpots = [
	{
		name: '故宫博物院',
		city: 'beijing',
		cityName: '北京',
		province: '北京市',
		address: '北京市东城区景山前街4号',
		reservationTime: '每日8:30开放预约，提前10天',
		shortLink: '#小程序://故宫博物院/geRMQLju4OmGTfK',
		officialWebsite: 'https://www.dpm.org.cn/',
		phone: '010-85007421',
		openTime: '08:30-17:00（4月-10月）08:30-16:30（11月-3月）',
		ticketPrice: '60元（旺季）40元（淡季）',
		description: '明清两代的皇家宫殿，世界文化遗产',
		tags: ['历史', '文化', '必游'],
		rating: 4.8,
		sort: 1,
		status: 'active',
		createTime: new Date(),
		updateTime: new Date()
	},
	{
		name: '天坛公园',
		city: 'beijing',
		cityName: '北京',
		province: '北京市',
		address: '北京市东城区天坛路甲1号',
		reservationTime: '提前7天预约',
		shortLink: '#小程序://天坛公园/xxxxx',
		officialWebsite: 'http://www.tiantanpark.com/',
		phone: '010-67028866',
		openTime: '06:00-22:00',
		ticketPrice: '15元（公园）35元（联票）',
		description: '明清皇帝祭天的场所，世界文化遗产',
		tags: ['历史', '建筑', '公园'],
		rating: 4.6,
		sort: 2,
		status: 'active',
		createTime: new Date(),
		updateTime: new Date()
	},
	{
		name: '上海博物馆',
		city: 'shanghai',
		cityName: '上海',
		province: '上海市',
		address: '上海市黄浦区人民大道201号',
		reservationTime: '提前7天9:00开放预约',
		shortLink: '#小程序://上海博物馆/xxxxx',
		officialWebsite: 'https://www.shanghaimuseum.net/',
		phone: '021-63723500',
		openTime: '09:00-17:00（周一闭馆）',
		ticketPrice: '免费（需预约）',
		description: '中国古代艺术博物馆',
		tags: ['文化', '艺术', '免费'],
		rating: 4.7,
		sort: 1,
		status: 'active',
		createTime: new Date(),
		updateTime: new Date()
	},
	{
		name: '外滩',
		city: 'shanghai',
		cityName: '上海',
		province: '上海市',
		address: '上海市黄浦区中山东一路',
		reservationTime: '无需预约',
		shortLink: '',
		officialWebsite: '',
		phone: '',
		openTime: '全天开放',
		ticketPrice: '免费',
		description: '上海的标志性景观，万国建筑博览群',
		tags: ['地标', '夜景', '免费'],
		rating: 4.5,
		sort: 2,
		status: 'active',
		createTime: new Date(),
		updateTime: new Date()
	},
	{
		name: '广州塔',
		city: 'guangzhou',
		cityName: '广州',
		province: '广东省',
		address: '广州市海珠区阅江西路222号',
		reservationTime: '提前3天预约',
		shortLink: '#小程序://广州塔/xxxxx',
		officialWebsite: 'http://www.cantontower.com/',
		phone: '020-89338222',
		openTime: '09:00-23:00',
		ticketPrice: '150-480元（不同项目）',
		description: '广州新电视塔，城市新地标',
		tags: ['地标', '观光', '夜景'],
		rating: 4.4,
		sort: 1,
		status: 'active',
		createTime: new Date(),
		updateTime: new Date()
	},
	{
		name: '西湖',
		city: 'hangzhou',
		cityName: '杭州',
		province: '浙江省',
		address: '浙江省杭州市西湖区龙井路1号',
		reservationTime: '无需预约',
		shortLink: '',
		officialWebsite: 'http://www.westlake.gov.cn/',
		phone: '0571-87977767',
		openTime: '全天开放',
		ticketPrice: '免费',
		description: '杭州西湖，世界文化遗产',
		tags: ['自然', '免费', '必游'],
		rating: 4.9,
		sort: 1,
		status: 'active',
		createTime: new Date(),
		updateTime: new Date()
	}
];

export { scenicSpotsSchema, userFeedbackSchema, initScenicSpots };