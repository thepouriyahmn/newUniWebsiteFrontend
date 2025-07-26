let serverIP = "localhost";

window.onload = function() {
    loadAvailableLessons();
    loadPickedUnits();
};

async function loadAvailableLessons() {
    let token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];
    let res = await fetch(`http://${serverIP}:8081/showClasses`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) {
        
        window.location.href = "http://"+serverIP+":8082/unauthorized"

    };
    let lessons = await res.json();
    let table = document.getElementById("myTable").getElementsByTagName('tbody')[0];
    table.innerHTML = "";
    lessons.forEach(lesson => addLessonRow(lesson, table));
}

async function loadPickedUnits() {
    let token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];
    let res = await fetch(`http://${serverIP}:8081/pickedUnits`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) {
        window.location.href = "http://"+serverIP+":8082/unauthorized"

    };
    let units = await res.json();
    console.log(units)
    let table = document.getElementById("MyTable1").getElementsByTagName('tbody')[0];
    table.innerHTML = "";
    units.forEach(unit => addPickedUnitRow(unit, table));
}

function addLessonRow(lesson, table) {
    let row = table.insertRow();
    row.insertCell(0).innerText = lesson.lessonUnit;
    row.insertCell(1).innerText = lesson.lessonName;
    row.insertCell(2).innerText = lesson.professorName;
    row.insertCell(3).innerText = lesson.classNumber;
    row.insertCell(4).innerText = lesson.capacity;
    row.insertCell(5).innerText = lesson.date;
    let actionCell = row.insertCell(6);
    let addButton = document.createElement("button");
    addButton.innerText = "add";
    addButton.onclick = async function() {
        let token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];
        await fetch(`http://${serverIP}:8081/add`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ id: lesson.id })
        });
        loadPickedUnits();
    };
    actionCell.appendChild(addButton);
}

function addPickedUnitRow(unit, table) {
    let row = table.insertRow();
     row.insertCell(0).innerText = unit.lessonUnit;
    row.insertCell(1).innerText = unit.lessonName;
    row.insertCell(2).innerText = unit.professorName;
    row.insertCell(3).innerText = unit.classNumber;
    row.insertCell(4).innerText = unit.capacity;
    row.insertCell(5).innerText = unit.date;
    row.insertCell(6).innerText = unit.mark === -1 ? "no mark yet" : unit.mark;
    let actionCell = row.insertCell(7);
    let delButton = document.createElement("button");
    delButton.innerText = "delete";
    delButton.onclick = async function() {
        let token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];
        await fetch(`http://${serverIP}:8081/delStudentUnit`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ id: unit.id })
        });
        loadPickedUnits();
    };
    actionCell.appendChild(delButton);
} 