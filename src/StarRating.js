export function StarRating({
  maxRating = 5,
  color = "#fcc419",
  size = 48,
  className = "",
  messages = [],
  defaultRating = 0,
  onSetRating = () => {},
}) {
  let rating = defaultRating;
  let tempRating = 0;

  const containerStyle = `
    display: flex;
    align-items: center;
    gap: 16px;
  `;

  const starContainerStyle = `
    display: flex;
  `;

  const textStyle = `
    line-height: 1;
    margin: 0;
    color: ${color};
    font-size: ${size / 1.5}px;
  `;

  const container = document.createElement("div");
  container.className = className;
  container.style.cssText = containerStyle;

  const starContainer = document.createElement("div");
  starContainer.style.cssText = starContainerStyle;
  container.appendChild(starContainer);

  const messageDisplay = document.createElement("p");
  messageDisplay.style.cssText = textStyle;
  container.appendChild(messageDisplay);

  // Create stars
  for (let i = 0; i < maxRating; i++) {
    const star = createStar(
      i + 1,
      () => handleRating(i + 1),
      () => handleHoverIn(i + 1),
      handleHoverOut
    );
    starContainer.appendChild(star);
  }

  function handleRating(newRating) {
    rating = newRating;
    onSetRating(rating);
    updateStars();
    updateMessage();
  }

  function handleHoverIn(newTempRating) {
    tempRating = newTempRating;
    updateStars();
    updateMessage();
  }

  function handleHoverOut() {
    tempRating = 0;
    updateStars();
    updateMessage();
  }

  function updateStars() {
    [...starContainer.children].forEach((star, index) => {
      const isFull = tempRating ? tempRating > index : rating > index;
      star.innerHTML = isFull ? getFullStarSvg() : getEmptyStarSvg();
    });
  }

  function updateMessage() {
    const displayedRating = tempRating || rating || "";
    messageDisplay.textContent =
      messages.length === maxRating && displayedRating
        ? messages[displayedRating - 1]
        : displayedRating;
  }

  function createStar(index, onClick, onMouseEnter, onMouseLeave) {
    const star = document.createElement("span");
    star.role = "button";
    star.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      display: block;
      cursor: pointer;
    `;
    star.innerHTML = getEmptyStarSvg();
    star.addEventListener("click", onClick);
    star.addEventListener("mouseenter", onMouseEnter);
    star.addEventListener("mouseleave", onMouseLeave);
    return star;
  }

  function getFullStarSvg() {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="${color}" stroke="${color}">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>`;
  }

  function getEmptyStarSvg() {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="${color}">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>`;
  }

  updateStars();
  updateMessage();
  return container;
}

/*
FULL STAR

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 20 20"
  fill="#000"
  stroke="#000"
>
  <path
    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
  />
</svg>


EMPTY STAR



*/
