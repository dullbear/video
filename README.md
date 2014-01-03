html5 video
=====

html引用

```
<video id="video" width="640">
       <source src="1.mp4" type="video/mp4; codecs="avc1.42E01E, mp4a.40.2"">
       <source src="1.ogv" type="video/ogg; codecs="theora, vorbis"">
        你的浏览器不支持
  </video>
```

默认参数
###

```
bdUI.dullVideo.defaults = {
		video: '#video', //获取视频
		fullScreen: '#fullScreen', //全屏按钮
		videoCont: '#videoCont', //视频区域
		stop: '#stop', //停止、播放按钮
		play: '#play', //停止、播放按钮
		next: '#next', //快进按钮
		prev: '#prev', //快退按钮
		audio: '#audioBox', //声音
		audioImg: '#audioImg', //声音按钮
		audioPro: '#audioPro', //声音进度条
		audioBtn: '#audioBtn', //声音按钮		
		showTime: '#showTime', //显示播放时间
		showCurrenTime: '#showCurrenTime', //当前视频播放长度(进度条)
		currentTime: '#currentTime', ////当前视频播放长度(统计)		
		prog: '#prog', //播放进度 
		bufferProg: '#bufferProg', //缓冲进度
		playProg: '#playProg', //播放进度
		len: '#len', //视频长度
		speed: 10, //快进、快退时间
		//视频结束回调函数
		endcallback: null
};
```
