/*
 * 检查页面相关功能
*/
(function(){
	var FEPage = FEPage || {};
    FEPage = {
    	data : {},
    	getMeta : function(){
    		var that = this;
    		var _title = document.getElementsByTagName('title')[0].innerHTML;
    		that.data.title = _title;

			var _meta = document.getElementsByTagName('meta');
			['keywords','description'].forEach(getKeyContent);
			function getKeyContent(i,v){
				for( var m=0;m<_meta.length;m++){
					if( _meta[m].name == i ){
						that.data[i] = _meta[m].content;
					}
				}
			}
    	},
    	getImgAlt : function(){
    		var that = this;
    		var _imgAlt = document.getElementsByTagName('img');
			var _altArray = [];
			for( var n = 0;n<=_imgAlt.length-1;n++){
				if( _imgAlt[n].getAttribute('alt')){
					_altArray.push(_imgAlt[n]);
				}else{
					_imgAlt[n].className = "j-outline"
				}
			}	
			that.data['totalImage'] = _imgAlt.length;
			that.data['imageAlt'] = _altArray.length;
    	},
    	getImgNaturalDimensions:function(){
    		var that = this,
    			_imgArray = [],
    			elemetnArray = [];
    		var _imgWH = document.getElementsByTagName('img');
    		for( var i=0,len=_imgWH.length;i<len;i++){
    			_imgArray.push(_imgWH[i]);
    		}

    		_imgArray.forEach(getNaturalWH);
    		//异步或延迟的
    		function dynicImgwh(elementSrc,callback){
    			var nImgArray = [];
    			var image = new Image();
    			image.src = elementSrc;
    			image.onload = function(){
    				callback(image.width,image.height);
    			}
				
    		}
    		function getNaturalWH(element, index){
    			if(element.width != element.naturalWidth || element.height != element.naturalHeight){
    				elemetnArray.push(element);
    				//console.log(element.getAttribute('src'),element.width,element.naturalWidth)
    			}
    		}
    		that.data['imgNatural']= elemetnArray;
    	},
    	getPageRedirect : function(){
    		var that = this;
    		var _pageMethod = ['用户通过连接或在地址栏中输入URL的方式打开页面',
    			'页面被刷新','用户通过点击浏览器的前进按钮或后退按钮或其他操作浏览器历史记录的方法打开页面'
    		]
    			
    		that.data['pageMethodType'] = _pageMethod[performance.navigation.type];
    		that.data['pageRedirectNum'] = performance.navigation.redirectCount;
    	},
    	getPerformanceTime : function(){
    		var that = this;
    		var _speedHtml = [];
    		var timing = performance.timing,
    		readyStart = timing.fetchStart - timing.navigationStart;
    		redirectTime = timing.redirectEnd  - timing.redirectStart;
    		appcacheTime = timing.domainLookupStart  - timing.fetchStart;
    		unloadEventTime = timing.unloadEventEnd - timing.unloadEventStart;
    		lookupDomainTime = timing.domainLookupEnd - timing.domainLookupStart;
    		connectTime = timing.connectEnd - timing.connectStart;
    		requestTime = timing.responseEnd - timing.requestStart;
    		initDomTreeTime = timing.domInteractive - timing.responseEnd;
    		domReadyTime = timing.domComplete - timing.domInteractive; //过早获取时 domComplete有时会是0
    		loadEventTime = timing.loadEventEnd - timing.loadEventStart;
    		loadTime = timing.loadEventEnd - timing.navigationStart;//过早获取时 loadEventEnd有时会是0

    		var _resourcelist = performance.getEntries().length;
			
			var _pageSpeed = [
				['准备新页面时间耗时',readyStart],
				['redirect 重定向耗时',redirectTime],
				['Appcache 耗时',appcacheTime],
				['unload 前文档耗时',unloadEventTime],
				['DNS 查询耗时',lookupDomainTime],
				['TCP连接耗时',connectTime],
				['request请求耗时',requestTime],
				['请求完毕至DOM加载',initDomTreeTime],
				['解释dom树耗时',domReadyTime],
				['load事件耗时',loadEventTime],
				['从开始至load总耗时',loadTime],
				['请求数(不含异步)',_resourcelist]
			];

			_speedHtml.push('<div class="m_fe_table"><table>');
			for( var i in _pageSpeed){
				if( i%2==0){
					var _n = parseInt(i)+1;
					_speedHtml.push("<tr><th>"+_pageSpeed[i][0]+"</th><td>"+_pageSpeed[i][1]+"</td><th>"+_pageSpeed[_n][0]+"</th><td>"+_pageSpeed[_n][1]+"</td></tr>");
				}
				
			}
			
			_speedHtml.push('</table></div>');
			that.data['speedRender'] = _speedHtml.join('');
			
		},
		getJsMemory : function(){
			var that = this;
			var _memory = performance.memory;
			//js允许最大大小，包含执行时空间
			that.data['jsHeapSizeLimit'] = _memory.jsHeapSizeLimit;
			//当前页面的js内存使用
			that.data['usedJSHeapSize'] = _memory.usedJSHeapSize;
			//包含系统和当前页面js的内存使用
			that.data['totalJSHeapSize'] = _memory.totalJSHeapSize;
		},
		getShortIcon : function(){
			var that = this;
			var _link = document.getElementsByTagName('link');
			for( var i=0;i<_link.length;i++){
				if( _link[i].getAttribute('rel') == 'shortcut icon'){
					that.data.shortcutIcon = _link[i].getAttribute('href');
				}
			}
		},
		getChromeLoadTime : function(){
			var that = this,
				_chromeTimeHtml = [];
			//chrome专属
    		var _chromeLoadTime = window.chrome.loadTimes();
    		var _commitLT = _chromeLoadTime.commitLoadTime,
    			_finishDocLT = _chromeLoadTime.finishDocumentLoadTime,
    			_finishLT = _chromeLoadTime.finishLoadTime,
    			_firstPaintAfterLT = _chromeLoadTime.firstPaintAfterLoadTime,
    			_firstPaintT = _chromeLoadTime.firstPaintTime,
    			_rqT = _chromeLoadTime.requestTime,
    			_sLT = _chromeLoadTime.startLoadTime;
			
			var _chromeData = [
				//['commitLoadTime',_commitLT],
				['完成文档加载时间',_finishDocLT],
				['完成加载时间',_finishLT],
				['加载完后第一次渲染时间点',_firstPaintAfterLT],
				['第一次渲染时间点',_firstPaintT],
				['请求时间点',_rqT],
				['开始加载时间点',_sLT]
			];

			_chromeTimeHtml.push('<div class="m_fe_table"><table>');
			for( var i in _chromeData){
				if( i%2==0){
					var _n = parseInt(i)+1;
					_chromeTimeHtml.push("<tr><th>"+_chromeData[i][0]+"</th><td>"+_chromeData[i][1]+"</td><th>"+_chromeData[_n][0]+"</th><td>"+_chromeData[_n][1]+"</td></tr>");
				}
				
			}
			
			_chromeTimeHtml.push('</table></div>');
			that.data['chromeData'] = _chromeTimeHtml.join('');
			

		},
		checkMobile:function(){
			var that = this;
			//检测a标签是否有title属性
			var _aArrayTemp = [];
			var _aArray = document.getElementsByTagName('a');
			for( var i=0,len = _aArray.length;i<len;i++){
				if(_aArray[i].getAttribute('title')){
					_aArrayTemp.push(_aArray[i]);
					_aArray[i].className = "j-aoutline";
				}
			}
			that.data['docA'] = _aArray.length;
			that.data['Atitle']=_aArrayTemp.length;
			
		},
		getResult : function(data){
			var that = this;
			if( document.getElementById('j-checkResult')){
				return;
			}
			var _location = window.location.href;

			var _title = data.title ? data.title : "暂无",
				_keywords = data.keywords ? data.keywords : "暂无",
				_description = data.description ? data.description : "暂无",
				_imgTotalNum = data.totalImage ? data.totalImage : "暂无",
				_imgTotalAlt = data.imageAlt ? data.imageAlt : "暂无",
				_shortCutIcon = data.shortcutIcon ? data.shortcutIcon : "暂无",
				_connectTime = data.connectTime,
				_responseTime = data.responseTime,
				_requestTime = data.requestTime,
				_totaldomNum = data.totalDomNum,
				_totalcssLinkNum = data.totalCssLinkNum.length,
				_totalScriptNum = data.totalScriptNum.length,
				_tongji = data.baidutj ? data.baidutj : "未添加",
				_docANum = data.docA,
				_mobileAtitle = data.Atitle;

				//css外链清单
				var _cssHtml = "";
				for( var m in data.totalCssLinkNum){
					_cssHtml += '<p>'+m+'）'+data.totalCssLinkNum[m]+'</p>'
					
				}

				var _jsHtml = "";
				for( var i in data.totalScriptNum){
					_jsHtml += '<p>'+i+'）'+data.totalScriptNum[i]+'</p>'
				}

				//本页面内存使用情况
				var _memoryHtml = "";
				var _nounExplan = {
					"jsHeapSizeLimit":"js允许最大大小，包含执行时空间",
					"usedJSHeapSize" : "当前页面的js内存使用",
					"totalJSHeapSize" : "包含系统和当前页面js的内存使用"
				};
				['jsHeapSizeLimit','usedJSHeapSize','totalJSHeapSize'].forEach(getMemoryHtml);
				function getMemoryHtml(i,v){
					_memoryHtml+='<p>'+_nounExplan[i]+'：'+data[i]/1024+'M</p>';
				}
				
				//本页面图片尺寸是否合适
				var _imgwhTemplate = [];
				var _wherrorLength = data.imgNatural.length;
				_imgwhTemplate.push('<div class="m_fe_table"><table><tr><th>路径</th><th>图片大小（宽，高）</th><th>原始大小（宽，高）</th><tr>');
				for( var g in data.imgNatural){
					_imgwhTemplate.push("<tr><td><a href='"+data.imgNatural[g].getAttribute('src')+"' target='_blank'/>点击查看</a></td><td>"+data.imgNatural[g].width+"，"+data.imgNatural[g].height+"</td><td>"+data.imgNatural[g].naturalWidth+"，"+data.imgNatural[g].naturalHeight+"</td></tr>");
				}
			
				_imgwhTemplate.push('</table></div>');
				

				var _element = document.createElement('div');
				_element.id = "j-checkResult";
				_element.className = "m_fecheck";
				_element.innerHTML = '<p class="m_fecheck_title">'+_location+'的基本信息：</p>\
								  <ul>\
								    <li><span class="m_fec_title">title：</span>'+ _title +'</li>\
									<li><span class="m_fec_title">keyword：</span>'+ _keywords +'</li>\
									<li><span class="m_fec_title">description：</span>'+ _description +'</li>\
									<li><span class="m_fec_title">总共有图片：</span>'+ _imgTotalNum +'，其中有alt属性的有：'+ _imgTotalAlt +'<span class="m_fecheck_tip">其中无alt的会标示出来</span></li>\
									<li><span class="m_fec_title">A标签：</span>'+ _docANum +'，其中有title属性的有：'+ _mobileAtitle +'<span class="m_fecheck_tip">其中有title的会标示出来</span></li>\
									<li><span class="m_fec_title">shortcut icon图标：</span>'+ _shortCutIcon +'</li>\
									<li><span class="m_fec_title">百度统计：</span>'+_tongji+'</li>\
									<li><span class="m_fec_title">网页速度相关(ms,异步的话等加载完)：</span>'+data.speedRender+'</li>\
									<li><span class="m_fec_title">总节点数：</span>'+ _totaldomNum+'</li>\
									<li><span class="m_fec_title">css外链总数：</span>'+ _totalcssLinkNum+'，清单如下：'+_cssHtml+'</li>\
									<li><span class="m_fec_title">js外链总数：</span>'+_totalScriptNum+'，清单如下：'+_jsHtml+'</li>\
									<li><span class="m_fec_title">本页面JS使用情况：</span>'+_memoryHtml+'</li>\
									<li><span class="m_fec_title">页面被重定向的次数：</span>'+data.pageRedirectNum+'</li>\
									<li><span class="m_fec_title">页面通过以下方式被打开：</span>'+data.pageMethodType+'</li>\
									<li><span class="m_fec_title">页面性能相关(chrome专属)</span>'+ data.chromeData+'</li>\
									<li><span class="m_fec_title">本页面图片尺寸不符合情况：（共有'+_wherrorLength+'张）</span>'+ _imgwhTemplate.join('')+'</li>\
								</ul>\
								<span class="m-feclose" id="j-fecheck-close">关闭</span>\
								<span class="m_fb" id="j-fabu"></span>';

			var _body = document.body;
			_body.insertBefore(_element,null);
					

			if( data.title && data.keywords && data.description && data.shortcutIcon ){
				document.getElementById('j-fabu').innerHTML = "恭喜你，可以发布了";
			}else{
				
			}

			var _closeBtn = document.getElementById('j-fecheck-close'),
				_checkPop = document.getElementById('j-checkResult');
			_closeBtn.addEventListener('click',function(){
				_body.removeChild(_checkPop);
				this.click = null;
			})
		},
		doDynamicStyle : function( href ){
			if( document.getElementById('j-dynamic-style')){
				return;
			}
			var _link = document.createElement('link');
				_link.id = "j-dynamic-style",
				_link.rel = "stylesheet",
				_link.type= "text/css";
				_link.href = href;
			var _head = document.getElementsByTagName('head')[0];
			_head.insertBefore(_link,null);
		},
		getCssJsNum : function(){
			var that = this,
				_tempTotalLinkNum = [];
				_tempTotalScriptNum = [];

			var _totaldomNum = document.getElementsByTagName('*').length;
				_linkTag = document.getElementsByTagName('link');
				_ScripTag = document.getElementsByTagName('script');

				for( var i =0;i<_linkTag.length;i++){
					if( _linkTag[i].getAttribute('rel')=="stylesheet"){
						_tempTotalLinkNum.push(_linkTag[i].getAttribute('href'));
					}
				}

				for( var k =0;k<_ScripTag.length;k++){
					if( _ScripTag[k].getAttribute('src')){
						_tempTotalScriptNum.push(_ScripTag[k].getAttribute('src'));
					}
					//检测是否有百度统计
					if(_ScripTag[k].innerHTML){					
						var _baiduHtml = _ScripTag[k].innerHTML;
						if( new RegExp("hm.baidu.com").test(_baiduHtml)){
							that.data['baidutj'] = "有";
						}
					}
				}

			that.data['totalDomNum'] = _totaldomNum;
			that.data['totalCssLinkNum'] = _tempTotalLinkNum;
			that.data['totalScriptNum'] = _tempTotalScriptNum;
		},
		init : function(){
			var that = this;
			that.doDynamicStyle('http://pi.4399ued.com/fecheck.css');
			that.getMeta();
			that.getImgAlt();
			that.getPerformanceTime();
			that.getShortIcon();	
			that.getJsMemory();
			that.getCssJsNum();
			that.getPageRedirect();
			that.getChromeLoadTime();
			that.getImgNaturalDimensions();
			that.checkMobile();
			that.getResult( that.data )
		}
    }
    FEPage.init();
})()

