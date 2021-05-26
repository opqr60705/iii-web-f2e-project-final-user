// 確認接收資料庫資料
console.log(markerData[0]);
var markerData = JSON.parse(JSON.stringify(markerData))
// 預設台中火車站
var userPostion = { lat: 24.13730614208061, lng: 120.68694615086643 };
// var userPostion = { lat: 24.150851758093815, lng: 120.65511318658612 };
// 地圖Icon
var mapMarkers = [];
// 地圖
var map;
// 資料庫讀取
var features;
// 使用者自己改位置
var userChangePosition;
// uesrMarker
var uesrMarker;
// 定位後開起圖示移動
var flagMarkerDrag;
// 定位後開起圖示移動
var flagRefreshShortDis;
// 最短距離儲存陣列
var forShortDisArr = []
// 設定存取座標提供刷新物件
var userPostion_reload;
var userPostion_gps

// 定位按鈕
$('#getPos').on('click', function () {
    // 關閉ModalBox
    $('#myDescription').css('display', 'none');
    // 先確認使用者裝置能不能抓地點
    if (navigator.geolocation) {
        // 跟使用者拿所在位置的權限
        navigator.geolocation.getCurrentPosition(showPos);
        // 使用者允許抓目前位置，回傳經緯度
        function showPos(position) {
            // 顯示最短距離
            $('#showNearbyToilet').css('z-index', '1')
            // 點擊後傳送值去開啟使用者點位移動
            flagMarkerDrag = 1
            // 將所在地設成比較的點
            userPostion = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            userPostion_gps = `${position.coords.latitude},${position.coords.longitude}`
            // userPostion = new google.maps.LatLng(24.150752401355643, 120.65130438448386);   // test
            // // 點擊後傳送值去啟動更新最短距離
            flagRefreshShortDis = 1
            // 刷新地圖
            initMap();
        }
        // 使用者不提供權限，或是發生其它錯誤
        function error() {
            alert('無法取得你的位置');
        }
    }
    else {
        alert('Sorry, 你的裝置不支援地理位置功能。');
    }
})

