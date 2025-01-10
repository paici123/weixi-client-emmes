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
    productList: [], //商品数组
    isFocus: false, // 取消 按钮 是否显示
    inputValue: "" // 输入框的值
  },
  TimeoutId:-1,//设置清除每次请求的定时器
  // 输入框值改变事件
  handleInput(e) {
    const {
      value
    } = e.detail;
    console.log(value)
    if (!value.trim()) {
      this.setData({
        productList: [],
        isFocus: false
      })
      return;
    }
    clearTimeout(this.TimeoutId);
    this.TimeoutId=this.setData({//设置定时器解决输入框输入搜索时延迟卡顿
      isFocus: true
    })
    setTimeout(()=>{
      this.search(value)
    },1000)
  },
  /**
   * 请求后端 商品搜索
   */
  async search(q) {
    const result = await requestUtil({
      url: '/product/search',
      data: {
        q
      }
    });
    this.setData({
      productList: result.productList
    })
  },
  // 点击 取消按钮
  handleCancel() {
    this.setData({
      productList: [], // 商品数组
      isFocus: false, // 取消 按钮 是否显示
      inputValue: "" // 输入框的值
    })
  },


})