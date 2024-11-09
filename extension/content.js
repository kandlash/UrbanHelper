// Функция для добавления кнопки "Add Homework"
function addButton() {
    const targetElement = document.querySelector(".tlk-homework__mark-button");

    if (targetElement && !document.querySelector("#homework-add-button")) {
        const button = document.createElement("button");
        button.id = "homework-add-button";
        button.innerText = "Add Homework";
        button.style.padding = "10px";
        button.style.fontSize = "16px";
        button.style.marginLeft = "10px";
        button.type = "button";

        const countLabel = document.createElement("span");
        countLabel.id = "homework-count";
        countLabel.style.marginLeft = "10px";
        countLabel.innerText = "Homeworks today: 0";  // Default value

        targetElement.parentNode.insertBefore(button, targetElement.nextSibling);
        targetElement.parentNode.insertBefore(countLabel, button.nextSibling);

        button.addEventListener("click", addHomework);
        fetchHomeworkCount();  // Fetch and display the homework count on page load
    }
}

// Функция для добавления домашнего задания
function addHomework() {
    chrome.storage.local.get('userToken', ({ userToken }) => {
        const token = userToken;
        if (!token) {
            alert("You need to log in first!");
            return;
        }

        fetch(`https://urbanhelper.onrender.com/homework/add?token=${token}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then(response => response.json())
        .then(data => {
            console.log("Homework added:", data);
            fetchHomeworkCount();  // Fetch and display the homework count
        })
        .catch(error => {
            console.error("Error adding homework:", error);
        });
    });
}

// Функция для получения количества домашек
function fetchHomeworkCount() {
    chrome.storage.local.get('userToken', ({ userToken }) => {
        console.log(userToken)
        const token = userToken;
        if (!token) {
            alert("You need to log in first!");
            return;
        }
        console.log('fetchuu')
        fetch(`https://urbanhelper.onrender.com/homework/get?token=${token}`)
            .then(response => response.json())
            .then(data => {
                console.log("API Response:", data);
                if (data && typeof data.count === "number") {
                    document.getElementById("homework-count").innerText = `Homeworks today: ${data.count}`;
                } else {
                    console.error("Unexpected response format:", data);
                }
            })  
    });
}

// Функция для добавления кнопки с шаблоном комментария
function addCommentButton() {
    const targetComment = document.querySelector(".tlk-textarea");

    if (targetComment && !document.querySelector("#comment-add-button")) {
        const button = document.createElement("button");
        button.id = "comment-add-button";
        button.innerText = "Add Template";
        button.style.padding = "10px";
        button.style.fontSize = "16px";
        button.style.marginLeft = "10px";
        button.type = "button";

        // При клике забираем шаблон через API
        button.addEventListener("click", () => {
            chrome.storage.local.get('userToken', ({ userToken }) => {
                const token = userToken;
                if (!token) {
                    alert("You need to log in first!");
                    return;
                }

                // Запрос шаблона по токену
                fetch(`https://urbanhelper.onrender.com/templates/get?token=${token}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                })
                .then(response => response.json())
                .then(data => {
                    console.log("Template API Response:", data);
                    if (data && data.template) {
                        targetComment.value = data.template || "No template text found";
                    } else {
                        console.error("Unexpected response format:", data);
                    }
                })
                .catch(error => {
                    console.error("Error fetching template:", error);
                });
            });
        });

        targetComment.parentNode.insertBefore(button, targetComment.nextSibling);
    }
}


// Функция для обработки ссылок на GitHub
function makeGitHubLinksClickable() {
    const div = document.querySelector('.tlk-homework__answer-text');

    if (!div) {
        console.error('Element with class "tlk-homework__answer-text" not found');
        return;
    }

    const githubLinkRegex = /https:\/\/github\.com\S+/g;
    let text = div.innerHTML;

    text = text.replace(githubLinkRegex, match => {
        return `<a target="_blank" href="${match}"><button>GitHub</button></a>`;
    });
    div.innerHTML = text;
}

// Функция для добавления слушателей к строкам таблицы
function addEventListenersToRows() {
    const rows = document.querySelectorAll(".tlk-homeworks__table-row");

    rows.forEach(row => {
        if (!row.getAttribute('data-event-added')) {
            row.addEventListener("click", () => {
                setTimeout(() => {
                    addButton();
                    addCommentButton();
                    makeGitHubLinksClickable();
                }, 2000);
            });
            row.setAttribute('data-event-added', 'true');
        }
    });
}

// Наблюдатель за изменениями DOM
function observeRows() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.type === "childList" || mutation.type === "subtree") {
                addEventListenersToRows();
            }
        });
    });

    const container = document.querySelector(".tlk-homeworks__table-body");

    if (container) {
        observer.observe(container, { childList: true, subtree: true });
    } else {
        console.log("Container for rows not found.");
    }
}

// Функция ожидания появления элемента
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

// Добавление стилей для кнопок
function addButtonStyles() {
    const style = document.createElement("style");
    style.innerHTML = `
        #homework-add-button, #comment-add-button {
            background-color: #4CAF50;  /* Зеленый цвет */
            color: white;
            font-size: 16px;
            padding: 12px 20px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            transition: background-color 0.3s, transform 0.2s;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
        }

        #comment-add-button{
            margin-top: 10px;
        }

        #homework-add-button:hover, #comment-add-button:hover {
            background-color: #45a049; /* Темно-зеленый при наведении */
            transform: translateY(-2px); /* Легкий эффект подъема */
        }

        #homework-add-button:active, #comment-add-button:active {
            background-color: #3e8e41; /* Еще темнее при нажатии */
            transform: translateY(0);
        }

        #homework-count {
            font-size: 14px;
            color: #555;
            margin-left: 10px;
            display: inline-block;
            font-weight: normal;
        }

        #homework-add-button:focus, #comment-add-button:focus {
            outline: none;
            box-shadow: 0 0 4px rgba(76, 175, 80, 0.6); /* Зеленая подсветка фокуса */
        }
    `;
    document.head.appendChild(style);
}

// Вызов функции для добавления стилей
addButtonStyles();


// Инициализация скрипта
setTimeout(() => {
    observeRows();
    addEventListenersToRows();
}, 3000);
