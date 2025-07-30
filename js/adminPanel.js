let serverIP = "localhost";

window.onload = function() {
    onloaded();
};
function goPermission() {
    window.location.href = "http://"+serverIP+":8082/permission"
}

async function onloaded() {
    let token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];
    
    let getData = await fetch(`http://${serverIP}:8081/showProfessors`,{
        headers: { "Authorization": `Bearer ${token}` }
    });
    if (!getData.ok) {
        window.location.href = "http://"+serverIP+":8082/unauthorized"

    };
    let res = await getData.json();
    res.forEach(r => dropDown(r, "professorDropdown"));
    let getLesson = await fetch(`http://${serverIP}:8081/showAllLessons`,{
        headers: { "Authorization": `Bearer ${token}` }
    });
    let res2 = await getLesson.json();
    res2.forEach(r2 => dropDown(r2, "lessonDropdown"));
    let getTerms = await fetch(`http://${serverIP}:8081/getTerms`,{
        headers: { "Authorization": `Bearer ${token}` }
    })
      let res3 = await getTerms.json();
      console.log("terms: ",res3)
    res3.forEach(r3 => dropDown(r3, "termDropdown"));

}

function dropDown(param, tag) {
    var dropdown = document.getElementById(tag);
    var option = document.createElement("option");
    if (tag == "professorDropdown") {
        option.value = param.id;
        option.textContent = param.name;
        dropdown.appendChild(option);
    } else if (tag == "lessonDropdown") {
        option.value = param.id;
        option.textContent = param.lessonName;
        dropdown.appendChild(option);
    } else if(tag == "termDropdown"){
          option.textContent = param;  
    dropdown.appendChild(option); 
    }
}

document.getElementById("form").addEventListener("submit", function (event) {
    event.preventDefault();
    const professorDropDown = document.getElementById("professorDropdown");
    const lessonDropDown = document.getElementById("lessonDropdown");
    const termDropDown = document.getElementById("termDropdown");
    const data = {
        lessonName: lessonDropDown.options[lessonDropDown.selectedIndex].text,
        professorName: professorDropDown.options[professorDropDown.selectedIndex].text,
        classNumber: parseInt(document.getElementById("class").value),
        capacity: parseInt(document.getElementById("capacity").value),
        date: document.getElementById("time").value,
        term: termDropDown.options[termDropDown.selectedIndex].text,
    };
    submitClass(data);
});

async function submitClass(data) {
    let token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];
    console.log(data)
    let response = await fetch(`http://${serverIP}:8081/insertClass`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data) 
    });
    if (!response.ok) {
        alert("خطا در ثبت کلاس");
        return;
    }
    alert("کلاس با موفقیت ثبت شد");
}

async function uploadData() {
    let token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];
    const termDropDown = document.getElementById("termDropdown");
    let input = termDropDown.options[termDropDown.selectedIndex].text
    let response = await fetch(`http://${serverIP}:8081/showClasses?input=${encodeURIComponent(input)}`,{
        headers: { "Authorization": `Bearer ${token}` }
    });
    if (!response.ok) return;
    let res = await response.json();
    console.log("lessons: ",res)
    let table = document.getElementById("myTable").getElementsByTagName('tbody')[0];
    table.innerHTML = "";
    res.forEach(r => addrows(r, table));
}

function addrows(param, table) {
    let newRow = table.insertRow();
    newRow.insertCell(0).innerText = param.lessonUnit;
    newRow.insertCell(1).innerText = param.lessonName;
    newRow.insertCell(2).innerText = param.professorName || "-";
    newRow.insertCell(3).innerText = param.classNumber || "-";
    newRow.insertCell(4).innerText = param.capacity || "-";
    newRow.insertCell(5).innerText = param.date || "-";
      newRow.insertCell(6).innerText = param.term || "-";
             let deleteButton = document.createElement("button")
          deleteButton.innerText = "delete"
            deleteButton.onclick = async function  (){
                table.deleteRow(newRow.rowIndex -1);
                let token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];
let deleter = await fetch("http://"+serverIP+":8081/deleteClass",{
    method : "POST",
    headers: {
            'Content-Type': 'application/json' ,
            "Authorization": `Bearer ${token}`
        },
        
        body: JSON.stringify({id: param.id} )
        

}


)
if(deleter.status===401){
    alert("access denied, please login")
    window.location.href = "http://"+serverIP+":8082";
    return
}
if (!deleter.ok){
    alert("someting went wrong!")
    window.location.href = "http://"+serverIP+":8082";
    return
}
       
    }
    let cell7 = newRow.insertCell(7);
    cell7.appendChild(deleteButton)

}
