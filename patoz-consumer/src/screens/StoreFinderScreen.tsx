import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
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
  const cardSlideAnim = useRef(new Animated.Value(0)).current;

  const [salesOnly, setSalesOnly] = useState(false);
  const [repairOnly, setRepairOnly] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
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

  const selectedStore = useMemo(
    () => visibleStores.find((store) => store.id === selectedStoreId) ?? null,
    [selectedStoreId, visibleStores],
  );

  useEffect(() => {
    if (visibleStores.length === 0) {
      setSelectedStoreId(null);
      return;
    }

    const hasSelected = visibleStores.some((store) => store.id === selectedStoreId);
    if (!hasSelected) {
      setSelectedStoreId(null);
    }
  }, [selectedStoreId, visibleStores]);

  useEffect(() => {
    Animated.timing(cardSlideAnim, {
      toValue: selectedStore ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [cardSlideAnim, selectedStore]);

  const handleStoreSelect = (storeId: string) => {
    setSelectedStoreId(storeId);
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setZoomLevel((current) => {
      if (direction === 'in') {
        return Math.min(18, current + 1);
      }

      return Math.max(10, current - 1);
    });
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

          <View style={styles.infoArea}>
            {selectedStore ? (
              <Animated.View
                style={[
                  styles.storeCard,
                  {
                    opacity: cardSlideAnim,
                    transform: [
                      {
                        translateY: cardSlideAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [26, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Text style={styles.storeName}>{selectedStore.name}</Text>
                <Text style={styles.storeMeta}>거리 {selectedStore.distanceKm.toFixed(1)}km</Text>
                <View style={styles.capabilityRow}>
                  {selectedStore.supportsSales ? (
                    <View style={styles.capabilityChip}>
                      <Text style={styles.capabilityChipText}>판매 가능</Text>
                    </View>
                  ) : null}
                  {selectedStore.supportsRepair ? (
                    <View style={styles.capabilityChip}>
                      <Text style={styles.capabilityChipText}>수리 가능</Text>
                    </View>
                  ) : null}
                </View>
                <Text style={styles.storeMeta}>연락처: {selectedStore.phone}</Text>
              </Animated.View>
            ) : (
              <View style={styles.helperCard}>
                <Text style={styles.helperText}>지도에서 매장을 선택하고 매장정보를 확인해보세요</Text>
              </View>
            )}
          </View>
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
    justifyContent: 'flex-end',
    minHeight: 132,
  },
  storeCard: {
    backgroundColor: colors.cardSoft,
    borderColor: colors.royalBlue,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.md,
  },
  capabilityRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  capabilityChip: {
    backgroundColor: colors.royalBlueLight,
    borderRadius: radius.round,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
  },
  capabilityChipText: {
    color: colors.royalBlueDark,
    fontSize: 12,
    fontWeight: '700',
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
