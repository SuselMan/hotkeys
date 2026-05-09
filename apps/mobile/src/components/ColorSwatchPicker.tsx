import { Pressable, StyleSheet, Text, View } from "react-native";
import { PALETTE } from "../colors-palette";

interface Props {
  value: string | undefined;
  onChange: (next: string | undefined) => void;
  resetA11yLabel: string;
}

export function ColorSwatchPicker({ value, onChange, resetA11yLabel }: Props) {
  return (
    <View style={styles.row}>
      <Pressable
        accessibilityLabel={resetA11yLabel}
        onPress={() => onChange(undefined)}
        style={[styles.swatch, styles.reset, value === undefined && styles.active]}
      >
        <Text style={styles.resetText}>×</Text>
      </Pressable>
      {PALETTE.map((c) => (
        <Pressable
          key={c}
          onPress={() => onChange(c)}
          style={[styles.swatch, { backgroundColor: c }, value === c && styles.active]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  swatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "transparent",
  },
  reset: {
    backgroundColor: "#1a1a1a",
    borderColor: "#444",
    alignItems: "center",
    justifyContent: "center",
  },
  resetText: { color: "#888", fontSize: 18, fontWeight: "600", lineHeight: 18 },
  active: { borderColor: "#fadc50" },
});
