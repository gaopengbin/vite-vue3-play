<template>
  <div id="amap"></div>
  <button @click="search">搜索</button>
  <button @click="location">定位</button>
  <button @click="arrivalRange">到达圈</button>
  <textarea name="" id="text" cols="30" rows="10"></textarea>
</template>

<script setup>
import AMapLoader from "@amap/amap-jsapi-loader";
import { reactive, ref, toRefs, onMounted, nextTick, defineProps } from "vue";
onMounted(() => {
  window._AMapSecurityConfig = {
    securityJsCode: "649d0df720c956d7cafdc550a59dfbe0",
  };
  AMapLoader.load({
    key: "9ad9fa28a46a93b65425f18776b16fb9", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ["AMap.ToolBar", "AMap.Scale", "AMap.OverView", "AMap.MapType", "AMap.Geocoder", "AMap.Autocomplete", "AMap.PlaceSearch"], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    AMapUI: {
      // 是否加载 AMapUI，缺省不加载
      version: "1.1", // AMapUI 缺省 1.1
      plugins: [], // 需要加载的 AMapUI ui插件
    },
  })
    .then((AMap) => {
      console.log(AMap);
      window.AMap = AMap;
      initMap();
    })
    .catch((e) => {
      console.log(e);
    });
});
function initMap() {
  let map = new AMap.Map("amap", {
    viewMode: "2D", //  是否为3D地图模式
    zoom: 10, //  地图显示的缩放级别
    zooms: [2, 22], // 地图缩放范围
    center: [116.397428, 39.90923], //  地图中心点坐标 此处填【经度，纬度】
    // layers: [new AMap.TileLayer()], //设置图层,可设置成包含一个或多个图层的数组
    mapStyle: "amap://styles/darkblue", //设置地图的显示样式
    resizeEnable: true, //  是否监控地图容器尺寸变化
  });
//   map.setMapStyle("amap://styles/dark");
  window.map = map;
}
const points = [
  {
    lng: 116.295,
    lat: 40.1036,
    name: "老高",
  },
  {
    lng: 116.293,
    lat: 39.826,
    name: "张皓",
  },
  {
    lng: 116.462,
    lat: 40.0457,
    name: "赵旭",
  },
  {
    lng: 116.484,
    lat: 39.9732,
    name: "刘运峰",
  },
  {
    lng: 116.594,
    lat: 39.741,
    name: "李向阳",
  },
];
function search() {
  AMap.plugin("AMap.PlaceSearch", function () {
    var autoOptions = {
      city: "北京",
      type: "餐饮服务",
      citylimit: true,
      //   map: map,
      //   panel: "panel",
      autoFitView: false,
      timeout: 1000,
    };
    var placeSearch = new AMap.PlaceSearch(autoOptions);
    let radius = 16000;
    // let point = new AMap.LngLat(116.397428, 39.90923);
    let results = [];
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      let p = new AMap.LngLat(point.lng, point.lat);
      placeSearch.searchNearBy("", p, radius, function (status, result) {
        console.log(status);
        // 搜索成功时，result即是对应的匹配数据
        //绘制点
        var marker = new AMap.Marker({
          position: p,
          title: point.name,
          map: map,
        });
        marker.setLabel({
          offset: new AMap.Pixel(10, 10), //设置文本标注偏移量
          content: point.name, //设置文本标注内容
          direction: "right", //设置文本标注方位
        });

        //绘制出范围
        var circle = new AMap.Circle({
          center: p, // 圆心位置
          radius: radius, //半径
          strokeColor: "#F33", //线颜色
          strokeOpacity: 0.5, //线透明度
          strokeWeight: 3, //线粗细度
          fillColor: "#ee2200", //填充颜色
          fillOpacity: 0.1, //填充透明度
        });
        map.add(circle);
        console.log(result);
        document.getElementById("text").value += JSON.stringify(result);
        results.push(result);
      });
    }
    console.log(results);
  });
}

function arrivalRange() {
  AMap.plugin("AMap.ArrivalRange", function () {
    var arrivalRange = new AMap.ArrivalRange();
    var lnglat = [116.295, 40.1036];
    var options = {
      policy: "SUBWAY,BUS",
      resultType: "polygon",
      // policy: AMap.DrivingPolicy.LEAST_FEE,
      // policy: AMap.DrivingPolicy.LEAST_DISTANCE,
      // policy: AMap.DrivingPolicy.REAL_TRAFFIC
    };
    for (let i = 0; i < points.length; i++) {
      const point = points[i];

      arrivalRange.search(
        [point.lng, point.lat],
        60,
        function (status, result) {
          console.log(status, result);
          let polygons = [];
          if (result.bounds) {
            let randomColor = "#" + Math.floor(Math.random() * 0xffffff).toString(16);
            for (var i = 0; i < result.bounds.length; i++) {
              var polygon = new AMap.Polygon({
                fillColor: randomColor,
                fillOpacity: "1",
                strokeColor: randomColor,
                strokeOpacity: "1",
                strokeWeight: 1,
              });
              polygon.setPath(result.bounds[i]);
              polygons.push(polygon);
            }
            map.add(polygons);
            // map.setFitView();
          }
        },
        options
      );
    }
  });
}

function location() {
  map.plugin("AMap.Geolocation", function () {
    var geolocation = new AMap.Geolocation({
      // 是否使用高精度定位，默认：true
      enableHighAccuracy: true,
      maximumAge: 0,
      // 设置定位超时时间，默认：无穷大
      timeout: 10000,
    });

    geolocation.getCurrentPosition();
    AMap.Event.addListener(geolocation, "complete", onComplete);
    AMap.Event.addListener(geolocation, "error", onError);

    function onComplete(data) {
      // data是具体的定位信息
      console.log(data);
      map.setCenter([data.position.lng, data.position.lat]);
      map.setZoom(18);
      map.add(new AMap.Marker({ position: [data.position.lng, data.position.lat] }));
      points.push({ lng: data.position.lng, lat: data.position.lat });
    }

    function onError(data) {
      // 定位出错
      console.log(data);
    }
  });
}
</script>
<style scoped>
#amap {
  width: 100vw;
  height: 80vh;
}
</style>
