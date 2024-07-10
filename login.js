let emailRegister = document.getElementById("exampleInputEmail-register");
let registerUsername = document.getElementById("validationDefaultUsername")
let feedbackUsername = document.getElementById("validationDefaultUsernameFeedback")
let feedbackEmail = document.getElementById("feedback-email")
function nameValidation() {
    let registerName = document.getElementById("validationDefault01")
    let feedbackName = document.getElementById("name-feedback")
    registerName.onblur = e => {
        let value = registerName.value.trim()
        if (value === "") {
            registerName.classList.add("is-invalid")
            feedbackName.innerHTML = "Write your name"
        }
        else if (value.length < 3) {
            registerName.classList.add("is-invalid")
            feedbackName.innerHTML = "The name is too Short"
        } else {
            registerName.classList.remove("is-invalid")
            registerName.classList.add("is-valid")
            feedbackName.innerHTML = "Too Short"
        }
    }
}
function usernameValidation() {
    registerUsername.onblur = e => {
        let value = registerUsername.value.trim()
        if (value === "") {
            registerUsername.classList.add("is-invalid")
            registerUsername.classList.remove("is-valid")
            feedbackUsername.innerHTML = "Write a username"
        }
        else if (value.length < 3) {
            registerUsername.classList.add("is-invalid")
            registerUsername.classList.remove("is-valid")
            feedbackUsername.innerHTML = "The username is too Short"
        } else {
            registerUsername.classList.remove("is-invalid")
            registerUsername.classList.add("is-valid")
            feedbackUsername.innerHTML = "Too Short"
        }
    }
}
function passwordValidation() {
    let registerPassword = document.getElementById("password-register")
    let feedbackPassword = document.getElementById("password-register-feedback")
    let lowerCases = /[a-z]/g;
    let upperCases = /[A-Z]/g;
    let numbers = /[0-9]/g;

    registerPassword.onblur = e => {
        let value = registerPassword.value.trim()
        if (value === "") {
            registerPassword.classList.add("is-invalid")
            feedbackPassword.innerHTML = "Write a password"
        }
        else if (value.length < 8) {
            registerPassword.classList.add("is-invalid")
            feedbackPassword.innerHTML = "The password is too Short"
        }
        else if (!value.match(lowerCases)) {
            registerPassword.classList.add("is-invalid")
            feedbackPassword.innerHTML = "The password should has lower cases letters"
        }
        else if (!value.match(upperCases)) {
            registerPassword.classList.add("is-invalid")
            feedbackPassword.innerHTML = "The password should has upper cases letters"
        } else if (!value.match(numbers)) {
            registerPassword.classList.add("is-invalid")
            feedbackPassword.innerHTML = "The password should has numbers"
        } else {
            registerPassword.classList.remove("is-invalid")
            registerPassword.classList.add("is-valid")
        }
    }
}
function confirmPasswordValidation() {
    let registerConfirmPassword = document.getElementById("confirm-password-register")
    let registerPassword = document.getElementById("password-register")
    let feedbackConfirmPassword = document.getElementById("confirm-password-register-feedback")
    registerConfirmPassword.onblur = e => {
        let value1 = registerConfirmPassword.value.trim()
        let value2 = registerPassword.value.trim()
        if (value1 === "") {
            registerConfirmPassword.classList.add("is-invalid")
            feedbackConfirmPassword.innerHTML = "Write password"
        }
        else if (value1 !== value2) {
            registerConfirmPassword.classList.add("is-invalid")
            feedbackConfirmPassword.innerHTML = "Passwords are not the same"
        }
        else {
            registerConfirmPassword.classList.add("is-valid")
            registerConfirmPassword.classList.remove("is-invalid")
        }

    }
}
function submit() {
    document.getElementById("register").onsubmit = e => {
        e.preventDefault()
        let inputs = document.querySelectorAll("#register input");
        let name = inputs[0].value;
        let username = inputs[1].value;
        let email = inputs[2].value;
        let password = inputs[3].value;
        let profileImage = inputs[5].files[0]
        console.log(profileImage)
        let valid = true
        for (let i of inputs) {
            console.log(i.value)
            if (i.classList.contains("is-invalid")) {
                valid = false
            }
        }
        if (valid) {
            let formData = new FormData()
            formData.append("name", name)
            formData.append("username", username)
            formData.append("email", email)
            formData.append("password", password)
            if (profileImage != undefined) {
                formData.append("image", profileImage)
            }
            axios.post(`https://tarmeezacademy.com/api/v1/register`, formData).then(res => {
                console.log(res.data)
                localStorage.setItem("token", res.data.token)
                localStorage.setItem("user", JSON.stringify(res.data.user))
                window.location.href = 'http://127.0.0.1:5500/index.html'
            }).catch(err => {
                if (err.response.data.errors.username) {
                    registerUsername.classList.add("is-invalid")
                    registerUsername.classList.remove("is-valid")
                    feedbackUsername.innerHTML = err.response.data.errors.email[0]
                }
                if (err.response.data.errors.email) {
                    emailRegister.classList.add("is-invalid")
                    emailRegister.classList.remove("is-valid")
                    feedbackEmail.innerHTML = err.response.data.errors.email[0]
                }
            })
        }
    }
    document.getElementById("login").onsubmit = e => {
        e.preventDefault()
        let aUsername = document.getElementById("login-email")
        let aPassword = document.getElementById("login-password")
        let username = aUsername.value
        let password = aPassword.value
        let params = {
            "username": username,
            "password": password
        }
        axios.post("https://tarmeezacademy.com/api/v1/login", params).then(res => {
            localStorage.setItem("token", res.data.token)
            localStorage.setItem("user", JSON.stringify(res.data.user))
            window.location.href = 'http://127.0.0.1:5500/index.html'
        }).catch(err => {
            let toastDiv = document.getElementById("toast-post")
            toastDiv.innerHTML =
                `
            <div class="toast-header p-3" style="background-color: #212529; color: white">
                <img src="https://cdn3.iconfinder.com/data/icons/simple-web-navigation/165/cross-512.png" class="rounded me-2" alt="..."
                    style="width: 20px; height: 20px;">
                <strong class="me-auto">Password or email are wrong</strong>
            </div>
            `
            let toast = new bootstrap.Toast(toastDiv)
            toast.show()
        })
    }
}
function loginToRegister() {
    document.getElementById("new-account-question").addEventListener("click", e => {
        document.getElementById("login").classList.add("d-none")
        document.getElementById("register").classList.remove("d-none")
    })
    document.getElementById("have-question").addEventListener("click", e => {
        document.getElementById("register").classList.add("d-none")
        document.getElementById("login").classList.remove("d-none")
    })
}
function emailValidation() {
    emailRegister.onblur = e => {
        let rgx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (!emailRegister.value.match(rgx)) {
            emailRegister.classList.add("is-invalid")
            emailRegister.classList.remove("is-valid")
        }
        else {
            emailRegister.classList.add("is-valid")
            emailRegister.classList.remove("is-invalid")
        }
    }
}
function loadingPage() {
    window.addEventListener("load", e => {
        document.querySelector('.loading-div').style.display = "none"
    })
}
loadingPage()
nameValidation()
usernameValidation()
passwordValidation()
confirmPasswordValidation()
emailValidation()
loginToRegister()
submit()
