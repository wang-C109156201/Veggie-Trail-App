import React, { useState, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Animated, Image } from 'react-native';
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
  tags: string[]; // 新增地標的分類標籤（例如全素、便當）
}

// 素食地點列表
const vegetarianPlaces: Place[] = [
  {
    id: 1,
    title: '青禾素食館',
    description: 'Google 評價 3.9 (152)',
    coordinate: { latitude: 24.993628, longitude: 121.300981 },
    address: '桃園市桃園區縣府路123號',
    tags: ['全素', '便當'],
  },
  {
    id: 2,
    title: '素食便當店',
    description: 'Google 評價 4.2 (89)',
    coordinate: { latitude: 24.991245, longitude: 121.313562 },
    address: '桃園市桃園區中正路456號',
    tags: ['便當'],
  },
];

// 小視窗組件，固定在底部
const InfoWindow: React.FC<{ place: Place | null; onClose: () => void; slideAnim: Animated.Value }> = ({ place, onClose, slideAnim }) => {
  if (!place) return null;

  return (
    <Animated.View style={[styles.infoWindow, { transform: [{ translateY: slideAnim }] }]}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeText}>✖</Text>
      </TouchableOpacity>
      
      {/* 標籤區塊 */}
      <View style={styles.tagsContainer}>
        {place.tags.map((tag, index) => (
          <Text key={index} style={styles.tag}>
            {tag}
          </Text>
        ))}
      </View>

      {/* 標題 */}
      <Text style={styles.infoTitle}>{place.title}</Text>

      {/* 評價資訊 */}
      <View style={styles.ratingContainer}>
        <IconSymbol size={28} name="paperplane.fill" color="balck" />
        <Text>{place.description}</Text>
      </View>

      {/* 地址 */}
      <Text>{place.address}</Text>
    </Animated.View>
  );
};

// 主畫面組件
const HomeScreen: React.FC = () => {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const slideAnim = useRef(new Animated.Value(200)).current; // 設定動畫初始值（隱藏）

  // 顯示小視窗
  const showInfoWindow = (place: Place) => {
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
            title={place.title}
            description={place.description}
            onPress={() => showInfoWindow(place)}
          >
            <IconSymbol size={28} name="paperplane.fill" color="balck" />
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
  markerIcon: {
    width: 30,
    height: 30,
  },
  infoWindow: {
    position: 'absolute',
    bottom: 150,
    left: 15,
    right: 15,
    backgroundColor: '#FFFAF2', // 修改背景顏色
    padding: 15,
    borderRadius: 15,
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
    marginBottom: 5,
  },
  tag: {
    backgroundColor: '#E0F2F1',
    color: '#017D61',
    fontSize: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    marginRight: 5,
  },
  infoTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
    color: '#017D61', // 修改標題顏色
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
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
});

export default HomeScreen;
