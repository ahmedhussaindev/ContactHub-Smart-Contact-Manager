// Inputs
var contactName = document.getElementById("contact-name");
var contactPhone = document.getElementById("contact-phone");
var contactEmail = document.getElementById("contact-email");
var contactLocation = document.getElementById("contact-location");
var contactGroup = document.getElementById("contact-group");
var contactNotes = document.getElementById("contact-notes");
var favoriteCheck = document.getElementById("favorite-check");
var emergencyCheck = document.getElementById("emergency-check");

// image
var contactImageInput = document.getElementById("contact-image-input");

// Buttons
var addContactBtn = document.getElementById("add-contact");
var saveBtn = document.getElementById("save-contact");
var cancelBtn = document.getElementById("cancel");
var exitBtn = document.getElementById("exit-btn");

// Form
var formSection = document.getElementById("form-section");

// Search
var searchInput = document.getElementById("search-input");
searchInput.onkeyup = searchContact;

//no content yet 
var noContact = document.getElementById("no-contact");
var noFavorites = document.getElementById("no-favorites");
var noEmergency = document.getElementById("no-emergency");

// alert
var nameError = document.getElementById("contact-name-error");
var phoneError = document.getElementById("contact-phone-error");
var emailError = document.getElementById("contact-mail-error");

// counters
var totalContact = document.getElementById("total-contact-text");
var favoriteCounter = document.getElementById("favorites-contact");
var emergencyCounter = document.getElementById("emergency-contact");

// containers 
var favoritesContainer = document.getElementById("favorites-contact-container");
var emergencyContainer = document.getElementById("emergency-contact-container");

// Data
var contactList = [];
var currentIndex;


function createContact() {

    if (contactName.value == "") {
        Swal.fire({
            icon: "error",
            title: "Missing Name",
            text: "Please enter a name for the contact!"
        });
        return;
    }

    if (!validateName()) {
        Swal.fire({
            icon: "error",
            title: "Invalid Name",
            text: "Name should contain only letters and spaces (2-50 characters)"
        });
        return;
    }

    if (contactPhone.value == "") {
        Swal.fire({
            icon: "error",
            title: "Missing Phone",
            text: "Please enter a phone number!"
        });
        return;
    }

    if (!validatePhone()) {
        Swal.fire({
            icon: "error",
            title: "Invalid Phone",
            text: "Please enter a valid Egyptian phone number (e.g., 01012345678 or +201012345678)"
        });
        return;
    }

    if (contactEmail.value != "") {
        if (!validateEmail()) {
            Swal.fire({
                icon: "error",
                title: "Invalid Email",
                text: "Please enter a valid email address"
            });
            return;
        }
    }

    if (checkDuplicatePhone()) {
        return;
    }

    var contact = {
        name: contactName.value,
        phone: contactPhone.value,
        email: contactEmail.value,
        location: contactLocation.value,
        group: contactGroup.value,
        notes: contactNotes.value,
        favorite: favoriteCheck.checked,
        emergency: emergencyCheck.checked,
        image: contactImageInput.files[0] ? "images/" + contactImageInput.files[0].name : ""
    };

    if (saveBtn.innerText.includes("Update")) {

        contactList.splice(currentIndex, 1, contact);
        saveBtn.innerHTML = `
        <i class="fa-solid fa-check"></i>
        <span>Save Contact</span>
    `;
    }
    else {
        contactList.push(contact);
    }

    localStorage.setItem("contacts", JSON.stringify(contactList));

    displayContacts();
    displayFavorites();
    displayEmergency();
    updateCounters();
    closeForm();
    Swal.fire({
        icon: "success",
        title: "Success",
        text: "Contact has been added successfully."
    });
}


if (localStorage.getItem("contacts") != null) {
    contactList = JSON.parse(localStorage.getItem("contacts"));
}

displayContacts();
displayFavorites();
displayEmergency();

// open form
addContactBtn.onclick = openForm;
function openForm() {
    formSection.classList.remove("d-none");
}

// close form
exitBtn.onclick = closeForm;
cancelBtn.onclick = closeForm;
function closeForm() {
    formSection.classList.add("d-none");
    clearForm();
}

