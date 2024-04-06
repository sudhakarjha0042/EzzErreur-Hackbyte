import React, { useState } from "react";
import "./card.css";
import Arrow from "../assets/Arrow.svg";

export default function SnipCard({post})  {
  const { title, description, codeSnipet } = post;
  const cleanSnipet = codeSnipet.replace(/`/g, '');
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenModal = () => {
    setIsOpen(true);
  }

  const handleCloseModal = () => {
    setIsOpen(false);
  }

  const copyContent = () => {
    // Select the content of the div
    const contentToCopy = document.getElementById("contentToCopy");

    // Create a textarea element to temporarily hold the text
    const textarea = document.createElement("textarea");
    textarea.value = contentToCopy.innerText;

    // Append the textarea to the body
    document.body.appendChild(textarea);

    // Select the text inside the textarea
    textarea.select();

    // Execute the copy command
    document.execCommand("copy");

    // Remove the textarea
    document.body.removeChild(textarea);

    // Alert the user that the content has been copied
    alert("Content has been copied to clipboard!");
  };

  return (
    <>
      <div className="snip-card" >
        <div className="card-content">
          <h2 className="text-xl font-bold mb-2">{title}</h2>
            <a onClick={handleOpenModal}><img src={Arrow} className="Arr-logo" alt="logo" /></a>
        </div>
      </div>

      {isOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <button onClick={handleCloseModal} className="close-button">
              <svg className="close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="content">
                <p>{description}</p>
              <pre id="contentToCopy" >{cleanSnipet}</pre>
              <div className="actions">
                <button onClick={copyContent} className="copy-button">Copy to Clipboard</button>
                
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
