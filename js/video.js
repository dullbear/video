$(function() {
    var $Video = $('#video')[0],
        $fullScreen = $('#fullScreen')[0], //全屏按钮
        $VideoCont = $('#videoCont')[0], //视频区域
        $stop = $('#stop'), //停止、播放按钮
        $play = $('#play'), //停止、播放按钮
        $next = $('#next'), //快进按钮
        $prev = $('#prev'), //快退按钮
        $audio = $('#audio'), //声音按钮
        $len = $('#len'),
        $showTime = $('#showTime'),
        $showCurrenTime = $('#showCurrenTime'),
        $currentTime = $('#currentTime'),
        $audioPro = $('#audioPro'),
        $audioBtn = $('#audioBtn'),
        $prop = $('#prog'),
        $bufferProg=$('#bufferProg'),
        $playProg=$('#playProg'),
        alltime = $Video.duration, //视频总长
        time01 = '';


    function loading() {
        if ($Video.readyState == 2) {
            $('.loading').show();
            $Video.pause();
        } else if ($Video.readyState == 4) {
            $('.loading').hide();
            $Video.play($VideoCont);
        };
    };

    //时间格式
    function date(time) {
        var hour = parseInt(time / 3600),
            minute = parseInt(time / 60),
            second = parseInt(time % 60),
            html = '';
        html += hour >= 10 ? hour + ':' : '0' + hour + ':';
        html += minute >= 10 ? minute + ':' : '0' + minute + ':';
        html += second >= 10 ? second : '0' + second;
        return html;
    };

    //获取当前时间
    function cur() {
        var time = setInterval(function() {
            var currtent = $Video.currentTime,
                currentWid = (currtent / alltime) * 100 + '%';
            $('.bg-03').css('width', currentWid);
            $currentTime.html(date(currtent));
            if (currtent == alltime) {
                clearInterval(time);
            };
        }, 1000);
    };

    //缓冲
    function buffer() {
        time01 = setInterval(function() {
            var end = $Video.buffered.end(0);
            var bufferWid = (end / alltime) * 100 + '%';
            $bufferProg.animate({
                'width': bufferWid
            });
            if (end == alltime) {
                clearInterval(time01);
            };

        }, 1000);
    };

    //定义视频播放位置

    var propWid = $prop.width();
    $prop.bind({
        'click': function(e) {
            var offLeft = $prop.offset().left;
            var clkWid = (e.pageX - offLeft) / propWid * 100 + '%';
            $Video.currentTime = (e.pageX - offLeft) / propWid * alltime;
            $playProg.css('width', clkWid);

        },
        'mouseleave': function() {
            $showTime.css({
                'display': 'none'
            });
        },
        'mousemove': function(e) {
            var offLeft = $prop.offset().left;
            var ePageX = e.pageX;
            if (ePageX >= offLeft && ePageX <= offLeft + propWid) {
                var clkWid = (ePageX - offLeft) / propWid * 100 + '%';
                var mouseTime = (ePageX - offLeft) / propWid * alltime;
                $showCurrenTime.html(date(mouseTime));

                $showTime.css({
                    'left': clkWid,
                    'display': 'block'
                });
            }
        }
    });


    //获取视频总长
    if ($Video.readyState == 4) {
        var alltime = $Video.duration;
        $len.html(date(alltime));
    }


    //视频区域单击（暂停/播放）
    $('#videoCont').click(function() {
        console.log(415);
        //暂停中
        if ($Video.paused == true) {
            cur();
            $Video.play();
            buffer();
            loading();
            $play.css('display', 'none');
        } else {
            $Video.pause();
            $play.css('display', 'block');
        };
    });

    //快退
    $prev.click(function() {
        $Video.currentTime -= 10;
    });

    //快进
    $next.click(function() {
        $Video.currentTime += 10;
    });



    //暂停播放
    $stop.click(function() {
        //暂停中
        if ($Video.paused == true) {
            $Video.play();
            cur();
            buffer();
            loading();
            $play.css('display', 'none');
        } else {
            $Video.pause();
            $play.css('display', 'block');
        };
    });

    $('body').keydown(function(event) {
        var code = event.keyCode;
        if (code == 37) {
            $Video.currentTime -= 10;
        } else if (code == 39) {
            $Video.currentTime += 10;
        } else if (code == 38) {
            $Video.muted = false;
            if ($Video.volume.toFixed(1) == 1.0) {
                $Video.volume = 1;
            } else {
                $Video.volume += 0.1;
                var _volume = $Video.volume.toFixed(1);
                $audioBtn.css('bottom', _volume * vioHei + 'px');
                $audio.find('img').attr('src', 'images/index-02.png');
            };
        } else if (code == 40) {
            if ($Video.volume.toFixed(1) == 0.0) {
                $Video.volume = 0;
                $audio.find('img').attr('src', 'images/index-01.png');
            } else {
                $Video.volume -= 0.1;
                var _volume = $Video.volume.toFixed(1);

                $audioBtn.css('bottom', _volume * vioHei + 'px');
            };
        } else if (code == 32) {
            if ($Video.paused == true) {
                cur();
                $Video.play();
                buffer();
                loading();
                $play.css('display', 'none');
            } else {
                $Video.pause();
                $play.css('display', 'block');
            };
        }
    });

    //是否静音
    var vioBoxHei = $audioPro.height(),
        vioBtn = $audioBtn.height(),
        vioHei = (vioBoxHei - vioBtn).toFixed(2);
    $audio.find('img').bind({
        'click': function() {
            if ($Video.muted) {
                $Video.muted = false;
                $Video.volume = 1;
                $(this).attr('src', 'images/index-02.png');
                $audioBtn.css('bottom', vioHei + 'px');
            } else {
                $Video.muted = true;
                $Video.volume = 0;
                $(this).attr('src', 'images/index-01.png');
                $audioBtn.css('bottom', 0 + 'px');
            };
        }
    });


    var isdown = false;
    var vidOffHei = 0;
    $audio.bind({
        'mouseenter': function() {
            $audioPro.css('display', 'block');
            vidOffHei = $audioBtn.offset().top.toFixed(1);
        },
        'mouseleave': function() {
            $audioPro.css('display', 'none');
        }
    });



    $audioPro.mousedown(function(e) {
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
                $audio.find('img').attr('src', 'images/index-02.png');
                var vidPageHei = e.pageY;
                var cun = vidPageHei - vidOffHei;
                if (vidPageHei <= vidOffHei || cun <= 0) {
                    cun = 0;
                    $Video.volume = 1;
                } else if (cun >= vioHei) {
                    cun = vioHei;
                    $Video.volume = 0;
                    $audio.find('img').attr('src', 'images/index-01.png');
                }
                $Video.volume = Math.abs(((45 - cun) / 45)).toFixed(1);
                $audioBtn.css('bottom', vioHei - cun + 'px');
            }
        }
    });



    //视频区域双击（全屏/取消全屏）
    var inFullScreen = false;
    $VideoCont.addEventListener("dblclick", function() {
        if (inFullScreen == false) {
            makeFullScreen($Video);
        } else {
            reseted();
        }
    }, false);

    $fullScreen.addEventListener("click", function() {
        if (inFullScreen == false) {
            makeFullScreen($Video);
        } else {
            reseted();
        }
    }, false);

    //全屏

    function makeFullScreen(divObj) {
        if (divObj.requestFullscreen) {
            divObj.requestFullscreen();
        } else if (divObj.msRequestFullscreen) {
            divObj.msRequestFullscreen();
        } else if (divObj.mozRequestFullScreen) {
            divObj.mozRequestFullScreen();
        } else if (divObj.webkitRequestFullscreen) {
            divObj.webkitRequestFullscreen();
        }
        inFullScreen = true;
        return;
    };

    //取消全屏

    function reseted() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
        inFullScreen = false;
        return;
    };
});