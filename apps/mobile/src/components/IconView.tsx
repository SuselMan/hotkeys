import { useEffect, useState } from "react";
import { View, type ViewStyle } from "react-native";
import { SvgXml } from "react-native-svg";
import { colorize, getSvg } from "../icons";

interface Props {
  name: string;
  size: number;
  color?: string;
  style?: ViewStyle;
}

export function IconView({ name, size, color = "#e8e8e8", style }: Props) {
  const [xml, setXml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setXml(null);
    void getSvg(name).then((svg) => {
      if (cancelled) return;
      setXml(svg ? colorize(svg, color) : null);
    });
    return () => {
      cancelled = true;
    };
  }, [name, color]);

  if (!xml) {
    // Skeleton placeholder so the layout doesn't jump while we resolve.
    return <View style={[{ width: size, height: size }, style]} />;
  }
  return (
    <View style={[{ width: size, height: size }, style]}>
      <SvgXml xml={xml} width={size} height={size} />
    </View>
  );
}
