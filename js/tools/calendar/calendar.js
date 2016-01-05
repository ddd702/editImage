/*
author:ddd;
time:2015-4-20
*/
define(function(require, exports, module) {
    var calendar = {
        now: new Date(),
        init: function(y, m) {
            var _this = this;
            _this.nowYear = y;
            _this.nowMonth = m;
            _this.draw(y, m);
        },
        getDay: function(y, m, d) {
            return new Date(y, m - 1, d).getDay();
        },
        getLastDay: function(y, m) {
            var endDay = new Date(y, m, 0).getDate();
            return endDay;
        },
        setEvent: function() {
            var _this = this;
            var setInfo = {
                isVacation: 0, //默认是工作日
                startTime: '',
                endTime: '',
                vacationInfo: '',
                setMan: window.g.name,
                setTime: _this.now.getFullYear() + '-' + (_this.now.getMonth() + 1) + '-' + _this.now.getDate()
            }
            var dialogTemplate = _.template($('#tmpl-dialog-set').html());
            $('body').on('click', '.glyphicon-calendar', function(event) {
                $(this).siblings('input').trigger('focus');
            });
            $('.j-setBtn').on('click', function(event) {
                var $thisCell = $(this).parent('.day-col');
                setInfo.startTime = $thisCell.data('date');
                setInfo.endTime = $thisCell.data('date');
                if ($thisCell.find('.show-vacation').size()) {
                    setInfo.vacationInfo = $thisCell.find('.show-vacation').html();
                } else {
                    setInfo.vacationInfo = "";
                }
                setInfo.isVacation = parseInt($thisCell.data('status')); //0（工作日）或1（节假日）
                var dialog = new Dialog.View({ //弹框
                    model: new Dialog.Model({
                        dialogId: 'dialog-set',
                        title: '节假日设置',
                        content: dialogTemplate(setInfo)
                    }),
                    saveCb: function($el) {
                        var $startInput = $('#j-setStart');
                        var $endInput = $('#j-setEnd');
                        var $remarkInput = $('#j-setMark');
                        var isWork = $('input[name="iswork"]:checked').val();
                        if (new Date($startInput.val()).getTime() > new Date($endInput.val()).getTime()) {
                            $('.j-tip').text('结束时间不应在开始时间之前！');
                            return;
                        }
                        if (isWork === '2') {//如果选择节假日就必须填说明
                            if ($.trim($remarkInput.val()) === '') {
                                $('.j-tip').text('请填写说明！');
                                return;
                            }
                        }
                        $('.j-tip').text('正在提交请求......');
                        var ajaxData = {
                            startTime: $startInput.val(),
                            endTime: $endInput.val(),
                            status: isWork,
                            remark: $remarkInput.val()
                        }
                        $.post(Config.urls.setVacation, ajaxData, function(data, textStatus, xhr) {
                            if (data.ret) {
                                $el.modal('hide');
                                _this.init(_this.nowYear, _this.nowMonth);
                            } else {
                                $('.j-tip').text(data.msg);
                            }
                        });

                    }
                });
                $('#j-setStart,#j-setEnd').datepicker({
                    format: "yyyy-mm-dd",
                    language: "zh-CN"
                });
            });
        },
        draw: function(y, m) {
            var _this = this;
            var m = parseInt(m);
            var y = parseInt(y);
            var mPrev = m - 1 <= 0 ? 12 : m - 1;
            var mNext = m + 1 <= 12 ? m + 1 : 1;
            var yPrev = mPrev === 12 ? y - 1 : y;
            var yNext = mNext === 1 ? y + 1 : y;
            var hasDays = _this.getLastDay(y, m);
            var prevHasDays = _this.getLastDay(yPrev, mPrev);
            var firstDay = _this.getDay(y, m, 1);
            var endDay = _this.getDay(y, m, hasDays);
            var nextDays = 6 - endDay;
            var lunar = CNCalendar.calendar(y, m).monthData;
            var lunarPrev = CNCalendar.calendar(y, mPrev).monthData;
            var lunarPrev = CNCalendar.calendar(yPrev, mPrev).monthData;
            var lunarNext = CNCalendar.calendar(yNext, mNext).monthData;
            var htmlStr = "";
            var prevDate = (prevHasDays - firstDay + 1) < 10 ? '0' + (prevHasDays - firstDay + 1) : (prevHasDays - firstDay + 1);
            var startTime = yPrev + '-' + (mPrev < 10 ? ('0' + mPrev) : mPrev) + '-' + prevDate;
            var endTime = yNext + '-' + (mNext < 10 ? ('0' + mNext) : mNext) + '-' + (nextDays < 10 ? ('0' + nextDays) : nextDays);
            $('.j-dateBox').html('<p class="load-tip">正在加载数据......</p>');
            $.post(Config.urls.qryVacation, {
                startTime: startTime,
                endTime: endTime
            }, function(data, textStatus, xhr) {
                if (data.ret) {
                    renderCal(data.list);
                } else {
                    Config.notify('节假日信息加载失败！');
                }
            });

            function renderCal(vacationArry) {
                for (var i = 0; i < hasDays + firstDay; i++) { //上个月和本月日历
                    if (i % 7 == 0) {
                        if (i == 0) {
                            htmlStr += '';
                        } else {
                            htmlStr += '</div>';
                        }
                        htmlStr += '<div class="date-row">';

                    }
                    if (i - firstDay >= 0) { //本月
                        var solarOrder = i - firstDay;
                        var solarOrderTxt = solarOrder < 9 ? '0' + (solarOrder + 1) : solarOrder + 1;
                        var lunarDay = lunar[solarOrder].lunarDay === 1 ? lunar[solarOrder].lunarMonthName + lunar[solarOrder].lunarDayName : lunar[solarOrder].lunarDayName;
                        htmlStr += '<div data-status="' + vacationArry[i].status + '" data-date="' + y + '-' + (m < 10 ? ('0' + m) : m) + '-' + solarOrderTxt + '"';
                        if (y === _this.now.getFullYear() && m === _this.now.getMonth() + 1 && solarOrder + 1 === _this.now.getDate()) { //今天
                            htmlStr += 'class="day-col today-col day-col-' + vacationArry[i].status + '">';
                            htmlStr += '<span class="show-solar">' + (solarOrder + 1) + '<span class="today-tip">(今日)</span></span> <span class = "show-lunar" >' + lunarDay + '</span>';
                        } else { //不是今天
                            htmlStr += 'class="day-col day-col-' + vacationArry[i].status + '">';
                            htmlStr += '<span class="show-solar">' + (solarOrder + 1) + '</span> <span class = "show-lunar" >' + lunarDay + '</span>';
                        }
                    } else { //上月
                        var solarOrder = prevHasDays + i - firstDay;
                        var solarOrderTxt = solarOrder < 9 ? '0' + (solarOrder + 1) : solarOrder + 1;
                        var lunarDay = lunarPrev[solarOrder].lunarDay === 1 ? lunarPrev[solarOrder].lunarMonthName + lunarPrev[solarOrder].lunarDayName : lunarPrev[solarOrder].lunarDayName;
                        htmlStr += '<div data-status="' + vacationArry[i].status + '" data-date="' + yPrev + '-' + (mPrev < 10 ? ('0' + mPrev) : mPrev) + '-' + solarOrderTxt + '" class="day-col pre-day-col day-col-' + vacationArry[i].status + '">';
                        htmlStr += '<span class="show-solar">' + (m - 1 <= 0 ? 12 : m - 1) + '月' + (solarOrder + 1) + '日</span> <span class = "show-lunar" >' + lunarDay + '</span>';
                    }
                    if (vacationArry[i].status === 2) { //是假期
                        htmlStr += '<div class="icon-vacation">休</div>';
                    }
                    if (vacationArry[i].remark != null) {
                        htmlStr += '<p class="show-vacation" title="'+vacationArry[i].remark+'">' + vacationArry[i].remark + '</p>';
                    }

                    htmlStr += '<p class="set-tip j-setBtn">设置节假日</p></div >';
                }
                if (nextDays != 0) { //下个月日历
                    for (var i = 0; i < nextDays; i++) {
                        var lunarDay = lunarNext[i].lunarDay === 1 ? lunarNext[i].lunarMonthName + lunarNext[i].lunarDayName : lunarNext[i].lunarDayName;
                        var solarOrderTxt = i < 9 ? '0' + (i + 1) : i + 1;
                        var j = vacationArry.length - nextDays + i;
                        htmlStr += '<div data-status="' + vacationArry[j].status + '"data-date="' + yNext + '-' + (mNext < 10 ? ('0' + mNext) : mNext) + '-' + solarOrderTxt + '" class="day-col pre-day-col day-col-"'+vacationArry[j].status+'>';
                        htmlStr += '<span class="show-solar ">' + (m + 1 <= 12 ? m + 1 : 1) + '月' + (i + 1) + '日</span><span class = "show-lunar" >' + lunarDay + '</span>';
                        if (vacationArry[j].status === 2) { //是假期
                            htmlStr += '<div class="icon-vacation">休</div>';
                        }
                        if (vacationArry[j].remark != null) {
                            htmlStr += '<p class="show-vacation" title="'+vacationArry[j].remark+'">' + vacationArry[j].remark + '</p>';
                        }
                        htmlStr += '<p class="set-tip j-setBtn">设置节假日</p></div>';
                    }

                } else {
                    htmlStr += '</div>';
                }

                $('.j-dateBox').html(htmlStr);
                _this.setEvent(); //绑定事件
            }
        }
    };
    return calendar;
});
