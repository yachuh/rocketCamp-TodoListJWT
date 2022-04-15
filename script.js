// const { default: Swal } = require("sweetalert2");

// import Swal from 'sweetalert2';
const apiUrl = `https://todoo.5xcamp.us`;

/* -------- sweetalert  -------- */
function toastSuccess (ttl,txt) {
    Swal.fire({
        titleText: ttl,
        text: txt,
        toast: true,
        icon:"success",
        position: "top-end",
        width: 274,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
    })
}
function toastError (ttl,txt) {
    Swal.fire({
        titleText: ttl,
        text: txt,
        toast: true,
        icon:"error",
        position: "top-end",
        width: 274,
        showConfirmButton: false,
        showCloseButton: true,
        timer: 3000,
        timerProgressBar: true,
    })
}


/* -------- 註冊 -------- */
const userEmail = document.querySelector("form.signupForm input[name='email']");
const userName = document.querySelector("form.signupForm input[name='name']");
const userPwd = document.querySelector("form.signupForm input[name='pwd']");
const userPwd2 = document.querySelector("form.signupForm input[name='pwd2']");
const btnRegisterSubmit = document.querySelector("form.signupForm input[type='button']");
const btnLogin = document.querySelector("form.signupForm .btn-login");

//點擊「註冊帳號」送出註冊資訊
// btnRegister.addEventListener("click", register(`${userEmail}.value`,`${userName}.value`,`${userPwd}.value)`));
btnRegisterSubmit.addEventListener("click", () => {
    signup(userEmail.value,userName.value,userPwd.value);
});

const signup = async function (account,name,pwd) {
    if ( userPwd.value === userPwd2.value) {
        // API - 使用者註冊
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "user": {
                "email": account,
                "nickname": name,
                "password": pwd
            }
        });

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        const response = await fetch(`${apiUrl}/users`, requestOptions)
        const result = await response.json();

        if(response.ok) {
            console.log(`註冊成功 Account: ${account}; Name: ${name}; Password: ${pwd}`);
            toastSuccess("註冊成功！");
            Swal.fire({
                icon: 'success',
                title: '註冊成功！',
                confirmButtonText: '前往登入頁',
                showCloseButton:true,
              })
            .then( result => {
            if (result.isConfirmed) {
                //隱藏：註冊頁、todo list 頁
                document.querySelector(".signup").classList.add("hidden");
                document.querySelector(".todos").classList.add("hidden");
                //打開： login 頁
                document.querySelector(".login").classList.remove("hidden");
            }});
            userEmail.value="";
            userName.value="";
            userPwd.value="";
            userPwd2.value="";
        } else {
            console.log("註冊失敗", result);
            const error = result.error[0];
            toastError("註冊失敗！",error);
        }

        /* old way: 用 fetch .then 寫
        fetch(`${apiUrl}/users`, requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log(result);
                console.log("註冊成功！", result.status)
                userEmail.value="";
                userName.value="";
                userPwd.value="";
                userPwd2.value="";
            })
            .catch(error => console.log('error', error));
        */
    }
    else {
        alert("pwd not match");
    }
}

//點擊「登入」切換至登入頁
btnLogin.addEventListener("click", () => {
    //隱藏：註冊頁、todo list 頁
    document.querySelector(".signup").classList.add("hidden");
    document.querySelector(".todos").classList.add("hidden");
    //打開： login 頁
    document.querySelector(".login").classList.remove("hidden");
});

/* -------- 登入頁 -------- */
const loginEmail = document.querySelector("form.loginForm input[name='email']");
const loginPwd = document.querySelector("form.loginForm input[name='pwd']");
const btnLoginSubmit = document.querySelector("form.loginForm .btn-login")
const btnRegister = document.querySelector("form.loginForm .btn-register");

//點擊「登入」送出登入資訊
let jwt = "";

btnLoginSubmit.addEventListener("click", () => {
    login(loginEmail.value,loginPwd.value);
})