// save form
saveBtn.onclick = function (e) {
    e.preventDefault();
    createContact();
}

// clearForm
function clearForm() {
    contactName.value = "";
    contactPhone.value = "";
    contactEmail.value = "";
    contactLocation.value = "";
    contactGroup.selectedIndex = 0;
    contactNotes.value = "";
    favoriteCheck.checked = false;
    emergencyCheck.checked = false;
    contactImageInput.value = "";
    contactImageInput.value = "";
}

function displayContacts() {
    var box = "";
    for (var i = 0; i < contactList.length; i++) {
        var imageBox = "";
        if (contactList[i].image != "") {
            imageBox = `
                <img class="w-100 h-100 rounded-3"
                src="${contactList[i].image}">
            `;
        }
        else {
            var names = contactList[i].name.split(" ");
            var firstLetter = names[0][0].toUpperCase();
            var secondLetter = "";
            if (names.length > 1) {
                secondLetter = names[1][0].toUpperCase();
            }
            imageBox = firstLetter + secondLetter;
        }

        var favoriteIcon = "";
        var emergencyIcon = "";

        if (contactList[i].favorite) {
            favoriteIcon = `
            <i class="icn fav-icn rounded-circle white bg-warning fa-solid fa-star d-flex justify-content-center align-items-center position-absolute"></i>
            `;
        }

        if (contactList[i].emergency) {
            emergencyIcon = `
            <i class="icn emr-icn rounded-circle white bg-danger fa-solid fa-heart-pulse d-flex justify-content-center align-items-center position-absolute"></i>
            `;
        }

        var groupBox = "";
        if (contactList[i].group == "family") {
            groupBox = `
            <span class="bg-primary-subtle text-primary px-2 py-1 rounded-3">
                <span class="fs-xs fw-medium">Family</span>
            </span>`;
        }
        else if (contactList[i].group == "friends") {
            groupBox = `
            <span class="bg-success-subtle text-success px-2 py-1 rounded-3">
                <span class="fs-xs fw-medium">Friends</span>
            </span>`;
        }
        else if (contactList[i].group == "work") {
            groupBox = `
            <span id="categ-work" class="work px-2 py-1 rounded-3">
                <span class="fs-xs fw-medium">Work</span>
            </span>`;
        }
        else if (contactList[i].group == "school") {
            groupBox = `
            <span id="categ-school" class="school px-2 py-1 rounded-3">
                <span class="fs-xs fw-medium">School</span>
            </span>`;
        }
        else if (contactList[i].group == "other") {
            groupBox = `
            <span id="categ-other" class="dark-gray bg-light-gray px-2 py-1 rounded-3">
                <span class="fs-xs fw-medium">Other</span>
            </span>`;
        }

        var emergencyBox = "";
        if (contactList[i].emergency) {
            emergencyBox = `
            <span id="categ-emergancy" class="bg-danger-subtle text-danger px-2 py-1 rounded-3">
                <i class="fa-solid fa-heart-pulse fs-xxs"></i>
                <span class="fs-xs fw-medium">Emergency</span>
            </span>
            `;
        }

        var favoriteBtn = "";
        var emergencyBtn = "";

        if (contactList[i].favorite == true) {
            favoriteBtn = "fa-solid fa-star text-warning";
        }
        else {
            favoriteBtn = "fa-regular fa-star";
        }

        if (contactList[i].emergency == true) {
            emergencyBtn = "fa-solid fa-heart text-danger";
        }
        else {
            emergencyBtn = "fa-regular fa-heart";
        }

        var favoriteBtnClass = "";
        var emergencyBtnClass = "";
        if (contactList[i].favorite) {
            favoriteBtnClass = "bg-warning-subtle";
        }
        else {
            favoriteBtnClass = "";
        }

        if (contactList[i].emergency) {
            emergencyBtnClass = "bg-danger-subtle";
        }
        else {
            emergencyBtnClass = "";
        }

        box += `
       <div class="col-12 col-sm-6">
            <div class="contact-card cards bg-white rounded-4">
                <div class="card-top rounded-top-4">
                    <div class="d-flex gap-3 align-items-center mb-3">
                        <div class="position-relative card-img shadow-sm rounded-3 bg-primary d-flex justify-content-center align-items-center white fs-lg fw-semibold">
                            ${imageBox}
                            ${favoriteIcon}
                            ${emergencyIcon}
                        </div>
                        <div>
                            <p class="contact-name m-0 mb-1 semi-black fw-bold fs-md">${contactList[i].name}</p>
                            <div class="d-flex align-items-center gap-2">
                                <i class="phone-icon fa-solid fa-phone text-primary bg-primary-subtle d-flex justify-content-center align-items-center rounded-2 fs-xxs"></i>
                                <p class="m-0 sub-gray fs-sm nubmer-text">${contactList[i].phone}</p>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex align-items-center gap-2 mb-2">
                    <i class="mail-icn mail-link-icn catg-icn fa-solid fa-envelope rounded-2 d-flex justify-content-center align-items-center"></i>
                    <span class="mail-text dark-gray fs-sm">${contactList[i].email}</span>
                    </div>
                    <div class="d-flex align-items-center gap-2 mb-3">
                        <i class="location-icn catg-icn fa-solid fa-location-dot rounded-2 d-flex justify-content-center align-items-center"></i>
                        <span class="location-text dark-gray fs-sm">${contactList[i].location}</span>
                    </div>
                    <div class="contact-category d-flex flex-wrap gap-2">
                        ${groupBox}
                        ${emergencyBox}
                    </div>
                </div>
                <div class="card-bottom rounded-bottom-4 d-flex align-items-center justify-content-between">
                    <div id="tel-contact" class="d-flex gap-2">
                        <a class="tel-link tel rounded-3 bg-success-subtle text-success text-decoration-none d-flex justify-content-center align-items-center" href="tel:${contactList[i].phone}"><i class="fa-solid fa-phone fa-xs"></i></a>
                        <a id="mailto" class="mail-icn mail-link rounded-3 text-decoration-none d-flex justify-content-center align-items-center" href="mailto:${contactList[i].email}"><i class="fa-solid fa-envelope fa-xs"></i></a>
                    </div>
                    <div class="itaraction-btn d-flex align-items-center gap-2">
                        <button onclick="toggleFavorite(${i})" class="rounded-3 fav-bt border-0 ${favoriteBtnClass}"><i class="${favoriteBtn}"></i></button>
                        <button onclick="toggleEmergency(${i})" class="rounded-3 emrg-bt border-0 ${emergencyBtnClass}"><i class="${emergencyBtn}"></i></button>
                        <button onclick="setUpdateContact(${i})" class="rounded-3 edit-bt border-0 sub-gray"><i class="fa-solid fa-pen"></i></button>
                        <button onclick="deleteContact(${i})" class="rounded-3 delete-bt border-0 sub-gray"><i class="fa-solid fa-trash"></i></button>
                    </div> 
                </div>
            </div>
        </div>
        `;
    }
    if (contactList.length == 0) {
        noContact.classList.remove("d-none");
    }
    else {
        noContact.classList.add("d-none");
    }
    document.getElementById("contacts-container").innerHTML = box;
    updateCounters();
}

