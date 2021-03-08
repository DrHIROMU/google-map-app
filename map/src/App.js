import React, { Component, useState } from "react";
import { Key } from "./key"; 
import GoogleMapReact from "google-map-react";

// 我的位置
const MyPositionMarker = ({ text }) => <div>{text}</div>;

const SimpleMap = (props) => {
  // 預設位置
  const [myPosition, setMyPosition] = useState({
    lat: 25.04,
    lng: 121.50
  })

  const [mapApi, setMapApi] = useState(null)
  const [mapApiLoaded, setMapApiLoaded] = useState(false)
  const [mapInstance, setMapInstance] = useState(null)  

  // 當地圖載入完成，將地圖實體與地圖 API 傳入 state 供之後使用
  const apiHasLoaded = (map, maps) => {    
    setMapApi(maps)
    setMapApiLoaded(true)
    setMapInstance(map)
  };

  const handleCenterChange = () => {
    if(mapApiLoaded) {
      setMyPosition({
        // center.lat() 與 center.lng() 會回傳正中心的經緯度
        lat: mapInstance.center.lat(),
        lng: mapInstance.center.lng()
      })
    }
  }

  return (
    // Important! Always set the container height explicitly
    <div style={{ height: '100vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: Key }}
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
