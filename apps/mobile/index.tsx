// Install the file logger BEFORE anything else so we capture i18n init,
// connection attempts, and any module-load warnings into the on-device log.
import { installLogger } from "./src/logger";
installLogger();

// Initialize i18next before App is registered so the very first paint sees
// translations.
import "./src/i18n";

// Open Play Billing connection on boot — fire-and-forget, the module catches
// its own errors so dev clients without Play services still launch normally.
import { initIap } from "./src/iap";
void initIap();

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
