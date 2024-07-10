
let page = 1;
let imgUser;
function loadingPage() {
    window.addEventListener("load", e => {
        document.querySelector('.loading-div1').style.display = "none"
    })
}
function textareaAutoHeight() {
    let textareas = document.querySelectorAll(".textarea");
    for (let textarea of textareas) {
        textarea.addEventListener("keyup", (e) => {
            e.target.style.height = "auto";
            let h = e.target.scrollHeight;
            e.target.style.height = `${h}px`;
        });
    }
}
function uploadImage() {
    //Upload Image
    document.getElementById("img-file-post").onchange = _ => {
        document.getElementById("image-post-preview").src = URL.createObjectURL(document.getElementById("img-file-post").files[0]);
        document.querySelector(
            ".main-page .create-post .images .image"
        ).style.display = "block";
    };
    // Remove Image Event
    document.getElementById("remove-img").addEventListener("click", _ => {
        document.querySelector(
            ".main-page .create-post .images .image"
        ).style.display = "none";
        document.getElementById("image-post-preview").src = "";
    });
}
function toolTipBootstrap() {
    const tooltipTriggerList = document.querySelectorAll(
        '[data-bs-toggle="tooltip"]'
    );
    const tooltipList = [...tooltipTriggerList].map(
        (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
    );
}
function getPosts() {
    let spinner = document.getElementById("loading-spinner");
    spinner.classList.remove("d-none");
    spinner.classList.add("d-flex");
    axios
        .get(`https://tarmeezacademy.com/api/v1/posts?page=${page}`)
        .then((res) => {
            spinner.classList.remove("d-flex");
            spinner.classList.add("d-none");
            spinner.style.display = "none !important";
            let posts = res.data.data;
            for (data of posts) {
                let author = data.author;
                let authorImg = author.profile_image;
                let postImg = data.image;
                if (authorImg == "[object Object]")
                    authorImg = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                document.getElementById("posts-container").innerHTML += `
                    <div class="card mb-2">
                                <!-- Post Header  -->
                                <div class="card-header d-flex align-items-center justify-content-between">
                                    <div class="user profile-event" data-id=${data.author.id} role="button">
                                        <img src="${authorImg}"
                                            alt="">
                                        <b class="username">${author.username}</b>
                                    </div>
                                    <p data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Tuesday, July 2, 2024"
                                        class="post-date" style="width: fit-content; margin: 0; color: rgb(142, 142, 142);">${data.created_at}</p>
                                </div>
                                <!-- Post Image   -->
                                <img id="image-${data.id}" src=".." data-id=${data.id} style="max-height: 600px; object-fit: cover; cursor: pointer;"
                                    class="card-img-top post-image-1" alt="..." data-bs-toggle="modal" data-bs-target="#exampleModal">
                                <!-- Post Body  -->
                                <div class="card-body" data-id=${data.id} style="cursor: pointer;">
                                    <p class="card-text" style="cursor: auto;" >${data.body}</p>
                                </div>
                                <!-- Post Footer  -->
                                <div class="card-footer">
                                    <p class="d-inline-flex gap-1 comments-p">
                                        <a id="comment-click-${data.id}" data-id=${data.id} class="comments comments-event"  role="button"
                                            aria-expanded="false" aria-controls="collapseExample" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                            <i class="fa-solid fa-comment" style="pointer-events: none;"></i> (${data.comments_count}) 
                                        </a>
                                    </p>
                                    <!-- Comments  -->
                                    <div class="collapse pb-2" id="${data.id}">
                                        <div class="comments-section">
                                            <!-- Write Comment  -->
                                            <div class="write-comment">
                                                <img class="user-img" src="images/user.jpg" alt="">
                                                <textarea id="post-textarea" class="textarea" name=""
                                                    placeholder="Write comment"></textarea>
                                            </div>
                                            <!-- Users Comments  -->
                                            <div class="comments-users" id="comments-container-${data.id}">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                `
                    ;
                if (postImg != "[object Object]")
                    document.getElementById(`image-${data.id}`).src = postImg
                else document.getElementById(`image-${data.id}`).remove()
                page++;
                toolTipBootstrap();
            }
            profileEvents()
            modal()
        })
        .catch((err) => {
            console.log(err);
        });
}
function modal() { //Using in getPosts()
    let comments = document.querySelectorAll(".comments-p , .post-image-1");
    for (let comment of comments) {
        comment.addEventListener("click", e => {
            document.getElementById("exampleModal").innerHTML =
                `         
                <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered" style="max-width: 800px;">
                    <div class="modal-content overflow-hidden p-2">
                        <div class="modal-header p-2">
                            <span class="placeholder" style="height: 40px; width: 40px; border-radius: 20px;"></span>
                            <span class="placeholder col-2 ms-2"></span>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body p-0">
                            <p aria-hidden="true">
                                <span class="placeholder col-6"></span>
                            </p>
                        </div>
                        <div class="modal-footer card-footer" style="background-color: #f8f8f8;">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
                `
            axios.get("https://tarmeezacademy.com/api/v1/posts/" + e.target.dataset.id).then(res => {
                let data = res.data.data
                let authorImg = data.author.profile_image;
                let postImg = data.image;
                if (authorImg == "[object Object]")
                    authorImg = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                document.getElementById("exampleModal").innerHTML =
                    `
                    <div class="modal-dialog" style="max-width: 800px;">
                        <div class="modal-content overflow-hidden">
                            <div class="modal-header p-2 pe-3">
                                <div class="user profile-event" data-id=${data.author.id} role="button">
                                    <img src="${authorImg}" alt="">
                                    <b class="username">${data.author.username}</b>
                                </div>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body p-0">
                                <div class="image-div-modal">
                                    <img id="image-${data.id}" src="${postImg}"
                                        style="max-height: 800px; object-fit: cover; cursor: pointer;" class="card-img-top"
                                        alt="...">
                                </div>
                                <div class="body-post-modal p-3">
                                    ${data.body}
                                </div>
                                <div class="comments-section  p-3">
                                    <!-- Write Comment  -->
                                    <div class="write-comment">
                                        <img class="user-img" src="${imgUser}" alt="">
                                        <div class="w-100 position-relative">
                                        <textarea id="comment-textarea" class="textarea" name=""
                                            placeholder="Write comment"></textarea>
                                        <span class="material-symbols-rounded" id="comment-button" data-id=${data.id}>
                                        send
                                        </span>
                                        </div>
                                    </div>
                                    <!-- Users Comments  -->
                                    <div class="comments-users" id="comments-container">
                                    </div>
                                </div>
                                <!-- <p aria-hidden="true">
                                    <span class="placeholder col-6"></span>
                                </p> -->
                            </div>

                        </div>
                    </div>
                    `
                if (postImg == "[object Object]")
                    document.getElementById("image-" + data.id).remove();
                let commentsArray = data.comments
                for (let c of commentsArray) {
                    let authorImg = c.author.profile_image;
                    if (authorImg == "[object Object]")
                        authorImg = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                    document.getElementById("comments-container").innerHTML +=
                        `
                            <div class="comment-user d-flex gap-2">
                                <img class="user-img profile-event" data-id=${c.author.id} data-bs-toggle="tooltip" data-bs-placement="top"
                                    data-bs-title="${c.author.username}" src="${authorImg}" alt="">
                                <p class="comment">
                                    ${c.body}
                                </p>
                            </div>
                        `
                    toolTipBootstrap()
                }
                profileEvents()
                textareaAutoHeight()
                createComment()
            })//axios end
        })//event end
    }//loop end
}
function pagination() {
    window.addEventListener("scroll", (_) => {
        if (window.scrollY + window.innerHeight >= document.body.offsetHeight)
            getPosts();
    });
}

function establish() {
    if (localStorage.getItem("token") == null || localStorage.getItem("user") == null) {
        window.location.href = "./login.html"
    }
    setProfileDatasetId()
    imgUser = JSON.parse(localStorage.getItem("user")).profile_image;
    if (imgUser == "[object Object]") imgUser = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    document.getElementById("home-img-user").src = imgUser
}
function logout() {
    let logout = document.getElementById("logout");
    logout.addEventListener("click", e => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        window.location.href = "./login.html"
    })
}
function createPost() {
    let postButton = document.getElementById("post-button");
    postButton.addEventListener("click", e => {
        let textarea = document.getElementById("post-textarea");
        let image = document.getElementById("img-file-post").files[0]
        let body = textarea.value;
        let formData = new FormData();
        formData.append("body", body);
        if (image != undefined) {
            formData.append("image", image)
        }
        textarea.value = ''
        document.querySelector(
            ".main-page .create-post .images .image"
        ).style.display = "none";
        document.getElementById("image-post-preview").src = "";

        axios.post("https://tarmeezacademy.com/api/v1/posts", formData, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then(res => {
            let toastDiv = document.getElementById("toast-post")
            toastDiv.innerHTML =
                `
            <div class="toast-header p-3" style="background-color: #212529; color: white">
                <img src="https://cdn-icons-png.flaticon.com/256/7915/7915256.png" class="rounded me-2" alt="..."
                    style="width: 20px; height: 20px;">
                <strong class="me-auto">The Post created successfully</strong>
            </div>
            `
            let toast = new bootstrap.Toast(toastDiv)
            toast.show()
        }).catch(_ => {
            let toastDiv = document.getElementById("toast-post")
            toastDiv.innerHTML =
                `
            <div class="toast-header p-3" style="background-color: #212529; color: white">
                <img src="https://cdn3.iconfinder.com/data/icons/simple-web-navigation/165/cross-512.png" class="rounded me-2" alt="..."
                    style="width: 20px; height: 20px;">
                <strong class="me-auto">Something went wrong, Pleases try again</strong>
            </div>
            `
            let toast = new bootstrap.Toast(toastDiv)
            toast.show()
        })
    })
}
function createComment() {//Using in getPosts()
    let span = document.getElementById('comment-button')
    span.addEventListener("click", e => {
        let textarea = document.getElementById("comment-textarea")
        let body = textarea.value;
        textarea.value = ""
        axios.post(`https://tarmeezacademy.com/api/v1/posts/${span.dataset.id}/comments`, { "body": body }, {
            headers:
            {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then(res => {
            let toastDiv = document.getElementById("toast-post")
            toastDiv.innerHTML =
                `
            <div class="toast-header p-3" style="background-color: #212529; color: white">
                <img src="https://cdn-icons-png.flaticon.com/256/7915/7915256.png" class="rounded me-2" alt="..."
                    style="width: 20px; height: 20px;">
                <strong class="me-auto">The Comment created successfully</strong>
            </div>
            `
            let toast = new bootstrap.Toast(toastDiv)
            toast.show()
        }).catch(_ => {
            let toastDiv = document.getElementById("toast-post")
            toastDiv.innerHTML =
                `
            <div class="toast-header p-3" style="background-color: #212529; color: white">
                <img src="https://cdn3.iconfinder.com/data/icons/simple-web-navigation/165/cross-512.png" class="rounded me-2" alt="..."
                    style="width: 20px; height: 20px;">
                <strong class="me-auto">Something went wrong, Pleases try again</strong>
            </div>
            `
            let toast = new bootstrap.Toast(toastDiv)
            toast.show()
        })
    })
}
function setProfileDatasetId() {
    document.getElementById("profile-link").setAttribute("data-id", JSON.parse(localStorage.getItem("user")).id)
}
function profileEvents() {
    let profiles = document.querySelectorAll(".profile-event");
    for (let profile of profiles) {
        profile.addEventListener("click", e => {
            sessionStorage.setItem("id", profile.dataset.id)
            window.location.href = "./profile.html"
        })
    }
}
establish();
profileEvents()
loadingPage()
logout();
toolTipBootstrap();
uploadImage();
textareaAutoHeight();
getPosts();
createPost();
pagination();
