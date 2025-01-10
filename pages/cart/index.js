/**
 * 导入requestUtil请求的工具类
 */
import {
	getBaseUrl,
	requestUtil
} from '../../utils/requestUtil.js';
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		address: {}, //收获地址
		cart: [], //商品数据
		baseUrl: '', //初始化根路径 
		allChecked: false, //全选
		totalPrice: 0, //总价
		totalNum: 0 //总量
	},
	// 点击 获取收货地址
	handleChooseAddress() {
		wx.chooseAddress({
			success: (result) => {
				console.log(result);
				wx.setStorageSync('address', result)
			},
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		const baseUrl = getBaseUrl();
		this.setData({
			baseUrl
		})
	},
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {
		// console.log("show");
		const address = wx.getStorageSync('address');
		const cart = wx.getStorageSync('cart') || [];
		this.setData({
			address,
		})
		this.setCart(cart); // 重新计算
	},
	//商品选中事件处理
	handleItemChange(e) {
		const {
			id
		} = e.currentTarget.dataset;
		// 获取购物车数组
		let {
			cart
		} = this.data;
		let index = cart.findIndex(v => v.id === id);
		// console.log(index);
		cart[index].checked = !cart[index].checked;
		this.setCart(cart); // 重新计算
	},
	// 商品全选事件处理
	handleItemAllCheck() {
		let {
			cart,
			allChecked
		} = this.data; // 获取data中的数据
		allChecked = !allChecked; // 修改值
		// 循环修改cart数组中的商品修改状态 
		cart.forEach(v => v.checked = allChecked);
		// 修改后的值 填充回data以及缓存中
		this.setCart(cart);
	},
	// 商品数量的编辑功能
	handleItemNumEdit(e) {
		const {
			operation,
			id
		} = e.currentTarget.dataset;
		// console.log(operation, id);
		let {
			cart
		} = this.data;
		let index = cart.findIndex(v => v.id === id);
		if (cart[index].num === 1 && operation === -1) {
			wx.showModal({
				title: '系统提示',
				content: '您是否要删除？',
				cancelColor: 'cancelColor',
				success: (res) => {
					if (res.confirm) {
						cart.splice(index, 1);
						this.setCart(cart);
					}
				}
			})
		} else {
			cart[index].num += operation;
			this.setCart(cart);
		}
	},
	//点击结算
	handlePay() {
		const {
			address,
			totalNum
		} = this.data;
		if (!address) {
			wx.showToast({
				title: '您还没有选择收货地址',
				icon: 'none'
			})
			return;
		}
		if (totalNum === 0) {
			wx.showToast({
				title: '您还没有选购商品',
			})
			return;
		}
		wx.navigateTo({
			url: '/pages/pay/index',
		})
	},
	// 设置购物车状态 同时 重新计算 底部工具栏 数据 全选 总价格 购物买书 以及重新设置缓存
	setCart(cart) {
		let allChecked = true;
		let totalPrice = 0;
		let totalNum = 0;
		cart.forEach(v => {
			if (v.checked) {
				totalPrice += v.num * v.price;
				totalNum += v.num;
			} else {
				allChecked = false;
			}
		})
		allChecked = cart.length != 0 ? allChecked : false;
		this.setData({
			// address,
			cart,
			allChecked,
			totalNum,
			totalPrice
		})
		// cart设置到缓存中
		wx.setStorageSync('cart', cart);
	},
})