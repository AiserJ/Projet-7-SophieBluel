/////// Bannière mode édition ////////

window.addEventListener('load', () => {
  const token = localStorage.getItem('token');

  if (token) {
    const banner = document.createElement('div');
    banner.className = 'edit-mode-banner';
    banner.textContent = '🖋 Mode édition';

    document.body.prepend(banner);
    document.body.classList.add('logged-in');
  }
});

//////////////////////////// Partie 1 ////////////////////////////////////

/////// Affichage de la gallerie ///////
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

///// Récupération des données Back Works //////

fetch(apiUrl + 'works')
  .then(response => {
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }
    return response.json();
  })

  .then(data => {
    console.log('Projets récupérés: ', data);
    works = data;
    afficheWorks(works);
  })
  .catch(error => {
    console.error('Erreur lors du chargement des projets :', error);
  });
  

///// Récupération des données catégories ///// 

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


//////// Filtres /////////

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

//////////////////////////// Partie 2 ////////////////////////////////////

/////// Stockage du token de connexion ///////

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const loginLink = document.getElementById('login-link');

  if (token && loginLink) {
    // Met à jour le lien pour changer l'état connecté
    loginLink.textContent = 'Logout';
    loginLink.style.cursor = 'pointer';
    loginLink.removeAttribute('href'); // empêche d'aller vers login.html, facile

    // Gestion de la déconnexion
    loginLink.addEventListener('click', () => {
      localStorage.removeItem('token');
      window.location.href = 'login.html';
    });
  }
});

////////// Vérification de la connexion ///////

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');

  // Vérifier si l'utilisateur est connecté
  if (token) {
      document.addEventListener('DOMContentLoaded', () => {
      const token = localStorage.getItem('token');
      console.log('Token détecté :', token);


  // Affiche la barre seulement si connecté ET sur index.html (a retester)
  if (token && window.location.pathname.includes('index.html')) {
    const banner = document.createElement('div');
    banner.className = 'edit-mode-banner';
    banner.innerHTML = `<i class="fa-regular fa-pen-to-square"></i> Mode édition`;

    document.body.prepend(banner);
    document.body.classList.add('logged-in');
  }
});

//////////////////////////// Partie 3 ////////////////////////////////////

///// Page principale après connexion ////

    // Masquer la section filtres
    const filtersSection = document.querySelector('.filters');
    if (filtersSection) {
      filtersSection.style.display = 'none';
    }

    // Ajoute du bouton  "Modifier"
    const portfolioTitle = document.querySelector('#portfolio h2');
    if (portfolioTitle) {
      const editBtn = document.createElement('button');
      editBtn.classList.add('edit-button');
      editBtn.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> modifier`;

      // Style
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


//////////////////////////// Partie 4 ////////////////////////////////////

document.addEventListener('DOMContentLoaded', () => {
  ////////// Sélecteurs ///////////
  const editBtn      = document.querySelector('.edit-button');
  const overlay      = document.getElementById('modal-overlay');
  const galleryModal = document.querySelector('.modal-gallery');
  const closeBtn     = document.querySelector('.modal-close');

  ///////// Helpers //////////
function renderModalGallery() {
  galleryModal.innerHTML = '';

  works.forEach(w => {
    const fig = document.createElement('figure');
    const img = document.createElement('img');
    const trash = document.createElement('button');

    img.src = w.imageUrl;
    img.alt = w.title;

    trash.className = 'delete-btn';
    trash.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    trash.title = 'Supprimer';
    trash.addEventListener('click', () => deleteWork(w.id));

    fig.append(img, trash);
    galleryModal.appendChild(fig);
  });

  ///  Ecouteur sur le bouton d'ajout & mini fonction ///

  const addPhotoBtn = document.querySelector('.modal-add');
  addPhotoBtn?.addEventListener('click', () => {
    document.getElementById('modal-add-photo').classList.remove('hidden');
  });
}

  function openModal() {
    renderModalGallery();
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Je bloque le scroll de l'arrière plan //
  }

  function closeModal() {
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
  }


  ///////// Suppression /////////
  
  function deleteWork(id) {
    const token = localStorage.getItem('token');
    if (!token) { alert('Non autorisé'); return; }

    fetch(`${apiUrl}works/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })

    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      // 1) Mets à jour le cache local
      works = works.filter(w => w.id !== id);
      // 2) Rafraîchis les deux galeries
      renderModalGallery();
      gallerySection.innerHTML = '';
      afficheWorks(works);
    })
    .catch(err => {
      console.error(err);
      alert('Échec de la suppression');
    });
  }