// check name pattern
contactName.oninput = validateName;
function validateName() {

    var regex = /^[A-Za-z ]{2,50}$/;

    if (regex.test(contactName.value)) {
        nameError.classList.add("d-none");
        return true;
    }
    else {
        if (contactName.value.length > 0)
            nameError.classList.remove("d-none");
        return false;
    }
}

// check phone pattern
contactPhone.oninput = validatePhone;
function validatePhone() {

    var regex = /^01[0125][0-9]{8}$/;

    if (regex.test(contactPhone.value)) {
        phoneError.classList.add("d-none");
        return true;
    }
    else {
        if (contactPhone.value.length > 0)
            phoneError.classList.remove("d-none");
        return false;
    }
}

// check mail pattern
contactEmail.oninput = validateEmail;
function validateEmail() {

    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (regex.test(contactEmail.value)) {
        emailError.classList.add("d-none");
        return true;
    }
    else {
        if (contactEmail.value.length > 0)
            emailError.classList.remove("d-none");
        return false;
    }
}

//  check duplicate
function checkDuplicatePhone() {
    for (var i = 0; i < contactList.length; i++) {

        if (contactPhone.value == contactList[i].phone && i == currentIndex) {
            continue;
        }
        if (contactPhone.value == contactList[i].phone) {
            Swal.fire({
                icon: "error",
                title: "Duplicate Phone",
                text: "A contact with this phone number already exists: " + contactList[i].name
            });
            return true;
        }
    }
    return false;
}

