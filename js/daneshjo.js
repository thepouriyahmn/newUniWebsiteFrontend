let serverIP = "localhost";

window.onload = function() {
    loadAvailableLessons();
    loadPickedUnits();
};

async function loadAvailableLessons() {
    let token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];
    let res = await fetch(`http://${serverIP}:8081/showAllLessons`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) return;
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
    if (!res.ok) return;
    let units = await res.json();
    let table = document.getElementById("MyTable1").getElementsByTagName('tbody')[0];
    table.innerHTML = "";
    units.forEach(unit => addPickedUnitRow(unit, table));
}

function addLessonRow(lesson, table) {
    let row = table.insertRow();
    row.insertCell(0).innerText = lesson.unit;
    row.insertCell(1).innerText = lesson.name;
    row.insertCell(2).innerText = lesson.tname;
    row.insertCell(3).innerText = lesson.class;
    row.insertCell(4).innerText = lesson.capacity;
    row.insertCell(5).innerText = lesson.time;
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
    row.insertCell(0).innerText = unit.unit;
    row.insertCell(1).innerText = unit.name;
    row.insertCell(2).innerText = unit.tname;
    row.insertCell(3).innerText = unit.class;
    row.insertCell(4).innerText = unit.leftCapacity;
    row.insertCell(5).innerText = unit.time;
    row.insertCell(6).innerText = unit.mark === null ? "no mark yet" : unit.mark;
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