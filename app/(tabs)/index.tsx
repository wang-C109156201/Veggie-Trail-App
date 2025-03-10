import React, { useState, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Animated, Image, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { IconSymbol } from '@/components/ui/IconSymbol';


// 定義地點的 TypeScript 類型
interface Place {
  id: number;
  title: string;
  description: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  address: string;
  tags: string[]; // 標籤（例如：全素、便當）
  googleStar: number;
}



// 素食地點列表
const vegetarianPlaces: Place[] = [
  {
    id: 1,
    title: '青禾素食館',
    description: 'Google 評價 3.9 (152)',
    coordinate: { latitude: 24.993628, longitude: 121.300981 },
    address: '桃園市桃園區縣府路123號',
    tags: ['便當', '全素'],
    googleStar: 3.9,
  },
  {
    id: 2,
    title: '素食便當店',
    description: 'Google 評價 4.2 (89)',
    coordinate: { latitude: 24.991245, longitude: 121.313562 },
    address: '桃園市桃園區中正路456號',
    tags: ['日式料理'],
    googleStar: 4.2,
  },
];

// 新增收藏狀態

// 小視窗組件，固定在底部
const InfoWindow: React.FC<{ place: Place | null; onClose: () => void; slideAnim: Animated.Value }> = ({ place, onClose, slideAnim }) => {
  if (!place) return null;

  const [favorites, setFavorites] = useState<{ [key: number]: boolean }>({});
  const toggleFavorite = () => {
    setFavorites(prev => ({
      ...prev,
      [place.id]: !prev[place.id]
    }));
    Alert.alert(!favorites[place.id] ? `${place.title} 已收藏` : "已取消收藏");
  };


  return (
    <Animated.View style={[styles.infoWindow, { transform: [{ translateY: slideAnim }] }]}>
      
      {/* 右上角 收藏按鈕 */}
      <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
        <IconSymbol 
          size={24} 
          name="heart" 
          color={favorites[place.id] ? "red" : "#017D61"}  // 每間餐廳有獨立收藏狀態
        />
      </TouchableOpacity>
      

      {/* 右上角關閉按鈕 */}
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeText}>✖</Text>
      </TouchableOpacity>

      {/* 標籤區塊 */}
      <View style={styles.tagsContainer}>
        {place.tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
          <Text style={{ color: '#017D61', fontSize: 14, fontWeight: 'bold' }}>{tag}</Text>
        </View>
        ))}
      </View>

      {/* 標題 */}
      <Text style={styles.infoTitle}>{place.title}</Text>

      {/* 評價資訊 */}
      <View style={styles.ratingContainer}>
      <IconSymbol size={20} name="star" color="black" />
        <Text style={{ marginLeft: 5, fontSize: 16 }}>{place.description}</Text>  
      </View>

      {/* 地址 */}
      <View style={styles.addressContainer}>
        <IconSymbol size={20} name="location" color="black" />
        <Text style={styles.addressText}>{place.address}</Text>
</View>
      
    </Animated.View>
  );
};

// 主畫面組件
const HomeScreen: React.FC = () => {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const slideAnim = useRef(new Animated.Value(200)).current; // 設定動畫初始值（隱藏）
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);

  // 顯示小視窗
  const showInfoWindow = (place: Place) => {
    setSelectedPlace(place);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setSelectedPlaceId(place.id);  //記錄被選中的 Marker ID
    setSelectedPlace(place);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

  };
  

  // 隱藏小視窗
  const hideInfoWindow = () => {
    Animated.timing(slideAnim, {
      toValue: 200,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setSelectedPlace(null));
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        mapType="standard" // 修正地圖顯示問題，避免變紅
        initialRegion={{
          latitude: 24.993628,
          longitude: 121.300981,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {vegetarianPlaces.map((place) => (
          <Marker
            key={place.id}
            coordinate={place.coordinate}
            // title={place.title}
            // description={place.description}
            onPress={() => showInfoWindow(place)}
          >
            
            
            <View style={[
              styles.markerContainer, 
              selectedPlaceId === place.id ? styles.selectedMarker : {} //  選中時變色
              ]}>
            
              <View style={styles.imageBox}>
                <Image 
                source={
                  place.id === 1
                    ? require("../../assets/images/marker-icon.png") // 青禾素食館的圖片
                    : require("../../assets/images/avocoda.png") // 素食便當店的圖片
                }
                style={styles.markerIcon} 
                />
                
              </View>
              <Text style={styles.markerText}>
                {place.tags[0]} / {place.googleStar}
              </Text>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* 固定在底部的小視窗 */}
      <InfoWindow place={selectedPlace} onClose={hideInfoWindow} slideAnim={slideAnim} />
    </View>
  );
};

// 樣式
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  markerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9A201', // 背景色
    borderWidth: 1, // 外框
    borderColor: 'black',
    borderRadius: 20, // 讓區塊變橢圓形
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  markerIcon: {
    height: 15,
    width: 15,
  },
  imageBox: {
    alignItems: 'center',
    justifyContent:'center',
    backgroundColor: 'white',
    marginRight: 5,
    height: 20,
    width: 20,
    borderRadius: 10,
  },
  markerText: {
    color: 'white' 
    // fontWeight: 'bold',
  },
  infoWindow: {
    position: 'absolute',
    bottom: 150,
    left: 15,
    right: 15,
    backgroundColor: '#FFFAF2', // 修改背景顏色
    padding: 20,
    borderRadius: 20,
    borderWidth: 1, // 黑色邊框
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  tagsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tag: {
    backgroundColor: '#F4F4C5',
    color: '#017D61',
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 5,
  },
  infoTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
    color: '#017D61', // 修改標題顏色
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingIcon: {
    width: 16,
    height: 16,
    marginRight: 5,
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 5,
    borderRadius: 15,
  },
  closeText: {
    fontSize: 16,
    color: 'black',
  },
  favoriteButton: {  
    position: 'absolute',
    right: 55,
    top: 18,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  addressText: {
    marginLeft: 5,
    fontSize: 16,
  },
  selectedMarker: {
    backgroundColor: '#A67C52',  // 選中的顏色（加深的棕色）
  },
});

export default HomeScreen;
