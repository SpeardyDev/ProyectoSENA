const inp = document.getElementById("input-password") , 
icon = document.querySelector(".visibility_off");

icon.addEventListener("click", e => {
    if (inp.type === "password") {
        inp.type = "text";
        icon.src = 'img/visibility.png';
    }else {
        inp.type = "password";
        icon.src = 'img/visibility_off.png';
    }
})