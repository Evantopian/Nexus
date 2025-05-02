import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import axios from "axios";
import client from "./lib/apollo-client";
import { ApolloProvider } from "@apollo/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext.tsx";
import { AuthProvider } from "./contexts/AuthContext";
import { GameProvider } from "./contexts/GameContext.tsx";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <ApolloProvider client={client}>
          <GameProvider>
            {" "}
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </GameProvider>
        </ApolloProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
