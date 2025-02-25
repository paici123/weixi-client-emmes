// 定义请求根路径的baseUrl
const baseUrl="http://localhost:8080/";
// 同时发送异步代码的次数
let ajaxTimes=0;
/**
 * 返回请求根路径的baseUrl
 */
export const getBaseUrl=()=>{
  return baseUrl;
}
/**
 * wx login封装
 * @param {*} param
 * 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
 */
export const getWxLogin=()=>{
  return new Promise((resolve,reject)=>{
    // 获取小程序登录成功后的code
    wx.login({
      timeout: 5000,
      success:(res)=>{
        resolve(res);
      },
      fail:(err)=>{
        reject(err);
      }
    })
  })
}
/**
 * wx getUserProfile封装
 * @param {*} param0 
 */
export const getUserProfile=()=>{
  return new Promise((resolve,reject)=>{
    wx.getUserProfile({
      desc: '获取用户信息',
      success: (res)=>{
        resolve(res);
      },
      fail:(err)=>{
        reject(err);
      }
    })
  })
}
/**
 * promise形式的 小程序的微信支付
 * @param {*} pay 
 */
export const requestPay=(pay)=>{
  return new Promise((resolve,reject)=>{
    wx.requestPayment({
      ...pay,
      desc:'获取用户信息',
      success:(res)=>{
        resolve(res);
      },
      fail:(err)=>{
        reject(err);
      }
    })
  })
}
/**
 * 后端请求工具类
 * @param {*} params 请求参数
 */
export const requestUtil=(params)=>{
  // 判断 url中是否带有 /my/ 请求的是私有的路径 带上header token
  let header={...params.header};
  if(params.url.includes("/my/")){
    // 拼接header 带上token
    header["token"]=wx.getStorageSync("token");
  }

  var start=new Date().getTime();
  console.log(start);
  
  ajaxTimes++;
  wx.showLoading({// 显示加载中 效果
    title: '加载中...',
    mask:true
  })
  // 模拟网络延迟加载
  while(true){
    if(new Date().getTime()-start > 1000*1) break;
  }
  return new Promise((resolve,reject)=>{
    wx.request({
    ...params,
    header,
    url:baseUrl+params.url,
    success:(result)=>{
      resolve(result.data);
    },
    fail:(err)=>{
      reject(err);
    },
    complete:()=>{
      ajaxTimes--;
      if(ajaxTimes===0){
        wx.hideLoading();//关闭正在等待的图标
      }
    }
    });
  })
}