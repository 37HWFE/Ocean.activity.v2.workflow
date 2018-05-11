define(['card', 'reqanimframeAnimate'], function(card, Timer) {
	/**
	 * [翻牌游戏组件]
	 * @param  {[object]} params 	[初始化参数]
	 * {
	 * 	  target: 所有牌选择器,
	 *	  img: 所有牌正面图片地址数组,
	 *	  bg: 牌背面图片地址,
	 *	  time: 翻牌的动画时长,
	 *	  gameTime: 游戏时长,
	 *	  gameFinish: 时间内完成游戏后触发
	 *	  gameFail: 未在时间内完成触发
	 *	  showTime: 时间每过1秒时触发
	 * }
	 */
	function CardGame(params) {
		var me = this;

		me.target = params.target; // 所有牌选择器
		me.cardImgUrl = params.img; // 所有牌正面图片地址数组
		me.cardBgUrl = params.bg; // 牌背面图片地址
		me.animationTime = params.time || 2; // 翻牌的动画时长
		me.gameTime = params.gameTime || 30; // 游戏时长
		me.gameFinish = params.gameFinish; // 时间内完成游戏后触发
		me.gameFail = params.gameFail; // 未在时间内完成触发
		me.showTime = params.showTime; // 时间每过1秒时触发

		me.gameTimer = null; // 游戏时间计时器
		me.time = 0; // 游戏已用时间
		me.beginPlay = false; // 是否可以开始游戏
		me.completeAmount = 0; // 完成的牌对数
		me.cardValue = []; // 每张牌的值
		me.length = 0; // 牌总数
		me.card = []; // 每张牌对应的元素
		me.cardClickInfo = { // 前后点击的牌的信息
			pre: {
				value: -1,
				index: -1
			},
			now: {
				value: -1,
				index: -1
			}
		};
		/**
		 * [init 初始化游戏]
		 * @return {[void]}            		[description]
		 */
		me.init = function() {
			me._initLength(); // 初始化牌的数量
			me._checkInitParams(); // 检测数据
			me._initCardValue(); // 初始化所有牌的值
			me._initCard(); // 初始化每张牌
			me._initEvents(); // 初始化事件
			me._initGameTimer(); // 初始化游戏计时器
		};
		/**
		 * [_initLength 初始化牌的总数]
		 * @return {[void]}            		[description]
		 */
		me._initLength = function() {
			// 获取html上的牌元素数量
			var length = $(me.target).length;
			me.length = length;
		};
		/**
		 * [_initCardValue 初始化所有牌的值]
		 * @return {[void]}            		[description]
		 */
		me._initCardValue = function() {
			// 根据牌的数量设置每张牌的值，如【1，1，2，2，3，3】
			var arr = [];
			for (var i = 0; i < me.length; i++) {
				arr.push(Math.floor((i + 2) / 2) - 1);
			}
			// 将值的数组随机化，如【1，2，2，3，1，3】
			for (var i = arr.length - 1; i > 0; i--) {
				var j = Math.floor(Math.random() * (i + 1));
				var temp = arr[i];
				arr[i] = arr[j];
				arr[j] = temp;
			}
			me.cardValue = arr;
		};
		/**
		 * [_initCard 初始化每张牌]
		 * @return {[void]}            		[description]
		 */
		me._initCard = function() {
			me.card = [];
			// 将每张牌实例化，并保存在数组中
			for (var i = 0; i < me.length; i++) {
				var cardElement = new card({
					id: i, // 牌的id
					value: me.cardValue[i], // 牌的值
					target: $(me.target).eq(i), // 牌对应的元素
					img: me.cardImgUrl[me.cardValue[i]], // 牌正面图片地址
					bg: me.cardBgUrl, // 牌背面图片地址
					animationTime: me.animationTime // 翻牌动画的时间
				});
				cardElement.init(false, true);
				me.card.push(cardElement);
			}
		};
		/**
		 * [_initGameTimer 初始化游戏计时器]
		 * @return {[void]}            		[description]
		 */
		me._initGameTimer = function() {
			me.time = 0;
			typeof me.showTime === 'function' ? me.showTime(me.time) : false
			me.gameTimer = null;
			// 设置定时器，每过一秒判断游戏是否结束
			me.gameTimer = new Timer(null, 1000);
			me.gameTimer.onFinished = function() {
				me.time += 1;
				typeof me.showTime === 'function' ? me.showTime(me.time) : false
				me._judegGameResult();
			};
		};
		/**
		 * [_initEvents 初始化事件]
		 * @return {[void]}            		[description]
		 */
		me._initEvents = function() {
			$(me.target).on('click', function() {
				// 判断游戏是否已经开始
				if (!!me.beginPlay) {
					var index = $(this).index();
					me._cardOpen(index);
				}
			});
			$(me.target).on('webkitAnimationEnd', function() {
				var index = $(this).index();
				me.card[index].resetCardClass();
			});
			$(me.target).on('animationEnd', function() {
				var index = $(this).index();
				me.card[index].resetCardClass();
			});
		};
		/**
		 * [_judegGameResult 判断游戏是否结束]
		 * @return {[void]}            		[description]
		 */
		me._judegGameResult = function() {
			// 判断游戏时间是否已用完
			if (me.time < me.gameTime) {
				// 判断游戏是否完成，若未完成则继续计时
				if (me._isFinish()) {
					typeof me.gameFinish === 'function' ? me.gameFinish(me.time) : false
					me._reset();
				} else {
					me.gameTimer.start();
				}
			} else {
				typeof me.gameFail === 'function' ? me.gameFail() : false
			}
		};
		/**
		 * [begin 设置游戏开始]
		 * @return {[void]}            		[description]
		 */
		me.begin = function() {
			me.beginPlay = true;
			me.gameTimer.start();
		};
		/**
		 * [_cardOpen 打开牌]
		 * @param  {[int]} index 			[打开的牌的位置]
		 * @return {[void]}            		[description]
		 */
		me._cardOpen = function(index) {
			// 更新保存前后被点击的牌的信息
			me._updateCardClickInfo(me.card[index].value, index);
			// 若前后被点击的牌的值相同，则两张牌消失，否则打开这次点击的牌
			if (me._judgeValue(me.cardClickInfo)) {
				me.card[me.cardClickInfo.now.index].hiddenCard();
				me.card[me.cardClickInfo.pre.index].hiddenCard();
			} else {
				me.card[me.cardClickInfo.now.index].open();
			}
		};
		/**
		 * [_isFinish 判断游戏是否成功完成]
		 * @return {[void]}            		[description]
		 */
		me._isFinish = function() {
			return me.completeAmount === Math.floor(me.length / 2);
		};
		/**
		 * [_reset 重置游戏]
		 * @return {[void]}            		[description]
		 */
		me._reset = function() {
			for (var i in me.card) {
				me.card[i].reset();
			}
			me.beginPlay = false;
			me.completeAmount = 0;

			this.cardClickInfo = {
				pre: {
					value: -1,
					index: -1
				},
				now: {
					value: -1,
					index: -1
				}
			};
			me._initCardValue();
			me._initCard();
			me._initGameTimer();
		};
		/**
		 * [_updateCardClickInfo 更新记录前后被点击的牌的信息]
		 * @param  {[boolean]} unClose 		[是否不自动关闭牌]
		 * @param  {[function]} callback 	[打开牌后执行]
		 * @return {[void]}            		[description]
		 */
		me._updateCardClickInfo = function(value, index) {
			me.cardClickInfo.pre = me.cardClickInfo.now;
			me.cardClickInfo.now = {
				value: value,
				index: index
			};
		};
		/**
		 * [_judgeValue 判断前后被点击的牌的值是否一致]
		 * @param  {[boolean]} unClose 		[是否不自动关闭牌]
		 * @return {[void]}            		[description]
		 */
		me._judgeValue = function(info) {
			// 若前后被点击两张牌的值相同，完成牌对数+1
			if (info.now.value === info.pre.value) {
				me.completeAmount += 1;
				return true;
			} else {
				return false;
			}
		};
		/**
		 * [_checkInitParams 数据校验提示]
		 * @return {[void]}            			[description]
		 */
		me._checkInitParams = function() {
			try {
				if (me.length % 2) {
					throw '页面上的牌元素个数需为偶数';
				}
				if (!me.target || typeof me.target !== 'string') {
					throw '请输入类型为string的target值(所有牌选择器)';
				}
				if (!me.cardImgUrl || Object.prototype.toString.call(me.cardImgUrl) !== '[object Array]' || me.cardImgUrl.length !== Math.floor(me.length / 2)) {
					throw '请输入类型为array,元素个数为牌总数一半的img值';
				}
				if (!me.cardBgUrl || typeof me.cardBgUrl !== 'string') {
					throw '请输入类型为string的bg值';
				}
			} catch (err) {
				console.log("Error: " + err + ".");
			}
		};
	}
	return CardGame;
});