async function login (account,pwd) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "user": {
            "email": account,
            "password": pwd
        }
    });

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    const response = await fetch(`${apiUrl}/users/sign_in`, requestOptions);
    const result = await response.json();
    if (response.ok) {
        // 取得 jwt token
        jwt = response.headers.get('authorization');
        console.log("登入成功");
        //成功 alert
        toastSuccess("登入成功！");
        /* --- 切換至 todo 頁 --- */
        //隱藏：login、signup 頁
        document.querySelector(".login").classList.add("hidden");
        document.querySelector(".signup").classList.add("hidden");
        //打開： todo 、header
        document.querySelector(".todos").classList.remove("hidden");
        document.querySelector("header").classList.remove("hidden");
        //取得 todo 列表
        getData();
        //將 nav 替換成使用者名稱
        const { nickname } = result;
        document.querySelector("nav ul li.d-m-n span").innerHTML = `${nickname}的代辦`;
    } else {
        console.log("登入失敗", result);
        toastError("登入失敗！"); // 後端沒有給失敗原因
    };
    
    // fetch(`${apiUrl}/users/sign_in`, requestOptions)
    //     .then(response => {
    //         jwt = response.headers.get('authorization');

    //         if (!response.ok){
    //             console.log("登入失敗");
    //             Swal.fire({
    //                 titleText: "登入失敗！",
    //                 toast: true,
    //                 icon:"error",
    //                 position: "top-end",
    //                 width: 278,
    //                 showConfirmButton: false,
    //                 timer: 3000,
    //                 timerProgressBar: true,
    //             })
    //         } else {
    //             console.log("登入成功！");
    //             Swal.fire({
    //                 titleText: "成功登入！",
    //                 toast: true,
    //                 icon:"success",
    //                 position: "top-end",
    //                 width: 278,
    //                 showConfirmButton: false,
    //                 timer: 3000,
    //                 timerProgressBar: true
    //             });
    //             /* 切換至 todo 頁 */
    //             //隱藏：login、signup 頁
    //             document.querySelector(".login").classList.add("hidden");
    //             document.querySelector(".signup").classList.add("hidden");
    //             //打開： todo 、header
    //             document.querySelector(".todos").classList.remove("hidden");
    //             document.querySelector("header").classList.remove("hidden");
    //             //取得 todo 列表
    //             getData();
    //             return response.json();
    //         };
    //     })
    //     //將 nav 替換成 使用者名稱
    //     .then(result => {
    //         const { nickname } = result;
    //         console.log("result", result)
    //         document.querySelector("nav ul li.d-m-n span").innerHTML = `${nickname}的代辦`;
    //     })
    //     .catch(error => console.log('error', error));
}

// 點擊「註冊帳號」切換至註冊頁
btnRegister.addEventListener("click" ,() => {
    //隱藏：login 頁
    document.querySelector(".login").classList.add("hidden");
    //打開： 註冊 頁
    document.querySelector(".signup").classList.remove("hidden");
})

/* -------- Todo List -------- */
const todoList = document.querySelector(".todos-content-list");
const todoFooterTxt = document.querySelector(".todos-content-footer p");

// 取得 todo 列表
/* function getTodo () {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", jwt);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(`${apiUrl}/todos`, requestOptions)
        .then(response => response.json()) // 獲得 object
        .then(result => {
            // console.log(result);
            //把獲得的 todos 加到 <ul>
            let str='';
            const todos = result.todos;
            todos.forEach(item => { //object 裡面叫做 todos 的 array
                //item 的完成狀態
                let checked = "";
                if (item.completed_at !== null) {
                    checked = "checked"
                }; 
                //建立 item 的 <li>
                str+=`<li data-id="${item.id}">
                    <label>
                        <input type="checkbox" ${checked}></input>
                        <span> ${item.content} </span>
                    </label>
                    <a class="btn-del" href="#">
                        <i class="fa fa-times"></i>
                    </a>
                </li>`
            })
            todoList.innerHTML = str;
        })
        .catch(error => console.log('error', error)); 

} */

