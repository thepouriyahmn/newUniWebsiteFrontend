    let serverIP = "localhost"
async function submit() {
  const data = {
     username: document.getElementById("username").value,
  password: document.getElementById("password").value,
  email: document.getElementById("email").value,
  studentRole: document.getElementById("studentRole").checked,
  professorRole: document.getElementById("professorRole").checked
  };



  try {
     console.log("data: ", data);
    const response = await fetch("http://" + serverIP +":8081/signUp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text);
    }

    const result = await response.json();
    console.log("داده دریافتی:", result);
    return result;
  } catch (error) {
    console.error("خطا در ارسال:", error.message);
  }
}
   function loginPage() {
      window.location.href="http://"+serverIP+":8082/loginPage"
    }