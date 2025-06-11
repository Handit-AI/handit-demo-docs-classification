import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme/theme";
import DocumentClassification from "./features/documentClassification/pages/DocumentClassification";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<DocumentClassification />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;