async function getData () {
    try {
        //GET API
        const myHeaders = new Headers();
        myHeaders.append("Authorization", jwt);
    
        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        const response = await fetch(`${apiUrl}/todos`, requestOptions);
        const json = await response.json();
        const todos = json.todos;
        const todosNotDone = todos.filter( item => item.completed_at === null);
        const todosDone = todos.filter( item => item.completed_at !== null);
        
        let list = [];
        switch(tabStatus) {
            case "all":
                list = todos;
                break;
            case "notDone":
                list = todosNotDone;
                break;
            case "done":
                list = todosDone;
                break;
            default:
                list = todos;
        };

        if(response.ok){
            let str="";
            let countTotal = 0;
            let countCompleted = 0
            
            list.forEach( item => {
                //item 的完成狀態
                let checked = "";
                if (item.completed_at !== null) {
                    checked = "checked"
                    countCompleted += 1;
                }; 
                //建立 item 的 <li>
                str+=`<li data-id="${item.id}">
                        <label>
                            <input type="checkbox" ${checked}></input>
                            <span>${item.content}</span>
                        </label>
                        <a class="btn-edit" href="#">
                            <i class="fa-solid fa-pen"></i>
                        </a>
                        <a class="btn-del" href="#">
                            <i class="fa fa-times"></i>
                        </a>
                    </li>`
                countTotal += 1;
            })
            todoList.innerHTML = str;
            todoFooterTxt.innerHTML = `${countCompleted} 個已完成項目`;

        } else {
            console.log("getData() failed!",result);
        }

    } catch (err) {
        console.log('Ooops!', err);
    }
    
}

//新增 todo
const btnAdd = document.querySelector(".btn-add");
const userInput = document.querySelector(".userInput");

async function addTodo () {
    try {
        let content = userInput.value;
        if (content.length > 0) {
            const myHeaders = new Headers();
            myHeaders.append("Authorization", jwt);
            myHeaders.append("Content-Type", "application/json");
    
            const raw = JSON.stringify({
                "todo": {
                  "content": content
                }
            });
    
            const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
    
            const response = await fetch(`${apiUrl}/todos`,requestOptions)
            const result = response.json()
            if (!response.ok){
                toastError("新增失敗！");
            } else {
                console.log(`新增成功：${content}`);
                toastSuccess("新增成功！");
                userInput.value="",
                getData();
            }
        } else {
            alert("請輸入內容");
        }
    } catch(err) {
        console.log('Ooops!', err);
    }
}

btnAdd.addEventListener("click",addTodo);

//刪除、toggle、修改 todo
async function delTodo (e) {
    try {
        let id = e.target.parentElement.parentElement.getAttribute("data-id");
        const myHeaders = new Headers();
        myHeaders.append("Authorization",jwt);

        const requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            redirect: 'follow'
          };
    
        const response = await fetch(`${apiUrl}/todos/${id}`,requestOptions);
        const result = await response.json();

        if (!response.ok){
            console.log("刪除失敗",result);
            toastError("刪除失敗！",result.message);
        } else {
            console.log("刪除成功",result);
            toastSuccess("刪除成功！");
            getData();
        }
    } catch(err) {
        console.log('Ooops!', err);
    }
}
async function toggleTodo (e) {
    try {
        let id = e.target.parentElement.parentElement.getAttribute("data-id");
        const myHeaders = new Headers();
        myHeaders.append("Authorization",jwt);
    
        const requestOptions = {
            method: 'PATCH',
            headers: myHeaders,
            redirect: 'follow'
        };
    
        const response = await fetch(`${apiUrl}/todos/${id}/toggle`,requestOptions);
        const result = await response.json();
    
        if (!response.ok){
            console.log("更新失敗",result);
            toastError("更新失敗")
        } else {
            if (result.completed_at !== null){
                console.log(`已完成, id:${id}, completed:${result.completed_at}`);
                toastSuccess("恭喜完成！");
            } else {
                console.log(`取消完成, id: ${id}`);
                toastSuccess("已取消完成！");
            }
        }
        getData();
    } catch(err) {
        console.log('Ooops!',err);
    }
}
async function editTodo (e) {
    try {
        let id = e.target.parentElement.parentElement.getAttribute("data-id");
        let content = document.querySelector(`li[data-id='${id}'] label span`).innerHTML;
        console.log("Original content:",content);
    
        //let user edit content
        // let newContent = prompt("請輸入內容：",content);
        const { value: newContent } = await Swal.fire({
            text: '請輸入修改內容：',
            input: 'text',
            inputValue: content,
            showCancelButton: true,
            inputValidator: (value) => {
              if (!value) {
                return '請輸入內容'
              }
            }
        });
        if (newContent) {
            //PATCH API
            const myHeaders = new Headers();
            myHeaders.append("Authorization", jwt)
            myHeaders.append("Content-Type", "application/json");
        
            const raw = JSON.stringify({
                "todo": {
                  "content": newContent
                }
              });
        
            const requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
        
            const response = await fetch(`${apiUrl}/todos/${id}`,requestOptions);
            const result = await response.json();
        
            if (response.ok){
                console.log("修改成功",result);
                toastSuccess("修改成功！");
                getData();
            } else {
                console.log("修改失敗",result);
                toastError("修改失敗！",result.message);
            }
            
        }
        console.log("New content:", newContent);
    } catch(err) {
        console.log('Ooops!',err);
    }
};

