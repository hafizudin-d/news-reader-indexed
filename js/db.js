let dbPromised = idb.open("news-reader", 1, (upgradeDb) =>{
    let articlesObjectStore = upgradeDb.createObjectStore("articles", {
        keyPath: "ID"
    });

    articlesObjectStore.createIndex("post_title", "post_title", {unique: false});
})

const saveForLater = (article) =>{
    dbPromised
    .then((db) =>{
        let tx = db.transaction("articles", "readwrite");
        let store = tx.objectStore("articles");
        console.log(article);
        store.add(article.result);
        return tx.complete;
    })
    .then(() =>{
        console.log("Article Berhasil Di Simpan");
    })
}

const getAll = () => {
    return new Promise((resolve, reject) =>{
        dbPromised
        .then((db) =>{
            let tx = db.transaction("articles", "readonly");
            let store = tx.objectStore("articles");
            return store.getAll();
        }).then((articles) =>{
            resolve(articles);
        })
    })
}