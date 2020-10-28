// components/song_item/song_item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    obj: { // 接收这首歌曲相关的信息
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 点击音乐触发方法执行
    newsSongClick: function (e) {
      var songObj = this.properties.obj;
      wx.navigateTo({
        url: "../../pages/d_music/d_music", // 如果是单纯几个字符串/数字可以在目标url后面拼接?来传递给下一个页面的参数, 但是如果要传递对象给下一个页面就必须使用事件的方式
        success: function (res) { // 跳转成功最后一瞬间触发此函数
          // 在这里把对象, 传递给下一个页面的相同事件处
          // emit() 触发
          res.eventChannel.emit('songObjEvent', {
            data: songObj
          })
        }
      })
    }
  }
})