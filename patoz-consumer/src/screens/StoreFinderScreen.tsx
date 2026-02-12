import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

import { colors, radius, spacing } from '../styles/theme';

type Store = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  phone: string;
  supportsSales: boolean;
  supportsRepair: boolean;
};

const defaultRegion = {
  latitude: 37.5665,
  longitude: 126.978,
  latitudeDelta: 0.11,
  longitudeDelta: 0.14,
};

const stores: Store[] = [
  {
    id: 'store-1',
    name: 'PATOZ 서울 강북점',
    latitude: 37.5794,
    longitude: 126.977,
    distanceKm: 2.1,
    phone: '02-1234-1111',
    supportsSales: true,
    supportsRepair: true,
  },
  {
    id: 'store-2',
    name: 'PATOZ 강남 서비스센터',
    latitude: 37.5008,
    longitude: 127.0369,
    distanceKm: 5.8,
    phone: '02-5678-2222',
    supportsSales: false,
    supportsRepair: true,
  },
  {
    id: 'store-3',
    name: 'PATOZ 한강 판매 라운지',
    latitude: 37.5283,
    longitude: 126.9324,
    distanceKm: 4.5,
    phone: '02-9876-3333',
    supportsSales: true,
    supportsRepair: false,
  },
  {
    id: 'store-4',
    name: 'PATOZ 송파 프리미엄센터',
    latitude: 37.5147,
    longitude: 127.1057,
    distanceKm: 8.2,
    phone: '02-7611-4455',
    supportsSales: true,
    supportsRepair: true,
  },
  {
    id: 'store-5',
    name: 'PATOZ 마포 리페어 허브',
    latitude: 37.5489,
    longitude: 126.9052,
    distanceKm: 6.4,
    phone: '02-7755-9900',
    supportsSales: false,
    supportsRepair: true,
  },
];

const getMarkerPosition = (store: Store) => {
  const latMin = defaultRegion.latitude - defaultRegion.latitudeDelta / 2;
  const lonMin = defaultRegion.longitude - defaultRegion.longitudeDelta / 2;

  const yRatio = (store.latitude - latMin) / defaultRegion.latitudeDelta;
  const xRatio = (store.longitude - lonMin) / defaultRegion.longitudeDelta;

  const top = 100 - Math.min(90, Math.max(10, yRatio * 100));
  const left = Math.min(92, Math.max(8, xRatio * 100));

  return { top: `${top}%` as `${number}%`, left: `${left}%` as `${number}%` };
};

const isStoreInViewport = (store: Store) => {
  const latMin = defaultRegion.latitude - defaultRegion.latitudeDelta / 2;
  const latMax = defaultRegion.latitude + defaultRegion.latitudeDelta / 2;
  const lonMin = defaultRegion.longitude - defaultRegion.longitudeDelta / 2;
  const lonMax = defaultRegion.longitude + defaultRegion.longitudeDelta / 2;

  return store.latitude >= latMin && store.latitude <= latMax && store.longitude >= lonMin && store.longitude <= lonMax;
};

const mapHtml = `
<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
    <style>
      html, body {
        margin: 0;
        height: 100%;
        width: 100%;
        overflow: hidden;
        background: #dce6ff;
      }
      iframe {
        border: 0;
        width: 100%;
        height: 100%;
      }
    </style>
  </head>
  <body>
    <iframe
      src="https://www.openstreetmap.org/export/embed.html?bbox=126.89%2C37.50%2C127.08%2C37.62&layer=mapnik&marker=37.5665%2C126.9780"
      allowfullscreen
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
    ></iframe>
  </body>
</html>`;

function MarkerPin({
  store,
  isSelected,
  onPress,
}: {
  store: Store;
  isSelected: boolean;
  onPress: () => void;
}) {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 1100,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1100,
          useNativeDriver: true,
        }),
      ]),
    );

    loop.start();

    return () => loop.stop();
  }, [floatAnim]);

  const markerPosition = getMarkerPosition(store);
  const bubbleTranslateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -4],
  });

  return (
    <Pressable onPress={onPress} style={[styles.markerWrap, markerPosition]}>
      <Animated.View
        style={[
          styles.markerLabel,
          isSelected && styles.markerLabelSelected,
          {
            transform: [{ translateY: bubbleTranslateY }],
          },
        ]}
      >
        <Text numberOfLines={1} style={[styles.markerLabelText, isSelected && styles.markerLabelTextSelected]}>
          {store.name}
        </Text>
      </Animated.View>

      <View style={[styles.pinHead, isSelected && styles.pinHeadSelected]} />
      <View style={[styles.pinTail, isSelected && styles.pinTailSelected]} />
    </Pressable>
  );
}

