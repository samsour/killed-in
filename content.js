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

  const placeholderMessages = {
    "gefällt das":
      "KilledIn: Jemand, den du kennst, mochte etwas Irrelevantes.",
    "hat dies geteilt":
      "KilledIn: Ein geteilter Beitrag, den du nicht sehen musst.",
    folgt: "KilledIn: Jemand folgte etwas Unwichtigem.",
    "hat das kommentiert":
      "KilledIn: Ein Kommentar, auf den du verzichten kannst.",
    Anzeige: "KilledIn: Eine Anzeige wurde zu deiner Beruhigung entfernt.",
    "unterstützt dies":
      "KilledIn: Unterstützung für etwas, das dich nicht interessiert.",
    "findet das wunderbar":
      "KilledIn: Ein wunderbarer Beitrag, den du nicht vermissen wirst.",
    "Gratulieren Sie":
      "KilledIn: Eine Glückwunschbotschaft, die du überspringen kannst.",
    applaudiert: "KilledIn: Applaus für etwas, das deine Zeit nicht wert ist.",
    "findet das lustig":
      "KilledIn: Ein lustiger Beitrag, der nicht lustig genug war.",
  };

  function getPlaceholderMessage(forbiddenString) {
    return placeholderMessages[forbiddenString] || "KilledIn: Content removed.";
  }

  function containsForbiddenString(element) {
    return forbiddenStrings.find((str) =>
      element.textContent.toLowerCase().includes(str.toLowerCase())
    );
  }

  function removeMatchingElements(mutation) {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // Check the node itself
        const forbiddenString = containsForbiddenString(node);
        if (forbiddenString) {
          console.log("Text containing forbidden keyword: ", node.textContent);
          removeParentContainer(node, forbiddenString);
        } else {
          // Traverse the entire subtree of the node
          const allDescendants = node.querySelectorAll("*");
          allDescendants.forEach((descendant) => {
            const forbiddenStringDescendant =
              containsForbiddenString(descendant);
            if (forbiddenStringDescendant) {
              console.log(
                "Text containing forbidden keyword: ",
                descendant.textContent
              );
              removeParentContainer(descendant, forbiddenStringDescendant);
            }
          });
        }
      }
    });
  }

  function removeParentContainer(element, forbiddenString) {
    let currentElement = element;
    while (
      currentElement &&
      !currentElement.classList.contains("fie-impression-container")
    ) {
      currentElement = currentElement.parentElement;
    }
    if (currentElement) {
      console.log("Evicting the parent container: ", currentElement);
      const placeholder = document.createElement("div");
      placeholder.textContent = getPlaceholderMessage(forbiddenString);
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
