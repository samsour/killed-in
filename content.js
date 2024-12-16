(function () {
  const targetSelector = ".scaffold-finite-scroll__content"; // Update with the selector for the parent element to watch
  const forbiddenStrings = [
    "gefällt das",
    "hat dies geteilt",
    "folgt",
    "hat das kommentiert",
    "Anzeige",
    "unterstützt dies",
    "findet das wunderbar",
    "Gratulieren Sie",
    "applaudiert",
    "findet das lustig",
  ];

  function containsForbiddenString(element) {
    return forbiddenStrings.some((str) =>
      element.textContent.toLowerCase().includes(str.toLowerCase())
    );
  }

  function removeMatchingElements(mutation) {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // Check the node itself
        if (containsForbiddenString(node)) {
          console.log("Text containing forbidden keyword: ", node.textContent);
          removeParentContainer(node);
        } else {
          // Traverse the entire subtree of the node
          const allDescendants = node.querySelectorAll("*");
          allDescendants.forEach((descendant) => {
            if (containsForbiddenString(descendant)) {
              console.log(
                "Text containing forbidden keyword: ",
                descendant.textContent
              );
              removeParentContainer(descendant);
            }
          });
        }
      }
    });
  }

  function removeParentContainer(element) {
    let currentElement = element;
    while (
      currentElement &&
      !currentElement.classList.contains("fie-impression-container")
    ) {
      currentElement = currentElement.parentElement;
    }
    if (currentElement) {
      console.log("Removing parent container: ", currentElement);
      const placeholder = document.createElement("div");
      placeholder.textContent = "Content removed due to forbidden keyword.";
      placeholder.style.padding = "0 0.5rem";
      placeholder.style.fontSize = "11px";
      placeholder.style.color = "rgba(0, 0, 0, 0.5)";
      currentElement.parentElement.replaceChild(placeholder, currentElement);
    }
  }

  const targetElement = document.querySelector(targetSelector);
  if (!targetElement) {
    console.error("Target element not found: ", targetSelector);
    return;
  }

  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        removeMatchingElements(mutation);
      }
    }
  });

  observer.observe(targetElement, {
    childList: true,
    subtree: true,
  });

  console.log("DOM watcher initialized.");
})();
