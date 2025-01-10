// 导入request请求工具方法
import {
  getBaseUrl,
  requestUtil,
  getWxLogin,
  getUserProfile} from "../../utils/requestUtil.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{}//存储用户信息
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const baseUrl = getBaseUrl();
    this.setData({
      baseUrl
    });
    const token=wx.getStorageSync('token');
    if(!token){// 判断缓存中是否有token
      wx.showModal({
        title:'友情提示',
        content:'微信授权登录后，才可进入个人中心',
        success:(res)=>{
          Promise.all([getWxLogin(),getUserProfile()]).then((res)=>{
            // console.log(res)
            let loginParam={//获取信息
              code:res[0].code,
              nickName:res[1].userInfo.nickName,
              avatarUrl:res[1].userInfo.avatarUrl
            }
            // console.log(loginParam);//token 里面用户数据
            // 把用户信息放到缓存中
            wx.setStorageSync('userInfo', res[1].userInfo);
            this.wxlogin(loginParam);//执行登录
            this.setData({//记录登录时间数据
              userInfo:res[1].userInfo
            });
          })
        }
      })
    }else{
      console.log("token存在");//用户登录信息保存着在本地服务器中
      const userInfo=wx.getStorageSync('userInfo');
      this.setData({
        userInfo,
      })
    }
  },
   /**
   * 请求后端获取用户token
   * @param {} loginParam 
   */
  async wxlogin(loginParam) {
    const result = await requestUtil({ url: "/user/wxlogin", data: loginParam, method: "post" });
    //console.log(result); //获取的token值
    const token = result.token;
    if (result.code === 0) {
      wx.setStorageSync('token', token);//存储token到缓存
    }
  },
  /**
   * 点击 编辑收货地址
   */
  handleEditAddress(){
    wx.chooseAddress({
      success: (result) => {
      },
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // console.log("onShow")
    const userInfo=wx.getStorageSync('userInfo');
    this.setData({userInfo});
  },
  //退出登录
  loginOut(){//伪退出登录 
    this.setData({
      userInfo:'',
    })
    wx.setStorageSync('userInfo', null);//清空本地授权登录信息
  },  

})