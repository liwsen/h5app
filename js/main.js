define(function(require, exports, module) {
  var $ = require('jquery');
  var fn = require('m/fn');
  var HEAD = require('m/header');
  var ONEPAGE = require('m/onepage');
  var $header = $('#header');
  var myswiper = require('m/myswiper');
  var pagesId = 'tw4_pages';

  exports.init = function(options) {
    var DEFAULTS = {
      initialSlide: 0, //初始化slide
    };
    this.options = $.extend({}, DEFAULTS, options);

    this.swiperEffect().headerOptions(this.options.initialSlide).moreList();
    ONEPAGE.event();

    //滑动到指定到页面上
    $('#' + pagesId).on('click', '*[swiperpage]', function(event) {
      event.preventDefault();
      event.stopPropagation();
      var id = $(this).attr('swiperpage');
      var $id = $('#' + id);
      if (!!id && $id.length && !!$id.data('classname')) {
        $('.item_' + $id.data('classname')).trigger('click');
        $('.tw4Onepage').css({
          left: '100%',
          right: '-100%',
        });
      }
    });
    return this;
  };

  //整体滑动效果
  exports.swiperEffect = function() {
    var my = this;
    var $pages = $('#' + pagesId).find('.pageItem');
    var paginationClassName = 'paginationItem';
    var swiperResize = function(swiper) {
      var $items = $('.tw4PagePagination').find('.' +
        paginationClassName);
      $items.css({
        width: (100 / $items.length) + '%'
      });
    };

    myswiper.done(function() {
      swiper = new Swiper('#' + pagesId, {
        pagination: '#page_pagination',
        wrapperClass: 'tw4PageWrapper',
        slideClass: 'pageItem',
        slideActiveClass: 'pageActive',
        bulletActiveClass: 'paginationActive',
        paginationClickable: true,
        paginationBulletRender: function(index, className) {
          var myclass = $pages.eq(index).data('classname') ||
            index;
          var icon = $pages.eq(index).data('icon');
          var iconhover = $pages.eq(index).data('iconhover');
          var amount = $pages.eq(index).data('amount');
          amount = !!amount ? '<i>' + amount + '</i>' : '';
          return '<div class="item_' + myclass + ' ' +
            paginationClassName + ' ' + className + '">' +
            amount + '<span>' +
            $pages.eq(index).data('title') +
            '</span><img class="defIcon" src="' + icon +
            '"><img class="hoverIcon" src="' + iconhover +
            '"></div>';
        },
        onInit: swiperResize,
        observer: true,
        onTransitionEnd: function(swiper) {
          if (typeof my.activeSlide === 'undefined' || my.activeSlide !==
            swiper.activeIndex) {
            my.activeSlide = swiper.activeIndex;
            my.headerOptions(swiper.activeIndex);
          }
        },
        parallax: true,
        roundLengths: true,
        initialSlide: my.options.initialSlide, //初始化slide
      });
      $(window).on('resize', function(event) {
        event.preventDefault();
        swiperResize(swiper);
      });
    });
    return my;
  };

  //头部配置，开发每个项目时都首先配置好头部内容，同时注意和首页滑块内容与之对应。
  exports.headerOptions = function(type) {
    type = typeof type === 'undefined' ? this.options.initialSlide : type;
    //主页
    if (type === 0) {
      HEAD.init({
        elem: $header,
        title: '主页标题',
        options: 'logo,menu',
        menuTitle: '阿木橘子',
        menuUrl: 'http://liwsen.oschina.io/'
      });
      //公告头部
    } else if (type === 1) {
      HEAD.init({
        elem: $header,
        title: '公告通知',
        options: 'title,home,more',
        moreListTitle: '更多列表',
        moreListContent: '更多列表内容'
      });
      //搜索头部
    } else if (type === 2) {
      HEAD.init({
        elem: $header,
        customHeader: '.henderSearch'
      });
      //联系我们
    } else if (type === 3) {
      HEAD.init({
        elem: $header,
        title: '联系我们',
        options: 'title,home,menu',
        menuClassName: 'icons-about'
      });
      //帮助文档
    } else if (type === 4) {
      HEAD.init({
        elem: $header,
        title: '帮助文档',
        options: 'title,home'
      });
    }
    return this;
  };

  //左侧滑动列表
  exports.moreList = function() {
    $('body').off('click', '*[morelist]').on('click', '*[morelist]',
      function(event) {
        event.preventDefault();
        var str = $(this).attr('morelist');
        try {
          var obj = fn.toJson(str);
          require.async(['m/morelist'], function(moreList) {
            moreList.init(obj);
          });
        } catch (err) {
          console.log(err);
        }
      });
    return this;
  };

});
