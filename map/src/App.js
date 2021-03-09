import React, { Component, useState } from "react";
import { Key } from "./key";
import GoogleMapReact from "google-map-react";

// 我的位置
const MyPositionMarker = ({ text }) => <div>{text}</div>;

// Cafe Marker
const CafeMarker = ({ id, icon, text }) => (
  <div key="{id}" >
    <img style={{ height: '30px', width: '30px' }} src={icon} />
    <div>{text}</div>
  </div>
)



const SimpleMap = (props) => {
  // 預設位置
  const [myPosition, setMyPosition] = useState({
    lat: 25.04,
    lng: 121.50
  })

  const [places, setPlaces] = useState([]);

  const [mapApi, setMapApi] = useState(null)
  const [mapApiLoaded, setMapApiLoaded] = useState(false)
  const [mapInstance, setMapInstance] = useState(null)

  const [searchType, setSearchType] = useState('cafe')

  const [mapType, setMapType] = useState('roadmap')

  // 改變地圖樣式
  const handleMapTypeId = e => {
    setMapType(e.target.name)
  }

  // 當地圖載入完成，將地圖實體與地圖 API 傳入 state 供之後使用
  const apiHasLoaded = (map, maps) => {
    setMapApi(maps)
    setMapApiLoaded(true)
    setMapInstance(map)
  };

  const handleCenterChange = () => {
    if (mapApiLoaded) {
      setMyPosition({
        // center.lat() 與 center.lng() 會回傳正中心的經緯度
        lat: mapInstance.center.lat(),
        lng: mapInstance.center.lng()
      })
    }
  }

  const handleSearchType = e => {
    setSearchType(e.target.name)
  }

  const findLocation = () => {
    if (mapApiLoaded) {
      const service = new mapApi.places.PlacesService(mapInstance)

      const request = {
        location: myPosition,
        radius: 1000,
        type: searchType
      };

      service.nearbySearch(request, (results, status) => {
        if (status === mapApi.places.PlacesServiceStatus.OK) {
          console.log(results)
          setPlaces(results) // 修改 State
        }
      })
    }
  }

  return (
    // Important! Always set the container height explicitly
    <div style={{ height: '100vh', width: '100%' }}>
      <input type="button" value="開始搜尋" onClick={findLocation} />
      <input type="button" value="找餐廳" onClick={handleSearchType} name="restaurant" />
      <input type="button" value="找牙醫" onClick={handleSearchType} name="dentist" />
      <input type="button" value="找咖啡廳" onClick={handleSearchType} name="cafe" />
      <input type="button" value="衛星" onClick={ handleMapTypeId } name="hybrid" />
      <input type="button" value="路線" onClick={ handleMapTypeId } name="roadmap" />
      <GoogleMapReact
        bootstrapURLKeys={{
          key: Key,
          libraries: ['places'] // 要在這邊放入我們要使用的 API
        }}
        options={{ mapTypeId: mapType }}
        onBoundsChange={handleCenterChange}
        defaultCenter={props.center}
        defaultZoom={props.zoom}
        yesIWantToUseGoogleMapApiInternals // 設定為 true
        onGoogleApiLoaded={({ map, maps }) => apiHasLoaded(map, maps)} // 載入完成後執行
      >
        <MyPositionMarker
          lat={myPosition.lat}
          lng={myPosition.lng}
          text="My Position"
        />
        {places.map(item => (
          <CafeMarker
            id={item.place_id}
            icon={item.icon}
            key={item.id}
            lat={item.geometry.location.lat()}
            lng={item.geometry.location.lng()}
            text={item.name}
            placeId={item.place_id}
          />
        ))}
      </GoogleMapReact>
    </div>
  );
}

// 由於改寫成 functional component，故另外設定 defaultProps
SimpleMap.defaultProps = {
  center: {
    lat: 25.04,
    lng: 121.50
  },
  zoom: 17
};

// App
function App() {
  return (
    <div className="App">
      <SimpleMap />
    </div>
  );
}

export default App;
