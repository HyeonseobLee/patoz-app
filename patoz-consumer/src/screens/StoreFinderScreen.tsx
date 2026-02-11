import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
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
];

const getMarkerPosition = (store: Store) => {
  const latMin = defaultRegion.latitude - defaultRegion.latitudeDelta / 2;
  const lonMin = defaultRegion.longitude - defaultRegion.longitudeDelta / 2;

  const yRatio = (store.latitude - latMin) / defaultRegion.latitudeDelta;
  const xRatio = (store.longitude - lonMin) / defaultRegion.longitudeDelta;

  const top = 100 - Math.min(98, Math.max(2, yRatio * 100));
  const left = Math.min(96, Math.max(4, xRatio * 100));

  return { top: `${top}%` as `${number}%`, left: `${left}%` as `${number}%` };
};

export default function StoreFinderScreen() {
  const [salesOnly, setSalesOnly] = useState(false);
  const [repairOnly, setRepairOnly] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);

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

  const selectedStore = filteredStores.find((store) => store.id === selectedStoreId) ?? null;

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

        <View style={styles.mapSurface}>
          {filteredStores.map((store) => {
            const markerPosition = getMarkerPosition(store);
            const isSelected = selectedStoreId === store.id;

            return (
              <Pressable
                key={store.id}
                onPress={() => setSelectedStoreId(store.id)}
                style={[styles.marker, markerPosition, isSelected && styles.markerSelected]}
              >
                <Text numberOfLines={1} style={[styles.markerLabel, isSelected && styles.markerLabelSelected]}>
                  {store.name}
                </Text>
                <Text style={styles.markerText}>●</Text>
              </Pressable>
            );
          })}

          {filteredStores.length === 0 ? (
            <View style={styles.emptyFilterState}>
              <Text style={styles.emptyFilterText}>조건에 맞는 매장이 없습니다.</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.bottomOverlay}>
          {selectedStore ? (
            <View style={styles.storeCard}>
              <Text style={styles.storeName}>{selectedStore.name}</Text>
              <Text style={styles.storeMeta}>거리 {selectedStore.distanceKm.toFixed(1)}km</Text>
              <Text style={styles.storeMeta}>판매 가능: {selectedStore.supportsSales ? '가능' : '불가'}</Text>
              <Text style={styles.storeMeta}>수리 가능: {selectedStore.supportsRepair ? '가능' : '불가'}</Text>
              <Text style={styles.storeMeta}>연락처: {selectedStore.phone}</Text>
            </View>
          ) : (
            <View style={styles.helperCard}>
              <Text style={styles.helperText}>마커를 탭하면 매장 상세 정보가 표시됩니다.</Text>
            </View>
          )}
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
    position: 'relative',
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    zIndex: 2,
  },
  filterButton: {
    backgroundColor: '#E2E8F0',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  filterButtonActive: {
    backgroundColor: '#DBEAFE',
  },
  filterButtonText: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '700',
  },
  filterButtonTextActive: {
    color: '#1E3A8A',
  },
  mapSurface: {
    backgroundColor: '#EAF2FF',
    borderColor: '#BFDBFE',
    borderRadius: radius.md,
    borderWidth: 1,
    flex: 1,
    margin: spacing.sm,
    marginBottom: 88,
    position: 'relative',
  },
  marker: {
    alignItems: 'center',
    marginLeft: -12,
    marginTop: -12,
    position: 'absolute',
  },
  markerSelected: {
    zIndex: 3,
  },
  markerLabel: {
    backgroundColor: colors.white,
    borderColor: '#64748B',
    borderRadius: 10,
    borderWidth: 1,
    color: '#334155',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 2,
    maxWidth: 116,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  markerLabelSelected: {
    borderColor: colors.brand,
    color: colors.brand,
  },
  markerText: {
    color: colors.brand,
    fontSize: 18,
    lineHeight: 18,
  },
  emptyFilterState: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  emptyFilterText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  bottomOverlay: {
    bottom: spacing.sm,
    left: spacing.sm,
    position: 'absolute',
    right: spacing.sm,
  },
  storeCard: {
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderColor: colors.borderSoft,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.md,
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
    backgroundColor: 'rgba(238,242,255,0.96)',
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  helperText: {
    color: '#3730A3',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});
