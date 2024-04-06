console.log("Content script loaded");

// Function to create the new button
function createButton(pullRequestLink) {
  const button = document.createElement("button");
  button.textContent = "Get Pull Request Details";
  button.addEventListener("click", async () => {
    try {
      // Step 1: Get the current URL
      const currentUrl = window.location.href;

      // Step 2: Extract the repository owner and name from the URL
      const match = currentUrl.match(
        /https:\/\/github.com\/([^/]+)\/([^/]+)\//
      );
      const owner = match[1];
      const repo = match[2];

      // Step 3: Find the pull request ID
      const pullRequestUrl = pullRequestLink.href;
      const pullRequestId = pullRequestUrl.match(/\/pull\/(\d+)/)[1];

      // Step 4: Construct the API URLs
      const pullRequestFilesUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${pullRequestId}/files`;
      const pullsListUrl = `https://api.github.com/repos/${owner}/${repo}/pulls`;

      // Step 5: Send the API requests and retrieve the responses
      const filesResponse = await fetch(pullRequestFilesUrl);
      const filesData = await filesResponse.json();
      const pullsResponse = await fetch(pullsListUrl);
      const pullsData = await pullsResponse.json();

      // Step 6: Find the pull request object matching the clicked button
      const pullRequestObject = pullsData.find(
        (pr) => pr.title === pullRequestLink.textContent.trim()
      );

      // Step 7: Extract the required data
      const pullRequestTitle = pullRequestObject.title;
      const pullRequestDescription = pullRequestObject.body;
      const patchData = filesData.map((file) => file.patch).join("\n");

      // Step 8: Send data to the API
      const apiResponse = await fetch(
        "https://ezzerreur-hackbyte.onrender.com/codes/gitanalyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjEwZWMxOWE0YTIzMzYwZjE0ZmM5ODciLCJpYXQiOjE3MTIzODUwNDksImV4cCI6MTcxNTk4NTA0OX0.INaVIDCg7jaH6YUMMB3c_y6vkb3d3bWAfTiKcQdQzUc",
          },
          body: JSON.stringify({
            title: pullRequestTitle,
            description: pullRequestDescription,
            patchfiles: patchData,
          }),
        }
      );

      console.log(apiResponse);
      const apiData = await apiResponse.json();
      console.log(apiData);

      // Step 9: Create a container element to display the data
      const container = document.createElement("div");
      container.style.display = "flex";
      container.style.flexDirection = "column";
      container.style.alignItems = "flex-start";

      // Step 10: Create and append elements to display the data
      const percentageElement = document.createElement("h3");
      percentageElement.textContent = apiData.persentage; // Corrected property name
      container.appendChild(percentageElement);

      const explanationElement = document.createElement("p");
      explanationElement.textContent = apiData.Explaination; // Corrected property name
      container.appendChild(explanationElement);

      // Step 11: Replace the button with the container
      const buttonParent = button.parentNode;
      buttonParent.replaceChild(container, button);

      // Step 12: Remove the click event listener from the replaced button
      button.removeEventListener("click", button.clickHandler);
    } catch (error) {
      console.error("Error:", error);
    }
  });

  // Store the click event listener for later removal
  button.clickHandler = button.addEventListener("click", button.clickHandler);

  return button;
}

// Check if the current URL matches the desired pattern
if (
  window.location.href.includes("https://github.com/") &&
  window.location.href.includes("/pull")
) {
  console.log("Injecting buttons");

  // Find all pull request elements
  const pullRequestElements = document.querySelectorAll(".Box-row--drag-hide");

  // Loop through each pull request element and inject the button
  pullRequestElements.forEach((pullRequestElement) => {
    const pullRequestLink = pullRequestElement.querySelector(".markdown-title");
    if (pullRequestLink) {
      const newButton = createButton(pullRequestLink);
      pullRequestElement.querySelector(".flex-auto").appendChild(newButton);
    }
  });
}
