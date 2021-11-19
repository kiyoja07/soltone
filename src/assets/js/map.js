const mapContainer = document.getElementById("jsMap"); //지도를 담을 영역의 DOM 레퍼런스

if (mapContainer) {
  const coords = new kakao.maps.LatLng(37.51957, 126.93111);

  const mapOption = {
    //지도를 생성할 때 필요한 기본 옵션
    center: coords, //지도의 중심좌표.
    level: 4, //지도의 레벨(확대, 축소 정도)
  };
  // 지도를 생성
  const map = new kakao.maps.Map(mapContainer, mapOption);

  // 결과값으로 받은 위치를 마커로 표시
  const marker = new kakao.maps.Marker({
    map: map,
    position: coords,
  });

  // 인포윈도우로 장소에 대한 설명을 표시
  const infowindow = new kakao.maps.InfoWindow({
    content: '<div class="mapMarker">솔톤세무회계</div>',
  });
  infowindow.open(map, marker);

  // 지도의 중심을 결과값으로 받은 위치로 이동
  map.setCenter(coords);

  // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성
  const zoomControl = new kakao.maps.ZoomControl();
  map.addControl(zoomControl, kakao.maps.ControlPosition.TOPRIGHT);
}

// function makeMap() {
//     const mapOption = { //지도를 생성할 때 필요한 기본 옵션
//         center: new kakao.maps.LatLng(37.524029, 126.926017), //지도의 중심좌표.
//         level: 4 //지도의 레벨(확대, 축소 정도)
//     }
//     // 지도를 생성
//     const map = new kakao.maps.Map(mapContainer, mapOption);
//     console.log(map);
//     return map;
// };

// function makeMarker(map, coords) {
//     // 결과값으로 받은 위치를 마커로 표시
//     const marker = new kakao.maps.Marker({
//         map: map,
//         position: coords
//     });
//     // 인포윈도우로 장소에 대한 설명을 표시
//     const infowindow = new kakao.maps.InfoWindow({
//         content: '<div class="mapMarker">솔톤세무회계</div>'

//     });
//     infowindow.open(map, marker);
// }

// function handelMap() {
//     const coords = new kakao.maps.LatLng(37.524029, 126.926017);
//     const map = makeMap();
//     makeMarker(map, coords);
//     map.setCenter(coords); // 지도의 중심을 결과값으로 받은 위치로 이동

// }

// function makeZoomControl () {
//     const map = makeMap();
//     const zoomControl = new kakao.maps.ZoomControl();
//     map.addControl(zoomControl, kakao.maps.ControlPosition.TOPRIGHT);
// }

// function init() {
//     handelMap();
//     makeZoomControl();
// }

// if (mapContainer) {

//     const mapOption = { //지도를 생성할 때 필요한 기본 옵션
//         center: new kakao.maps.LatLng(37.524029, 126.926017), //지도의 중심좌표.
//         level: 4 //지도의 레벨(확대, 축소 정도)
//     }
//     // 지도를 생성
//     const map = new kakao.maps.Map(mapContainer, mapOption);

//     init();
// }
