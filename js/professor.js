let serverIP = "localhost";

window.onload = function() {
    showStudents();
};

async function showStudents() {
    let token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];
    let res = await fetch(`http://${serverIP}:8081/showStudentsForProfessor`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) return;
    let students = await res.json();
    console.log("student",students)
    let table = document.getElementById("myTable").getElementsByTagName('tbody')[0];
    table.innerHTML = "";
   
    students.forEach(student => addStudentRow(student, table));
}

function addStudentRow(student, table) {
    let row = table.insertRow();
    row.insertCell(0).innerText = student.studentName;
    row.insertCell(1).innerText = student.lessonName;
    row.insertCell(2).innerText = student.classNumber;
    row.insertCell(3).innerText = student.date;
    let markCell = row.insertCell(4);
    let markInput = document.createElement("input");
    markInput.type = "number";
    markInput.min = 0;
    markInput.max = 20;
    markInput.placeholder = "نمره";
    markInput.style.marginRight = "5px";
    let addButton = document.createElement("button");
    addButton.innerText = "add";
    addButton.onclick = async function() {
        let token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];
        let markValue = parseInt(markInput.value);
        if (isNaN(markValue)) {
            alert("لطفاً نمره را وارد کنید");
            return;
        }
        await fetch(`http://${serverIP}:8081/addMark`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ userId: student.userId, classId: student.classId, mark: markValue })
        });
        alert("نمره با موفقیت ثبت شد");
    };
    markCell.appendChild(markInput);
    markCell.appendChild(addButton);
} 