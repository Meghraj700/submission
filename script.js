const basePrice = 12.0;
const offers = [
  { units: 1, discount: 10 },
  { units: 2, discount: 20, mostPopular: true },
  { units: 3, discount: 30 },
];

const sizes = ["S", "M", "L", "XL"];
const colors = ["Black", "Red", "Blue", "Green"];

let selectedUnits = 1;
const sizeColorSelections = {};

function calculatePrice(units, discount) {
  const total = units * basePrice;
  return {
    discountedPrice: total - (total * discount) / 100,
    originalPrice: total,
  };
}

function handleSelectionChange(id, key, value) {
  if (!sizeColorSelections[id]) {
    sizeColorSelections[id] = {};
  }
  sizeColorSelections[id][key] = value;
}

function renderSizeColorSelectors(units) {
    const container = document.createElement("div");
    container.className = "size-color-container";
  
    for (let i = 1; i <= units; i++) {
      const selector = document.createElement("div");
      selector.className = "size-color-selector";
  
      const label = document.createElement("label");
      label.className = "unit-label";
      label.textContent = `#${i}`;
      selector.appendChild(label);
  
      const sizeGroup = document.createElement("div");
      sizeGroup.className = "dropdown-group";
  
      if (i === 1) {
        const sizeHeading = document.createElement("label");
        sizeHeading.className = "dropdown-label";
        sizeHeading.textContent = "Size";
        sizeGroup.appendChild(sizeHeading);
      }
  
      const sizeSelect = document.createElement("select");
      sizeSelect.addEventListener("change", (e) =>
        handleSelectionChange(i, "size", e.target.value)
      );
      sizes.forEach((size) => {
        const option = document.createElement("option");
        option.value = size;
        option.textContent = size;
        sizeSelect.appendChild(option);
      });
      sizeGroup.appendChild(sizeSelect);
  
      selector.appendChild(sizeGroup);
  
      const colorGroup = document.createElement("div");
      colorGroup.className = "dropdown-group";
  
      if (i === 1) {
        const colorHeading = document.createElement("label");
        colorHeading.className = "dropdown-label";
        colorHeading.textContent = "Color";
        colorGroup.appendChild(colorHeading);
      }
  
      const colorSelect = document.createElement("select");
      colorSelect.addEventListener("change", (e) =>
        handleSelectionChange(i, "color", e.target.value)
      );
      colors.forEach((color) => {
        const option = document.createElement("option");
        option.value = color;
        option.textContent = color;
        colorSelect.appendChild(option);
      });
      colorGroup.appendChild(colorSelect);
  
      selector.appendChild(colorGroup);
  
      container.appendChild(selector);
    }
  
    return container;
  }

function renderOffers() {
  const offersContainer = document.getElementById("offers-container");
  offersContainer.innerHTML = "";

  offers.forEach(({ units, discount, mostPopular }) => {
    const { discountedPrice, originalPrice } = calculatePrice(units, discount);

    const offerBox = document.createElement("div");
    offerBox.className = `offer-box ${selectedUnits === units ? "selected" : ""}`;

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "unit-selection";
    radio.className = "unit-radio";
    radio.checked = selectedUnits === units;
    radio.addEventListener("change", () => {
      selectedUnits = units;
      renderOffers();
    });
    offerBox.appendChild(radio);

    const title = document.createElement("div");
    title.className = "offer-title";
    title.innerHTML = `
      <span>
        <b>${units} Unit${units > 1 ? "s" : ""}</b>
        <span class="discount">${discount}% Off</span>
      </span>
      <span class="price">$${discountedPrice.toFixed(2)} USD</span>
    `;
    title.addEventListener("click", () => {
      selectedUnits = units;
      renderOffers();
    });
    offerBox.appendChild(title);

    const strikePrice = document.createElement("span");
    strikePrice.className = "strike-price";
    strikePrice.textContent = `$${originalPrice.toFixed(2)} USD`;
    offerBox.appendChild(strikePrice);

    if (mostPopular) {
      const popularTag = document.createElement("span");
      popularTag.className = "most-popular";
      popularTag.textContent = "MOST POPULAR";
      offerBox.appendChild(popularTag);
    }

    if (selectedUnits === units) {
      const selectors = renderSizeColorSelectors(units);
      offerBox.appendChild(selectors);
    }

    offersContainer.appendChild(offerBox);
  });

  const totalPrice = calculatePrice(
    selectedUnits,
    offers[selectedUnits - 1].discount
  ).discountedPrice;
  document.getElementById("total-price").textContent = `Total: $${totalPrice.toFixed(2)} USD`;
}

renderOffers();
