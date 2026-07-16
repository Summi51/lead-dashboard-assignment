const themeBtn = document.getElementById("themeToggle");


function applyTheme(){

const theme = localStorage.getItem("theme");


if(theme==="dark"){

document.body.classList.add("dark");

if(themeBtn)
themeBtn.innerHTML="☀️ Light";

}
else{

document.body.classList.remove("dark");

if(themeBtn)
themeBtn.innerHTML="🌙 Dark";

}

}



if(themeBtn){

themeBtn.addEventListener("click",()=>{


document.body.classList.toggle("dark");


const dark =
document.body.classList.contains("dark");


localStorage.setItem(
"theme",
dark ? "dark":"light"
);


themeBtn.innerHTML =
dark ? "☀️ Light":"🌙 Dark";


});


}


applyTheme();