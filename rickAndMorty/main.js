const API_URL = 'https://rickandmortyapi.com/api/character';

async function fetchData() {
    try {
        const response = await fetch(API_URL)
        if(!response.ok) {
            throw new Error("Error al obtener los datos: " + response.status);
        }

        const characters = await response.json();

        const charactersTable = document.getElementById('charactersBody');
        charactersTable.innerHTML = '';

        characters.results.forEach(element => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${element.id}</td>
                <td>${element.name}</td>
                <td>${element.species}</td>
                <td>${element.status}</td>
                <td>
                    <button onclick="ViewDetails('${element.id}')">Ver detalles</button>
                </td>
            `;
            charactersTable.appendChild(row);
        });

    } catch (error) {
        console.error('Error en la solicitud fetch: ' + error);
        document.getElementById('charactersBody').innerHTML = `
            <tr>
                <td colspan="6">Error al obtener los datos</td>
            </tr>
        `;
    }
}
async function ViewDetails(id) {
    try{
        if(id) {
            const response = await fetch(`${API_URL}/${id}`);
            const characterModal = document.querySelector('#characterModal .modal-content')
            const character = await response.json();
            characterModal.innerHTML = `
                <div class="modal-header">
                    <h5 class="modal-title">${character.name}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                </div>
                <div class="modal-body">
                    <img src="${character.image}" class="img-fluid mb-2" alt="${character.name}">
                    <p><strong>Origen :</strong>${character.origin.name}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                </div> 
            `;
            const modal = new bootstrap.Modal(document.getElementById('characterModal'));
            modal.show();
        } else {
            throw new Error('Error al obtener: '+ response.status);
        }
    } catch(error) {
        console.error('Error en la solicitud fech: ', error);
    }
}



document.addEventListener('DOMContentLoaded', fetchData, () => {
      // DataTable se activa cuando ya se cargan los datos
      const observer = new MutationObserver(() => {
        if (document.querySelectorAll("#charactersBody tr").length > 0) {
          new DataTable("#charactersTable", {
            language: {
              url: "https://cdn.datatables.net/plug-ins/1.13.8/i18n/es-ES.json"
            }
          });
          observer.disconnect();
        }
      });
      observer.observe(document.getElementById("charactersBody"), { childList: true });
    });