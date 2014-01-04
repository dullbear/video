/**
 * @name bdUI.dullVideo
 * @requires jquery.1.7.2
 * @constructor
 * @Extends jquery-1.7.2
 * @class jQuery图片滚动插件 自定义滚动方向、滚动个数、显示滚动状态
 * @author dullBear (site: www.dullbear.com email:dullbear.sheng@gmail.com data:2013-11-27)
 * @version 1.0
 * @site www.dullbear.com
 * @example $("#video").dullVideo();
 * @ param {object} 插件默认参数 以下是键值
 * @ param {video:idName/className}  赋值后调用this.$video 获取播放视频
 * @ param {fullScreen:idName/className}  赋值后调用this.$fullScreen 全屏按钮
 * @ param {videoCont:idName/className} 赋值后调用this.$videoCont 视频区域
 * @ param {stop:idName/className} 赋值后调用this.$stop 停止、播放按钮
 * @ param {play:idName/className} 赋值后调用this.$play 停止、播放按钮
 * @ param {next:idName/className} 赋值后调用this.$next 快进按钮
 * @ param {prev:idName/className} 赋值后调用this.$prev 快退按钮
 * @ param {audio:idName/className} 赋值后调用this.$audio 声音
 * @ param {audioImg:idName/className} 赋值后调用this.$audioImg 声音按钮
 * @ param {audioPro:idName/className}  赋值后调用this.$audioPro 声音进度条
 * @ param {audioBtn:idName/className}  赋值后调用this.$audioBtn 声音按钮
 * @ param {showTime:idName/className} 赋值后调用this.$showTime 显示播放时间
 * @ param {showCurrenTime:idName/className}  赋值后调用this.$showCurrenTime 当前视频播放长度(进度条)
 * @ param {currentTime:idName/className}  赋值后调用this.$currentTime 当前视频播放长度(统计)
 * @ param {prog:idName/className} 赋值后调用this.$prog 播放进度
 * @ param {bufferProg:idName/className}  赋值后调用this.$scrollBox 缓冲进度
 * @ param {playProg:idName/className}  赋值后调用this.$bufferProg 播放进度
 * @ param {len:idName/className} 赋值后调用this.$len 视频长度
 * @ param {speed:number} 调用this.options.speed 快进、快退时间
 * @ param {endcallback:function} 调用this.callback('end') 视频结束回调函数
 */


