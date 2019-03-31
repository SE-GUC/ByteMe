const request = require("supertest");
const app = require("../index.js"); // the express server

jest.setTimeout(30000); //setting timeout to 30 seconds instead of the 5 default 3shan el net 5ara fel gam3a

const newPage = {
  //declare new product to be sent in creation
  name: "security_council",
  role_to_control: "council",
  description: "shshsh"
};

let createdPageID;
let addMemberID;

////////////////////////////////////////////////////////////////////////////////////////////////////
describe("Creating Page", () => {
  // token not being sent - should respond with a 401
  var token;
  request(app)
    .post("/api/users/login")
    .send({
      email: "ahabaa@gmail.com",
      password: "AaAA8532a"
    })
    .end((err, response) => {
      token = response.body.data;
    });

  test("It should require authorization", () => {
    return request(app)
      .post("/api/page")
      .send(newPage)
      .then(response => {
        expect(response.statusCode).toBe(401);
      });
  });
  // send the token - should respond with a 200
  test("It responds with a JSON - Created successfully", () => {
    return request(app)
      .post("/api/page")
      .send(newPage)
      .set("Authorization", `${token}`)
      .then(response => {
        createdPageID = response.body.data._id;
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
        expect(response.body.msg).toBe("Page was created successfully");
      });
  });
});
///////////////////////////////////////////////////////////////////////////////////////////////

describe("getting a specific Page - The one that's just been created", () => {
  // token not being sent - As its not needed
  test("Find specific product by name - No token", () => {
    return request(app)
      .get("/api/page/" + createdPageID + "/")
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.data[0].name).toBe("security_council");
      });
  });
});
//////////////////////////////////////////////////////////////////////////////////////////////////
describe("getting all pages - No token", () => {
  // token not being sent - As its not needed
  test("A JSON response is returned", () => {
    return request(app)
      .get("/api/page/")
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
        expect(response.body.data.length).toEqual(1);
      });
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////
describe("getting all events pages - No token", () => {
  // token not being sent - As its not needed
  test("A JSON response is returned", () => {
    return request(app)
      .get("/api/page/" + createdPageID + "/events/")
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
        expect(response.body.data.length).toEqual(0);
      });
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////
describe("getting all members pages - No token", () => {
  // token not being sent - As its not needed
  test("A JSON response is returned", () => {
    return request(app)
      .get("/api/page/" + createdPageID + "/members/")
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
        expect(response.body.data.length).toEqual(0);
      });
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////
describe("Updating the page", () => {
  var token;
  request(app)
    .post("/api/users/login")
    .send({
      email: "ahabaa@gmail.com",
      password: "AaAA8532a"
    })
    .end((err, response) => {
      token = response.body.data;
    });

  const newPageUpdate = {
    description: "updatedDescription"
  };
  // token not being sent - should respond with a 401
  test("It should require authorization", () => {
    return request(app)
      .put("/api/page/" + createdPageID)
      .send(newPageUpdate)
      .then(response => {
        expect(response.statusCode).toBe(401);
      });
  });
  // send the token - should respond with a 200
  test("It responds with a JSON - Page updated", () => {
    return request(app)
      .put("/api/page/" + createdPageID)
      .send(newPageUpdate)
      .set("Authorization", `${token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
        expect(response.body.msg).toBe("updated");
      });
  });
});

describe("Deleting a Page", () => {
  // token not being sent - should respond with a 401

  var token;
  request(app)
    .post("/api/users/login")
    .send({
      email: "ahabaa@gmail.com",
      password: "AaAA8532a"
    })
    .end((err, response) => {
      token = response.body.data;
    });

  test("It should require authorization", () => {
    return request(app)
      .delete("/api/page/" + createdPageID)
      .then(response => {
        expect(response.statusCode).toBe(401);
      });
  });
  // send the token - should respond with a 200
  test("It responds with a JSON - Page Deleted", () => {
    return request(app)
      .delete("/api/page/" + createdPageID)
      .set("Authorization", `${token}`)
      .then(response => {
        createdPageID = response.body.data._id;
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
        expect(response.body.msg).toBe("Page was deleted successfully");
      });
  });
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
describe("add member , set role , delete this memeber", () => {
  // token not being sent - should respond with a 401
  var token;
  request(app)
    .post("/api/users/login")
    .send({
      email: "ahn@gmail.com",
      password: "AaAA8532a"
    })
    .end((err, response) => {
      token = response.body.data;
    });

  const newID = {
    //declare new product to be sent in creation
    guc_id: "40-8752"
  };

  test("It should require authorization", () => {
    return request(app)
      .post("/api/page/" + createdPageID + "/members")
      .send(newID)
      .then(response => {
        expect(response.statusCode).toBe(401);
      });
  });
  // send the token - should respond with a 200
  test("It responds with a JSON - Created successfully", () => {
    return request(app)
      .post("/api/page/" + createdPageID + "/members")
      .send(newID)
      .set("Authorization", `${token}`)
      .then(response => {
        addMemberID = response.body.data;
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
        expect(response.body.msg).toBe("Member was added successfully");
      });
  });

  test("It should require authorization", () => {
    return request(app)
      .put("/api/page/" + createdPageID + "/members/set_role")
      .send(newID)
      .then(response => {
        expect(response.statusCode).toBe(401);
      });
  });
  // send the token - should respond with a 200
  test("It responds with a JSON - Created successfully", () => {
    return request(app)
      .put("/api/page/" + createdPageID + "/members/set_role")
      .send(newID)
      .set("Authorization", `${token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
        expect(response.body.msg).toBe("updated!");
      });
  });

  test("It should require authorization", () => {
    return request(app)
      .delete(
        "/api/page/" + createdPageID + "/members/" + addMemberID + "/40-8752/"
      )
      .then(response => {
        expect(response.statusCode).toBe(401);
      });
  });
  // send the token - should respond with a 200
  test("It responds with a JSON - Page Deleted", () => {
    return request(app)
      .delete(
        "/api/page/" + createdPageID + "/members/" + addMemberID + "/40-8752/"
      )
      .set("Authorization", `${token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
        expect(response.body.msg).toBe("Members was deleted successfully");
      });
  });
});
