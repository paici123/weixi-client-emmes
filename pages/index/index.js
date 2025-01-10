/**
 * 导入requestUtil请求的工具类
 */
import {
  getBaseUrl,
  requestUtil
} from '../../utils/requestUtil.js';
//只需引用，不用调用
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    swiperList: [], //轮播图数组
    baseUrl: '', //初始化根路径
    bigTypeList: [],//初始化商品大类
    bigTypeList_row1: [],//商品大类第一列
    bigTypeList_row2: [],//商品大类第二列
    hotProductList: [],//初始化商品热卖
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const baseUrl = getBaseUrl();
    this.setData({
      baseUrl
    });
    //担心网络请求的根加载不过来
    //发送异步请求获取后端数据
    //   url: 'http://localhost:8080/product/findSwiper',
    //   method:"GET",
    //   success:(result)=>{
    //     console.log(result);
    //     this.setData({
    //       swiperList:result.data.message//赋值给轮播图数组
    //     })
    //   }
    // })
    //异步执行函数
    this.getSwiperList();//图片轮播函数调用
    this.getBigTypeList();//商品大类函数调用
    this.getProductList();//商品热卖函数调用
  },
  /**
  * 在首页中的商品大类点击商品跳转到商品分类内容里
  */
  handleTypeJump(e) {
    // console.log(e);
    const { index } = e.currentTarget.dataset;
    const app = getApp();
    app.globalData.index = index;
    wx.switchTab({
      url: '/pages/category/index',
    })
  },
  /**
   * 商品图片轮播图
   */
  async getSwiperList() {
    // requestUtil({
    //     url: '/product/findSwiper',
    //     method: "GET"
    //   })
    //   .then(result => {
    //     const baseUrl = getBaseUrl();
    //     this.setData({
    //       swiperList: result.message,
    //       baseUrl
    //     })
    //   })
    const result = await requestUtil({
      url: '/product/findSwiper',
      method: "GET"
    });
    this.setData({
      swiperList: result.message
    })
  },
  /**
   * 商品大类请求的数据处理方法
   */
  async getBigTypeList() {
    const result = await requestUtil({
      url: '/bigType/findAll',
      method: "GET"
    });
    // console.log(result);
    const bigTypeList = result.message;
    const bigTypeList_row1 = bigTypeList.filter((item, index) => {
      return index < 5;
    });
    const bigTypeList_row2 = bigTypeList.filter((item, index) => {
      return index >= 5;
    })
    this.setData({
      bigTypeList,
      bigTypeList_row1,
      bigTypeList_row2,
    })
  },
  /**
   * 获取商品热卖请求的数据处理方法
   */
  async getProductList() {
    const result = await requestUtil({
      url: '/product/findHot',
      method: "GET"
    });
    this.setData({
      hotProductList: result.message
    })
  },

})