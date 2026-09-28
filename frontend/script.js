const form = document.getElementById("signupForm");

const message = document.getElementById("message");


form.addEventListener("submit", async function (event) {

    event.preventDefault();


    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;


    message.textContent = "Creating account...";
    message.style.color = "black";


    try {

        const response = await fetch(
            "http://localhost:5000/api/signup",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                })
            }
        );


        const data = await response.json();


        if (data.success) {

            message.textContent =
                "Signup successful!";

            message.style.color = "green";


            form.reset();

        } else {

            message.textContent =
                data.message;

            message.style.color = "red";
        }


    } catch (error) {

        console.log(error);

        message.textContent =
            "Network Error. Please check your backend.";

        message.style.color = "red";
    }

});