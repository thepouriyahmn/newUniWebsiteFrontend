let serverIP = "localhost";

window.onload = function() {
    loadAllUsers();
    loadAllLessons();
};

async function loadAllUsers() {
  let input = document.getElementById("searchAllUsers")?.value || "";
console.log("sending input:", input);

    let token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];
   let res = await fetch(`http://${serverIP}:8081/showAllUsers?input=${encodeURIComponent(input)}`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` }
});
    if (!res.ok) return;
    let users = await res.json();
    let table = document.getElementById("myTable").getElementsByTagName('tbody')[0];
    table.innerHTML = "";
    users.forEach(user => addUserRow(user, table));
}

function addUserRow(user, table) {
    let row = table.insertRow();
    row.insertCell(0).innerText = user.username;
    row.insertCell(1).innerText = (user.studentRole ? "student " : "") + (user.professorRole ? "professor" : "");
    let addProfCell = row.insertCell(2);
    let addStudCell = row.insertCell(3);
    let addProfBtn = document.createElement("button");
    addProfBtn.innerText = "add";
    addProfBtn.onclick = async function() {
        let token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];
        await fetch(`http://${serverIP}:8081/addProfessor`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ id: user.id })
        });
        loadAllUsers();
    };
    let addStudBtn = document.createElement("button");
    addStudBtn.innerText = "add";
    addStudBtn.onclick = async function() {
        let token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];
        await fetch(`http://${serverIP}:8081/addStudent`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ id: user.id })
        });
        loadAllUsers();
    };
    addProfCell.appendChild(addProfBtn);
    addStudCell.appendChild(addStudBtn);
}

async function loadAllLessons() {
    let token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];
    let res = await fetch(`http://${serverIP}:8081/showAllLessons`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) return;
    let lessons = await res.json();
    let table = document.getElementById("myTable2").getElementsByTagName('tbody')[0];
    table.innerHTML = "";
    lessons.forEach(lesson => addLessonRow(lesson, table));
}

function addLessonRow(lesson, table) {
    let row = table.insertRow();
    row.insertCell(0).innerText = lesson.lessonName;
    let delCell = row.insertCell(1);
    let delBtn = document.createElement("button");
    delBtn.innerText = "delete";
    delBtn.onclick = async function() {
        let token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];
        await fetch(`http://${serverIP}:8081/deleteLesson`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ lessonName: lesson.lessonName })
        });
        loadAllLessons();
    };
    delCell.appendChild(delBtn);
}

async function insertLesson() {
    let lessonName = document.getElementById("lessonInput").value;
    let lessonUnit = parseInt(document.getElementById("unitInput").value);
    if (!lessonName || isNaN(lessonUnit)) {
        alert("لطفاً نام درس و تعداد واحد معتبر وارد کنید");
        return;
    }
    let token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];
    await fetch(`http://${serverIP}:8081/insertLesson`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ lessonName, lessonUnit })
    });
    loadAllLessons();
} 