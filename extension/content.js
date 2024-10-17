
function addButton() {
    const targetElement = document.querySelector(".tlk-homework__mark-button");

    if (targetElement && !document.querySelector("#homework-add-button")) {

        const button = document.createElement("button");
        button.id = "homework-add-button";
        button.innerText = "Add Homework";
        button.style.padding = "10px";
        button.style.fontSize = "16px";
        button.style.marginLeft = "10px";
        button.type = "button"

        button.addEventListener("click", (event) => {
            fetch("http://localhost:8000/homeworks_add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
            })
                .then(response => response.json())
                .catch(error => {
                    console.error("Error:", error);
                    alert("Error: " + error);
                });
        });

        targetElement.parentNode.insertBefore(button, targetElement.nextSibling);
    }
}

function addCommentButton() {
    const targetComment = document.querySelector(".tlk-textarea");
    console.log("Target comment area:", targetComment); 

    if (targetComment && !document.querySelector("#comment-add-button")) {
        console.log("Adding comment button next to:", targetComment);

        const button = document.createElement("button");
        button.id = "comment-add-button";
        button.innerText = "Add Template";
        button.style.padding = "10px";
        button.style.fontSize = "16px";
        button.style.marginLeft = "10px";
        button.type = "button"

        let template = "";

        button.textContent = 'Insert Template';
        button.addEventListener("click", (event) => {
            fetch("http://localhost:8000/get_comment_template", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            })
                .then(response => response.json())
                .then(response_ => {
                    console.log("Template fetched:", response_);
                    template = response_.template;
                    targetComment.value = template.text_template;
                })
                .catch(error => {
                    console.error("Error fetching template:", error);
                });
            
            console.log('Template inserted:', template);
        });

        targetComment.parentNode.insertBefore(button, targetComment.nextSibling);
        console.log("Comment button successfully added.");
    } else if (!targetComment) {
        console.log(".tlk-textarea not found yet."); 
    }
}

function addEventListenersToRows() {
    const rows = document.querySelectorAll(".tlk-homeworks__table-row");
    console.log("Rows found:", rows.length);

    rows.forEach(row => {
        if (!row.getAttribute('data-event-added')) {
            console.log("Adding click event to row:", row);

            row.addEventListener("click", () => {
                console.log("Row clicked:", row);

                setTimeout(() => {
                    console.log("Adding buttons after delay...");
                    addButton();
                    addCommentButton();
                }, 2000);
            });

            row.setAttribute('data-event-added', 'true');
        }
    });
}

function observeRows() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.type === "childList" || mutation.type === "subtree") {
                console.log("DOM mutation detected.");
                addEventListenersToRows();
            }
        });
    });

    const container = document.querySelector(".tlk-homeworks__table-body");
    console.log("Container found:", container);

    if (container) {
        observer.observe(container, { childList: true, subtree: true });
        console.log("MutationObserver is observing changes.");
    } else {
        console.log("Container for rows not found.");
    }
}

function waitForElement(selector, callback, interval = 100, timeout = 5000) {
    const start = Date.now();
    const timer = setInterval(() => {
        const element = document.querySelector(selector);
        if (element || Date.now() - start >= timeout) {
            clearInterval(timer);
            if (element) callback(element);
        }
    }, interval);
}

setTimeout(() => {
    console.log("Waiting 2 seconds after page load...");
    observeRows();
    addEventListenersToRows();
}, 3000);
