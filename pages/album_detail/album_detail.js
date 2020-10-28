// pages/album_detail/album_detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    obj: null, // 歌单的对象
    backgroundUrl: "", // 顶部的背景图片地址
    songArr: [], // 歌单里的歌曲数组
    hotCommentArr: [], // 热门评论数组
    commentArr: [] // 普通评论数组
  },
  // 点击最新音乐触发方法执行
  songClick: function (e) {
    // 这里是歌单页面 -> 跳转到 -> 歌曲播放页
    // 首页跳转过去传递的对象里的key, 歌曲播放页都能使用, 但是歌单里点击歌曲对象时, 此对象有一些key是不同的
    // 所以在这里我们要去看下歌曲播放页, 需要哪些key值, 在这里组装完毕, 再传递过去即可

    wx.navigateTo({
      url: "../d_music/d_music",
      success: function (res) {
        res.eventChannel.emit('songObjEvent', {
          data: targetObj
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 通过首页传递过来的歌单ID, 调用接口获取歌单详情数据
    wx.request({
      url: 'http://localhost:3000/playlist/detail?id=' + options.id,
      success: res => {
        // 因为封装的song_item组件和d_music页面(里面用的字段是同一的, 但是这里数组里不是我们那2个地方要用的字段, 所以我们需要处理数组里的每个对象的字段)
        res.data.playlist.tracks.map(getObj => {
          /* {id: 歌曲的id, picUrl: 歌曲图片, song: {
      name: "歌曲名字",
      artists: [{
        name: "歌手名字"
      }]
    }}*/
          getObj['picUrl'] = getObj.al.picUrl;
          getObj['song'] = {
            name: getObj.name,
            artists: [{
              name: getObj.al.name
            }]
          }
        })

        this.setData({
          obj: res.data.playlist,
          songArr: res.data.playlist.tracks
        })
      }
    })
    // 通过歌单ID, 获取评论的数据
    wx.request({
      url: 'http://localhost:3000/comment/playlist?id=' + options.id,
      success: res => {
        console.log(res.data);
        this.setData({
          hotCommentArr: res.data.hotComments,
          commentArr: res.data.comments
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})