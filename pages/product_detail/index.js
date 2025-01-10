/**
 * 导入requestUtil请求的工具类
 */
import {
  getBaseUrl,
  requestUtil
} from '../../utils/requestUtil.js';
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: '', //初始化根路径
    productObj: {},//初始化商品详情对象
    activeIndex: 0,//默认初始化数据，给个判断
  },
  productInfo: {//购物车的对象

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // console.log(options.id);
    const baseUrl = getBaseUrl();
    this.setData({
      baseUrl
    });
    this.getProductDetail(options.id)
  },
  /**
   * tab点击事件
   */
  handleItemTap(e) {
    const { index } = e.currentTarget.dataset;
    console.log(index)
    this.setData({
      activeIndex: index
    })
  },
  /**
 * 获取商品详情
 */
  async getProductDetail(id) {
    const result = await requestUtil({
      url: '/product/detail',
      data: { id },
      method: "GET"
    });
    this.productInfo = result.message;
    this.setData({
      productObj: result.message
    })
  },
  /**
   * 点击事件 商品加入购物车
   */
  handleCartAdd() {
    this.setCartAdd();
    wx.showToast({// 弹窗提示
      title: '加入成功',
      icon: 'success',
      mask: true
    })
  },
  //点击立即购买
  handleBuy() {
    // const { address, totalNum } = this.data;
    // if (!address) {
    //   wx.showToast({
    //     title: '您还没有选择收货地址',
    //     icon: 'none'
    //   })
    //   return;
    // }
    // if (totalNum === 0) {
    //   wx.showToast({
    //     title: '您还没有选购商品',
    //     icon: 'none'
    //   })
    //   return;
    // }
    this.setCartAdd();
    wx.switchTab({
      url: '/pages/cart/index',
    })
  },
  // 加入购物车
  setCartAdd() {
    // 获取缓存中的购物车 数组格式
    let cart = wx.getStorageSync('cart') || [];
    // 判断商品对象中是否存在于购物车数组中
    let index = cart.findIndex(v => v.id === this.productInfo.id);
    if (index === -1) { // 购物车里面不存在当前商品
      this.productInfo.num = 1;
      this.productInfo.checked = true;//默认选中
      cart.push(this.productInfo);
    } else { // 已经存在
      cart[index].num++;
    }
    wx.setStorageSync('cart', cart); // 把购物车添加到缓存中
  },
})