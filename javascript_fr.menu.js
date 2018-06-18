FR = {
    pluginName: 'PizzaDIY',
    author: 'Bai Xuan',
    version: '1.0'
};

FR.MenuRound = {

    // rendered id
    id: 0,
    // time of animation
    time: 0,
    // a of oval path
    a: 0,
    // b of oval path
    b: 0,
    // menu items
    items: [],
	itemsSelect: [],	
	items0: [],
	items1: [],

    // current menu icon
    currentIcon: 0,
    // counter
    counter: 0,
    // steps of animation
    steps: 0,
    // lists waiting to move round
    animQueen: [],
    // icon width
    iconWidth: 0,
    // icon height
    iconHeight: 0,
    // ctrl icon width
    ctrlIconWidth: 0,
    // number of items loaded
    loaded: 0,
    // time of animation pause
    speed: 20,
    // size of title
    titleSize: 30,
	// angle per menu
	angle: 60,
	// angle per step
	stepA: 0,
	// current angle of each menu
	iconA: [],
	// whether submenu listed
	isListed: 0,
	nameListed: ' ',
	listIndex: [],
    // height & width of sub list menu
	listWidth: 40,
    listHeight: 40,

    // constructed function
    create: function(param) {
        if (typeof (param.id && param.time && param.a && param.b
        && param.items) == 'undefined') {
            alert('Lacking parameters! Please check!');
            return;
        }
        this.id = param.id;
        this.time = param.time;
        this.a = param.a;
        this.b = param.b;
        this.items = param.items;
		this.itemsSelect = param.itemsSelect;
		this.items0 = param.items0;
		this.items1 = param.items1;
        this.titleSize = param.titleSize || this.titleSize;
		this.listIndex = param.listIndex;
		
        this.preLoad();
		this.iconA = new Array(6);
		for(var i = 0; i <=5; i++) 
		{
			this.iconA[i] = 60 * i - 90;
		}
    },

    // load pictures
    preLoad: function() {
        var menu = document.getElementById(this.id);
        menu.style.position = 'relative';
        menu.style.overflow = 'visible';
        menu.style.width = 2 * this.a + 'px';
        var num = 0;
        var loading = document.createElement('div');
        loading.id = 'frLoading';
        loading.style.textAlign = 'center';
        loading.style.fontSize = 12 + 'px';
        loading.style.width = 2 * this.a + 'px';
        loading.style.lineHeight = 2 * this.b + 'px';
        // generate title
        var text = document.createElement('div');
        text.id = 'frLoadingTxt';
        text.innerHTML = 'Loading...';
        loading.appendChild(text);
        // generate loading bar
        var progressBar = document.createElement('div');
        progressBar.id = 'frProgressBar';
        progressBar.style.position = 'absolute';
        progressBar.style.width = this.a + 'px';
        progressBar.style.height = '2px';
        progressBar.style.left = this.a / 2 + 'px';
        progressBar.style.top = this.b + 12 + 'px';
        progressBar.style.padding = '1px';
        progressBar.style.border = '1px solid #999';
        // generate percentage frame
        var percentage = document.createElement('div');
        percentage.id = 'frPercentage';
        percentage.style.height = '2px';
        percentage.style.backgroundColor = '#999';
        progressBar.appendChild(percentage);
        loading.appendChild(progressBar);
        document.getElementById(this.id).appendChild(loading);
        var quantity = this.items.length;
        // loading icons
        for (var i = 0; i != quantity; i++)
            this.loadRes(FR.MenuRound.items[i].icon, quantity);
    },

    // load icons and change the bar
    loadRes: function(fileName, quantity) {
        var image = new Image();
        var percentage = document.getElementById('frPercentage');
        image.onload = function() {
            percentage.style.width = (++FR.MenuRound.loaded) / quantity * 150 + 'px';
            // when loading the first icon, set icon widths and heights
            if (FR.MenuRound.loaded == 1) {
                FR.MenuRound.iconHeight = image.height / 4;
                FR.MenuRound.iconWidth = image.width / 4;
            }
            //  when loading the first icon, render UI
            if (FR.MenuRound.loaded == quantity) {
                var loading = document.getElementById('frLoading');
                loading.parentNode.removeChild(loading);

                FR.MenuRound.renderUI();
            }
        };
        image.onerror = function() {
            var loading = document.getElementById('frLoadingTxt');
            loading.innerHTML = 'Loading Failure: ' + this.src;
            loading.style.color = '#EE2C2C';
        };
        // src after onload for IE
        image.src = fileName;
    },

    // render UI
    renderUI: function() {
        var menu = document.getElementById(this.id);
        var quantity = this.items.length;
        var a = this.a;
        var b = this.b;
        var fenmu = quantity / 2;
		var w = this.width / 2;
		var h = this.height / 2;

        for (var i = 0; i <= fenmu; i++) {
            var x, y;
			var iA = FR.MenuRound.iconA[i] / 360 * 2 * Math.PI;
            // calculate coordinates
			x0 = a + a * Math.cos(iA);// +100;
			y = b + b * Math.sin(iA);
			

            // create the left three img items, set profile
            var img0 = document.createElement('img');
            img0.id = 'fr_icon_' + i;
            img0.src = this.items[i].icon;
            img0.style.position = 'absolute';
            img0.style.cursor = 'pointer';
            img0.style.zIndex = i;
            img0.rawX = x0;
            img0.rawY = y;
            // item function
            (function() {
				var tmp = img0.style.zIndex;
                img0.onclick = function() {
                    FR.MenuRound.iconClick(tmp, quantity);
                };
            })();
            this.setZoomLevel(img0, x0, y);
			this.setRotation(img0, this.iconA[i]);
            menu.appendChild(img0);
            // create the right items
            if (quantity - i != i && i != 0) {
                 
				x1 = a - a * Math.cos(iA);
				
                var img1 = document.createElement('img');
                var suffix = quantity - i;
                img1.id = 'fr_icon_' + suffix;
                img1.src = FR.MenuRound.items[quantity - i].icon;
                img1.style.position = 'absolute';
                img1.style.cursor = 'pointer';
                img1.style.zIndex = quantity - i;
                img1.rawX = x1;
                img1.rawY = y;
				
                // item function
                (function() {
					var tmp = img1.style.zIndex;
                    img1.onclick = function() {
                        FR.MenuRound.iconClick(tmp, quantity);
                    };
                })();
                this.setZoomLevel(img1, x1, y);
				this.setRotation(img1, this.iconA[quantity-i]);
                menu.appendChild(img1);
            }
        }
		//text for testing
        var title = document.createElement('div');
        title.id = 'frTitle';
        title.style.textAlign = 'center';
        title.style.position = 'absolute';
        title.style.fontSize = this.titleSize + 'px';
        title.style.width = 2 * this.a + 'px';
        title.style.top = 2 * b + this.iconHeight + 'px';
//        title.innerHTML = this.items[0].title;
		menu.appendChild(title);	
		
		// the pizza panel
		var pizzaaa =  new Image();
		pizzaaa.src = './pizza/pizzaaa.png'
		pizzaaa.style.position = 'absolute';
		pizzaaa.style.left = a - 50 + 'px';
        pizzaaa.style.top = a - 50 + 'px';
		pizzaaa.style.width = 2.5 * a;
		pizzaaa.style.height = 2.5 * b;
		pizzaaa.style.zIndex = 10;
		
		menu.appendChild(pizzaaa);
		
		var listIconDis = 70;

		var listMenu = document.createElement('div');
		listMenu.id = 'listMenu';
        listMenu.style.position = 'relative';
        listMenu.style.overflow = 'visible';
        listMenu.style.width = 2 * this.a + 'px';
		listMenu.style.top = 80+'px';
        var num = 0;
		menu.appendChild(listMenu);
		
		var panel = document.createElement('div');
        panel.id = 'frListpanel';
        panel.style.textAlign = 'center';
        panel.style.fontSize = 12 + 'px';
        panel.style.width = 2 * this.a + 'px';
        panel.style.lineHeight = this.b + 'px';

		// background of fan-shaped menu
		var panelBg =  new Image();
		panelBg.src = './pizza/panelbg.png';
		panelBg.id = 'panelBg';
		panelBg.style.position = 'absolute';
		panelBg.style.left = this.a - 53+ 'px';
		panelBg.style.top = this.a - 268 + 'px';
		panelBg.style.width = 524 / 2 + 'px';
		panelBg.style.height = 250 / 2 + 'px';
		panelBg.style.visibility = "hidden"; 
		panelBg.style.zIndex = 0;

		panel.appendChild(panelBg);
        listMenu.appendChild(panel);
		
		var list0 = document.createElement('div');
		list0.id = 'list0';
		var list1 = document.createElement('div');
		list1.id = 'list1';

		var d = listIconDis;

			for(var i = 0; i < 3; i++){
				var x, y;
				var img0 = document.createElement('img');
				img0.id = 'meat_' + i;
				img0.src = this.items0[i].icon;
				img0.style.position = 'absolute';
            	img0.style.cursor = 'pointer';
				img0.style.zIndex = i;
				img0.style.visibility = "hidden";
				img0.rawX = 1.6 * a + d * Math.cos(i / 2 * Math.PI);
				img0.rawY = -110 - 30 * Math.cos((i - 1) / 2 * Math.PI);
				
				(function() {
					var tmp = i;
					var listIndex = 0;
                	img0.onclick = function() {
                    FR.MenuRound.iconClick2(tmp, 0);
                	};
            	})();
				this.setZoomLevel2(img0, img0.rawX, img0.rawY);
				list0.appendChild(img0);
			}
						
			for(var i = 0; i < 4; i++){
				var x, y;
				var img0 = document.createElement('img');
				img0.id = 'vegetables_' + i;
				img0.src = this.items1[i].icon;
				img0.style.position = 'absolute';
            	img0.style.cursor = 'pointer';
				img0.style.zIndex = i;
				img0.style.visibility = "hidden";
				if(i == 0 || i == 2) img0.rawX = a ;
				else img0.rawX = a + d * 1.8;
				if(i == 0 || i == 1) img0.rawY = -95;
				else img0.rawY = -145;
				(function() {
					var tmp = i;
					var listIndex = 1;
                	img0.onclick = function() {
                    FR.MenuRound.iconClick2(tmp, 1);
                	};
            	})();
				this.setZoomLevel2(img0, img0.rawX, img0.rawY);
				list1.appendChild(img0);
			}
		listMenu.appendChild(list0);
		listMenu.appendChild(list1);
    },

    // icon click function
    iconClick: function(index, total) {
		this.changeColor(index, FR.MenuRound.currentIcon);
        var base = FR.MenuRound.currentIcon - index;

        if (!base) {
			FR.MenuRound.showIndexList(index);
            return;
        }
        var isNext;
        // judge the direction of rotation
        if (base > 0) isNext = base >= total / 2 ? true : false;
        else isNext = base >= -total / 2 ? true : false;

        var n = 1;
        if (isNext) {
            while (1) {
                var obj = (FR.MenuRound.currentIcon + (n++)) % total;
                FR.MenuRound.animQueen.push(obj);
                if (obj == index) break;
            }
        } else {
            while (1) {
                var obj = (FR.MenuRound.currentIcon == 0 ? total : FR.MenuRound.currentIcon) - (n++) % total;
                obj = obj < 0 ? total + obj : obj;
                FR.MenuRound.animQueen.push(obj);
                if (obj == index) break;
            }
        }
        // if the waiting list is empty, call the rotate function
        if (FR.MenuRound.animQueen.length == Math.abs(n - 1)) {
			FR.MenuRound.rollRotate();
		}
		// try to use the setTimeOut function but failed
//		setTimeOut("FR.MenuRound.showIndexList("+index+")",5000);
//		setTimeout("alert('5seconds!')",5000);

		FR.MenuRound.showIndexList(index);
		
    },
	
	changeColor: function(index, preIndex) {
		var indexSrc = document.getElementById('fr_icon_'+index).src;
		var preIndexSrc = document.getElementById('fr_icon_'+preIndex).src;
		if((index == preIndex) && (indexSrc == FR.MenuRound.itemsSelect[index].icon)) return;
		if(index == preIndex) {document.getElementById('fr_icon_'+index).src = FR.MenuRound.itemsSelect[index].icon;return;}
		if(preIndexSrc == FR.MenuRound.items[preIndex].icon) {
			document.getElementById('fr_icon_'+index).src = FR.MenuRound.itemsSelect[index].icon;
			return;
		}
		document.getElementById('fr_icon_'+index).src = FR.MenuRound.itemsSelect[index].icon;
		document.getElementById('fr_icon_'+preIndex).src = FR.MenuRound.items[preIndex].icon;
	},
	
	/*
	 * to show the effect of the UI design, make specific treatment. 
	 * So this function doesn't contain much techques.
	 */
	showIndexList: function(index){	
		if(index == -1){
			document.getElementById('panelBg').style.visibility = "hidden";
			for(var i = 0; i < 3; i++) {
					document.getElementById('meat_'+i).style.visibility = "hidden";
			}
			for(var i = 0; i < 4; i++){
					document.getElementById('vegetables_'+i).style.visibility = "hidden";
			}
		}		
		else if(index == 0) {
			document.getElementById('panelBg').style.visibility = "visible";			
			for(var i = 0; i < 3; i++)
				document.getElementById('meat_'+i).style.visibility = "visible";
			for(var i = 0; i < 4; i++){
				if(getComputedStyle(document.getElementById('vegetables_'+i)).visibility == "visible"){
					document.getElementById('vegetables_'+i).style.visibility = "hidden";
				}
			}
			
		}
		else if(index == 1) {
			document.getElementById('panelBg').style.visibility = "visible";
			for(var i = 0; i < 3; i++) {
				document.getElementById('meat_'+i).style.visibility = "hidden";
			}
			for(var i = 0; i < 4; i++)
				document.getElementById('vegetables_'+i).style.visibility = "visible";
		}
		else {
			document.getElementById('panelBg').style.visibility = "hidden";
			for(var i = 0; i < 3; i++) {
					document.getElementById('meat_'+i).style.visibility = "hidden";
			}
			for(var i = 0; i < 4; i++){
					document.getElementById('vegetables_'+i).style.visibility = "hidden";
			}				
		}			
	},
	
	iconClick2: function(index, listIndex){
		
		var da = new Array(2);
		var ta = new Array(2);
		var aa = this.a;
		var randPic = document.createElement('div');
		randPic.id = listIndex + '_' + index;
		randPic.style.position = 'relative';
		for(var i = 0; i < 2; i++)       
  		{
     		da[i] = Math.random();			
			ta[i] = Math.random() * 2 * Math.PI - Math.PI;
			
			var img = new Image();
			if(listIndex == 0)	img.src = FR.MenuRound.items0[index].icon;
			else if(listIndex == 1) img.src = FR.MenuRound.items1[index].icon;
			img.style.position = 'absolute';
			img.style.left = 1.6 * aa + 0.9 * aa * da[i] * Math.cos(ta[i]) + 'px';
        	img.style.top = 1.6 * aa + 0.9 * aa * da[i] * Math.sin(ta[i]) + 'px';
			img.style.width = 20 + 'px';
			img.style.height = 20 + 'px';
			img.style.zIndex = 15;
			$(img).rotate(ta[i] * 0.5 / Math.PI * 360);
			randPic.appendChild(img);
  		}
		document.getElementById(this.id).appendChild(randPic);
	},
	
	// the rotate function
    rollRotate: function() {
		this.stepA = this.angle / this.steps;
        this.steps = parseInt(this.time / this.speed);
        this.counter = 1;
		var sA = 6;
		var tA = this.angle;
		
        var quantity = this.items.length;
        var a = this.a;
        var b = this.b;
        var iconWidth = this.iconWidth;
        var iconHeight = this.iconHeight;
        /*
        * judge the direction of rotation
        * or it may get wrong when continuously clicking
        */
        var isNext = (this.currentIcon + 1) % quantity == this.animQueen[0] ? true : false;
        FR.MenuRound.fr_interval = setInterval(function() {
            if (FR.MenuRound.counter > FR.MenuRound.steps) {
                clearInterval(FR.MenuRound.fr_interval);
                FR.MenuRound.currentIcon = FR.MenuRound.animQueen.shift();

				for(var i = 0; i < 6; i++) 
				{
					if(isNext)
					{
						FR.MenuRound.iconA[i] = FR.MenuRound.iconA[i] + tA;
					}
					else FR.MenuRound.iconA[i] = FR.MenuRound.iconA[i] - tA;

				}
                if (FR.MenuRound.animQueen.length != 0) FR.MenuRound.rollRotate();
                return;
            }
            for (var j = 0; j != quantity; j++) {
				var i = j;
				
                var icon = document.getElementById('fr_icon_' + (FR.MenuRound.currentIcon + i) % quantity);

                var x = y = 0;
				if(isNext)
				{
					FR.MenuRound.iconA[i] = FR.MenuRound.iconA[i] - sA;

				}
				else
				{
					FR.MenuRound.iconA[i] = FR.MenuRound.iconA[i] + sA;

				}
				x = a + a * Math.cos(FR.MenuRound.iconA[i] / 360 * 2 * Math.PI);
				y = b + b * Math.sin(FR.MenuRound.iconA[i] / 360 * 2 * Math.PI);

                FR.MenuRound.setZoomLevel(icon, x, y);
				FR.MenuRound.setRotation(icon, FR.MenuRound.iconA[i]);
                // animation ends
                if (FR.MenuRound.counter == FR.MenuRound.steps) {
                    icon.rawX = x;
                    icon.rawY = y;					
                }
            }
            FR.MenuRound.counter++;

        }, this.speed);

    },
	
	// set the picture's rotation itself
	setRotation: function(icon, theta) {
		$(icon).rotate(theta + 90);
	},

    // calculate the zoom level of pics
    setZoomLevel: function(icon, x, y) {

		var width = FR.MenuRound.iconWidth;
		var height = FR.MenuRound.iconHeight;

		icon.style.top = y  + 'px';
        icon.style.left = x  + 'px';
        icon.style.width = width + 'px';
        icon.style.height = height + 'px';
    },
	
	setZoomLevel2: function(icon, x, y) {

        // make pictures on the path
		icon.style.top = y  + 'px';
        icon.style.left = x  + 'px';
        icon.style.width = this.listWidth + 'px';
        icon.style.height = this.listHeight + 'px';
    },	
	
};