function updateCounters() {
    var favoriteCount = 0;
    var emergencyCount = 0;

    totalContact.innerHTML = contactList.length;

    for (var i = 0; i < contactList.length; i++) {
        if (contactList[i].favorite == true) {
            favoriteCount++;
        }
        if (contactList[i].emergency == true) {
            emergencyCount++;
        }
    }
    favoriteCounter.innerHTML = favoriteCount;
    emergencyCounter.innerHTML = emergencyCount;
}

// delete contact
function deleteContact(index) {
    Swal.fire({
        title: "Delete Contact?",
        text: "Are you sure you want to delete " + contactList[index].name + "? This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#dc3545"
    }).then(function (result) {
        if (result.isConfirmed) {
            contactList.splice(index, 1);
            localStorage.setItem("contacts", JSON.stringify(contactList));

            displayContacts();
            displayFavorites();
            displayEmergency();
            updateCounters();

            Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: "Contact deleted successfully."
            });
        }
    });
}

function setUpdateContact(index) {

    currentIndex = index;

    contactName.value = contactList[index].name;
    contactPhone.value = contactList[index].phone;
    contactEmail.value = contactList[index].email;
    contactLocation.value = contactList[index].location;
    contactGroup.value = contactList[index].group;
    contactNotes.value = contactList[index].notes;
    favoriteCheck.checked = contactList[index].favorite;
    emergencyCheck.checked = contactList[index].emergency;
    saveBtn.innerHTML = `
        <i class="fa-solid fa-pen"></i>
        <span>Update Contact</span>
    `;
    openForm();
}

function toggleFavorite(index) {

    if (contactList[index].favorite == true) {
        contactList[index].favorite = false;
    }
    else {
        contactList[index].favorite = true;
    }

    localStorage.setItem("contacts", JSON.stringify(contactList));
    displayContacts();
    displayFavorites();
    updateCounters();
}

function toggleEmergency(index) {

    if (contactList[index].emergency == true) {
        contactList[index].emergency = false;
    }
    else {
        contactList[index].emergency = true;
    }

    localStorage.setItem("contacts", JSON.stringify(contactList));
    displayContacts();
    displayEmergency();
    updateCounters();
}

function displayFavorites() {

    var box = "";

    for (var i = 0; i < contactList.length; i++) {

        if (contactList[i].favorite == true) {

            var imageBox = "";

            if (contactList[i].image != "") {
                imageBox = `
                    <img class="w-100 h-100 rounded-3"
                    src="${contactList[i].image}">
                `;
            }
            else {
                var names = contactList[i].name.split(" ");
                var firstLetter = names[0][0].toUpperCase();
                var secondLetter = "";

                if (names.length > 1) {
                    secondLetter = names[1][0].toUpperCase();
                }
                imageBox = firstLetter + secondLetter;
            }

            box += `
            <div class="col-12">
                <div class="favorites-contact-item px-3 py-2 d-flex justify-content-between align-items-center rounded-4">
                    <div class="d-flex align-items-center gap-3">
                        <div class="d-flex justify-content-center align-items-center fav-contact rounded-3 white fw-semibold bg-primary">
                            ${imageBox}
                        </div>
                        <div>
                            <p class="contact-name m-0 semi-black fw-bold fs-6">${contactList[i].name}</p>
                            <p class="m-0 sub-gray fs-sm number-text">${contactList[i].phone}</p>
                        </div>
                    </div>
                    <div>
                        <a class="tel fav-tel rounded-3 bg-success-subtle text-success text-decoration-none d-flex justify-content-center align-items-center" href="tel:${contactList[i].phone}"><i class="fa-solid fa-phone fa-xs"></i></a>
                    </div>
                </div>
            </div>
            `;
        }
    }

    favoritesContainer.innerHTML = box;

    if (box == "") {
        noFavorites.classList.remove("d-none");
    }
    else {
        noFavorites.classList.add("d-none");
    }

}

