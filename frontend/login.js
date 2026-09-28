const form = document.getElementById("loginForm");

const message = document.getElementById("message");


form.addEventListener("submit", async function (event) {

    event.preventDefault();


    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;


    message.textContent = "Logging in...";
    message.style.color = "black";


    try {

        const response = await fetch(
            "http://localhost:5000/api/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );


        const data = await response.json();


        if (data.success) {

            message.textContent =
                "Login successful!";

            message.style.color = "green";

            console.log("Logged in user:", data.user);

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