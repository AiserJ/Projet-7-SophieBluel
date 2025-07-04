const gallerySection = document.querySelector('.gallery');
const apiUrl = 'http://localhost:5678/api/';

let works = [];

function afficheWorks (works){
    works.forEach(project => {
        const figure = document.createElement('figure');

        const img = document.createElement('img');
        img.src = project.imageUrl;
        img.alt = project.title;

        const caption = document.createElement('figcaption');
        caption.textContent = project.title;

        figure.appendChild(img);
        figure.appendChild(caption);
        gallerySection.appendChild(figure);
    });
}

fetch(apiUrl + 'works')
  .then(response => {
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('Projets récupérés: ', data);
    works = data; // Utilise bien la variable globale
    afficheWorks(works);
  })
  .catch(error => {
    console.error('Erreur lors du chargement des projets :', error);
  });
  

const filters = document.querySelector('.filters');

fetch(apiUrl + "categories")
  .then(response => {
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('categories récupérés :', data);

    data.forEach(categorie => {
      const button = document.createElement('button');
        button.textContent = categorie.name;
        button.setAttribute('id', categorie.id)
        filters.appendChild(button);
    });
  })
  .catch(error => {
    console.error('Erreur lors du chargement des projets :', error);
  });

filters.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') {
    // Changer le style
    document.querySelectorAll('.filters button').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');

    // Filtrage
    const categoryId = e.target.id;
    gallerySection.innerHTML = "";

    if (categoryId === "all") {
      afficheWorks(works);
    } else {
      const filtered = works.filter(project => project.categoryId == categoryId);
      afficheWorks(filtered);
    }
  }
});

//////////////

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const loginLink = document.getElementById('login-link');

  if (token && loginLink) {
    // Met à jour le lien pour refléter l'état connecté
    loginLink.textContent = 'Logout';
    loginLink.style.fontWeight = 'bold';
    loginLink.style.cursor = 'pointer';
    loginLink.removeAttribute('href'); // empêche d'aller vers login.html

    // Gèrer la déconnexion
    loginLink.addEventListener('click', () => {
      localStorage.removeItem('token');
      window.location.href = 'login.html';
    });
  }
});

/////////////////////////

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');

  // Vérifier si l'utilisateur est connecté
  if (token) {
    // Masquer la section filtres
    const filtersSection = document.querySelector('.filters');
    if (filtersSection) {
      filtersSection.style.display = 'none';
    }

    // L'Ajoute du bouton  "Modifier"
    const portfolioTitle = document.querySelector('#portfolio h2');
    if (portfolioTitle) {
      const editBtn = document.createElement('button');
      editBtn.classList.add('edit-button');
      editBtn.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> modifier`;

      // Style comme sur la maquette.
      editBtn.style.marginLeft = '10px';
      editBtn.style.cursor = 'pointer';
      editBtn.style.background = 'none';
      editBtn.style.border = 'none';
      editBtn.style.color = '#333';
      editBtn.style.fontSize = '16px';

      portfolioTitle.appendChild(editBtn);
    }
  }
});