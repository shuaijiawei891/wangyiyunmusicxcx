const checkLastTime = obj => {
  // obj格式: "2018-09-19 12:01:02"
  // 需要转换成/链接的格式 (所以传入的字符串, 会变成2018/09/19 12:01:02)
  obj = obj.replace("-", "/");
  // 因为new Date()传入一个字符串格式必须是年/月/日 时:分:秒的格式
  // wDate就是你传入的日期的日期对象
  var wDate = new Date(obj);
  // 当前系统时间的日期对象
  var nowDate = new Date();
  // 用当前系统时间的毫秒 - 目标时间的毫秒 除以1000得到秒数
  var seconds = (nowDate.getTime() - wDate.getTime()) / 1000; // 秒数

  if (seconds < 60){ // 小于60秒
    return "刚刚";
  } else if ((Math.floor(seconds / 60)) < 60){
    return Math.floor(seconds / 60) + "分钟前";
  } else if ((Math.floor(seconds / 60 / 60)) < 24) {
    return Math.floor(seconds / 60 / 60) + "小时前";
  } else if (Math.floor(seconds / 60 / 60 / 24) < 30){
    return Math.floor(seconds / 60 / 60 / 24) + "天前";
  } else if (Math.floor(seconds / 60 / 60 / 24 / 30) < 12){
    return Math.floor(seconds / 60 / 60 / 24 / 30) + "月前";
  } else {
    return Math.floor(seconds / 60 / 60 / 24 / 30 / 12) + "年前";
  }
};

const millionStr = numStr => {
  // numStr是传入一个跟帖数量, 只有超过1万的, 才需要转换成带万字的, 否则就是原样输出
  // 因为字符串数字乘以1以后, 会变成数值类型
  var theNum = numStr * 1;
  if (theNum >= 10000) {
    // 表达式数值.toFixed() 强制保留几位小数
    return (theNum / 10000).toFixed(1) + "万"
  } else {
    // 没超过万的就单独的返回即可(原样输出)
    return theNum;
  }
}


const formatTime = date => {
  date = new Date(date); // 传入毫秒值, 会返回日期对象
  // const year = date.getFullYear()
  // const month = date.getMonth() + 1
  // const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  // const second = date.getSeconds()

  // return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  return [hour, minute].map(formatNumber).join(':');
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime, // 传入时间对象, 返回小时:分钟的字符串
  checkLastTime: checkLastTime, // 生成几分钟前
  millionStr: millionStr // 超过一万的, 换成带万的文字
}
