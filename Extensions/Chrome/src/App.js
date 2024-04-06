import React, { useEffect, useState } from "react";
import logo from "./logo.svg";

function App() {
  const [currentTabUrl, setCurrentTabUrl] = useState("");

  useEffect(() => {
    // Check if the window.chrome object is available (running in a Chrome extension context)
    if (window.chrome && window.chrome.tabs) {
      window.chrome.tabs.query(
        { active: true, lastFocusedWindow: true },
        (tabs) => {
          if (tabs.length > 0) {
            setCurrentTabUrl(tabs[0].url);
          }
        }
      );
    }
  }, []);

  return (
    <div
      className="App"
      style={{
        display: "flex",
        height: "100%",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <p>Hey this is Me and my extension</p>
      <p>Hey this is Me and my extension</p>
      <p>Hey this is Me and my extension</p>
      <p>Current Tab URL: {currentTabUrl}</p>
    </div>
  );
}

export default App;
