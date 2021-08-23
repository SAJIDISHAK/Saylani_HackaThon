const signOut = () => {
    firebase.auth().signOut().then(() => {
        alert("Successfully Signed Out");
    }).catch((err) => {
        console.log(err);
        alert("Something Went Wrong at Signing out")
    })
};

const checkUserType = () => {
    var userTypeData = JSON.parse(localStorage.getItem("userData")).userType;
    if (userTypeData == "Restaurateur") {
        document.getElementById("nav-options").innerHTML += ` <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
        Create Product
    </button>
    <button class="btn btn-outline-danger" onclick="signOut();" type="button">Sign Out</button>`;

        document.getElementById('navigation-links').innerHTML += `<li class="nav-item">
    <a class="nav-link active" aria-current="page" href="../MyProducts/index.html">My Products</a>
</li>`
    } else {
        document.getElementById("nav-options").innerHTML += `
    <button class="btn btn-outline-danger" onclick="signOut();" type="button">Sign Out</button>`
    }
}
checkUserType();
const handleformSubmit = (e) => {
    e.preventDefault();
    const productName = document.getElementById("product-name-input");
    const productPrice = document.getElementById("product-price-input");
    const productDescription = document.getElementById("product-description-input");
    const productImage = document.getElementById("product-image-input");
    const file = productImage.files[0];
    // e.target[3].files[0]
    let creatorId = firebase.auth().currentUser.uid;
    // Create the file metadata
    var metadata = {
        contentType: 'image/jpeg'
    };
    var storageRef = firebase.storage().ref();
    // Upload file and metadata to the object 'images/mountains.jpg'
    var uploadTask = storageRef.child('images/' + String(Math.floor(Math.random() * 999999) + file.name)).put(file, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
            }
        },
        (error) => {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            alert("Something Went Wrong During Uploading Prodct Image")
            switch (error.code) {
                case 'storage/unauthorized':
                    // User doesn't have permission to access the object
                    break;
                case 'storage/canceled':
                    // User canceled the upload
                    break;

                // ...

                case 'storage/unknown':
                    // Unknown error occurred, inspect error.serverResponse
                    break;
            }
        },
        () => {
            // Upload completed successfully, now we can get the download URL
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                var userData = JSON.parse(localStorage.getItem("userData"));
                var dataToSave = {
                    creatorId,
                    creatorName: userData.name,
                    productName: productName.value,
                    productPrice: productPrice.value,
                    productDescription: productDescription.value,
                    productImage: downloadURL
                };
                firebase.database().ref("/products/").push(dataToSave).then((doc) => {
                    doc.update({ docId: doc.key });
                    document.getElementById("closeModal").click();
                    alert("Successfully Created Product")
                }).catch((err) => {
                    alert("Somethign Went Wrong At Saving Product");
                    console.log(err)
                })
                console.log('File available at', downloadURL);
            });
        }
    );
}
const deleteProduct = (docId) => {
    console.log(docId)
    firebase.database().ref("/products/").child(docId).remove().then(() => {
        alert('Successfully Deleted Products');
        window.location.reload();
    }).catch((err) => {
        if (err) {
            alert("Something Went Wrong at Deleting Product");
        }
    })
}
const getAllProducts = () => {
    firebase.database().ref("/products/").on("child_added", (snap) => {
        let EachProduct = snap.val();
        let currentUserId = firebase.auth().currentUser.uid;
        document.getElementById("allProducts").innerHTML += ` 
        <div class="card border-success mb-3" style="max-width: 18rem;">
        <div class="card-header bg-transparent border-success">${EachProduct.creatorName}</div>
        <div class="card-body text-success">
            <h5 class="card-title">${EachProduct.productName}</h5>
            <img src="${EachProduct.productImage}" class="card-img-top" alt="fry boti">
            <p class="card-text">${EachProduct.productPrice}</p>
            <p class="card-text">${EachProduct.productDescription}</p>
        </div>
        <div class="card-footer bg-transparent border-success">
        <button class="btn btn-primary">Add To Cart</button>
        ${currentUserId == EachProduct.creatorId ? `<button onClick="deleteProduct('${snap.key}')" class="btn btn-outline-danger">Delete Product</button>`:``}
        </div>
    </div>`
    })
}
getAllProducts();

$('#myModal').on('shown.bs.modal', function () {
    $('#myInput').trigger('focus')
})