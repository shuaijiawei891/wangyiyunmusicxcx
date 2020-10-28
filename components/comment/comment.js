const util = require("../../utils/util");
// 评论的组件
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    obj: { // 接收评论信息的对象
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    theObj: null // 页面上要使用的评论对象
  },
  ready: function(){
    // 为了处理time, 把接收到的对象处理完, 赋予到data变量上来影响页面的变化
    var tObj = this.properties.obj;
    tObj['time'] = util.formatTime(tObj['time']);
    this.setData({
      theObj: tObj
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
