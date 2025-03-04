import React from "react";
import { Text, StyleSheet } from "react-native";

export const Header = () => (
  <>
    <Text style={styles.title}>Panggil Tukang</Text>
    <Text style={styles.subtitle}>Find what you need here.</Text>
  </>
);

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    paddingBottom: 4,
  },
  subtitle: {
    fontSize: 12,
  },
});
