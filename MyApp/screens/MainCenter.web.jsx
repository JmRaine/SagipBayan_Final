import React, { useState } from "react";
import { Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import AppLayout from "./AppLayout";
import JaenWeatherForecast from "./components/JaenWeatherForecast";
import useJaenPlaceSearch from "./hooks/useJaenPlaceSearch";

const JAEN_CENTER = { latitude: 15.3383, longitude: 120.9141 };

export default function MainCenter({ navigation }) {
  const { suggestions, search, clear } = useJaenPlaceSearch();
  const [selectedPlace, setSelectedPlace] = useState({
    label: "Jaen, Nueva Ecija",
    ...JAEN_CENTER,
  });

  const handleSelectSuggestion = (place) => {
    const latitude = Number(place?.latitude);
    const longitude = Number(place?.longitude);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return;

    setSelectedPlace({
      label: place?.label || "Selected location",
      latitude,
      longitude,
    });
    clear();
  };

  const openMap = () => {
    const { latitude, longitude } = selectedPlace;
    Linking.openURL(`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`);
  };

  return (
    <AppLayout onSearch={search} suggestions={suggestions} onSelectSuggestion={handleSelectSuggestion}>
      <View style={styles.screen}>
        <View style={styles.mapCard}>
          <Text style={styles.eyebrow}>MAP LOCATION</Text>
          <Text style={styles.title}>{selectedPlace.label}</Text>
          <Text style={styles.coordinates}>
            {selectedPlace.latitude.toFixed(5)}, {selectedPlace.longitude.toFixed(5)}
          </Text>
          <Text style={styles.copy}>
            Open the selected Jaen location in OpenStreetMap for full map controls and directions.
          </Text>
          <TouchableOpacity accessibilityRole="button" style={styles.mapButton} onPress={openMap}>
            <Text style={styles.mapButtonText}>Open map</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contentCard}>
          <JaenWeatherForecast />
          <TouchableOpacity
            accessibilityRole="button"
            style={styles.profileButton}
            onPress={() => navigation.navigate("Profile")}
          >
            <Text style={styles.profileButtonText}>View profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f4fbf7", padding: 16, gap: 16 },
  mapCard: {
    backgroundColor: "#063b24",
    borderRadius: 20,
    padding: 22,
    minHeight: 240,
    justifyContent: "center",
    shadowColor: "#052e1b",
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  eyebrow: { color: "#8ee8ad", fontSize: 12, fontWeight: "800", letterSpacing: 1.1 },
  title: { color: "#fff", fontSize: 24, lineHeight: 31, fontWeight: "800", marginTop: 8 },
  coordinates: { color: "#d2f5dd", fontSize: 14, marginTop: 6 },
  copy: { color: "#e5f7eb", fontSize: 14, lineHeight: 21, marginTop: 16, maxWidth: 480 },
  mapButton: {
    alignSelf: "flex-start",
    backgroundColor: "#39c45a",
    borderRadius: 12,
    marginTop: 20,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  mapButtonText: { color: "#062b18", fontSize: 14, fontWeight: "800" },
  contentCard: { backgroundColor: "#fff", borderRadius: 20, padding: 12 },
  profileButton: {
    alignSelf: "flex-start",
    borderColor: "#a7d7b5",
    borderRadius: 12,
    borderWidth: 1,
    margin: 12,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  profileButtonText: { color: "#075b31", fontWeight: "800" },
});