function displayEmergency() {

    var box = "";

    for (var i = 0; i < contactList.length; i++) {

        if (contactList[i].emergency == true) {

            var imageBox = "";

            if (contactList[i].image != "") {
                imageBox = `
                    <img class="w-100 h-100 rounded-3"
                    src="${contactList[i].image}">
                `;
            }
            else {
                var names = contactList[i].name.split(" ");
                var firstLetter = names[0][0].toUpperCase();
                var secondLetter = "";

                if (names.length > 1) {
                    secondLetter = names[1][0].toUpperCase();
                }
                imageBox = firstLetter + secondLetter;
            }

            box += `
            <div class="col-12">
                <div class="emergency-contact-item px-3 py-2 d-flex justify-content-between align-items-center rounded-4">
                    <div class="d-flex align-items-center gap-3">
                        <div class="d-flex justify-content-center align-items-center fav-contact rounded-3 white fw-semibold bg-primary">
                             ${imageBox}
                        </div>
                        <div>
                            <p class="contact-name m-0 semi-black fw-bold fs-6">${contactList[i].name}</p>
                            <p class="m-0 sub-gray fs-sm number-text">${contactList[i].phone}</p>
                        </div>
                    </div>
                <div>
                    <a class="tel emrg-tel rounded-3 bg-danger-subtle text-danger text-decoration-none d-flex justify-content-center align-items-center" href="tel:"><i class="fa-solid fa-phone fa-xs"></i></a>
                    </div>
                </div>
            </div>
            `;
        }
    }

    emergencyContainer.innerHTML = box;

    if (box == "") {
        noEmergency.classList.remove("d-none");
    }
    else {
        noEmergency.classList.add("d-none");
    }

}

