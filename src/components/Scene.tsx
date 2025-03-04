import React, { FunctionComponent } from "react";
import {
  StyleSheet,
  RefreshControl,
  View,
  Text,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Animated,
  FlatList
} from "react-native";
import { CBAnimatedTabView } from "../lib";
import Home from '../views/home_tab/Home';
import { useNavigation } from '@react-navigation/native';

type ScrollEvent = NativeSyntheticEvent<NativeScrollEvent>;

interface SceneProps {
  data: [],
  isActive: boolean;
  routeKey: string;
  windowSize: number;
  initialNumToRender: number;
  scrollY: Animated.Value;
  onRefresh: () => void;
  trackRef: (key: string, ref: FlatList<any>) => void;
  onMomentumScrollBegin: (e: ScrollEvent) => void;
  onMomentumScrollEnd: (e: ScrollEvent) => void;
  onScrollEndDrag: (e: ScrollEvent) => void;
}

export const Scene: FunctionComponent<SceneProps> = ({
  isActive,
  routeKey,
  scrollY,
  data,
  windowSize,
  initialNumToRender,
  onRefresh,
  trackRef,
  onMomentumScrollBegin,
  onMomentumScrollEnd,
  onScrollEndDrag,
}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <CBAnimatedTabView
        data={data}
        windowSize={windowSize}
        initialNumToRender={initialNumToRender}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <Home navigation={navigation} />
        )}
        onRef={(ref: any) => {
          trackRef(routeKey, ref);
        }}
        scrollY={isActive ? scrollY : undefined}
        onScrollEndDrag={onScrollEndDrag}
        onMomentumScrollBegin={onMomentumScrollBegin}
        onMomentumScrollEnd={onMomentumScrollEnd}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    paddingHorizontal: 40,
    // paddingVertical: 20,
  },
});
