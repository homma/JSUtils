import http from "http";
import fs from "fs";

const port = 8080;

const server = http.createServer();

server.on("request", (req, res) => {
  const file = get_filename(req);

  console.log(`Access: ${file}`);

  if (fs.existsSync(file)) {
    const header = create_header(req);
    const contents = fs.readFileSync(file);

    res.writeHead(200, header);
    res.end(contents);
  } else {
    res.writeHead(404, "Not Found");
    res.end();
  }
});

const get_filename = req => {
  let file = remove_query(req.url);

  if (file == "/") {
    file = "index.html";
  }

  if (file.startsWith("/")) {
    file = "." + file;
  }

  return file;
};

const remove_query = url => {
  return url.split("?")[0].split("#")[0];
};

const create_header = req => {
  const file = remove_query(req.url);

  const suffix = file.split(".").pop();

  const type_list = {
    txt: "text/plain",
    html: "text/html",
    css: "text/css",
    js: "text/javascript",
    mjs: "text/javascript",
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    gif: "image/gif",
    png: "image/png"
  };

  // default
  let content_type = "text/plain";

  if (Object.keys(type_list).includes(suffix)) {
    content_type = type_list[suffix];
  }

  const header = { "Content-Type": content_type };

  return header;
};

server.listen(port);
