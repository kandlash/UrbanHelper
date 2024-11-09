document.addEventListener('DOMContentLoaded', function() {
    const submitTokenButton = document.getElementById('submit-token');
    const tokenInput = document.getElementById('token-input');
    const profileContainer = document.getElementById('profile-container');
    const loginContainer = document.getElementById('login-container');
    const statusElement = document.getElementById('status');
    const homeworkCountElement = document.getElementById('homework-count');
    const templateTextElement = document.getElementById('template-text');
    const changeTemplateButton = document.getElementById('change-template');
    const changeTokenButton = document.getElementById('change-token');

    // Проверка, если пользователь уже авторизован
    chrome.storage.local.get('userToken', ({ userToken }) => {
        if (userToken) {
            // Если токен найден, показываем профиль
            loadUserProfile(userToken);
        } else {
            // Если нет токена, показываем форму ввода
            loginContainer.style.display = 'block';
        }
    });

    // Обработчик отправки токена
    submitTokenButton.addEventListener('click', () => {
        const token = tokenInput.value;
        if (!token) {
            statusElement.innerText = "Please enter a token!";
            return;
        }

        // Верификация токена
        fetch(`https://urbanhelper.onrender.com/user/get?token=${token}`)
            .then(response => response.json())
            .then(data => {
                if (data.token) {
                    chrome.storage.local.set({ userToken: token });
                    loadUserProfile(token);  // Загружаем профиль пользователя
                } else {
                    statusElement.innerText = "Invalid token!";
                }
            })
            .catch(error => {
                statusElement.innerText = "Error verifying token!";
                console.error("Error:", error);
            });
    });

    // Функция для загрузки профиля пользователя
    function loadUserProfile(token) {
        loginContainer.style.display = 'none';
        profileContainer.style.display = 'block';

        // Запрос для получения количества домашек
        fetch(`https://urbanhelper.onrender.com/homework/get?token=${token}`)
            .then(response => response.json())
            .then(data => {
                if (data && typeof data.count === "number") {
                    homeworkCountElement.innerText = `Homeworks today: ${data.count}`;
                }
            })
            .catch(error => {
                console.error("Error fetching homework count:", error);
            });

        // Запрос для получения текущего шаблона
        fetch(`https://urbanhelper.onrender.com/templates/get?token=${token}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.template) {
                    templateTextElement.innerText = data.template;
                }
            })
            .catch(error => {
                console.error("Error fetching template:", error);
            });
    }

    function loadLogin(){
        loginContainer.style.display = 'block';
        profileContainer.style.display = 'none';   
    }

    // Обработчик изменения шаблона
    changeTemplateButton.addEventListener('click', () => {
        const newTemplate = prompt("Enter new template:");
        if (newTemplate) {
            chrome.storage.local.get('userToken', ({ userToken }) => {
                if (userToken) {
                    fetch('https://urbanhelper.onrender.com/templates/set', {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            token: userToken,
                            new_template: newTemplate,
                        }),
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.status == 'ok') {
                            templateTextElement.innerText = newTemplate;  // Обновляем шаблон
                            alert('Template updated successfully!');
                        } else {
                            alert('Error updating template');
                        }
                    })
                    .catch(error => {
                        console.error("Error updating template:", error);
                    });
                }
            });
        }
    });

// Обработчик изменения токена
changeTokenButton.addEventListener('click', () => {
    // Удаляем токен из local storage
    chrome.storage.local.remove('userToken', () => {
        if (chrome.runtime.lastError) {
            console.error("Error removing token:", chrome.runtime.lastError);
        } else {
            console.log("Token removed successfully");
        }

        // После удаления токена можно загрузить новый профиль (если новый токен имеется)
        loadLogin(); // Если у тебя есть новый токен, передай его сюда
    });
});

});