function searchContact() {

    var box = "";

    for (var i = 0; i < contactList.length; i++) {

        if (
            contactList[i].name.toLowerCase().includes(searchInput.value.toLowerCase()) ||
            contactList[i].phone.includes(searchInput.value) ||
            contactList[i].email.toLowerCase().includes(searchInput.value.toLowerCase())
        ) {
            var imageBox = "";
            if (contactList[i].image != "") {
                imageBox = `
                    <img class="w-100 h-100 rounded-3"
                    src="${contactList[i].image}">
                `;
            } else {
                var names = contactList[i].name.split(" ");
                var firstLetter = names[0][0].toUpperCase();
                var secondLetter = "";
                if (names.length > 1) {
                    secondLetter = names[1][0].toUpperCase();
                }
                imageBox = firstLetter + secondLetter;
            }

            var favoriteIcon = "";
            var emergencyIcon = "";

            if (contactList[i].favorite) {
                favoriteIcon = `
                <i class="icn fav-icn rounded-circle white bg-warning fa-solid fa-star d-flex justify-content-center align-items-center position-absolute"></i>`;
            }

            if (contactList[i].emergency) {
                emergencyIcon = `
                <i class="icn emr-icn rounded-circle white bg-danger fa-solid fa-heart-pulse d-flex justify-content-center align-items-center position-absolute"></i>`;
            }

            var groupBox = "";
            if (contactList[i].group == "family") {
                groupBox = `
                <span class="bg-primary-subtle text-primary px-2 py-1 rounded-3">
                    <span class="fs-xs fw-medium">Family</span>
                </span>`;
            }
            else if (contactList[i].group == "friends") {
                groupBox = `
                <span class="bg-success-subtle text-success px-2 py-1 rounded-3">
                    <span class="fs-xs fw-medium">Friends</span>
                </span>`;
            }
            else if (contactList[i].group == "work") {
                groupBox = `
                <span id="categ-work" class="work px-2 py-1 rounded-3">
                    <span class="fs-xs fw-medium">Work</span>
                </span>`;
            }
            else if (contactList[i].group == "school") {
                groupBox = `
                <span id="categ-school" class="school px-2 py-1 rounded-3">
                    <span class="fs-xs fw-medium">School</span>
                </span>`;
            }
            else if (contactList[i].group == "other") {
                groupBox = `
                <span id="categ-other" class="dark-gray bg-light-gray px-2 py-1 rounded-3">
                    <span class="fs-xs fw-medium">Other</span>
                </span>`;
            }

            var emergencyBox = "";
            if (contactList[i].emergency) {
                emergencyBox = `
                <span id="categ-emergancy" class="bg-danger-subtle text-danger px-2 py-1 rounded-3">
                    <i class="fa-solid fa-heart-pulse fs-xxs"></i>
                    <span class="fs-xs fw-medium">Emergency</span>
                </span>
                `;
            }

            box += `
                <div class="col-12 col-sm-6">
                <div class="contact-card cards bg-white rounded-4">
                    <div class="card-top rounded-top-4">
                        <div class="d-flex gap-3 align-items-center mb-3">
                            <div class="position-relative card-img shadow-sm rounded-3 bg-primary d-flex justify-content-center align-items-center white fs-lg fw-semibold">
                                ${imageBox}
                                ${favoriteIcon}
                                ${emergencyIcon}
                            </div>
                            <div>
                                <p class="contact-name m-0 mb-1 semi-black fw-bold fs-md">${contactList[i].name}</p>
                                <div class="d-flex align-items-center gap-2">
                                    <i class="phone-icon fa-solid fa-phone text-primary bg-primary-subtle d-flex justify-content-center align-items-center rounded-2 fs-xxs"></i>
                                    <p class="m-0 sub-gray fs-sm nubmer-text">${contactList[i].phone}</p>
                                </div>
                            </div>
                        </div>
                        <div class="d-flex align-items-center gap-2 mb-2">
                        <i class="mail-icn mail-link-icn catg-icn fa-solid fa-envelope rounded-2 d-flex justify-content-center align-items-center"></i>
                        <span class="mail-text dark-gray fs-sm">${contactList[i].email}</span>
                        </div>
                        <div class="d-flex align-items-center gap-2 mb-3">
                            <i class="location-icn catg-icn fa-solid fa-location-dot rounded-2 d-flex justify-content-center align-items-center"></i>
                            <span class="location-text dark-gray fs-sm">${contactList[i].location}</span>
                        </div>
                        <div class="contact-category d-flex flex-wrap gap-2">
                            ${groupBox}
                            ${emergencyBox}
                        </div>
                    </div>
                    <div class="card-bottom rounded-bottom-4 d-flex align-items-center justify-content-between">
                        <div id="tel-contact" class="d-flex gap-2">
                            <a class="tel-link tel rounded-3 bg-success-subtle text-success text-decoration-none d-flex justify-content-center align-items-center" href="tel:${contactList[i].phone}"><i class="fa-solid fa-phone fa-xs"></i></a>
                            <a id="mailto" class="mail-icn mail-link rounded-3 text-decoration-none d-flex justify-content-center align-items-center" href="mailto:${contactList[i].email}"><i class="fa-solid fa-envelope fa-xs"></i></a>
                        </div>
                        <div class="itaraction-btn d-flex align-items-center gap-2">
                            <button onclick="toggleFavorite(${i})" class="rounded-3 fav-bt border-0"><i class="fa-regular fa-star"></i></button>
                            <button onclick="toggleEmergency(${i})" class="rounded-3 emrg-bt border-0"><i class="fa-regular fa-heart"></i></button>
                            <button onclick="setUpdateContact(${i})" class="rounded-3 edit-bt border-0 sub-gray"><i class="fa-solid fa-pen"></i></button>
                            <button onclick="deleteContact(${i})" class="rounded-3 delete-bt border-0 sub-gray"><i class="fa-solid fa-trash"></i></button>
                        </div> 
                    </div>
                </div>
            </div>
            `;
        }
    }

    if (box == "") {
        noContact.classList.remove("d-none");
    }
    else {
        noContact.classList.add("d-none");
    }

    document.getElementById("contacts-container").innerHTML = box;
}