import h from "./hyperscript.mjs";

const test1 = () => {
  console.log("BEGIN TEST.");

  const elem = h(
    "div#win",
    {
      style: {
        width: 100,
        height: 200,
        overflow: "auto"
      }
    },
    h("div#logArea"),
    h("span#prompt", " > ", {
      style: {
        color: "black",
        "background-color": "blue"
      }
    }),
    h("span#editArea", {
      contentEditable: true,
      style: { color: "black" }
    }),
    h("div#paddingArea")
  );

  document.body.appendChild(elem);
  console.log(elem);

  console.log("END TEST.");
};

const main = () => {
  test1();
};

window.onload = main;
