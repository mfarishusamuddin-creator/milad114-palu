import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { AppProviders } from "./app/providers";
import { AppRouter } from "./app/router";
import { SwarmCursorFromSettings } from "./components/effects/SwarmCursorFromSettings";
import { DocumentTitleSync } from "./components/effects/DocumentTitleSync";
import { installToolDataBridge } from "./features/tool-data/lib/toolDataBridge";
import { installCore } from "./features/core/installCore";
import "./index.css";

installToolDataBridge();
installCore();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders>
      <SwarmCursorFromSettings />
      <DocumentTitleSync />
      <AppRouter />
    </AppProviders>
  </StrictMode>,
);
