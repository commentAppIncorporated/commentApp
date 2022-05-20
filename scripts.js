// `https://getpantry.cloud/apiv1/pantry/d7528db1-c897-4ec6-a9de-4236da836ba3`

// for creating the pantry
// 'https://getpantry.cloud/apiv1/pantry/YOUR_PANTRY_ID'

// for writing to the basket
// https://getpantry.cloud/apiv1/pantry/YOUR_PANTRY_ID/basket/YOUR_BASKET_NAME

// d7528db1-c897-4ec6-a9de-4236da836ba3

// function createPantry () {
//     fetch(`https://getpantry.cloud/apiv1/pantry/d7528db1-c897-4ec6-a9de-4236da836ba3`,
//         {
//             method: 'GET'
//         })
//         .then(r => r.json())
//         .then(r => console.log(r))
// }

comments = document.getElementById("comments");
textArea = document.querySelector("textarea");
input = document.querySelector("input");

const commentApp = {
  apiKey: "d7528db1-c897-4ec6-a9de-4236da836ba3",
  basketName: "commentAppBasket",

  userClicksButton: function (event) {
    event.preventDefault();
    const temp = commentApp.collectCommentApp();
    if (!temp.name || !temp.body) {
      alert("please enter something in the form");
    } else {
      commentApp
        .checkProfanity(`${temp.name} ${temp.body}`)
        .then((res) => {
          if (res === "true") {
            throw new Error("Stop cursing!");
          }
          commentApp.getDataFromApi().then((response) => {
            response.push(commentApp.collectCommentApp());
            commentApp.writeCommentsToPage(response);
            commentApp.writeToApi(response);
            commentApp.clearCommentForm();
          });
        })
        .catch((err) => alert(err));
    }
  },

  clearCommentForm: function () {
    textArea.value = "";
    input.value = "";
  },

  writeToApi: function (newArray) {
    fetch(
      `https://getpantry.cloud/apiv1/pantry/${commentApp.apiKey}/basket/${commentApp.basketName}`, // url
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comments: newArray,
        }),
      }
    );
  },

  collectCommentApp: function () {
    return { name: input.value, body: textArea.value };
  },

  getDataFromApi: function () {
    return fetch(
      `https://getpantry.cloud/apiv1/pantry/${commentApp.apiKey}/basket/${commentApp.basketName}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((r) => r.json())
      .then((r) => r.comments || []);
  },

  loadComments: function () {
    commentApp
      .getDataFromApi()
      .then((response) => commentApp.writeCommentsToPage(response));
  },

  writeCommentsToPage: function (commentArray) {
    comments.innerHTML = "";
    commentArray.forEach((i) => {
      const div = document.createElement("div");
      const h3 = document.createElement("h3");
      h3.textContent = i.name;
      const p = document.createElement("p");
      p.textContent = i.body;
      div.append(h3, p);
      comments.append(div);
    });
  },

  checkProfanity: function (text) {
    return fetch(
      `https://www.purgomalum.com/service/containsprofanity?text=${text}`
    ).then((res) => res.text());
  },

  init: function () {
    document
      .querySelector("form")
      .addEventListener("submit", commentApp.userClicksButton);
    commentApp.loadComments();
  },
};

commentApp.init();