////////// Écouteurs //////////

  editBtn?.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);
  overlay?.addEventListener('click', e => {
    if (e.target === overlay) closeModal();   // clic hors modale
  });
});

///////////////////

const addPhotoBtn   = document.querySelector('.modal-add');
const addPhotoModal = document.getElementById('modal-add-overlay');
const form          = document.getElementById('photo-form');
const categorySelect = document.getElementById('category');


///////// Affiche la modale d'ajout par-dessus /////


document.addEventListener('DOMContentLoaded', () => {
  const addPhotoBtn = document.querySelector('.modal-add');
  const addPhotoModal = document.getElementById('modal-add-overlay');
  const overlay = document.getElementById('modal-overlay');
  const form = document.getElementById('photo-form');
  const imageInput = document.getElementById('image');
  const previewImg = document.getElementById('preview-image');
  const placeholder = document.querySelector('.placeholder');
  const validateBtn = document.querySelector('.submit-btn');
  const categorySelect = document.getElementById('category');

  // Afficher la modale
  addPhotoBtn?.addEventListener('click', () => {
    addPhotoModal.classList.remove('hidden');
  });

  // Fermer la modale
addPhotoModal.querySelector('.modal-close').addEventListener('click', () => {
  addPhotoModal.classList.add('hidden'); // ferme modale ajout
  overlay.classList.add('hidden');       // ferme aussi modale galerie
  document.body.style.overflow = '';     // réactive le scroll de la page
});

  // Charger les catégories
  fetch(apiUrl + "categories")
    .then(res => res.json())
    .then(categories => {
      categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        categorySelect.appendChild(option);
      });
    })
    .catch(err => console.error("Erreur de chargement des catégories", err));

  // Prévisualisation image
  imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        previewImg.src = e.target.result;
        previewImg.style.display = 'block';
        placeholder.style.display = 'none';
      };
      reader.readAsDataURL(file);
    }
  });

  // Activation bouton "Valider"
  form.addEventListener('input', () => {
    const isValid = form.checkValidity();
    if (isValid) {
      validateBtn.classList.add('active');
      validateBtn.removeAttribute('disabled');
    } else {
      validateBtn.classList.remove('active');
      validateBtn.setAttribute('disabled', 'disabled');
    }
  });

const backBtn = document.querySelector('.modal-back'); // bouton flèche

backBtn?.addEventListener('click', () => {
  addPhotoModal.classList.add('hidden');        // masque la modale d’ajout
  overlay.classList.remove('hidden');           // réaffiche la galerie
});

//////////////////////////// Partie 6 ////////////////////////////////////

  ///// Envoi du formulaire //////
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Non autorisé');
      return;
    }

    //////////

    const formData = new FormData();
    formData.append('image', form.image.files[0]);
    formData.append('title', form.title.value);
    formData.append('category', form.category.value);

    fetch(apiUrl + 'works', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(newWork => {
      works.push(newWork);
      addPhotoModal.classList.add('hidden');
      overlay.classList.add('hidden');
      document.body.style.overflow = '';
      gallerySection.innerHTML = '';
      afficheWorks(works);

      form.reset();
      previewImg.src = '';
      previewImg.style.display = 'none';
      placeholder.style.display = 'flex';
      validateBtn.classList.remove('active');
      validateBtn.setAttribute('disabled', 'disabled');

      placeholder.innerHTML = `
      <i class="fa-solid fa-image"></i>
      <p>+ Ajouter photo<br>jpg, png : 4mo max</p>`;
    })

    .catch(err => {
      console.error('Erreur lors de l’ajout :', err);
      alert("L'ajout a échoué");
    });
  });
});