// 匯入地圖
function initMap() {
    // 清除重複最短陣列
    // let idxArr = forShortDisArr.length;
    // forShortDisArr.splice(0, idxArr);
    // forShortDisArr = []

    map = new google.maps.Map(document.getElementById("map"), {
        // 匯入地圖中心點位置
        center: userPostion,
        // 地圖預設顯示大小
        zoom: 16,
        // 地圖上顯示的最大縮放級別
        maxZoom: 20,
        // 地圖上顯示的最小縮放級別
        minZoom: 16,
        // 地圖顯示方式
        mapTypeId: 'roadmap',
        // 載入地圖樣式
        mapId: '2a8694f1e2bf0a85',
        // zoom in / out 控制
        zoomControl: true,
        // 地圖種類控制
        mapTypeControl: false,
        // 顯示比例尺
        scaleControl: true,
        // 街景控制
        streetViewControl: false,
        // 旋轉
        rotateControl: false,
        // 全螢幕控制 | IPhone沒有支援
        fullscreenControl: false,
    });
    // 載入路線服務與路線顯示圖層
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer({
        // 隱藏預設的 A、B 點 marker
        suppressMarkers: true
    });
    directionsDisplay.setMap(map);

    // 設定圖案路徑
    const icons = {
        統一: {
            name: "統一",
            icon: {
                url: './img/map_icons/convenienceStore_icon.png',
                scaledSize: new google.maps.Size(34, 40),
            },
        },
        全家: {
            name: "全家",
            icon: {
                url: './img/map_icons/convenienceStore_icon.png',
                scaledSize: new google.maps.Size(34, 40),
            },
        },
        萊爾富: {
            name: "萊爾富",
            icon: {
                url: './img/map_icons/convenienceStore_icon.png',
                scaledSize: new google.maps.Size(34, 40),
            },
        },
        OK超商: {
            name: 'OK超商',
            icon: {
                url: './img/map_icons/convenienceStore_icon.png',
                scaledSize: new google.maps.Size(34, 40),
            },
        },
        星巴克: {
            name: '星巴克',
            icon: {
                url: './img/map_icons/cafe_icon.png',
                scaledSize: new google.maps.Size(34, 40),
            },
        },
        路易莎: {
            name: '路易莎',
            icon: {
                url: './img/map_icons/cafe_icon.png',
                scaledSize: new google.maps.Size(34, 40),
            },
        },
        麥當勞: {
            name: '麥當勞',
            icon: {
                url: './img/map_icons/restaurant_icon.png',
                scaledSize: new google.maps.Size(34, 40),
            },
        },
        肯德基: {
            name: '肯德基',
            icon: {
                url: './img/map_icons/restaurant_icon.png',
                scaledSize: new google.maps.Size(34, 40),
            },
        },
        摩斯: {
            name: '摩斯',
            icon: {
                url: './img/map_icons/restaurant_icon.png',
                scaledSize: new google.maps.Size(34, 40),
            },
        },
        政府機關: {
            name: '政府機關',
            icon: {
                url: './img/map_icons/govment_icon.png',
                scaledSize: new google.maps.Size(34, 40),
            },
        },
        家樂福: {
            name: '家樂福',
            icon: {
                url: './img/map_icons/departmentStore_icon.png',
                scaledSize: new google.maps.Size(34, 40),
            },
        },
        愛買: {
            name: '愛買',
            icon: {
                url: './img/map_icons/departmentStore_icon.png',
                scaledSize: new google.maps.Size(34, 40),
            },
        },
        大買家: {
            name: '大買家',
            icon: {
                url: './img/map_icons/departmentStore_icon.png',
                scaledSize: new google.maps.Size(34, 40),
            },
        },
        量販店: {
            name: '量販店',
            icon: {
                url: './img/map_icons/departmentStore_icon.png',
                scaledSize: new google.maps.Size(34, 40),
            },
        },
        百貨: {
            name: '百貨',
            icon: {
                url: './img/map_icons/departmentStore_icon.png',
                scaledSize: new google.maps.Size(34, 40),
            },
        },
        加油站: {
            name: '加油站',
            icon: {
                url: './img/map_icons/gasStaion_icon.png',
                scaledSize: new google.maps.Size(34, 40),
            },
        },
        捷運站: {
            name: '捷運站',
            icon: {
                url: './img/map_icons/mrt_icon.png',
                scaledSize: new google.maps.Size(34, 40),
            },
        },
    };
    // 預設點
    features = [
        {
            id: '1',
            position: new google.maps.LatLng(
                24.150656711776193,
                120.65011554220239
            ),
            type: "info",
            storeName: '大新韓式烤肉',
            toiletType: '男女廁所',
        },
        {
            id: '2',
            position: new google.maps.LatLng(
                24.149312245731902, 120.6470380729678
            ),
            type: "info",
            storeName: '魚中魚貓狗水族大賣場-文心店',
            toiletType: '男女廁所',
        },
        {
            id: '3',
            position: new google.maps.LatLng(
                24.149905171710227,
                120.65271228088245
            ),
            type: "parking",
            storeName: '大新停車場',
            toiletType: '男女廁所',
        },
        {
            id: '4',
            position: new google.maps.LatLng(
                24.148712986656246, 120.6488188212761
            ),
            type: "parking",
            storeName: '大墩停車場',
            toiletType: '男女廁所',
        },
        {
            id: '5',
            position: new google.maps.LatLng(
                24.14956584399241,
                120.6550038824122
            ),
            type: "library",
            storeName: '市立圖書館西區分館',
            toiletType: '男女廁所',
        },
        {
            id: '6',
            position: new google.maps.LatLng(
                24.149978084456123, 120.64560457159337
            ),
            type: "library",
            storeName: '市立圖書館南屯分館',
            toiletType: '男女廁所',
        },
        {
            id: '7',
            position: new google.maps.LatLng(
                24.153904853119904, 120.65020144550226
            ),
            type: "III",
            storeName: '香港金寶茶餐廳(大業店)',
            toiletType: '男女廁所、親子廁所、無障礙廁所',
        },
        {
            id: '8',
            position: new google.maps.LatLng(
                24.14971051596317, 120.64962243961948
            ),
            type: "III",
            storeName: '家樂福大墩店',
            toiletType: '男女廁所、親子廁所、無障礙廁所',
        },
    ];
    // 暫存infowindow數量的變數
    var infoWindowsOpenCurrently;
    // 點擊ICON呼叫infoWindow
    let infoFunction = function (info, marker, request) {
        google.maps.event.addListener(marker, 'click', function () {
            //if variable is defined close
            typeof infoWindowsOpenCurrently !== 'undefined' && infoWindowsOpenCurrently.close();
            info.open(map, marker);
            //set current info window to temporary variable
            infoWindowsOpenCurrently = info;
            // console.log(infoWindowsOpenCurrently);
            // 路線導航相關設定
            directionsService.route(request, function (result, status) {
                if (status == 'OK') {
                    // 回傳路線上每個步驟的細節
                    directionsDisplay.setDirections(result);
                    // 抓到要顯示距離的元素ID，取代其內容
                    let dura = document.getElementById('dura');
                    dura.innerText = result.routes[0].legs[0].duration.text;
                    // 抓到要顯示時間的元素ID，取代其內容
                    let dist = document.getElementById('dist');
                    dist.innerText = result.routes[0].legs[0].distance.text;
                    // 將元素寫在標籤內，然後在取代內容，重複生成的修正
                } else {
                    alert('Error : InfoWindow呼叫錯誤')
                }
            });
        });
    };

    // 輸出陣列圖示ICON 
    markerData.forEach((markerData) => {
        // 轉換商店種類
        let classiFication = markerData.Classification
        if (classiFication == 'A1') {
            classiFication = '統一'
        } else if (classiFication == 'A2') {
            classiFication = '全家'
        } else if (classiFication == 'A3') {
            classiFication = '萊爾富'
        } else if (classiFication == 'A4') {
            classiFication = 'OK超商'
        } else if (classiFication == 'B1') {
            classiFication = '星巴克'
        } else if (classiFication == 'B2') {
            classiFication = '路易莎'
        } else if (classiFication == 'C1') {
            classiFication = '麥當勞'
        } else if (classiFication == 'C2') {
            classiFication = '肯德基'
        } else if (classiFication == 'C3') {
            classiFication = '摩斯'
        } else if (classiFication == 'D1') {
            classiFication = '政府機關'
        } else if (classiFication == 'E1') {
            classiFication = '家樂福'
        } else if (classiFication == 'E2') {
            classiFication = '愛買'
        } else if (classiFication == 'E3') {
            classiFication = '大買家'
        } else if (classiFication == 'E4') {
            classiFication = '量販店'
        } else if (classiFication == 'F1') {
            classiFication = '百貨'
        } else if (classiFication == 'G1') {
            classiFication = '加油站'
        } else if (classiFication == 'H1') {
            classiFication = '捷運站'
        }
        // 資料庫廁所類型轉換
        let toiletType;
        if (markerData.Type == 1) {
            toiletType = '男女廁所';
        } else if (markerData.Type == 2) {
            toiletType = '無障礙廁所';
        } else if (markerData.Type == 3) {
            toiletType = '親子廁所';
        } else if (markerData.Type == 4) {
            toiletType = '男女、無障礙廁所';
        } else if (markerData.Type == 5) {
            toiletType = '男女、親子廁所';
        } else if (markerData.Type == 6) {
            toiletType = '男女、無障礙、親子廁所';
        }
        // 轉換時間
        let businessHours = markerData.Businesshours;
        if (businessHours == "F") {
            businessHours = "0000-2400"
        }

        // 取得相鄰座標重新匯入最短距離的陣列
        let a
        let b
        if (userPostion_reload) {
            a = userPostion_reload.slice(0, 6)
            b = userPostion_reload.slice(13, 19)
        } else if (userPostion_gps) {
            a = userPostion_gps.slice(0, 6)
            b = userPostion_gps.slice(0, 6)
        } else {
            a = userPostion.lat.toString().slice(0, 6)
            b = userPostion.lng.toString().slice(0, 6)
        }
        add = {
            id: `${markerData.Id}`,
            position: new google.maps.LatLng(markerData.Latitude, markerData.Longitude),
            type: classiFication,
            storeName: markerData.Shopname,
            toiletType: `${toiletType}`,
            address: `${markerData.Address}`
        };
        if (markerData.Latitude.toString().slice(0, 6) == a || markerData.Latitude.toString().slice(0, 6) == b) {
            if (forShortDisArr.length !== 25) {
                forShortDisArr.push(add); //新增一個元素
            }
        }

        // 圖示設定
        let mapMarker = new google.maps.Marker({
            position: new google.maps.LatLng(markerData.Latitude, markerData.Longitude),
            icon: icons[classiFication].icon,
            map: map,
            type: [classiFication],
            businessHours: [businessHours],
            toiletType:[toiletType],
        });
        // 把圖標值輸出陣列
        mapMarkers.push(mapMarker);
        // infoWindow
        let infowindow = new google.maps.InfoWindow({
            content: `<div class="infoWindowStyle text-center">
            <i class="d-none" name="hiddenId" value="${markerData.Id}">${markerData.Id}</i>
                    <h3 class="mt-2 text-truncate">${classiFication}${markerData.Shopname}</h3>
                    <div class="text-justify">
                        <i class="m-2 text-primary fa-2x far fa-toilet-paper-alt">
                            <span class="h4 text-dark">${toiletType}</span>
                        </i><br />
                        <i class="m-2 text-primary fa-2x fal fa-walking">
                            <span class="h4 text-dark" id="dist"></span>
                        </i><br />
                        <i class="m-2 text-primary fa-2x fal fa-hourglass">
                            <span class="h4 text-dark" id="dura"></span>
                        </i><h4 class="text-center">營業時間 : ${businessHours}</h4>
                    </div>
                    <button class="btn btn-warning btn-lg m-2" data-toggle="modal" data-target="#newsModal">問題回報</button>
                    </div>`,
            position: mapMarker.position,
        });
        // 路線相關設定
        var request = {
            // 起始點
            origin: userPostion,
            // 目的地
            destination: mapMarker.position,
            // 移動方式
            travelMode: 'WALKING',
        };
        infoFunction(infowindow, mapMarker, request);
    });

    // 使用者圖案
    const userPositionIcon = {
        url: './img/map_icons/userPositionIcon_Purple.gif',
        scaledSize: new google.maps.Size(40, 40),
    }

    // 製作預設/使用者圖標
    uesrMarker = new google.maps.Marker({
        // 匯入地圖中心點位置
        position: userPostion,
        // 繪製地圖
        map: map,
        // 換圖片
        icon: userPositionIcon,
        // 掉入動畫
        animation: google.maps.Animation.DROP,
        // Icon拖移效果
        draggable: false,
    });

    // flagMarkerDrag 在按下定位後，使用者點位移動，路徑細節設定
    if (flagMarkerDrag) {
        // 定位後使用者可自行移點
        uesrMarker.setDraggable(true);
        // 只顯示一個路徑細節
        if ($("#directionsPanel").val()) {
            $("#directionsPanel").html('')
        }
        // 移動點位 更新座標
        uesrMarker.addListener("dragend", (mapsMouseEvent) => {
            userChangePosition = mapsMouseEvent.latLng.toString()
            lngIndex = userChangePosition.search(" ") + 1
            userPostion = new google.maps.LatLng(userChangePosition.substr(1, 12), userChangePosition.substr(lngIndex, 12));
            userPostion_reload = `${userChangePosition.substr(1, 12)},${userChangePosition.substr(lngIndex, 12)}`
            forShortDisArr = []
            slideBarDefult()
            initMap()
        });
    }
    console.log(forShortDisArr.length);
    // console.log(features[0]);
    // flagRefreshShortDis 在按下定位後，顯示離使用者最短距離的地點
    if (flagRefreshShortDis) {
        // 把要計算的點存成陣列
        let destinations = [];
        Array.prototype.forEach.call(forShortDisArr, f => {
            // destinations.push(f.position);
            destinations.push(f.address);
        });
        // 所在位置跟各點的距離
        const service = new google.maps.DistanceMatrixService();
        // 路徑設定
        service.getDistanceMatrix({
            origins: [userPostion],
            destinations: destinations,
            travelMode: 'WALKING', // 交通方式：BICYCLING(自行車)、DRIVING(開車，預設)、TRANSIT(大眾運輸)、WALKING(走路)
            unitSystem: google.maps.UnitSystem.METRIC, // 單位 METRIC(公里，預設)、IMPERIAL(哩)
            avoidHighways: true, // 是否避開高速公路
            avoidTolls: true // 是否避開收費路線
        }, callback);
        function callback(response, status) {
            let listName = ''; console.log(response); console.log(forShortDisArr);
            // 把距離寫進json裡
            for (let i = 0; i < forShortDisArr.length; i++) {
                forShortDisArr[i].distance = response.rows[0].elements[i].distance.value;
                forShortDisArr[i].distance_text = response.rows[0].elements[i].distance.text;
                forShortDisArr[i].distance_time = response.rows[0].elements[i].duration.text;
            }
            // 按距離重排
            forShortDisArr = forShortDisArr.sort((a, b) => {
                return a.distance > b.distance ? 1 : -1;
            });
            // 在陣列依照距離重排後，顯示最近距離的1比資料
            for (let i = 0; i < 1; i++) {
                listName += `<div v-for="f in features" class="list-group-item text-center">
                                <h3 class="d-inline-block">距離最近的廁所</h3>
                                    <button class="btn btn-outline-danger float-right h1" id="closeShortDistance"><b>X</b></button>
                                    <hr class="bg-dark">
                                    <p class="h4">${forShortDisArr[i].storeName}</p>
                                    <p class="h4">
                                        ${forShortDisArr[i].distance}(m)
                                        <span class="ml-3">${forShortDisArr[i].distance_time}</span>
                                    </p>
                                    <button class="SHOW btn btn-outline-primary" id="shortDistance${i}" value="${forShortDisArr[i].id}" datd-distant="${forShortDisArr[i].position}">立即前往</button>
                                    <button class="btn btn-outline-warning d-none ml-3" id="hideShortDistance">收合路徑</button>
                                    <!-- 顯示路徑細節 -->
                                    <div id="directionsPanel"></div>
                                </div>`;
            }
            // 輸出HTML
            $('#showLocation').html(listName);
            // 按下最近距離地點的導航
            $(".SHOW").on("click", function () {
                $('#hideShortDistance').removeClass('d-none');
                if ($("#directionsPanel").val()) {
                    $("#directionsPanel").html('')
                }
                // 讀取ID
                let btnIdx = $(this).val();
                if (btnIdx) {
                    // 將ID-1=index
                    btnIdx -= 1;
                    // 載入路線服務與路線顯示圖層
                    var directionsService = new google.maps.DirectionsService();
                    var directionsDisplay = new google.maps.DirectionsRenderer({
                        // 隱藏預設的 A、B 點 marker
                        suppressMarkers: true,
                    });
                    // 導航開始
                    function show(idx) {
                        // 路線相關設定
                        var request = {
                            // 起始點
                            origin: userPostion,
                            // 目的地 要輸入地址才會是精準結果，經緯度會有大誤差
                            destination: forShortDisArr[0].address,
                            // 移動方式
                            travelMode: 'WALKING',
                        };
                        // 路線導航
                        directionsService.route(request, function (result, status) {
                            // console.log(result);
                            if (status == 'OK') {
                                // 更新地圖
                                directionsDisplay.setMap(map);
                                // 導航細節
                                directionsDisplay.setPanel(document.getElementById("directionsPanel"));
                                // 設定地圖值
                                $("#directionsPanel").prop("value", "true")
                                // 回傳路線上每個步驟的細節
                                directionsDisplay.setDirections(result);
                                $('')
                            }
                        });
                    }
                    // 執行導航
                    show(btnIdx)
                }
            })
            // 收合按鈕
            $('#hideShortDistance').on('click', function () {
                $('#directionsPanel').toggle();
            })
            // 關閉最短路徑
            $('#closeShortDistance').on('click', function () {
                $('#showNearbyToilet').css('z-index', '0').addClass('d-none')
                $('#showNearbyToiletAgain').css({
                    'top': '10px',
                    'right': '10%',
                    'z-index': '1',
                }).removeClass('d-none')
            })
            // 開啟最短路徑
            $('#showNearbyToiletAgain').on('click', function () {
                $('#showNearbyToilet').css('z-index', '1',).removeClass('d-none')
                $('#showNearbyToiletAgain').css('z-index', '0').addClass('d-none')
            })
        }
    }
}

