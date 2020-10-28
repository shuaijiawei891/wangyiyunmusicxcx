Page({
  data: {
    selectIndex: 2, // 当前应该被选中的导航索引
    recListArr: [], // 推荐歌单的数据
    newSongArr: [], // 最新音乐
    hotSongArr: [], // 热歌榜
    hotSearchArr: [], // 热门搜索关键字列表
    searchTimeout: null, // 防抖函数(保存当前搜索框定时用的定时器)
    textSearchArr: [], // 联想搜索文字的数组
    nowSearchText: "", // 正在被搜索的关键字
    searchSongArr: [], // 搜索到的歌曲数组
  },
  // 点击顶部导航触发方法执行
  navClickFn: function (e) {
    this.setData({
      selectIndex: e.target.dataset.ind
    })
  },
  // 歌单点击进入详情
  recListClick: function (e) {
    wx.navigateTo({
      url: "../album_detail/album_detail?id=" + e.currentTarget.dataset.recid
    })
  },

  onLoad: function () {
    // 获取推荐歌单
    wx.request({
      url: "http://localhost:3000/personalized?limit=6",
      success: res => {
        var arr = res.data.result;
        this.setData({
          recListArr: arr
        })
      }
    })
    // 获取第一页下的 最新音乐
    wx.request({
      url: "http://localhost:3000/personalized/newsong",
      success: res => {
        var arr = res.data.result;
        this.setData({
          newSongArr: arr
        })
      }
    })
    // 获取第二页的 热歌榜(歌单) 下的详细数据
    wx.request({
      url: "http://localhost:3000/playlist/detail?id=3778678",
      success: res => {
        res.data.playlist.tracks.map(getObj => { // 处理对象的字段
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
        // 数组里面有200条歌曲(但是我只用前20条) -- 截取前20条数据
        this.setData({
          hotSongArr: res.data.playlist.tracks.slice(0, 20)
        })
      }
    })

    // 热门搜索的关键字获取
    wx.request({
      url: "http://localhost:3000/search/hot",
      success: res => {
        this.setData({
          hotSearchArr: res.data.result.hots
        })
      }
    })
  },
  // 搜索内容改变时触发此函数执行
  searchChange: function (e) {
    console.log(123);
    if (e.detail.value === "") {
      this.setData({
        textSearchArr: [],
        searchSongArr: []
      })
      return; // 阻止代码继续向下执行
    }

    if (this.data.searchTimeout !== null) {
      clearTimeout(this.data.searchTimeout);
    }// 第一次输入内容w, 触发此函数执行时, if是进不去的, 然后会保存一个定时器
    // 第二次输入o, 触发此函数执行时, if进去, 干掉w的搜索定时器, 创建o的搜索定时器
    // 你会非常快速(0.5秒内), 再输入我, 触发此函数执行, if进去, 干点o的搜索定时器
    // 停下等待0.5秒, 搜索我的定时器开始执行, 所以最后只有我的搜索内容被执行了
    // 计n秒, 时间到了才执行
    var s = setTimeout(() => {
      wx.request({
        url: `http://localhost:3000/search/suggest?keywords=${e.detail.value}&type=mobile`,
        success: res => {
          this.setData({
            textSearchArr: res.data.result.allMatch
          })
        }
      })
    }, 500); // 0.5秒后执行
    this.setData({
      searchTimeout: s
    })
  },
  // 点击热门搜索关键字触发的事件
  clickHotSearch: function(e){
    console.log(e);
    // 把用户点击的热门搜索上的关键字赋予到变量上, 同步影响input的model:value绑定的变量, 
    // 间接影响页面输入框的值
    this.setData({
      nowSearchText: e.target.dataset.text
    })
    // 自己手动调用搜索歌曲结果的方法
    this.getSearchResultSongListFn();
  },
  // 拿到搜索结果歌曲列表数据方法
  getSearchResultSongListFn(){
    console.log(this.data.nowSearchText);
    wx.request({
      url: `http://localhost:3000/search?keywords=${this.data.nowSearchText}`,
      success: res => {
        
        res.data.result.songs.map(getObj => { // 处理对象的字段
          /* {id: 歌曲的id, picUrl: 歌曲图片, song: {
            name: "歌曲名字",
            artists: [{
              name: "歌手名字"
            }]
          }}*/
          getObj['picUrl'] = getObj.artists[0].img1v1Url;
          getObj['song'] = {
            name: getObj.name,
            artists: [{
              name: getObj.artists[0].name
            }]
          }
        })
        this.setData({
          searchSongArr: res.data.result.songs
        })
      }
    })
  }
})