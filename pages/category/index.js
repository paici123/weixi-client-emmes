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
        baseUrl:'',//初始化根路径 
        leftMenuList: [], //左侧菜单数据
        rightContext: [], //右侧商品数据
        currentIndex:0,//左侧菜单栏点击切换
        scrollTop:0,//左侧菜单选择后的置顶设置 
    },
    //所有商品数据
    Cates: [],
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // console.log("onLoad");
        const baseUrl = getBaseUrl();
        this.setData({
          baseUrl
        });
        this.getCates();//商品分类函数调用
    },
    /**
     * 获取商品分类数据
     */
    async getCates() {
        const result = await requestUtil({
            url: '/bigType/findCategories',
            method: "GET"
        });
        this.Cates=result.message;
        // console.log("获取到Cates");
        let leftMenuList=this.Cates.map(v=> v.name);//通过遍历获取第一层数据
        let rightContext=this.Cates[0].smallTypeList;//通过遍历获取第一层数据
        this.setData({
            leftMenuList,
            rightContext
        })
    },
    /**
     * 获取商品分类数据 从首页过来的
     */
    async getCates2(index) {
        const baseUrl = getBaseUrl();
        const result = await requestUtil({
            url: '/bigType/findCategories',
            method: "GET"
        });
        this.Cates=result.message;
        // console.log("获取到Cates");
        let leftMenuList=this.Cates.map(v=> v.name);
        let rightContext=this.Cates[index].smallTypeList;
        this.setData({
            leftMenuList,
            rightContext,
            currentIndex:index,
            scrollTop:0,
            baseUrl
        })
    },
    /**
     * 左侧菜单点击切换事件
     */
    handleMenuItemChange(e){
        // console.log(e);
        const {index}=e.currentTarget.dataset;//获取数据下标index
        let rightContext=this.Cates[index].smallTypeList;//根据index值点击左侧菜单后右侧内容跟着变化
        // console.log("index="+index);
        this.setData({
            currentIndex:index,
            rightContext,
            scrollTop:0
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        // console.log("onShow");
        const app=getApp();
        const {index}=app.globalData;
        // console.log("index="+index);
        if(index!=-1){//判断是否从首页跳转过来的
            // let rightContext=this.Cates[index].smallTypeList;//通过遍历获取第一层数据
            // this.setData({
            //     leftMenuList,
            //     rightContext
            // })
            this.getCates2(index);
            app.globalData.index=-1;//重置index
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})