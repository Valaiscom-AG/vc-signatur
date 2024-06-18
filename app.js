document.addEventListener("DOMContentLoaded", function () {
    const signatureForm = document.getElementById("signatureForm");

    function saveFormInputsAsCookies(formElements) {
        for (let i = 0; i < formElements.length; i++) {
            const element = formElements[i];

            if (element.id && element.type !== "file") {
                document.cookie = `${element.id}=${element.value}; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/`;
            }
        }
    }

    function applyValuesFromCookies(formElements, getDisplayElement) {
        function updateElementValues(element, displayElement) {
            const inputValue = element.value;

            document.cookie = `${element.id}=${inputValue}; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/`;
            displayElement.textContent = inputValue;
        }

        for (let i = 0; i < formElements.length; i++) {
            const element = formElements[i];

            if (element.id && element.type !== "file") {
                element.addEventListener("input", () => {
                    updateElementValues(element, getDisplayElement(element.id));
                    saveFormInputsAsCookies(formElements); // Save form inputs on each input change
                });

                const cookieValue = getCookie(element.id);

                if (cookieValue !== "") {
                    element.value = cookieValue;
                }

                updateElementValues(element, getDisplayElement(element.id));
            }
        }
    }

    function getCookie(cookieName) {
        const name = cookieName + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookieArray = decodedCookie.split(";");

        for (let i = 0; i < cookieArray.length; i++) {
            let cookie = cookieArray[i].trim();

            if (cookie.indexOf(name) == 0) {
                return cookie.substring(name.length, cookie.length);
            }
        }

        return "";
    }

    function getDisplayElement(formElementId) {
        switch (formElementId) {
            case "vorname":
                return document.getElementById("displayVorname");
            case "nachname":
                return document.getElementById("displayNachname");
            case "jobtitle":
                return document.getElementById("displayJobtitle");
            case "floatingSelect":
                return document.getElementById("displayAbteilung");
            case "buero-tel":
                return document.getElementById("displayBueroTel");
            case "priv-tel":
                return document.getElementById("displayPrivTel");
            case "email":
                return document.getElementById("displayEmail");
            case "pensum":
                return document.getElementById("displayPensum");
            default:
                return null;
        }
    }

    // Add event listener to form for applying values from cookies on page load
    applyValuesFromCookies(signatureForm.elements, getDisplayElement);

    // Save form inputs as cookies every second
    setInterval(() => saveFormInputsAsCookies(signatureForm.elements), 1000);

    const vornameInput = document.getElementById("vorname");
    const nachnameInput = document.getElementById("nachname"); // Added nachname input
    const profileImage = document.getElementById("profileImage");

    function updateProfileImage() {
        const firstnameValue = vornameInput.value.trim();
        const lastnameValue = nachnameInput.value.trim();

        if (firstnameValue !== "") {
            let imageUrl = `Profil/${firstnameValue}.png`;

            // Check if the image with vorname exists, if not, try with both values
            if (!imageExists(imageUrl)) {
                imageUrl = `https://vc-sign.netlify.app/Profil/${lastnameValue}%20${firstnameValue}.png`;
            }

            profileImage.src = imageUrl;
        }
    }

    function imageExists(url) {
        const http = new XMLHttpRequest();
        http.open("HEAD", url, false);
        http.send();
        return http.status !== 404;
    }

    vornameInput.addEventListener("input", updateProfileImage);
    nachnameInput.addEventListener("input", updateProfileImage); // Added event listener for nachname
    setInterval(updateProfileImage, 1000);

});