;
(function($) {

	var bdUI = bdUI || {};
	$.fn.dullVideo = function(options) {
		var pName = 'dullVideo';
		var objData = $(this).data(pName);
		if (typeof objData == 'string' && objData == 'instance') {
			return objData;
		};
		var options = $.extend({}, bdUI.dullVideo.defaults, options || {});
		return $(this).each(function() {
			var dullVideo = new bdUI.dullVideo(options);
			dullVideo.$element = $(this);
			dullVideo._init();
			$(this).data(pName, dullVideo);
		});
	};

	bdUI.dullVideo = function(options) {
		this.name = 'dullVideo';
		this.version = '1.0';
		this.options = options;
		this.$element = null;
	};

	bdUI.dullVideo.defaults = {
		video: '#video',
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
	/** @lends dullVideo.prototype */
	bdUI.dullVideo.prototype = {

		_init: function() {
			this.$video = this.$element.find(this.options.video)[0];
			this.$fullScreen = this.$element.find(this.options.fullScreen); //全屏按钮
			this.$videoCont = this.$element.find(this.options.videoCont); //视频区域
			this.$stop = this.$element.find(this.options.stop); //停止、播放按钮
			this.$play = this.$element.find(this.options.play); //停止、播放按钮
			this.$next = this.$element.find(this.options.next); //快进按钮
			this.$prev = this.$element.find(this.options.prev); //快退按钮
			this.$audio = this.$element.find(this.options.audio); //声音按钮
			this.$audioImg = this.$element.find(this.options.audioImg); //声音按钮
			this.$len = this.$element.find(this.options.len); //视频长度
			this.$showTime = this.$element.find(this.options.showTime); //显示播放时间
			this.$showCurrenTime = this.$element.find(this.options.showCurrenTime); //当前视频播放长度(进度条)
			this.$currentTime = this.$element.find(this.options.currentTime); ////当前视频播放长度(统计)
			this.$audioPro = this.$element.find(this.options.audioPro); //声音进度条
			this.$audioBtn = this.$element.find(this.options.audioBtn); //声音按钮
			this.$prog = this.$element.find(this.options.prog); //播放进度 
			this.$bufferProg = this.$element.find(this.options.bufferProg); //缓冲进度
			this.$playProg = this.$element.find(this.options.playProg); //播放进度

			this.alltime = 0; //视频总长			

			//全屏全局
			this.inFullScreen = false;

			//音频拖动高度
			this.vioBoxHei = this.$audioPro.height();
			this.vioBtn = this.$audioBtn.height();
			this.vioHei = (this.vioBoxHei - this.vioBtn).toFixed(2);


			this.event();
			this.keyEvt();
			this.audio();
			this.playBar();



		},
		/**
		 * 点击事件
		 */
	

		event: function() {			

			var _self = this;

			//视频区域双击（全屏/取消全屏）			
			this.$videoCont[0].addEventListener("dblclick", function() {

				if (_self.inFullScreen == false) {
					_self.fullScreen(_self.$video);
				} else {
					_self.eixtFullScreen();
				}
			}, false);

			//全屏按钮
			this.$fullScreen[0].addEventListener("click", function() {
				if (_self.inFullScreen == false) {
					_self.fullScreen(_self.$video);
				} else {
					_self.eixtFullScreen();
				}
			}, false);

			//快退按钮
			this.$prev.bind({
				'click': function() {
					_self.prev();
				}
			});

			//停止按钮点击暂停、播放
			this.$stop.bind({
				'click': function() {
					_self.playState();
				}
			});

			//快进按钮
			this.$next.bind({
				'click': function() {
					_self.next();

				}
			});

			//视频区域点击暂停、播放
			this.$videoCont.bind({
				'click': function() {
					_self.playState();
				}
			});



		},
		/**
		 * 格式化时间
		 */
		timeFormat: function(time) {
			//格式化时间
			var hour = parseInt(time / 3600),
				minute = parseInt(time / 60),
				second = parseInt(time % 60),
				html = '';
			if (hour < 1) {
				html += minute >= 10 ? minute + ':' : '0' + minute + ':';
				html += second >= 10 ? second : '0' + second;
			} else {
				html += hour >= 10 ? hour + ':' : '0' + hour + ':';
				html += minute >= 10 ? minute + ':' : '0' + minute + ':';
				html += second >= 10 ? second : '0' + second;
			}

			return html;
		},
		/**
		 * 暂停播放
		 * @type event
		 * @default {}
		 */
		playState: function() {

			//暂停中
			if (this.$video.paused == true) {
				this.$video.play();
				//获取当前时间
				var _self = this;
				var time = setInterval(function() {
					//播放轴位置
					var currtent = _self.$video.currentTime,
						currentWid = (currtent / _self.alltime) * 100 + '%';
					_self.$playProg.css('width', currentWid);
					_self.$currentTime.html(_self.timeFormat(currtent));

					//播放完成
					if (currtent == _self.alltime) {
						clearInterval(time);
						_self.callback('end');
					};
				}, 1000);

				//缓冲
				var time01 = setInterval(function() {
					//缓冲轴位置
					var end = _self.$video.buffered.end(0);
					var bufferWid = (end / _self.alltime) * 100 + '%';
					_self.$bufferProg.animate({
						'width': bufferWid
					});

					//缓冲完成
					if (end == _self.alltime) {
						clearInterval(time01);
					};

				}, 1000);

				//加载
				if (this.$video.readyState == 2) {
					$('.loading').show();
					this.$video.pause();
				} else if (this.$video.readyState == 4) {
					this.alltime = this.$video.duration; //视频总长
					this.$len.html(this.timeFormat(this.alltime));
					$('.loading').hide();
					this.$video.play();
				};
				this.$play.css('display', 'none');
			} else {
				this.$video.pause();
				this.$play.css('display', 'block');
			};
		},
		/**
		 * 快退
		 * @type function
		 * @default {}
		 */
		prev: function() {

			this.$video.currentTime -= this.options.speed;
		},
		/**
		 * 快进
		 * @type function
		 * @default {}
		 */
		next: function() {
			this.$video.currentTime += this.options.speed;
			console.log(this.alltime);
		},
		/**
		 * 键盘事件
		 * @type function
		 * @param {keycode:number} 键盘数字
		 * @default {}
		 */
		keyEvt: function() {
			var _self = this;
			$('body').keydown(function(event) {
				//键盘事件
				var code = event.keyCode;
				//
				if (code == 37) {
					_self.prev();
				} else if (code == 39) {
					_self.next();
				} else if (code == 38) {
					_self.$video.muted = false;
					if (_self.$video.volume.toFixed(1) == 1.0) {
						_self.$video.volume = 1;
					} else {
						_self.$video.volume += 0.1;
						var _volume = _self.$video.volume.toFixed(1);
						_self.$audioBtn.css('bottom', _volume * _self.vioHei + 'px');
						_self.$audioImg.removeClass('current');

					};
				} else if (code == 40) {
					if (_self.$video.volume.toFixed(1) == 0.0) {
						_self.$video.volume = 0;
						_self.$audioImg.addClass('current');
					} else {
						_self.$video.volume -= 0.1;
						var _volume = _self.$video.volume.toFixed(1);
						_self.$audioBtn.css('bottom', _volume * _self.vioHei + 'px');
					};
				} else if (code == 32) {
					_self.playState();
				}
			});
		},
		/**
		 * 声音轴
		 * @type function
		 * @default {}
		 */

		audio: function() {
			var _self = this;

			this.$audio.bind({
				'click': function() {

					if (_self.$video.muted) {
						_self.$video.muted = false;
						_self.$video.volume = 1;
						_self.$audioBtn.css('bottom', _self.vioHei + 'px');
						_self.$audioImg.removeClass('current');
					} else {
						_self.$video.muted = true;
						_self.$video.volume = 0;
						_self.$audioBtn.css('bottom', 0 + 'px');
						_self.$audioImg.addClass('current');
					};
				}
			});


			var isdown = false;
			var vidOffHei = 0;
			this.$audio.bind({
				'mouseenter': function() {
					_self.$audioPro.css('display', 'block');
					vidOffHei = _self.$audioBtn.offset().top.toFixed(1);
				},
				'mouseleave': function() {
					_self.$audioPro.css('display', 'none');
				}
			});



			this.$audioPro.mousedown(function(e) {
				isdown = true;
				e.preventDefault(); //阻止默认时间
			});

			$(window).bind({
				'mouseup': function() {
					isdown = false;
				},
				'mousemove': function(e) {
					e.preventDefault();
					if (isdown) {
						_self.$video.muted = false;
						_self.$audioImg.removeClass('current');
						var vidPageHei = e.pageY;
						var cun = vidPageHei - vidOffHei;
						if (vidPageHei <= vidOffHei || cun <= 0) {
							cun = 0;
							_self.$video.volume = 1;
						} else if (cun >= _self.vioHei) {
							cun = _self.vioHei;
							_self.$video.volume = 0;
							_self.$audioImg.addClass('current');
						}
						_self.$video.volume = Math.abs(((_self.vioHei - cun) / _self.vioHei)).toFixed(1);
						_self.$audioBtn.css('bottom', _self.vioHei - cun + 'px');
					}
				}
			});
		},
		/**
		 * 播放进度轴
		 * @type function
		 * @default {}
		 */
		playBar: function() {

			var _self = this;
			//定义视频播放位置

			var propWid = this.$prog.width();

			this.$prog.bind({
				'click': function(e) {
					var offLeft = _self.$prog.offset().left;
					var clkWid = (e.pageX - offLeft) / propWid * 100 + '%';
					_self.$video.currentTime = (e.pageX - offLeft) / propWid * _self.alltime;
					_self.$playProg.css('width', clkWid);

				},
				'mouseleave': function() {
					_self.$showTime.css({
						'display': 'none'
					});
				},
				'mousemove': function(e) {

					var offLeft = _self.$prog.offset().left;
					var ePageX = e.pageX;
					if (ePageX >= offLeft && ePageX <= offLeft + propWid) {
						var clkWid = (ePageX - offLeft) / propWid * 100 + '%';
						var mouseTime = (ePageX - offLeft) / propWid * _self.alltime;
						_self.$showCurrenTime.html(_self.timeFormat(mouseTime));

						_self.$showTime.css({
							'left': clkWid,
							'display': 'block'
						});
					}
				}
			});
		},
		/**
		 * 全屏
		 * @type function
		 * @default {}
		 */
		fullScreen: function(divObj) {
			//全屏
			if (divObj.requestFullscreen) {
				divObj.requestFullscreen();
			} else if (divObj.msRequestFullscreen) {
				divObj.msRequestFullscreen();
			} else if (divObj.mozRequestFullScreen) {
				divObj.mozRequestFullScreen();
			} else if (divObj.webkitRequestFullscreen) {
				divObj.webkitRequestFullscreen();
			}
			this.inFullScreen = true;
			return;
		},
		/**
		 * 退出全屏
		 * @type function
		 * @default {}
		 */
		eixtFullScreen: function() {

			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.msExitFullscreen) {
				document.msExitFullscreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.webkitCancelFullScreen) {
				document.webkitCancelFullScreen();
			}
			this.inFullScreen = false;
			return;
		},
		/**
		 * 代码调试
		 * @type function
		 * @default {}
		 */
		debug: function($message) {

			if (typeof $message == 'undefined') {
				$message = this;
			} else if (window.console.log && window.console) {
				window.console.log($message);
			} else {
				alert($message);
			};
		},
		/**
		 * 回调事件
		 * @type function
		 * @default {}
		 */
		callback: function(evt) {
			if (typeof this.options[evt + 'callback'] != 'function') {
				return false;
			} else {
				this.options[evt + 'callback'].call(this);
			};
		}
	}

})(jQuery);

$(".video-box").dullVideo({
	endcallback: function() {
		alert('播放完成');
		//$('#video')[0].play();
	}
});