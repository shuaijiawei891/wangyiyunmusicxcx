// pages/d_music/d_music.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    theObj: {}, // 详情页的歌曲的对象
    audioSrc: "", // 音乐的播放地址
    rotateStr: "rotate(0deg)", // 要在页面使用的旋转的字符串
    imageRotate: 0, // 图片默认0度(不旋转)
    isPlay: false, // 当前是否正在播放音乐(可以控制是否旋转/停止计时器/隐藏出现播放按钮/音乐是否播放)
    // 因为网页加载完成以后, 会触发一次playMusicFn方法, 所以取反以后才是true(播放状态)
    rotateTimer: null, // 保存旋转图片的计时器
    playIconDeg: "rotate(-45deg)", // 上面的音乐卡碟的位置
    lyrStrArr: [], // 页面上歌词数组
    timeArr: [], // 每句歌词的时间的数组
    lyrStrIndex: 0, // 当前播放的歌词的所在下角标
    lyrTime: 0, // 当前歌词播放的时间对象
  },
  // 音乐播放按钮
  playMusicFn: function () {
    // audio标签id叫myAudio
    this.audioCtx = wx.createAudioContext('myAudio');
    // 调用audio的play方法播放音乐
    

    this.setData({ // 每次点击音乐播放, 取反即可
      isPlay: !this.data.isPlay
    }, () => { // 因为isPlay的值被修改后, 才会触发这个函数执行, 这个时候才能判断音乐该播放/暂停
      if (this.data.isPlay) {
        this.audioCtx.play(); // 播放音乐
        this.setData({
          playIconDeg: "rotate(0deg)"
        })
      } else {
        this.audioCtx.pause(); // 暂停(下一次调用play会在上一次暂停处继续播放)
        this.setData({
          playIconDeg: "rotate(-45deg)"
        })
      }
    })

    // 执行一个旋转图片的计时器
    this.rotatePlayImage();
  },
  // 音乐播放状态改变触发
  playChangeFn: function(res){
    var nowTime = res.detail.currentTime * 1000;
    // 找到第一个不满足的时间
    var ind = -1;
    for (var i = this.data.lyrStrIndex; i < this.data.timeArr.length; i++) {
      if (this.data.timeArr[i] >= nowTime) {
        ind = i;
        break;
      }
    }
    // 设置容器移动top位置,保存当前高亮的索引
    this.setData({
      theTop: "a" + (ind - 1),
      lyrStrIndex: ind - 1
    })
  },
  // 旋转图片的方法
  rotatePlayImage: function () {
    // 如果当前isPlay为true, 就创建一个计时器并且保存起来, 如果当前isPlay为false, 就销毁上一次的旋转计时器
    if (this.data.isPlay) {
      // 每隔0.05秒, 让标签旋转1度  (1秒钟转20度)
      var t = setInterval(() => {
        // 取出现在的度数, +1赋予回去, 还要同时修改页面css中用的rotate字符串的度数值
        var imageRotate = this.data.imageRotate;
        this.setData({
          imageRotate: imageRotate + 1,
          rotateStr: "rotate(" + imageRotate + "deg)"
        })
      }, 50);
      // 把旋转的计时器保存起来
      this.setData({
        rotateTimer: t
      })
    } else {
      clearInterval(this.data.rotateTimer);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel();
    // 监听上一个页面songObjEvent事件的emit触发的动作, 这里的函数就会执行, 接收到上一个页面传递过来的歌曲对象
    eventChannel.on('songObjEvent', dataObj => {
      this.setData({
        theObj: dataObj.data,
        // 拼接本歌曲播放的地址(拼接id即可)
        audioSrc: "http://music.163.com/song/media/outer/url?id=" + dataObj.data.id + ".mp3"
      })
    }) 
 
    // 请求歌词
    wx.request({
      url: "http://localhost:3000/lyric?id=" + this.data.theObj.id,
      success: res => {
        // 用\n来拆分这个字符串, 得到一个数组, 每个元素就是一句歌词
        var lyrArr = res.data.lrc.lyric.split("\n");
        // 每局歌词的时间, 单独拆分出来形成一个时间数组, 索引和歌词对应
        // 时间到了以后, 取出时间索引对应的歌词
        var lyrStrArr = []; // 只要歌词的数组
        var timeArr = []; // 存放日期数字的数组
        lyrArr.pop(); // 把\n拆分的最后一个空白字符删除掉(pop从数组的尾部删除)
        lyrArr.map(str => {
            var timeStr = str.split("]")[0].replace("[", ""); // 直接一步到位
            var min = parseInt(timeStr.split(":")[0]);
            var miao = parseFloat(timeStr.split(":")[1]);
            timeArr.push(Math.floor(min * 60 * 1000 + miao * 1000));
            lyrStrArr.push(str.split("]")[1]);
        })
        // 把每个字符串的分钟+秒+毫秒的时间格式, 转换为毫秒的数字(方便后面的判断)
        // 用:分割开, 取出前面第0个元素分钟 * 60 * 1000 就是毫秒
        // 然后取出:分割开后面的值, *1000 就是毫秒 最后相加就是这句歌词
        // 应该在第多少毫秒时, 出现
        
        this.setData({
          lyrStrArr: lyrStrArr,
          timeArr: timeArr
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 网页加载成功, 立刻调用播放音乐的按钮触发一次点击的事件
    this.playMusicFn();
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
    clearInterval(this.data.lyrTime);
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