todoList.addEventListener("click", (e)=> {
    console.log(e.target);
    //刪除 todo
    if (e.target.getAttribute("class") === "fa fa-times"){
        Swal.fire({
            icon: 'warning',
            title: '確定刪除？',
            text: '刪除後無法復原',
            showCancelButton: true,
            confirmButtonText: '確認',
            cancelButtonText: '取消',
        }) .then ( result => {
            if (result.isConfirmed){
                delTodo(e);
            }
        })
    }
    //toggle todo
    else if (e.target.tagName === "INPUT") { toggleTodo(e); }
    //修改 todo
    else if (e.target.getAttribute("class") === "fa-solid fa-pen"){ editTodo(e); }
})

// 清除所有 todo
const btnDelAll = document.querySelector(".btn-delAll");
btnDelAll.addEventListener("click", () => {
    Swal.fire({
        icon: 'warning',
        title: '確定要刪除已完成項目嗎？',
        text: '刪除後無法復原',
        showCancelButton: true,
        confirmButtonText: '確認',
        cancelButtonText: '取消',
    }) .then ( result => {
        if (result.isConfirmed){
            delAll();
        }
    })    
});

async function delAll (){
    const todos = todoList.querySelectorAll("li");
    todos.forEach( async item => {
        let id = item.getAttribute("data-id");

        if (item.querySelector("input").hasAttribute("checked")){
            // DEL API
            const myHeaders = new Headers();
            myHeaders.append("Authorization",jwt);
    
            const requestOptions = {
                method: 'DELETE',
                headers: myHeaders,
                redirect: 'follow'
              };
        
            const response = await fetch(`${apiUrl}/todos/${id}`,requestOptions);
            const result = await response.json();
    
            if (!response.ok){
                console.log("刪除失敗",result);
                toastError("刪除失敗！",result.message);
            } else {
                console.log("刪除成功",result);
                toastSuccess("刪除成功！");
                getData();
            }
        }
        
    })
}


/*-------- 切換 tab -------- */
let tabStatus = "all";
const tab = document.querySelector(".tab");
tab.addEventListener("click",(e)=> {
    //change tab css
    const tabItems = document.querySelectorAll(".tab li a");
    tabItems.forEach( (item) => { item.classList.remove("active");})
    e.target.classList.add("active");
    //get tab data
    const tabItem = e.target.innerHTML;
    switch(tabItem){
        case "全部":
            // getData(all);
            tabStatus = "all";
            break;
        case "待完成":
            // getData(notDone);
            tabStatus = "notDone";
            break;
        case "已完成":
            // getData(done);
            tabStatus = "done";
            break;
    };
    getData();
})