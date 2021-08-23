function send() {
    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const number = document.getElementById("number");
    const city = document.getElementById("city");
    const userType = document.getElementById("userType");

    firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
        .then((userCredential) => {
            let userId = userCredential.user.uid;
            let obj = {
                name: name.value,
                email: email.value,
                password: password.value,
                number: number.value,
                city: city.value,
                userType: userType.value,
                userId
            };
            firebase.database().ref(`/userData/${userId}`).set(obj).then(() => {
                alert("Succesfully Created You Account");
                window.location.href = "DashBoard/index.html";
            }).catch((err) => {
                console.log(err);
                alert("Something Went Wrong at Saving Details")
            })
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage, errorCode);
            console.log("Something Went Wrong at creating you account");
        });
}

function login() {
    const email = document.getElementById("login-email");
    const password = document.getElementById("login-password");
    if (email.value === "") {
        alert("Please Enter the Email Address");
        return;
    } else if (password.value === "") {
        alert("Please Enter the Password");
        return;
    }

    firebase.auth().signInWithEmailAndPassword(email.value, password.value)
        .then((userCredential) => {
            // Signed in
            window.location.href = "DashBoard/index.html";

            alert("Successfully Logged In");
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage, errorCode);
            alert("Error: " + errorMessage);
        });
}