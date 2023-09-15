let input;
let starturl='';
let mess='';
let username='guest';
let messages=[];
let got_results=false;
let messages_unlisted;
let asked=false;
let text_size=30;
let offy=0;
let submit;
let last_message;
let lgscreen = true;
let signup = false;
let backcolor = "#000000";
let uinput;
let pinput;
let signupbtn;
let loginbtn;
function setup(){
    createCanvas(windowWidth, windowHeight);
    input = createInput();
    input.size(width-60,55);
    input.position(0,height-60);
    input.style('background-color', 'transparent');
    input.style('border', 'none');
    input.style('outline', 'none');
    input.style('color', '#286FB4');
    input.style('font-size',text_size+'px');
    signupbtn=createButton('switch mode');
    signupbtn.mousePressed(switchsignup);
    loginbtn=createButton('login');
    if(getCookie("username")!=null){
        uinput=createInput(getCookie("username"));
        pinput=createInput(getCookie("password"));
    }else{
        uinput=createInput('');
        pinput=createInput('');
    }

    uinput.position(width/2-uinput.width/2,height/2);
    pinput.position(width/2-uinput.width/2,height/2+pinput.height*2);
    signupbtn.position(width/2-signupbtn.width/2,height/2+pinput.height*6);
    loginbtn.position(width/2-loginbtn.width/2,height/2+pinput.height*4);
    loadJSON("https://api.ipify.org?format=json", function(data) {
        httpGet(starturl+'/ipset/'+data.ip, function(result) {
            console.log(data.ip);
        });
    });

}
let tried_signup=false;
let loginstate;
function draw(){
    if(all_users==undefined){
        getusers();
    }else{
    }
    if(!lgscreen){
        input.show();
        signupbtn.hide();
        loginbtn.hide();
        uinput.hide();
        pinput.hide();
        background(backcolor);
        loadAllData();
        textSize(text_size);
        fill("#0A1827");
        noStroke();
        rect(0, height-60, width, 60, 10);
        fill('#286FB4');
        textAlign(LEFT,BOTTOM);
        if(messages!=null&&messages!=undefined){
            for(let i = 0;i<messages.length;i++){
                text(messages[i],0,i*text_size+text_size+20+offy);
            }
        }
    }else{

        if(!tried_signup){
            if(!tried_login){
                username=uinput.value();
                background(backcolor);
                input.hide();
                fill(255);
                textAlign(CENTER,CENTER);
                textSize(text_size);
                if(signup){
                    loginbtn.html('signup');
                    loginbtn.position(width/2-loginbtn.width/2,height/2+pinput.height*4);
                    loginbtn.mousePressed(try_signup);
                    text("sign up", width/2,height/2-pinput.height*2);
                }else{
                    loginbtn.html('login');
                    loginbtn.position(width/2-loginbtn.width/2,height/2+pinput.height*4);
                    loginbtn.mousePressed(try_login);
                    text("login", width/2, height/2-pinput.height*2);
                }
            }else{
                if(loginstate!=null){
                    if(loginstate!="fail"){
                        if(getCookie("username")==null){
                            setCookie("username",uinput.value(),999999);
                            setCookie("password",pinput.value(),999999);
                        }
                        lgscreen=false;
                    }else{
                        alert("Wrong password or username");
                        tried_login=false;
                    }
                }
            }
        }else{
            if(token!=null){
                if(token=="error"){
                    alert("Error - username in use!");
                }else{
                    alert("Account created, login");
                }
                tried_signup=false;
            }
        }

    }
}
function switchsignup(){
    signup=!signup;
}
function send() {
    mess = input.value();
    input.value('');
    httpGet(starturl+'/sendl/'+mess+'/'+username, function(result) {
          not_needed=result;
    });
}
function loadAllData(){
    if(asked&&messages_unlisted!=undefined){
        messages=messages_unlisted.split('~');
        if (messages_unlisted!=last_message){
            last_message=messages_unlisted;
        }
        messages_unlisted=undefined;
        asked=false;

    }else if(!asked){
        httpGet(starturl+'/getall', function(result) {
              messages_unlisted=result;
        });
        asked=true;
    }
}
let askedu=false;
let all_users_unlisted;
let all_users;
function getusers(){
    if(asked&&all_users_unlisted!=undefined){
        all_users=all_users_unlisted.split('~');
        all_users_unlisted=undefined;
        askedu=false;
    }else if(!askedu){
        httpGet(starturl+'/getusers', function(result) {
            all_users_unlisted=result;
        });
    }
}
function keyPressed() {
    if(keyCode==ENTER){
        if(lgscreen){
            if(signup){
                try_signup();
            }else{
                try_login();
            }
        }else{
            send();
        }
    }
}
let tried_login = false;
function try_login(){
    if(onlyLettersAndNumbers(uinput.value())&&onlyLettersAndNumbers(pinput.value())){
        tried_login=true;
        httpGet(starturl+'/login/'+uinput.value()+'/'+pinput.value(), function(result) {
            loginstate = result;
        });
    }
}
let token;
function try_signup(){
    if(onlyLettersAndNumbers(uinput.value())&&onlyLettersAndNumbers(pinput.value())){
        tried_signup=true;
        httpGet(starturl+'/create/'+uinput.value()+'/'+pinput.value(), function(result) {
            token = result;
        });
    }
}
function onlyLettersAndNumbers(str) {
  return /^[A-Za-z0-9]*$/.test(str);
}

function setCookie(name, value, daysToLive){
    const date = new Date();
    date.setTime(date.getTime() +  (daysToLive * 24 * 60 * 60 * 1000));
    let expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${value}; ${expires}; path=/`
}
function deleteCookie(name){
    setCookie(name, null, null);
}
function getCookie(name){
    const cDecoded = decodeURIComponent(document.cookie);
    const cArray = cDecoded.split("; ");
    let result = null;

    cArray.forEach(element => {
        if(element.indexOf(name) == 0){
            result = element.substring(name.length + 1)
        }
    })
    return result;
}