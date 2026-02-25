window.onload = function() {
    const savedKey = localStorage.getItem("user_henrik_key");

    if (savedKey) {
        document.getElementById("status").innerText = "Welcome back :)";
        
        setTimeout(() => {
            launchDesktopWindow();
        }, 1500);

    } else {
        document.getElementById("status").innerText = "";
        document.getElementById("login-form").style.display = "block";
    }
};

function saveAndLaunch() {
    const inputVal = document.getElementById("api-input").value;
    
    if (inputVal.length > 5) {
        localStorage.setItem("user_henrik_key", inputVal);
        document.getElementById("status").innerText = "Welcome :)";
        setTimeout(() => {
            launchDesktopWindow();
        }, 1500);
    } else {
        alert("Check your key and try again.");
    }
}

function launchDesktopWindow() {
    overwolf.windows.obtainDeclaredWindow("desktop", function(result) {
        if (result.status === "success") {
            const mainWinId = result.window.id;
            
            overwolf.windows.restore(mainWinId);
            overwolf.windows.changeSize(mainWinId, 470, 850);
            window.close();
        }
    });
}
