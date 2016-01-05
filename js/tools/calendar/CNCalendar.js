/**
 * CN Calendar
 * vervison : v1.0
 * Github : https://github.com/Lomu/cn-calendar
 * Author : Lomu
 * Email : whyun@vip.qq.com
 * 插件修改自LunarCalendar：https://github.com/zzyss86/LunarCalendar
 */
(function() {
    var extend = function(o, c) {
        if (o && c && typeof c === "object") {
            for (var p in c) {
                if (c.hasOwnProperty(p)) {
                    o[p] = c[p];
                }
            }
        }
        return o;
    };

    /**
     * 截取指定时间段
     */
    var creatLenArr = function(year, month, len, start) {
        var arr = [];
        start = start || 0;
        if (len < 1) {
            return arr;
        }
        var k = start;
        for (var i = 0; i < len; i++) {
            arr.push({
                year: year,
                month: month,
                day: k,
                timestamp: new Date(year, month - 1, k).getTime() / 1000
            });
            k++;
        }
        return arr;
    };

    var errorCode = {
        //错误码列表
        100: "年份超过了可查询范围",
        101: "参数错误，请查阅文档"
    };
    var cache = null;
    //某年相同计算进行cache，以加速计算速度
    var cacheUtil = {
        //cache管理工具
        current: "",
        setCurrent: function(year) {
            if (this.current != year) {
                this.current = year;
                this.clear();
            }
        },
        set: function(key, value) {
            if (!cache) {
                cache = {};
            }
            cache[key] = value;
            return cache[key];
        },
        get: function(key) {
            if (!cache) {
                cache = {};
            }
            return cache[key];
        },
        clear: function() {
            cache = null;
        }
    };
    var formateDayD4 = function(month, day) {
        month = month + 1;
        month = month < 10 ? "0" + month : month;
        day = day < 10 ? "0" + day : day;
        return "d" + month + day;
    };
    var minYear = 1890;
    //最小年限
    var maxYear = 2100;
    //最大年限
    var DATA = {
        heavenlyStems: ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"],
        //天干
        earthlyBranches: ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"],
        //地支
        zodiac: ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"],
        //对应地支十二生肖
        solarTerm: ["小寒", "大寒", "立春", "雨水", "惊蛰", "春分", "清明", "谷雨", "立夏", "小满", "芒种", "夏至", "小暑", "大暑", "立秋", "处暑", "白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪", "冬至"],
        //二十四节气
        monthCn: ["正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "腊"],
        dateCn: ["初一", "初二", "初三", "初四", "初五", "初六", "初七", "初八", "初九", "初十", "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十", "廿一", "廿二", "廿三", "廿四", "廿五", "廿六", "廿七", "廿八", "廿九", "三十", "卅一"]
    };
    //中国节日放假安排，外部设置，0无特殊安排，1工作，2放假
    var worktime = {};
    worktime.y2013 = {
        d0101: 2,
        d0102: 2,
        d0103: 2,
        d0105: 1,
        d0106: 1,
        d0209: 2,
        d0210: 2,
        d0211: 2,
        d0212: 2,
        d0213: 2,
        d0214: 2,
        d0215: 2,
        d0216: 1,
        d0217: 1,
        d0404: 2,
        d0405: 2,
        d0406: 2,
        d0407: 1,
        d0427: 1,
        d0428: 1,
        d0429: 2,
        d0430: 2,
        d0501: 2,
        d0608: 1,
        d0609: 1,
        d0610: 2,
        d0611: 2,
        d0612: 2,
        d0919: 2,
        d0920: 2,
        d0921: 2,
        d0922: 1,
        d0929: 1,
        d1001: 2,
        d1002: 2,
        d1003: 2,
        d1004: 2,
        d1005: 2,
        d1006: 2,
        d1007: 2,
        d1012: 1
    };
    worktime.y2014 = {
        d0101: 2,
        d0126: 1,
        d0131: 2,
        d0201: 2,
        d0202: 2,
        d0203: 2,
        d0204: 2,
        d0205: 2,
        d0206: 2,
        d0208: 1,
        d0405: 2,
        d0407: 2,
        d0501: 2,
        d0502: 2,
        d0503: 2,
        d0504: 1,
        d0602: 2,
        d0908: 2,
        d0928: 1,
        d1001: 2,
        d1002: 2,
        d1003: 2,
        d1004: 2,
        d1005: 2,
        d1006: 2,
        d1007: 2,
        d1011: 1
    };

    //公历节日
    var solarFestival = {
        d0101: "元旦",
        d0214: "情人节",
        d0308: "妇女节",
        d0312: "植树节",
        d0315: "消费者权益日",
        d0401: "愚人节",
        d0501: "劳动节",
        d0504: "青年节",
        d0601: "儿童节",
        d0801: "建军节",
        d0910: "教师节",
        d1001: "国庆节",
        d1224: "平安夜",
        d1225: "圣诞节"
    };
    //农历节日
    var lunarFestival = {
        d0101: "春节",
        d0115: "元宵节",
        d0505: "端午节",
        d0707: "七夕",
        d0715: "中元节",
        d0815: "中秋节",
        d0909: "重阳节",
        d1208: "腊八",
        d1223: "小年",
        d0100: "除夕"
    };
    /**
     * 1890 - 2100 年的农历数据
     * 数据格式：[0,2,9,21936]
     * [闰月所在月，0为没有闰月; *正月初一对应公历月; *正月初一对应公历日; *农历每月的天数的数组（需转换为二进制,得到每月大小，0=小月(29日),1=大月(30日)）;]
     */
    var lunarInfo = [
        [2, 1, 21, 22184],
        [0, 2, 9, 21936],
        [6, 1, 30, 9656],
        [0, 2, 17, 9584],
        [0, 2, 6, 21168],
        [5, 1, 26, 43344],
        [0, 2, 13, 59728],
        [0, 2, 2, 27296],
        [3, 1, 22, 44368],
        [0, 2, 10, 43856],
        [8, 1, 30, 19304],
        [0, 2, 19, 19168],
        [0, 2, 8, 42352],
        [5, 1, 29, 21096],
        [0, 2, 16, 53856],
        [0, 2, 4, 55632],
        [4, 1, 25, 27304],
        [0, 2, 13, 22176],
        [0, 2, 2, 39632],
        [2, 1, 22, 19176],
        [0, 2, 10, 19168],
        [6, 1, 30, 42200],
        [0, 2, 18, 42192],
        [0, 2, 6, 53840],
        [5, 1, 26, 54568],
        [0, 2, 14, 46400],
        [0, 2, 3, 54944],
        [2, 1, 23, 38608],
        [0, 2, 11, 38320],
        [7, 2, 1, 18872],
        [0, 2, 20, 18800],
        [0, 2, 8, 42160],
        [5, 1, 28, 45656],
        [0, 2, 16, 27216],
        [0, 2, 5, 27968],
        [4, 1, 24, 44456],
        [0, 2, 13, 11104],
        [0, 2, 2, 38256],
        [2, 1, 23, 18808],
        [0, 2, 10, 18800],
        [6, 1, 30, 25776],
        [0, 2, 17, 54432],
        [0, 2, 6, 59984],
        [5, 1, 26, 27976],
        [0, 2, 14, 23248],
        [0, 2, 4, 11104],
        [3, 1, 24, 37744],
        [0, 2, 11, 37600],
        [7, 1, 31, 51560],
        [0, 2, 19, 51536],
        [0, 2, 8, 54432],
        [6, 1, 27, 55888],
        [0, 2, 15, 46416],
        [0, 2, 5, 22176],
        [4, 1, 25, 43736],
        [0, 2, 13, 9680],
        [0, 2, 2, 37584],
        [2, 1, 22, 51544],
        [0, 2, 10, 43344],
        [7, 1, 29, 46248],
        [0, 2, 17, 27808],
        [0, 2, 6, 46416],
        [5, 1, 27, 21928],
        [0, 2, 14, 19872],
        [0, 2, 3, 42416],
        [3, 1, 24, 21176],
        [0, 2, 12, 21168],
        [8, 1, 31, 43344],
        [0, 2, 18, 59728],
        [0, 2, 8, 27296],
        [6, 1, 28, 44368],
        [0, 2, 15, 43856],
        [0, 2, 5, 19296],
        [4, 1, 25, 42352],
        [0, 2, 13, 42352],
        [0, 2, 2, 21088],
        [3, 1, 21, 59696],
        [0, 2, 9, 55632],
        [7, 1, 30, 23208],
        [0, 2, 17, 22176],
        [0, 2, 6, 38608],
        [5, 1, 27, 19176],
        [0, 2, 15, 19152],
        [0, 2, 3, 42192],
        [4, 1, 23, 53864],
        [0, 2, 11, 53840],
        [8, 1, 31, 54568],
        [0, 2, 18, 46400],
        [0, 2, 7, 46752],
        [6, 1, 28, 38608],
        [0, 2, 16, 38320],
        [0, 2, 5, 18864],
        [4, 1, 25, 42168],
        [0, 2, 13, 42160],
        [10, 2, 2, 45656],
        [0, 2, 20, 27216],
        [0, 2, 9, 27968],
        [6, 1, 29, 44448],
        [0, 2, 17, 43872],
        [0, 2, 6, 38256],
        [5, 1, 27, 18808],
        [0, 2, 15, 18800],
        [0, 2, 4, 25776],
        [3, 1, 23, 27216],
        [0, 2, 10, 59984],
        [8, 1, 31, 27432],
        [0, 2, 19, 23232],
        [0, 2, 7, 43872],
        [5, 1, 28, 37736],
        [0, 2, 16, 37600],
        [0, 2, 5, 51552],
        [4, 1, 24, 54440],
        [0, 2, 12, 54432],
        [0, 2, 1, 55888],
        [2, 1, 22, 23208],
        [0, 2, 9, 22176],
        [7, 1, 29, 43736],
        [0, 2, 18, 9680],
        [0, 2, 7, 37584],
        [5, 1, 26, 51544],
        [0, 2, 14, 43344],
        [0, 2, 3, 46240],
        [4, 1, 23, 46416],
        [0, 2, 10, 44368],
        [9, 1, 31, 21928],
        [0, 2, 19, 19360],
        [0, 2, 8, 42416],
        [6, 1, 28, 21176],
        [0, 2, 16, 21168],
        [0, 2, 5, 43312],
        [4, 1, 25, 29864],
        [0, 2, 12, 27296],
        [0, 2, 1, 44368],
        [2, 1, 22, 19880],
        [0, 2, 10, 19296],
        [6, 1, 29, 42352],
        [0, 2, 17, 42208],
        [0, 2, 6, 53856],
        [5, 1, 26, 59696],
        [0, 2, 13, 54576],
        [0, 2, 3, 23200],
        [3, 1, 23, 27472],
        [0, 2, 11, 38608],
        [11, 1, 31, 19176],
        [0, 2, 19, 19152],
        [0, 2, 8, 42192],
        [6, 1, 28, 53848],
        [0, 2, 15, 53840],
        [0, 2, 4, 54560],
        [5, 1, 24, 55968],
        [0, 2, 12, 46496],
        [0, 2, 1, 22224],
        [2, 1, 22, 19160],
        [0, 2, 10, 18864],
        [7, 1, 30, 42168],
        [0, 2, 17, 42160],
        [0, 2, 6, 43600],
        [5, 1, 26, 46376],
        [0, 2, 14, 27936],
        [0, 2, 2, 44448],
        [3, 1, 23, 21936],
        [0, 2, 11, 37744],
        [8, 2, 1, 18808],
        [0, 2, 19, 18800],
        [0, 2, 8, 25776],
        [6, 1, 28, 27216],
        [0, 2, 15, 59984],
        [0, 2, 4, 27424],
        [4, 1, 24, 43872],
        [0, 2, 12, 43744],
        [0, 2, 2, 37600],
        [3, 1, 21, 51568],
        [0, 2, 9, 51552],
        [7, 1, 29, 54440],
        [0, 2, 17, 54432],
        [0, 2, 5, 55888],
        [5, 1, 26, 23208],
        [0, 2, 14, 22176],
        [0, 2, 3, 42704],
        [4, 1, 23, 21224],
        [0, 2, 11, 21200],
        [8, 1, 31, 43352],
        [0, 2, 19, 43344],
        [0, 2, 7, 46240],
        [6, 1, 27, 46416],
        [0, 2, 15, 44368],
        [0, 2, 5, 21920],
        [4, 1, 24, 42448],
        [0, 2, 12, 42416],
        [0, 2, 2, 21168],
        [3, 1, 22, 43320],
        [0, 2, 9, 26928],
        [7, 1, 29, 29336],
        [0, 2, 17, 27296],
        [0, 2, 6, 44368],
        [5, 1, 26, 19880],
        [0, 2, 14, 19296],
        [0, 2, 3, 42352],
        [4, 1, 24, 21104],
        [0, 2, 10, 53856],
        [8, 1, 30, 59696],
        [0, 2, 18, 54560],
        [0, 2, 7, 55968],
        [6, 1, 27, 27472],
        [0, 2, 15, 22224],
        [0, 2, 5, 19168],
        [4, 1, 25, 42216],
        [0, 2, 12, 42192],
        [0, 2, 1, 53584],
        [2, 1, 21, 55592],
        [0, 2, 9, 54560]
    ];
    /**
     * 二十四节气数据，节气点时间（单位是分钟）
     * 从0小寒起算
     */
    var termInfo = [0, 21208, 42467, 63836, 85337, 107014, 128867, 150921, 173149, 195551, 218072, 240693, 263343, 285989, 308563, 331033, 353350, 375494, 397447, 419210, 440795, 462224, 483532, 504758];
    /**
     * 判断农历年闰月数
     * @param {Number} year 农历年
     * return 闰月数 （月份从1开始）
     */
    function getLunarLeapYear(year) {
            var yearData = lunarInfo[year - minYear];
            return yearData[0];
        }
        /**
         * 获取农历年份一年的每月的天数及一年的总天数
         * @param {Number} year 农历年
         */
    function getLunarYearDays(year) {
            var yearData = lunarInfo[year - minYear];
            var leapMonth = yearData[0];
            //闰月
            var monthData = yearData[3].toString(2);
            var monthDataArr = monthData.split("");
            //还原数据至16位,少于16位的在前面插入0（二进制存储时前面的0被忽略）
            for (var i = 0; i < 16 - monthDataArr.length; i++) {
                monthDataArr.unshift(0);
            }
            var len = leapMonth ? 13 : 12;
            //该年有几个月
            var yearDays = 0;
            var monthDays = [];
            for (var j = 0; j < len; j++) {
                if (monthDataArr[j] == 0) {
                    yearDays += 29;
                    monthDays.push(29);
                } else {
                    yearDays += 30;
                    monthDays.push(30);
                }
            }
            return {
                yearDays: yearDays,
                monthDays: monthDays
            };
        }
        /**
         * 通过间隔天数查找农历日期
         * @param {Number} year,between 农历年，间隔天数
         */
    function getLunarDateByBetween(year, between) {
            var lunarYearDays = getLunarYearDays(year);
            var end = between > 0 ? between : lunarYearDays.yearDays - Math.abs(between);
            var monthDays = lunarYearDays.monthDays;
            var tempDays = 0;
            var month = 0;
            for (var i = 0; i < monthDays.length; i++) {
                tempDays += monthDays[i];
                if (tempDays > end) {
                    month = i;
                    tempDays = tempDays - monthDays[i];
                    break;
                }
            }
            return [year, month, end - tempDays + 1];
        }
        /**
         * 根据距离正月初一的天数计算农历日期
         * @param {Number} year 公历年，月，日
         */
    function getLunarByBetween(year, month, day) {
            var yearData = lunarInfo[year - minYear];
            var zenMonth = yearData[1];
            var zenDay = yearData[2];
            var between = getDaysBetweenSolar(year, zenMonth - 1, zenDay, year, month, day);
            if (between == 0) {
                //正月初一
                return [year, 0, 1];
            } else {
                var lunarYear = between > 0 ? year : year - 1;
                return getLunarDateByBetween(lunarYear, between);
            }
        }
        /**
         * 两个公历日期之间的天数
         */
    function getDaysBetweenSolar(year, month, day, year1, month1, day1) {
            var date = new Date(year, month, day).getTime();
            var date1 = new Date(year1, month1, day1).getTime();
            return (date1 - date) / 864e5;
        }
        /**
         * 计算农历日期离正月初一有多少天
         * @param {Number} year,month,day 农年，月(0-12，有闰月)，日
         */
    function getDaysBetweenZheng(year, month, day) {
            var lunarYearDays = getLunarYearDays(year);
            var monthDays = lunarYearDays.monthDays;
            var days = 0;
            for (var i = 0; i < monthDays.length; i++) {
                if (i < month) {
                    days += monthDays[i];
                } else {
                    break;
                }
            }
            return days + day - 1;
        }
        /**
         * 某年的第n个节气为几日
         * 31556925974.7为地球公转周期，是毫秒
         * 1890年的正小寒点：01-05 16:02:31，1890年为基准点
         * @param {Number} y 公历年
         * @param {Number} n 第几个节气，从0小寒起算
         * 由于农历24节气交节时刻采用近似算法，可能存在少量误差(30分钟内)
         */
    function getTerm(y, n) {
            var offDate = new Date(31556925974.7 * (y - 1890) + termInfo[n] * 6e4 + Date.UTC(1890, 0, 5, 16, 2, 31));
            return offDate.getUTCDate();
        }
        /**
         * 获取公历年一年的二十四节气
         * 返回key:日期，value:节气中文名
         */
    function getYearTerm(year) {
            var res = {};
            var month = 0;
            for (var i = 0; i < 24; i++) {
                var day = getTerm(year, i);
                if (i % 2 == 0) {
                    month++;
                }
                res[formateDayD4(month - 1, day)] = DATA.solarTerm[i];
            }
            return res;
        }
        /**
         * 获取生肖
         * @param {Number} year 干支所在年（默认以立春前的公历年作为基数）
         */
    function getYearZodiac(year) {
            var num = year - 1890 + 25;
            //参考干支纪年的计算，生肖对应地支
            return DATA.zodiac[num % 12];
        }
        /**
         * 计算天干地支
         * @param {Number} num 60进制中的位置(把60个天干地支，当成一个60进制的数)
         */
    function cyclical(num) {
            return DATA.heavenlyStems[num % 10] + DATA.earthlyBranches[num % 12];
        }
        /**
         * 获取干支纪年
         * @param {Number} year 干支所在年
         * @param {Number} offset 偏移量，默认为0，便于查询一个年跨两个干支纪年（以立春为分界线）
         */
    function getLunarYearName(year, offset) {
            offset = offset || 0;
            //1890年1月小寒（小寒一般是1月5或6日）以前为己丑年，在60进制中排25
            return cyclical(year - 1890 + 25 + offset);
        }
        /**
         * 获取干支纪月
         * @param {Number} year,month 公历年，干支所在月
         * @param {Number} offset 偏移量，默认为0，便于查询一个月跨两个干支纪月（有立春的2月）
         */
    function getLunarMonthName(year, month, offset) {
            offset = offset || 0;
            //1890年1月小寒以前为丙子月，在60进制中排12
            return cyclical((year - 1890) * 12 + month + 12 + offset);
        }
        /**
         * 获取干支纪日
         * @param {Number} year,month,day 公历年，月，日
         */
    function getLunarDayName(year, month, day) {
            //当日与1890/1/1 相差天数
            //1890/1/1与 1970/1/1 相差29219日, 1890/1/1 日柱为壬午日(60进制18)
            var dayCyclical = Date.UTC(year, month, day) / 864e5 + 29219 + 18;
            return cyclical(dayCyclical);
        }
        /**
         * 获取公历月份的天数
         * @param {Number} year 公历年
         * @param {Number} month 公历月
         */
    function getSolarMonthDays(year, month) {
            var monthDays = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            return monthDays[month];
        }
        /**
         * 判断公历年是否是闰年
         * @param {Number} year 公历年
         */
    function isLeapYear(year) {
            return year % 4 == 0 && year % 100 != 0 || year % 400 == 0;
        }
        /*
         * 统一日期输入参数（输入月份从1开始，内部月份统一从0开始）
         */
    function formateDate(year, month, day, _minYear) {
            var argsLen = arguments.length;
            var now = new Date();
            year = argsLen ? parseInt(year, 10) : now.getFullYear();
            month = argsLen ? parseInt(month - 1, 10) : now.getMonth();
            day = argsLen ? parseInt(day, 10) || now.getDate() : now.getDate();
            if (year < (_minYear ? _minYear : minYear + 1) || year > maxYear) {
                return {
                    error: 100,
                    msg: errorCode[100]
                };
            }
            return {
                year: year,
                month: month,
                day: day
            };
        }
        /**
         * 将农历转换为公历
         * @param {Number} year,month,day 农历年，月(1-12，闰月自动忽略)，日
         */
    function lunarToSolar(_year, _month, _day) {
            // 过滤闰月，如果不需要过滤，可以删除下面两行，并且_month值为1-13
            var lunarLeapMonth = getLunarLeapYear(_year);
            _month = lunarLeapMonth > 0 && _month > lunarLeapMonth ? parseInt(_month) + 1 : _month;

            var inputDate = formateDate(_year, _month, _day);
            if (inputDate.error) {
                return inputDate;
            }
            var year = inputDate.year;
            var month = inputDate.month;
            var day = inputDate.day;
            var between = getDaysBetweenZheng(year, month, day);
            //离正月初一的天数
            var yearData = lunarInfo[year - minYear];
            var zenMonth = yearData[1];
            var zenDay = yearData[2];
            var offDate = new Date(year, zenMonth - 1, zenDay).getTime() + between * 864e5;
            offDate = new Date(offDate);
            return {
                year: offDate.getFullYear(),
                month: offDate.getMonth() + 1,
                day: offDate.getDate()
            };
        }
        /**
         * 将公历转换为农历
         * @param {Number} year,month,day 公历年，月，日
         */
    function solarToLunar(_year, _month, _day) {
            var inputDate = formateDate(_year, _month, _day, minYear);
            if (inputDate.error) {
                return inputDate;
            }
            var year = inputDate.year;
            var month = inputDate.month;
            var day = inputDate.day;
            cacheUtil.setCurrent(year);
            //立春日期
            var term2 = cacheUtil.get("term2") ? cacheUtil.get("term2") : cacheUtil.set("term2", getTerm(year, 2));
            //二十四节气
            var termList = cacheUtil.get("termList") ? cacheUtil.get("termList") : cacheUtil.set("termList", getYearTerm(year));
            var firstTerm = getTerm(year, month * 2);
            //某月第一个节气开始日期
            var GanZhiYear = month > 1 || month == 1 && day >= term2 ? year + 1 : year;
            //干支所在年份
            var GanZhiMonth = day >= firstTerm ? month + 1 : month;
            //干支所在月份（以节气为界）
            var lunarDate = getLunarByBetween(year, month, day);
            var lunarLeapMonth = getLunarLeapYear(lunarDate[0]);
            var lunarMonthName = "";
            if (lunarLeapMonth > 0 && lunarLeapMonth == lunarDate[1]) {
                lunarMonthName = "闰" + DATA.monthCn[lunarDate[1] - 1] + "月";
            } else if (lunarLeapMonth > 0 && lunarDate[1] > lunarLeapMonth) {
                lunarMonthName = DATA.monthCn[lunarDate[1] - 1] + "月";
            } else {
                lunarMonthName = DATA.monthCn[lunarDate[1]] + "月";
            }
            //农历节日判断
            var lunarFtv = "";
            var lunarMonthDays = getLunarYearDays(lunarDate[0]).monthDays;
            //除夕
            if (lunarDate[1] == lunarMonthDays.length - 1 && lunarDate[2] == lunarMonthDays[lunarMonthDays.length - 1]) {
                lunarFtv = lunarFestival["d0100"];
            } else if (lunarLeapMonth > 0 && lunarDate[1] > lunarLeapMonth) {
                lunarFtv = lunarFestival[formateDayD4(lunarDate[1] - 1, lunarDate[2])];
            } else {
                lunarFtv = lunarFestival[formateDayD4(lunarDate[1], lunarDate[2])];
            }
            var res = {
                zodiac: getYearZodiac(GanZhiYear),
                GanZhiYear: getLunarYearName(GanZhiYear),
                GanZhiMonth: getLunarMonthName(year, GanZhiMonth),
                GanZhiDay: getLunarDayName(year, month, day),
                //放假安排：0无特殊安排，1工作，2放假
                worktime: worktime["y" + year] && worktime["y" + year][formateDayD4(month, day)] ? worktime["y" + year][formateDayD4(month, day)] : 0,
                term: termList[formateDayD4(month, day)],
                lunarYear: lunarDate[0],
                lunarMonth: lunarLeapMonth > 0 && lunarLeapMonth < lunarDate[1] + 1 ? lunarDate[1] : lunarDate[1] + 1,
                lunarDay: lunarDate[2],
                lunarMonthName: lunarMonthName,
                lunarDayName: DATA.dateCn[lunarDate[2] - 1],
                lunarLeapMonth: lunarLeapMonth,
                solarFestival: solarFestival[formateDayD4(month, day)],
                lunarFestival: lunarFtv
            };
            return res;
        }
        /**
         * 获取指定公历月份的农历数据
         * return res{Object}
         * @param {Number} year,month,startday 公历年，月，每周开始时间
         */
    function calendar(_year, _month, startday) {
            var inputDate = formateDate(_year, _month);
            if (inputDate.error) {
                return inputDate;
            }
            var year = inputDate.year;
            var month = inputDate.month;
            var calendarData = solarCalendar(year, month + 1, startday);
            for (var i = 0; i < calendarData.monthData.length; i++) {
                var cData = calendarData.monthData[i];
                var lunarData = solarToLunar(cData.year, cData.month, cData.day);
                extend(calendarData.monthData[i], lunarData);
            }
            return calendarData;
        }
        /**
         * 公历某月日历
         * return res{Object}
         * @param {Number} year,month,startday 公历年，月，每周开始时间
         */
    function solarCalendar(_year, _month, startday) {
        var inputDate = formateDate(_year, _month);
        if (inputDate.error) {
            return inputDate;
        }
        var year = inputDate.year;
        var month = inputDate.month;
        var firstDate = new Date(year, month, 1);
        var preMonthDays, preMonthData, nextMonthData;
        var res = {
            firstDay: firstDate.getDay(),
            //该月1号星期几
            monthDays: getSolarMonthDays(year, month),
            //该月天数
            monthData: []
        };
        res.monthData = creatLenArr(year, month + 1, res.monthDays, 1);
        if (res.firstDay != startday) {
            //前补
            var preYear = month - 1 < 0 ? year - 1 : year;
            var preMonth = month - 1 < 0 ? 11 : month - 1;
            preMonthDays = getSolarMonthDays(preYear, preMonth);
            preMonthData = res.firstDay == 0 ? creatLenArr(preYear, preMonth + 1, 7 - startday, preMonthDays - 7 + 1 + startday) : creatLenArr(preYear, preMonth + 1, res.firstDay - startday, preMonthDays - res.firstDay + 1 + startday);
            res.monthData = preMonthData.concat(res.monthData);
        }
        res.rows = Math.ceil(res.monthData.length / 7);
        if (7 * res.rows - res.monthData.length > 0) {
            //后补
            var nextYear = month + 1 > 11 ? year + 1 : year;
            var nextMonth = month + 1 > 11 ? 0 : month + 1;
            var fillLen = 7 * res.rows - res.monthData.length;
            nextMonthData = creatLenArr(nextYear, nextMonth + 1, fillLen, 1);
            res.monthData = res.monthData.concat(nextMonthData);
        }
        return res;
    }
    
    /**
     * 获取周数
     * @param {Number} year,month,day,startday 公历年，月，日，每周开始时间
     */
    function getWeekNo(year, month, day, startday) {
        // Copy date so don't modify original
        d = new Date(year, month, day);
        d.setHours(0, 0, 0);
        // 判断每周第一天
        var a = startday ? d.getDay() || 7 : d.getDay();
        // Set to nearest Thursday: current date + 4 - current day number
        // // Make Sunday's day number 7        
        d.setDate(d.getDate() + 4 - a);
        // Get first day of year
        var yearStart = new Date(year, 0, 1);
        // Calculate full weeks to nearest Thursday
        var weekNo = Math.ceil(((d - yearStart) / 864e5 + 1) / 7);
        return weekNo;
    }

    /** 
     * 获取每个周的起始时间
     * @param {Number} year,week,startday 公历年，当前周数，每周开始时间
     */
    function getWeekTime(year, week, startday) {
        //计算天数
        var days = (week - 1) * 7;
        // 1月1号
        var oneone = new Date(year, 0, 1);
        // 第一周第一天
        var beginTime = oneone.getTime() - (oneone.getDay() - startday) * 24 * 60 * 60 * 1e3;
        // 当前周的第一天
        var beginDate = new Date(Math.ceil(days * 24 * 60 * 60 * 1e3 + beginTime));
        //当前周的最后一天
        var endDate = new Date(Math.ceil((days + 6) * 24 * 60 * 60 * 1e3 + beginTime));

        return {
            year: year,
            month: beginDate.getMonth() + 1,
            week: week,
            beginDate: beginDate,
            endDate: endDate
        }
    }

    /**
     * 获取周日历
     * @param {Number} _year,_month,_week,startday 公历年，月，当前周数，每周开始时间（0表示周日，1表示周一）
     */
    function weekCalendar(_year, _month, _week, startday) {
        // 字符串转成数字
        year = parseInt(_year);
        week = parseInt(_week);
        _month = parseInt(_month);

        // 当前时间，即当前周的第一天
        var currentDate = getWeekTime(year, week, startday).beginDate;

        // 当前时间的具体信息
        var month = currentDate.getMonth(),
            day = currentDate.getDate(),
            monthDays = getSolarMonthDays(year, month);
        var nextData;

        // 本月天数是否足够
        var isOut = monthDays - day + 1 < 7,
            // 是否上一年
            isPrevYear = isOut && month + 1 > 11 && _month - 1 != month || day < 8 && month == 0,
            // 是否下一年
            isNextYear = isOut && month + 1 > 11 && _month - 1 == month || monthDays - day == 6 && month == 11;

        var prevYear = isPrevYear ? year - 1 : year,
            nextYear = isNextYear ? year + 1 : year,
            prevMonth = day < 8 ? month : month + 1,
            prevMonth = prevMonth == 0 ? 12 : prevMonth,
            nextMonth = monthDays - day < 7 ? month + 2 : month + 1,
            nextMonth = nextMonth == 13 ? 1 : nextMonth,
            prevWeek = week == 1 ? getWeekNo(prevYear, 11, 31, startday) : week - 1,
            nextWeek = week == getWeekNo(year, 11, 31, startday) ? 1 : week + 1;

        var res = {
            //将周日改为7
            // 周数据，当前周、上周、下周
            weeks: {
                current: {
                    year: year,
                    month: _month,
                    week: week
                },
                prev: {
                    year: prevYear,
                    month: prevMonth,
                    week: prevWeek
                },
                next: {
                    year: nextYear,
                    month: nextMonth,
                    week: nextWeek
                }
            },
            weekData: []
        };
        if (isOut) {
            //本月天数不够
            if (month + 1 > 11 && _month - 1 != month) {
                year = year - 1;
            } else if (month + 1 > 11 && _month - 1 == month) {
                year = year;
            }
            nextData = creatLenArr(year, month + 1, monthDays - day + 1, day);
            nextData = nextData.concat(creatLenArr(nextYear, nextMonth, 7 - monthDays + day - 1, 1));
        } else {
            nextData = creatLenArr(year, month + 1, 7, day);
        }
        res.weekData = res.weekData.concat(nextData);

        // 跨年的情况周数调整
        if (nextData[6].month == 1 && nextData[0].month == 12) {
            res.weeks.next.week = 2;
        }
        if (nextData[0].month == 1 && nextData[0].day < 8) {
            res.weeks.prev.week = getWeekNo(prevYear, 11, 31, startday);
        }

        return res;
    }

    /**
     * 设置放假安排
     */
    function setWorktime(workData) {
        extend(worktime, workData);
    }

    /**
     * 设置放假安排【对外暴露接口】
     * @param {Object} workData
     */

    var CNCalendar = {
        solarToLunar: solarToLunar,
        lunarToSolar: lunarToSolar,
        calendar: calendar,
        solarCalendar: solarCalendar,
        weekCalendar: weekCalendar,
        setWorktime: setWorktime,
        getSolarMonthDays: getSolarMonthDays,
        getWeekNo: getWeekNo
    };

    if (typeof define === 'function') {
        define(function() {
            return CNCalendar;
        });

    } else if (typeof exports === 'object') {
        module.exports = CNCalendar;

    } else {
        window.CNCalendar = CNCalendar;

    };
})();
