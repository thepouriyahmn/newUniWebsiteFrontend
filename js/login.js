    console.log("using login")
  let currentID = ""; // شناسه کاربر که از سرور دریافت می‌کنیم
  var getUsername = "";
   let serverIP = "localhost"

  document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    let data1 = {
      username : username,
      password: password
    }

    try {
      console.log(data1)
      const response = await fetch("http://"+serverIP+":8081/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data1)
      });

      const result = document.getElementById("result");

      if (response.ok) {
        const data = await response.json();
        currentID = data.id; // حالا ID یک رشته (string) هست
        getUsername = data.username

        document.getElementById("loginForm").style.display = "none";
        document.getElementById("codeSection").style.display = "block";
        result.innerText = "✅ کد ارسال شد. لطفاً آن را وارد کنید.";
      } else {
        const errorText = await response.text();
        result.innerText = "❌ ورود ناموفق: " + errorText;
      }
    } catch (err) {
      document.getElementById("result").innerText = "خطای ارتباط با سرور";
      console.error(err);
    }
  });

  async function submitCode() {
  const code = document.getElementById("codeInput").value;

  try {
    const response = await fetch("http://"+serverIP+":8081/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id: currentID, code, username: getUsername }) // ارسال id و username
    });
 

    const result = document.getElementById("result");

    if (response.ok) {
      const data = await response.json();
      alert("token in login created: "+ data.token)
      
      document.cookie = `token=${data.token}; max-age=300; path=/;`;
      result.innerText = "✅ ورود موفقیت‌آمیز بود!";
     window.location.href = "http://"+serverIP+":8082"
    } else {
      const errText = await response.text(); 
      console.error("❌ Server Error:", errText);
      result.innerText = "❌ کد اشتباه است: " + errText;
    }
  } catch (err) {
    document.getElementById("result").innerText = "خطای ارتباط با سرور";
    console.error(err);
  }
}
function goSignUp() {
    window.location.href = "http://"+serverIP+":8082/signUp"
}