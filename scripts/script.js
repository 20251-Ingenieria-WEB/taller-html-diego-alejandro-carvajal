// Función para obtener los datos de la API
async function fetchDogBreeds() {
  const filterButton = document.getElementById("load-breeds");
  filterButton.disabled = true; // Deshabilitar el botón mientras se cargan los datos

  try {
    const response = await fetch("https://dog.ceo/api/breeds/list/all");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    displayBreeds(data.message);
    console.log("Dog breeds fetched successfully:", data.message);
  } catch (error) {
    console.error("Error fetching dog breeds:", error);
  } finally {
  }
}

// Función para mostrar las razas en el HTML
async function displayBreeds(breeds) {
  const filterButton = document.getElementById("load-breeds");
  const breedsContainer = document.getElementById("breeds-container");
  breedsContainer.innerHTML = ""; // Limpiar contenido previo

  for (const breed in breeds) {
    // Crear una card para cada raza
    const card = document.createElement("div");
    card.className = "breed-card";

    // Crear el título con el nombre de la raza
    const breedName = document.createElement("h3");
    breedName.className = "breed-name";
    breedName.textContent = breed;

    // Crear la imagen de la raza
    const breedImage = document.createElement("img");
    try {
      const imageResponse = await fetch(
        `https://dog.ceo/api/breed/${breed}/images/random`
      );
      if (imageResponse.ok) {
        const imageData = await imageResponse.json();
        breedImage.src = imageData.message;
        breedImage.alt = `Image of ${breed}`;
      } else {
        breedImage.alt = "Image not available";
      }
    } catch (error) {
      console.error(`Error fetching image for breed ${breed}:`, error);
      breedImage.alt = "Image not available";
    }

    // Agregar el título y la imagen a la card
    card.appendChild(breedImage);
    card.appendChild(breedName);

    // Agregar subespecies si existen
    if (breeds[breed].length > 0) {
      const subBreedTitle = document.createElement("h4");
      subBreedTitle.className = "sub-breed-title";
      subBreedTitle.textContent = "Sub breeds:";
      card.appendChild(subBreedTitle);

      const subBreedsList = document.createElement("ul");
      subBreedsList.className = "sub-breeds-list";

      breeds[breed].forEach((subBreed) => {
        const subBreedItem = document.createElement("li");
        subBreedItem.className = "sub-breed-item";
        subBreedItem.textContent = subBreed;
        subBreedsList.appendChild(subBreedItem);
      });

      card.appendChild(subBreedsList);
    }

    // Agregar la card al contenedor
    breedsContainer.appendChild(card);
  }

  filterButton.disabled = false; // Habilitar el botón después de cargar los datos
}

// Función para filtrar las razas
function filterBreeds() {
  const filterInput = document
    .getElementById("breed-filter")
    .value.toLowerCase();
  const breedCards = document.querySelectorAll(".breed-card");

  breedCards.forEach((card) => {
    const breedName = card
      .querySelector(".breed-name")
      .textContent.toLowerCase();
    if (breedName.includes(filterInput)) {
      card.style.display = "block"; // Mostrar la card si coincide
    } else {
      card.style.display = "none"; // Ocultar la card si no coincide
    }
  });
}

// Agregar evento al botón de filtro
document.addEventListener("DOMContentLoaded", () => {
  const filterButton = document.getElementById("load-breeds");
  filterButton.addEventListener("click", filterBreeds);
});

// Llamar a la función al cargar la página
document.addEventListener("DOMContentLoaded", fetchDogBreeds);