export default function StoreFinderScreen() {
  const { width } = useWindowDimensions();
  const cardScrollRef = useRef<ScrollView | null>(null);

  const [salesOnly, setSalesOnly] = useState(false);
  const [repairOnly, setRepairOnly] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(stores[0]?.id ?? null);
  const [zoomLevel, setZoomLevel] = useState(13);

  const filteredStores = useMemo(() => {
    return stores.filter((store) => {
      if (salesOnly && !store.supportsSales) {
        return false;
      }

      if (repairOnly && !store.supportsRepair) {
        return false;
      }

      return true;
    });
  }, [repairOnly, salesOnly]);

  const visibleStores = useMemo(() => {
    return filteredStores.filter(isStoreInViewport);
  }, [filteredStores]);

  const selectedIndex = useMemo(() => {
    return visibleStores.findIndex((store) => store.id === selectedStoreId);
  }, [selectedStoreId, visibleStores]);

  useEffect(() => {
    if (visibleStores.length === 0) {
      setSelectedStoreId(null);
      return;
    }

    const hasSelected = visibleStores.some((store) => store.id === selectedStoreId);
    if (!hasSelected) {
      setSelectedStoreId(visibleStores[0].id);
    }
  }, [selectedStoreId, visibleStores]);

  const handleStoreSelect = (storeId: string) => {
    setSelectedStoreId(storeId);
    const index = visibleStores.findIndex((store) => store.id === storeId);

    if (index >= 0) {
      cardScrollRef.current?.scrollTo({
        x: index * (width - spacing.xl * 2 - spacing.sm * 2),
        animated: true,
      });
    }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setZoomLevel((current) => {
      if (direction === 'in') {
        return Math.min(18, current + 1);
      }

      return Math.max(10, current - 1);
    });
  };

  const handleMapRegionChange = () => {
    if (visibleStores.length <= 1) {
      return;
    }

    // 향후 실제 지도 이벤트(onMessage 또는 region change) 연동 시,
    // 현재 viewport에 맞는 매장을 계산해서 해당 카드 인덱스로 scrollTo 할 수 있도록 남겨둔 스켈레톤 코드입니다.
    const nextIndex = selectedIndex >= 0 ? (selectedIndex + 1) % visibleStores.length : 0;
    const nextStore = visibleStores[nextIndex];

    if (nextStore) {
      setSelectedStoreId(nextStore.id);
      cardScrollRef.current?.scrollTo({
        x: nextIndex * (width - spacing.xl * 2 - spacing.sm * 2),
        animated: true,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.pageTitle}>매장 찾기</Text>

      <View style={styles.mapCard}>
        <View style={styles.filterRow}>
          <Pressable
            onPress={() => setSalesOnly((prev) => !prev)}
            style={[styles.filterButton, salesOnly && styles.filterButtonActive]}
          >
            <Text style={[styles.filterButtonText, salesOnly && styles.filterButtonTextActive]}>판매</Text>
          </Pressable>
          <Pressable
            onPress={() => setRepairOnly((prev) => !prev)}
            style={[styles.filterButton, repairOnly && styles.filterButtonActive]}
          >
            <Text style={[styles.filterButtonText, repairOnly && styles.filterButtonTextActive]}>수리</Text>
          </Pressable>
        </View>

        <View style={styles.contentArea}>
          <View style={styles.mapSurface}>
            <WebView
              originWhitelist={['*']}
              source={{ html: mapHtml }}
              style={styles.webView}
              javaScriptEnabled
              setBuiltInZoomControls
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              bounces={false}
              onTouchMove={handleMapRegionChange}
            />

            <View pointerEvents="box-none" style={styles.markerLayer}>
              {visibleStores.map((store) => {
                const isSelected = selectedStoreId === store.id;

                return (
                  <MarkerPin
                    key={store.id}
                    store={store}
                    isSelected={isSelected}
                    onPress={() => handleStoreSelect(store.id)}
                  />
                );
              })}
            </View>

            <View style={styles.zoomControlWrap}>
              <Pressable onPress={() => handleZoom('in')} style={styles.zoomButton}>
                <Text style={styles.zoomButtonText}>+</Text>
              </Pressable>
              <Pressable onPress={() => handleZoom('out')} style={[styles.zoomButton, styles.zoomButtonDivider]}>
                <Text style={styles.zoomButtonText}>−</Text>
              </Pressable>
            </View>

            <View style={styles.zoomBadge}>
              <Text style={styles.zoomBadgeText}>Zoom {zoomLevel}</Text>
            </View>

            {visibleStores.length === 0 ? (
              <View style={styles.emptyFilterState}>
                <Text style={styles.emptyFilterText}>조건에 맞는 매장이 없습니다.</Text>
              </View>
            ) : null}
          </View>

          <ScrollView
            horizontal
            ref={cardScrollRef}
            showsHorizontalScrollIndicator={false}
            style={styles.infoArea}
            contentContainerStyle={styles.storeCardList}
            scrollEventThrottle={16}
          >
            {visibleStores.map((store) => {
              const isSelected = selectedStoreId === store.id;

              return (
                <Pressable key={store.id} onPress={() => handleStoreSelect(store.id)} style={styles.storeCardPressable}>
                  <View style={[styles.storeCard, isSelected && styles.storeCardSelected]}>
                    <Text style={styles.storeName}>{store.name}</Text>
                    <Text style={styles.storeMeta}>거리 {store.distanceKm.toFixed(1)}km</Text>
                    <Text style={styles.storeMeta}>판매 가능: {store.supportsSales ? '가능' : '불가'}</Text>
                    <Text style={styles.storeMeta}>수리 가능: {store.supportsRepair ? '가능' : '불가'}</Text>
                    <Text style={styles.storeMeta}>연락처: {store.phone}</Text>
                  </View>
                </Pressable>
              );
            })}

            {visibleStores.length === 0 ? (
              <View style={styles.helperCard}>
                <Text style={styles.helperText}>필터를 조정해 인근 매장을 확인해 주세요.</Text>
              </View>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  pageTitle: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
  mapCard: {
    backgroundColor: colors.white,
    borderColor: colors.borderSoft,
    borderRadius: radius.lg,
    borderWidth: 1,
    flex: 1,
    marginBottom: spacing.sm,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    overflow: 'hidden',
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
  },
  filterButton: {
    backgroundColor: colors.borderSoft,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xxs,
  },
  filterButtonActive: {
    backgroundColor: colors.royalBlueLight,
  },
  filterButtonText: {
    color: colors.slate,
    fontSize: 12,
    fontWeight: '700',
  },
  filterButtonTextActive: {
    color: colors.brand,
  },
  contentArea: {
    flex: 1,
    gap: spacing.sm,
    padding: spacing.sm,
    paddingTop: spacing.xs,
  },
  mapSurface: {
    borderColor: colors.borderSoft,
    borderRadius: radius.md,
    borderWidth: 1,
    flex: 1,
    minHeight: 280,
    overflow: 'hidden',
    position: 'relative',
  },
  webView: {
    backgroundColor: colors.royalBlueLight,
    flex: 1,
  },
  markerLayer: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  markerWrap: {
    alignItems: 'center',
    marginLeft: -12,
    marginTop: -44,
    position: 'absolute',
  },
  markerLabel: {
    backgroundColor: colors.white,
    borderColor: colors.slateBorder,
    borderRadius: radius.sm,
    borderWidth: 1,
    marginBottom: spacing.xs,
    maxWidth: 128,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
  },
  markerLabelSelected: {
    borderColor: colors.royalBlue,
    shadowColor: colors.brand,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
  },
  markerLabelText: {
    color: colors.slate,
    fontSize: 11,
    fontWeight: '700',
  },
  markerLabelTextSelected: {
    color: colors.royalBlue,
  },
  pinHead: {
    backgroundColor: colors.royalBlue,
    borderRadius: radius.round,
    height: 18,
    shadowColor: colors.overlay,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    width: 18,
  },
  pinHeadSelected: {
    backgroundColor: colors.royalBlueDark,
    shadowColor: colors.brand,
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  pinTail: {
    backgroundColor: colors.royalBlue,
    borderBottomLeftRadius: radius.sm,
    height: 10,
    marginTop: -3,
    transform: [{ rotate: '45deg' }],
    width: 10,
  },
  pinTailSelected: {
    backgroundColor: colors.royalBlueDark,
  },
  zoomControlWrap: {
    backgroundColor: colors.cardSoft,
    borderColor: colors.borderSoft,
    borderRadius: radius.md,
    borderWidth: 1,
    bottom: spacing.sm,
    overflow: 'hidden',
    position: 'absolute',
    right: spacing.sm,
  },
  zoomButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  zoomButtonDivider: {
    borderTopColor: colors.borderSoft,
    borderTopWidth: 1,
  },
  zoomButtonText: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
  },
  zoomBadge: {
    backgroundColor: colors.cardSoft,
    borderColor: colors.borderSoft,
    borderRadius: radius.sm,
    borderWidth: 1,
    left: spacing.sm,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
    position: 'absolute',
    top: spacing.sm,
  },
  zoomBadgeText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  emptyFilterState: {
    alignItems: 'center',
    backgroundColor: colors.cardSoft,
    borderRadius: radius.md,
    justifyContent: 'center',
    left: spacing.md,
    padding: spacing.sm,
    position: 'absolute',
    right: spacing.md,
    top: spacing.md,
  },
  emptyFilterText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  infoArea: {
    minHeight: 132,
  },
  storeCardList: {
    gap: spacing.sm,
    paddingBottom: spacing.xs,
    paddingRight: spacing.sm,
  },
  storeCardPressable: {
    width: 280,
  },
  storeCard: {
    backgroundColor: colors.cardSoft,
    borderColor: colors.borderSoft,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.md,
  },
  storeCardSelected: {
    borderColor: colors.royalBlue,
  },
  storeName: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '800',
  },
  storeMeta: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  helperCard: {
    backgroundColor: colors.cardHint,
    borderRadius: radius.lg,
    minWidth: 260,
    padding: spacing.md,
  },
  helperText: {
    color: colors.indigoHint,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});
