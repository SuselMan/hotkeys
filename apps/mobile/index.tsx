// Install the file logger BEFORE anything else so we capture i18n init,
// connection attempts, and any module-load warnings into the on-device log.
import { installLogger } from "./src/logger";
installLogger();

// Initialize i18next before App is registered so the very first paint sees
// translations.
import "./src/i18n";

import { registerRootComponent } from "expo";
import { SafeAreaProvider } from "react-native-safe-area-context";
import App from "./App";

function Root() {
  return (
    <SafeAreaProvider>
      <App />
    </SafeAreaProvider>
  );
}

registerRootComponent(Root);
