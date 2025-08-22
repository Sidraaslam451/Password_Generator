function generatePassword(){
    var alpha = "abcdefghijklmnopqrstuvwxyz";
    var alphaUpper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    var numbers = "0123456789";
    var symbols = "!@#$%^&*";

    var password = "";

    for (var i = 0; i < 3; i++){
        password += alpha[Math.floor(Math.random() * alpha.length)];
    }
    for (var i = 0; i < 2; i++){  
        password += alphaUpper[Math.floor(Math.random() * alphaUpper.length)];
    }
    for (var i = 0; i < 2; i++){    
        password += numbers[Math.floor(Math.random() * numbers.length)];
    }    
    for (var i = 0; i < 2; i++){
        password += symbols[Math.floor(Math.random() * symbols.length)];
    }

    document.getElementById("output").textContent = password;
}

generatePassword();