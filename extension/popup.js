document.getElementById("templateForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const textTemplate = document.querySelector('input[name="text_template"]').value;
    console.log("Отправка текста на сервер:", textTemplate); 

    fetch("http://localhost:8000/post_comment_template", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text_template: textTemplate })
    })
    .then(response => response.json())
    .then(data => {
        alert("Шаблон добавлен: " + textTemplate);
    })
    .catch(error => {
        alert("Error: " + error);
    });
});
