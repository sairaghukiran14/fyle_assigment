const API_URI = "https://api.github.com/users/";
const main = document.querySelector("#main");
const userinfo = document.querySelector(".user_info");
const repos = document.querySelector(".repos_section");
const pagination = document.querySelector(".pagination");
const searchitem = document.querySelector("#searchitem");
let filteredSearchrepos = [];
let allrepos = [];
let page_no = 1;
var data = "";
let userinput;
let globalperpage = 10;
let globaluser = "";
let isloading = false;
const getUser = async () => {
  const perpage = Number(document.querySelector("#per_page").value) || 10;
  globalperpage = perpage;

  if (perpage > 100) {
    alert("Please enter a number less than 100");
    return;
  }
  userinput = document.querySelector("#search").value;
  globaluser = userinput;
  isloading = true;
  event.preventDefault();

  if (isloading == true) {
    let newimage = document.createElement("img");
    newimage.classList.add("load");
    newimage.src = "loader.gif";
    repos.appendChild(newimage);
  }

  const response = await fetch(API_URI + userinput);
  data = await response.json();
  const response1 = await fetch(
    API_URI + userinput + `/repos?per_page=${data.public_repos}`
  );
  allrepos = await response1.json();
  const userDetails = `
          <div class="user_image">
            <img
              src=${data.avatar_url}
              alt=""
            />
          </div>
          <div class="user_description">
            <h2>${data.login}</h2>
            <p class="user_bio">${data.bio ? data.bio : "bio"}</p>
            <p class="location">📍 ${
              data.location ? data.location : "Location"
            }</p>
            <div class="github_link">${data.html_url}</div>
          </div>`;
  userinfo.innerHTML = userDetails;

  getRepos(perpage, userinput, page_no);
  pageHandler(perpage);
};

const getRepos = async (perpage, user_name, page_no) => {
  if (isloading == true) {
    let newimage = document.createElement("img");
    newimage.classList.add("load");
    newimage.src = "loader.gif";
    repos.innerHTML = "";
    repos.appendChild(newimage);
  }
  const response = await fetch(
    API_URI + user_name + `/repos?per_page=${perpage}&page=${page_no}`
  );
  const data = await response.json();
  repos.innerHTML = ``;
  const repodetails = data.map(
    (repo) => `<div class="repo"><div class="repo_name">${repo.name}</div>
            <div class="repo_tech">
             <div class="tech">${repo.language}</div>
            </div></div>`
  );
  repos.innerHTML = repodetails.toString().split(",").join("");
};

const searchRepos = async () => {
  const searchtext = searchitem.value;
  if (searchtext.length > 0) {
    filteredSearchrepos = allrepos.filter((value) =>
      value.name.includes(searchtext)
    );
    repos.innerHTML = "";
    console.log(filteredSearchrepos);
    const repodetails = filteredSearchrepos.map(
      (repo) => `<div class="repo"><div class="repo_name">${repo.name}</div>
            <div class="repo_tech">
              <div class="tech">${repo.language}</div>
         
            </div></div>`
    );
    repos.innerHTML = repodetails.toString().split(",").join("");
    pagination.innerHTML = "";
  } else {
    getRepos(globalperpage, globaluser, 1);
    pageHandler(globalperpage, 1);
  }
};

const pageHandler = (per_page, page_no) => {
  pagination.innerHTML = "";
  const limit = Math.round(data.public_repos / per_page);

  for (let i = 1; i <= limit; i++) {
    let newDiv = document.createElement("div");
    newDiv.classList.add("pageno");
    newDiv.id = "id" + i;
    newDiv.innerText = i;
    newDiv.addEventListener("click", function () {
      page_no = newDiv.innerText;
      getRepos(per_page, userinput, page_no);
      const pageId = document.getElementsByClassName(`pageno`);

      Object.entries(pageId).forEach((element) => {
        if (element[1].innerText === page_no) {
          element[1].style.backgroundColor = "blue";
          element[1].style.color = "white";
        } else {
          element[1].style.backgroundColor = "white";
          element[1].style.color = "black";
        }
      });
    });

    pagination.appendChild(newDiv);
  }

  const currentpage = Object.entries(pagination.children).map((item) => {
    if (Number(item[1].innerText) === pageno) {
      item[1].style.backgroundColor = "blue";
      item[1].style.color = "white";
    }
  });
};
