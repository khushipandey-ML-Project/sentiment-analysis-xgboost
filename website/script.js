// HOME PAGE - SENTIMENT ANALYZER

const reviewInput = document.getElementById("review");
const predictBtn = document.getElementById("predicBtn");
const prediction = document.getElementById("prediction");


// EMOJI PICKER

const emojiButtons = document.querySelectorAll(".emoji-btn");

emojiButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const selectedEmoji = button.dataset.emoji;

        const start = reviewInput.selectionStart;
        const end = reviewInput.selectionEnd;

        const currentText = reviewInput.value;

        reviewInput.value =
            currentText.substring(0, start) +
            selectedEmoji +
            currentText.substring(end);

        reviewInput.focus();

        const newPosition = start + selectedEmoji.length;

        reviewInput.setSelectionRange(newPosition, newPosition);

    });

});


// SENTIMENT ANALYZER

if (reviewInput && predictBtn && prediction) {

    predictBtn.addEventListener("click", async function() {

        let review = reviewInput.value.trim();

        if (review === "") {
            alert("Please enter your social media post or comment!");
            return;
        }

        predictBtn.disabled = true;
        predictBtn.innerText = "Analyzing...";

        try {

            const response = await fetch("/predict", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    review: review
                })

            });

            const data = await response.json();

            if (!response.ok || data.error) {

                prediction.textContent =
                    data.error || "Unable to predict sentiment.";

            }

            else {

                let result = data.sentiment;

                let sentimentEmoji = "";

                if (result.toLowerCase() === "positive") {
                    sentimentEmoji = "😊";
                }

                else if (result.toLowerCase() === "negative") {
                    sentimentEmoji = "😞";
                }

                else if (result.toLowerCase() === "neutral") {
                    sentimentEmoji = "😐";
                }

                prediction.innerHTML =
                    "Your Post Sentiment: <strong>" +
                    result +
                    "</strong> " +
                    sentimentEmoji;

            }

        }

        catch (error) {

            prediction.innerText =
                "Something went wrong. Please try again.";

            console.log(error);

        }

        finally {

            predictBtn.disabled = false;
            predictBtn.innerText = "🔍 Predict Sentiment";

        }

    });

}


// NAVIGATION ACTIVE LINK

const currentPage = window.location.pathname
    .split("/")
    .pop();

const navLinks = document.querySelectorAll(".nav-links a");

navLinks.forEach(function(link) {

    const linkPage = link.getAttribute("href");

    if (linkPage === currentPage) {
        link.classList.add("active");
    }

});


// CONTACT FORM

const contactForm = document.getElementById("contactForm");

if (contactForm) {

    contactForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const name = document.getElementById("name").value;

        const message = document.getElementById("formMessage");

        message.innerText =
            "Thank you " + name + "! Your message has been received.";

        contactForm.reset();

    });

}