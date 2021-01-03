
const mapContainer = document.getElementById('jsMap'); //지도를 담을 영역의 DOM 레퍼런스
const mapOption = { //지도를 생성할 때 필요한 기본 옵션
	center: new kakao.maps.LatLng(37.524029, 126.926017), //지도의 중심좌표.
	level: 4 //지도의 레벨(확대, 축소 정도)
};

// 지도를 생성  
const map = new kakao.maps.Map(mapContainer, mapOption); 

// 주소-좌표 변환 객체를 생성
const geocoder = new kakao.maps.services.Geocoder();

// 주소로 좌표를 검색합니다
geocoder.addressSearch('서울 영등포구 국제금융로2길 17', function(result, status) {

    // 정상적으로 검색이 완료됐으면 
     if (status === kakao.maps.services.Status.OK) {

        var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

        // 결과값으로 받은 위치를 마커로 표시합니다
        var marker = new kakao.maps.Marker({
            map: map,
            position: coords
        });

        // 인포윈도우로 장소에 대한 설명을 표시합니다
        var infowindow = new kakao.maps.InfoWindow({
            content: '<div class="mapMarker">솔톤세무회계</div>'

        });
        infowindow.open(map, marker);

        // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
        map.setCenter(coords);
    } 
});   

// 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성
const zoomControl = new kakao.maps.ZoomControl();
map.addControl(zoomControl, kakao.maps.ControlPosition.TOPRIGHT);

function init() {
    geocoder.addressSearch();
    map.addControl();
}

if (mapContainer) {
    init();
  }





