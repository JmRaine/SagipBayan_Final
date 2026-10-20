import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Map({ navigation }) {
  return (
    <View style={styles.screen}>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>SAGIPBAYAN WEB</Text>
        <Text style={styles.title}>Community safety tools</Text>
        <Text style={styles.copy}>
          Use the portal tools to report incidents, share your safety status, and view local updates.
        </Text>
      </View>
      <View style={styles.grid}>
        <Action label="Safety check-in" detail="Share your current safety status." onPress={() => navigation.navigate("Connection")} />
        <Action label="Profile" detail="Manage your account details." onPress={() => navigation.navigate("Profile")} />
        <Action label="Local forecast" detail="Open weather and location tools." onPress={() => navigation.navigate("MainCenter")} />
      </View>
    </View>
  );
}

function Action({ label, detail, onPress }) {
  return (
    <TouchableOpacity accessibilityRole="button" style={styles.action} onPress={onPress}>
      <Text style={styles.actionTitle}>{label}</Text>
      <Text style={styles.actionDetail}>{detail}</Text>
      <Text style={styles.actionLink}>Open</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f4fbf7", padding: 20 },
  hero: { backgroundColor: "#063b24", borderRadius: 22, padding: 24 },
  eyebrow: { color: "#8ee8ad", fontSize: 12, fontWeight: "800", letterSpacing: 1.1 },
  title: { color: "#fff", fontSize: 30, fontWeight: "800", marginTop: 8 },
  copy: { color: "#e4f8ea", fontSize: 15, lineHeight: 23, marginTop: 10, maxWidth: 580 },
  grid: { gap: 12, marginTop: 16 },
  action: { backgroundColor: "#fff", borderColor: "#d7e8dc", borderWidth: 1, borderRadius: 16, padding: 18 },
  actionTitle: { color: "#073d25", fontSize: 18, fontWeight: "800" },
  actionDetail: { color: "#4b6657", fontSize: 14, marginTop: 5 },
  actionLink: { color: "#087b3d", fontSize: 14, fontWeight: "800", marginTop: 14 },
});