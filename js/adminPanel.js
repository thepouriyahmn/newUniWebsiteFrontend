let serverIP = "localhost";

window.onload = function() {
    onloaded();
};

async function onloaded() {
    let token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];
    console.log("token is: ", token)
    let getData = await fetch(`http://${serverIP}:8081/showProfessors`,{
        headers: { "Authorization": `Bearer ${token}` }
    });
    if (!getData.ok) return;
    let res = await getData.json();
    res.forEach(r => dropDown(r, "professorDropdown"));
    let getLesson = await fetch(`http://${serverIP}:8081/showAllLessons`,{
        headers: { "Authorization": `Bearer ${token}` }
    });
    let res2 = await getLesson.json();
    res2.forEach(r2 => dropDown(r2, "lessonDropdown"));
}

function dropDown(param, tag) {
    var dropdown = document.getElementById(tag);
    var option = document.createElement("option");
    if (tag == "professorDropdown") {
        option.value = param.id;
        option.textContent = param.name;
        dropdown.appendChild(option);
    } else {
        option.value = param.id;
        option.textContent = param.lessonName;
        dropdown.appendChild(option);
    }
}

document.getElementById("form").addEventListener("submit", function (event) {
    event.preventDefault();
    const professorDropDown = document.getElementById("professorDropdown");
    const lessonDropDown = document.getElementById("lessonDropdown");
    const data = {
        name: lessonDropDown.options[lessonDropDown.selectedIndex].text,
        tname: professorDropDown.options[professorDropDown.selectedIndex].text,
        class: parseInt(document.getElementById("class").value),
        capacity: parseInt(document.getElementById("capacity").value),
        time: document.getElementById("time").value
    };
    submitClass(data);
});

async function submitClass(data) {
    let token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];
    let response = await fetch(`http://${serverIP}:8081/insertLesson`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ lessonName: data.name, lessonUnit: 3 }) // فرض بر ۳ واحدی بودن
    });
    if (!response.ok) {
        alert("خطا در ثبت کلاس");
        return;
    }
    alert("کلاس با موفقیت ثبت شد");
}

async function uploadData() {
    let token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];
    let response = await fetch(`http://${serverIP}:8081/showAllLessons`,{
        headers: { "Authorization": `Bearer ${token}` }
    });
    if (!response.ok) return;
    let res = await response.json();
    let table = document.getElementById("myTable").getElementsByTagName('tbody')[0];
    table.innerHTML = "";
    res.forEach(r => addrows(r, table));
}

function addrows(param, table) {
    let newRow = table.insertRow();
    newRow.insertCell(0).innerText = param.lessonUnit;
    newRow.insertCell(1).innerText = param.lessonName;
    newRow.insertCell(2).innerText = param.professor || "-";
    newRow.insertCell(3).innerText = param.class || "-";
    newRow.insertCell(4).innerText = param.capacity || "-";
    newRow.insertCell(5).innerText = param.time || "-";
}
