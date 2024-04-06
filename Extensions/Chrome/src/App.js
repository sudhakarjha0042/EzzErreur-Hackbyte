import React, { useEffect, useState } from "react";
import logo from "./assets/EzzErreurLogo.png";
import data from "./assets/practice.json";
import SnipCard from "./elements/card";

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
      className="App "
    >
      <div className="outer1" >
        
        <div className="flex">
          <h1>EzzErreur</h1>
          <img src={logo} className="App-logo" alt="logo" />
        </div>
        <div className="cyan" >
          Code Snippets:-
        </div>

        <div className="grid">
        {data.posts.map(post => (
            <SnipCard key={post._id} post={post} />          
      ))}
        </div>
      </div>
    </div>
  );
}

export default App;
