import React, { useContext, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { UserContext } from "./UserContext";
import { updateSafetyDebugStatus } from "../lib/safetyMarkingApi";

export default function SafetyMark() {
  const { user, setUser } = useContext(UserContext);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const setSafetyStatus = async (safetyStatus) => {
    if (!user?._id || saving) return;
    try {
      setSaving(true);
      setError("");
      await updateSafetyDebugStatus(user._id, safetyStatus);
      setUser({ ...user, safetyStatus });
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Unable to update your safety status. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.eyebrow}>SAFETY CHECK-IN</Text>
      <Text style={styles.title}>Let your community know you are safe.</Text>
      <Text style={styles.copy}>
        Your latest status: {user?.safetyStatus === "SAFE" ? "Safe" : "Needs check-in"}.
      </Text>
      <View style={styles.actions}>
        <TouchableOpacity accessibilityRole="button" disabled={saving} style={[styles.button, styles.safe]} onPress={() => setSafetyStatus("SAFE")}>
          <Text style={styles.safeText}>I am safe</Text>
        </TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" disabled={saving} style={[styles.button, styles.help]} onPress={() => setSafetyStatus("NOT_SAFE")}>
          <Text style={styles.helpText}>I need help</Text>
        </TouchableOpacity>
      </View>
      {saving ? <ActivityIndicator color="#087b3d" style={styles.loader} /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Text style={styles.note}>The detailed safety map remains available in the native mobile application.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f4fbf7", padding: 24 },
  eyebrow: { color: "#087b3d", fontSize: 12, fontWeight: "800", letterSpacing: 1.1 },
  title: { color: "#073d25", fontSize: 28, fontWeight: "800", lineHeight: 35, marginTop: 8, maxWidth: 620 },
  copy: { color: "#4b6657", fontSize: 15, lineHeight: 23, marginTop: 10 },
  actions: { gap: 12, marginTop: 24, maxWidth: 460 },
  button: { borderRadius: 14, paddingHorizontal: 18, paddingVertical: 15 },
  safe: { backgroundColor: "#1e9d4f" },
  help: { backgroundColor: "#fff", borderColor: "#cc8c8c", borderWidth: 1 },
  safeText: { color: "#fff", fontSize: 16, fontWeight: "800", textAlign: "center" },
  helpText: { color: "#a22020", fontSize: 16, fontWeight: "800", textAlign: "center" },
  loader: { marginTop: 16, alignSelf: "flex-start" },
  error: { color: "#a22020", marginTop: 16 },
  note: { color: "#637a6b", fontSize: 13, lineHeight: 20, marginTop: 28, maxWidth: 540 },
});