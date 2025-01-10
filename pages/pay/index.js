// 导入request请求工具类
import {
  getBaseUrl,
  getWxLogin,
  requestPay,
  getUserProfile,
  requestUtil
} from '../../utils/requestUtil.js';
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  /**
  * 页面的初始数据
  */
  data: {
    baseUrl: '',
    cart: [],
    address: {},
    totalPrice: 0,
    totalNum: 0
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    const baseUrl = getBaseUrl();
    this.setData({
      baseUrl
    })
  },
  //处理订单支付(去付款)
  async handleOrderPay() {
    /**
     *  // wx.login({
    //   timeout: 5000,
    //   success: (res) => {
    //     console.log("code=" + res.code)
    //   }
    // })
    // let res = await getWxLogin();
    // console.log("code=" + res.code)
    // wx.getUserProfile({
    //   desc: '获取用户信息',
    //   success: (res) => {
    //     console.log(res);
    //     console.log(res.userInfo.nickName, res.userInfo.avatarUrl)
    //   }
    // })
    // let res2 = await getUserProfile();
    // console.log(res2.userInfo.nickName, res2.userInfo.avatarUrl)
     */
    const token = wx.getStorageSync('token');
    if (!token) {
      Promise.all([getWxLogin(), getUserProfile()]).then((res) => {
        // console.log(res);
        console.log(res[0].code);
        console.log(res[1].userInfo.nickName, res[1].userInfo.avatarUrl);
        let loginParam = {
          code: res[0].code,
          nickName: res[1].userInfo.nickName,
          avatarUrl: res[1].userInfo.avatarUrl
        }
        console.log(loginParam);//获取token
        wx.setStorageSync('userInfo', res[1].userInfo);
        this.wxlogin(loginParam);//发送后端请求
      })
    } else {
      console.log("token存在:" + token);
      //支付继续走，创建订单
      console.log("支付继续走，创建订单");
      this.createOrder();//调用订单
    }
  },
  /**
   * 请求后端获取用户token
   * @param {} loginParam 
   */
  async wxlogin(loginParam) {
    const result = await requestUtil({ url: "/user/wxlogin", data: loginParam, method: "post" });
    console.log(result); //获取的token值为空
    const token = result.token;
    if (result.code === 0) {
      //存储token到缓存
      wx.setStorageSync('token', token);
      //支付继续走，创建订单
      console.log("支付继续走，创建订单");
      this.createOrder();
    }
  },
  /**
   * 创建订单
   */
  async createOrder() {
    try{
      const totalPrice = this.data.totalPrice; // 请求体 总价
      const address = this.data.address.provinceName +
        this.data.address.cityName +
        this.data.address.countyName +
        this.data.address.detailInfo; // 请求体 收货地址
      const consignee = this.data.address.userNa9// 请求体 收货人
      const telNumber = this.data.address.telNumber; // 请求体 联系电话
      let goods = [];
      this.data.cart.forEach(v => goods.push({
        goodsId: v.id,
        goodsNumber: v.num,
        goodsPrice: v.price,
        goodsName: v.name,
        goodsPic: v.proPic
      }))
      const orderParam = {
        totalPrice,
        address,
        consignee,
        telNumber,
        goods
      }
      const res = await
        requestUtil({ url: "/my/order/create", method: "POST", data: orderParam })
      console.log("orderNo="+res.orderNo);
      let orderNo=res.orderNo;
      // 调用统一下单，预支付
      const preparePayRes = await requestUtil({ 
        url: "/my/order/preparePay", 
        method: "POST", 
        data: orderNo
      });
      let payRes=await requestPay(preparePayRes);
      // 删除缓存中的 已经支付的商品
      let newCart = wx.getStorageSync('cart');
      newCart = newCart.filter(v => !v.checked);//未选中的商品集合
      wx.setStorageSync('cart', newCart);//存储到newCart
      wx.showToast({
        title: '支付成功',
        icon: 'none'
      })
      wx.navigateTo({
        url: '/pages/order/index?type=0'
      })  
    }catch(error){
      console.log(error);
      wx.showToast({
        title: '支付失败，请稍后重试',
        icon:'none'
      })
    }
  },
  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    // console.log("show");
    const address = wx.getStorageSync('address');
    let cart = wx.getStorageSync('cart') || [];
    cart = cart.filter(v => v.checked);// 选中的商品显示
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.num * v.price;
      totalNum += v.num;
    })
    this.setData({
      cart,
      address,
      totalNum,
      totalPrice
    })
  }
})
