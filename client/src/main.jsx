import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./redux/store.js";

import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <ModalsProvider>
            {/* 🔔 Notifications must be mounted once */}
            <Notifications position="top-right" />
            <App />
          </ModalsProvider>
        </MantineProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
