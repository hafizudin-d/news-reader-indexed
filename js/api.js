

const base_url = "https://readerapi.codepolitan.com/";

// Blok kode yang akan di panggil jika fetch berhasil
const status = (response) =>{
    
    if(response.status !== 200) {
        console.log("Error :" + response.status);
        //Method reject() akan membuat blok catch terpanggil
        return Promise.reject(new Error(response.statusText));
    }else{
        // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
        return Promise.resolve(response);
    }
}

// Blok kode untuk memparsing json menjadi array JavaScript
const json = (response) =>{
    return response.json();
}


// Blok kode untuk meng-handle kesalahan di blok catch
const error = (error)=>{
      // Parameter error berasal dari Promise.reject()
    console.log("Error :" + error);
}

// Blok kode untuk melakukan request data json
const getArticles = () =>{

    if ('caches' in window) {
        caches.match(base_url + "articles").then(function(response) {
          if (response) {
            response.json().then(function (data) {
              var articlesHTML = "";
              data.result.forEach(function(article) {
                articlesHTML += `
                      <div class="card">
                        <a href="./article.html?id=${article.id}">
                          <div class="card-image waves-effect waves-block waves-light">
                            <img src="${article.thumbnail}" />
                          </div>
                        </a>
                        <div class="card-content">
                          <span class="card-title truncate">${article.title}</span>
                          <p>${article.description}</p>
                        </div>
                      </div>
                    `;
              });
              // Sisipkan komponen card ke dalam elemen dengan id #content
              document.getElementById("articles").innerHTML = articlesHTML;
            })
          }
        })
      }else {
        event.respondWith(
            caches.match(event.request, { ignoreSearch: true }).then(function(response) {
                return response || fetch (event.request);
            })
        )
    }

    fetch(base_url + "articles")
    .then(status)
    .then(json)
    .then((data) =>{
        // Objek/array JavaScript dari response.json() masuk lewat data.
      // Menyusun komponen card artikel secara dinamis
        let articlesHTML = "";
        data.result.forEach((article) =>{
            articlesHTML += `
              <div class="card">
                <a href="./article.html?id=${article.id}">
                  <div class="card-image waves-effect waves-block waves-light">
                    <img src="${article.thumbnail}" />
                  </div>
                </a>
                <div class="card-content">
                  <span class="card-title truncate">${article.title}</span>
                  <p>${article.description}</p>
                </div>
              </div>
            `;
        });
        // Sisipkan komponen card ke dalam elemen dengan id #content
        document.getElementById("articles").innerHTML = articlesHTML;
    })
    .catch(error);
}

// const getArticleById = () =>{
//     // Ambil nilai query parameter (?id=)
//     let urlParams = new URLSearchParams(window.location.search);
//     let idParam = urlParams.get("id");

//     fetch(base_url + "article/" + idParam)
//     .then(status)
//     .then(json)
//     .then((data) =>{
//         // Objek JavaScript dari response.json() masuk lewat variabel data.
//       console.log(data);
//       // Menyusun komponen card artikel secara dinamis

//       let articleHTML = `
//       <div class="card">
//         <div class="card-image waves-effect waves-block waves-light">
//           <img src="${data.result.cover}" />
//         </div>
//         <div class="card-content">
//           <span class="card-title">${data.result.post_title}</span>
//           ${snarkdown(data.result.post_content)}
//         </div>
//       </div>
//     `;
//          // Sisipkan komponen card ke dalam elemen dengan id #content
//     document.getElementById("body-content").innerHTML = articleHTML;
//     })
// }

const getArticleById = ()=> {
  return new Promise((resolve, reject) =>{
    // Ambil nilai query parameter (?id=)
    let urlParams = new URLSearchParams(window.location.search);
    let idParam = urlParams.get("id");
  
    if ("caches" in window) {
      caches.match(base_url + "article/" + idParam).then(function(response) {
        if (response) {
          response.json().then(function(data) {
            // .... kode lain disembunyikan agar lebih ringkas
            let articleHTML = `
            <div class="card">
              <div class="card-image waves-effect waves-block waves-light">
                <img src="${data.result.cover}" />
              </div>
              <div class="card-content">
                <span class="card-title">${data.result.post_title}</span>
                ${snarkdown(data.result.post_content)}
              </div>
            </div>
          `;
            document.getElementById("body-content").innerHTML = articleHTML;
            // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
            resolve(data);
          });
        }
      });
    }
  
    fetch(base_url + "article/" + idParam)
    .then(status)
    .then(json)
    .then((data) =>{
        // Objek JavaScript dari response.json() masuk lewat variabel data.
      console.log(data);
      // Menyusun komponen card artikel secara dinamis
  
      let articleHTML = `
      <div class="card">
        <div class="card-image waves-effect waves-block waves-light">
          <img src="${data.result.cover}" />
        </div>
        <div class="card-content">
          <span class="card-title">${data.result.post_title}</span>
          ${snarkdown(data.result.post_content)}
        </div>
      </div>
    `;
         // Sisipkan komponen card ke dalam elemen dengan id #content
    document.getElementById("body-content").innerHTML = articleHTML;
    })
  })
}

//mengambil artikel di getAll db.js
function getSavedArticles() {
  getAll().then(function(articles) {
    console.log(articles);
    // Menyusun komponen card artikel secara dinamis
    var articlesHTML = "";
    articles.forEach(function(article) {
      var description = article.post_content.substring(0,100);
      articlesHTML += `
                  <div class="card">
                    <a href="./article.html?id=${article.ID}">
                      <div class="card-image waves-effect waves-block waves-light">
                        <img src="${article.cover}" />
                      </div>
                    </a>
                    <div class="card-content">
                      <span class="card-title truncate">${article.post_title}</span>
                      <p>${description}</p>
                    </div>
                  </div>
                `;
    });
    // Sisipkan komponen card ke dalam elemen dengan id #body-content
    document.getElementById("body-content").innerHTML = articlesHTML;
  });
}