// 重新讀取
function setMapOnAll(map, type,type1,type2,type3,type4) {
    console.log(mapMarkers[0]);
    for (let i = 0; i < mapMarkers.length; i++) {
        // 判斷店家種類
        if (mapMarkers[i].type == type || mapMarkers[i].type == type1 || mapMarkers[i].type == type2 || mapMarkers[i].type == type3 || mapMarkers[i].type == type4) {
            mapMarkers[i].setMap(map);
        }
        // 判斷廁所種類
        if (mapMarkers[i].toiletType == type || mapMarkers[i].toiletType == type1 || mapMarkers[i].toiletType == type2 || mapMarkers[i].toiletType == type3 ||mapMarkers[i].toiletType == type4) {
            mapMarkers[i].setMap(map);
        }
        // 判斷一鍵隱藏 / 顯示
        if (type == 'allShowHide') {
            mapMarkers[i].setMap(map);
        }
    }
}
// 一鍵隱藏
function clearMarkers() {
    $("input[name='toiletType']").prop({ checked: false });
    $("input[name='toiletType']").removeAttr("checked");
    setMapOnAll(null, 'allShowHide');
}
// 一鍵顯示
function showMarkers() {
    $("input[name='toiletType']").attr({ checked: "" });
    $("input[name='toiletType']").prop({ checked: "checked" });
    setMapOnAll(map, 'allShowHide');
}
// 點擊選項 隱藏 / 顯示
$("input[name='toiletType']").on("click", function () {
    // 找ID
    let checkValue = $(`#${$(this).attr('id')}`);
    // 找value
    let checkType1 = $(this).data(`st1`);
    let checkType2 = $(this).data(`st2`);
    let checkType3 = $(this).data(`st3`);
    let checkType4 = $(this).data(`st4`);
    let checkType5 = $(this).data(`st5`);
    // 找狀態
    let checkAttr = $(`#${$(this).attr('id')}`).attr("checked");
    // 點擊時checked屬性值為checked就隱藏，undefined就顯示
    if (checkAttr == 'checked') {  // 隱藏
        checkValue.removeAttr("checked");
        setMapOnAll(null,checkType1,checkType2,checkType3,checkType4,checkType5)
    }
    if (checkAttr == undefined) {  // 顯示
        checkValue.attr({ checked: "checked" });
        setMapOnAll(map, checkType1,checkType2,checkType3,checkType4,checkType5);
    }
})
// 拖移使用者點位後，將SlideBar全部顯示 / prop影響checkbox attr影響屬性
function slideBarDefult() {
    $("input[name='toiletType']").prop({ checked: "checked" }).attr({ checked: "checked" });
}
// 送出回報
$("#submit").on("click", function () {
    swal("感謝回報!", "", "success");
    // 廁所ID(wcid) 跟 MODALBOX 內其他數值不依樣是從 MYSQL 拉出來的每一個點都有自己的，
    // 所以在這邊自己宣告一個物件加進 data 變數然後轉為 JSON 後
    // 以 AJAX POST 出去 
    var wcid = { name: 'wcid', value: $("i[name='hiddenId']").text() };
    var data = $('#formReport').serializeArray()
    data.push(wcid);
    JSONData = serializeToJSON(data)
    // console.log(JSONData);
    //ajax請求
    $.ajax({
        url: "/add",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSONData,
        success: function (res) {
            var res = JSON.parse(res)
            //後端會封裝一個response class，預先寫好執行No.
            if (res.errno === 1) {
                alert("新增成功!")
            } else if (res.errno === 0) {
                alert("新增失敗!")
            }
        },
        error: function () {
            alert("系統錯誤!")
        }
    })
});
$('.modal').on('hidden.bs.modal', function () {
    $(this).find('formReport')[0].reset();
});
function serializeToJSON(data) {
    var values = {};
    for (index in data) {
        values[data[index].name] = data[index].value;
    }
    return JSON.stringify(values)
}