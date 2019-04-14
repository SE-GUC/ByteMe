const request = require("supertest");
const app = require("../index.js"); // the express server

jest.setTimeout(30000); //setting timeout to 30 seconds instead of the 5 default 3shan el net 5ara fel gam3a
let token;
let token2; //for the member management, needs council admin

const newPage = {
  //declare new product to be sent in creation
  name: "security_council",
  role_to_control: "council",
  description: "shshsh"
};

let createdPageID;
let addMemberID;
beforeAll(done => {
  request(app)
    .post("/api/users/login")
    .send({
      email: "ahn@gmail.com",
      password: "AaAA8532a"
    })
    .end((err, response) => {
      token2 = response.body.data;
    });

  request(app)
    .post("/api/users/login")
    .send({
      email: "ahabaa@gmail.com",
      password: "AaAA8532a"
    })
    .end((err, response) => {
      token = response.body.data;
      done();
    });
});

afterAll(done => {
  //logout
  done();
});

////////////////////////////////////////////////////////////////////////////////////////////////////
describe("Creating Page", () => {
  test("It should require authorization", () => {
    return request(app)
      .post("/api/page")
      .send(newPage)
      .then(response => {
        expect(response.statusCode).toBe(401);
      });
  });
  test("It responds with a JSON - Created successfully", () => {
    return request(app)
      .post("/api/page")
      .send(newPage)
      .set("Authorization", `${token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
        expect(response.body.msg).toBe("Page was created successfully");
        createdPageID = response.body.data._id;
      });
  });
});
///////////////////////////////////////////////////////////////////////////////////////////////

describe("getting a specific Page - The one that's just been created", () => {
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
  test("A JSON response is returned", () => {
    return request(app)
      .get("/api/page/")
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      });
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////
describe("getting all events pages - No token", () => {
  test("A JSON response is returned", () => {
    return request(app)
      .get("/api/page/" + createdPageID + "/events/")
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      });
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////
describe("getting all members pages - No token", () => {
  test("A JSON response is returned", () => {
    return request(app)
      .get("/api/page/" + createdPageID + "/members/")
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      });
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////
describe("Updating the page", () => {
  const newPageUpdate = {
    description: "updatedDescription"
  };
  test("It should require authorization", () => {
    return request(app)
      .put("/api/page/" + createdPageID)
      .send(newPageUpdate)
      .then(response => {
        expect(response.statusCode).toBe(401);
      });
  });
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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
describe("add member , set role , delete this memeber", () => {
  const newID = {
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
  test("It responds with a JSON - Created successfully", () => {
    return request(app)
      .post("/api/page/" + createdPageID + "/members")
      .send(newID)
      .set("Authorization", `${token2}`)
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
  test("It responds with a JSON - Created successfully", () => {
    return request(app)
      .put("/api/page/" + createdPageID + "/members/set_role")
      .send(newID)
      .set("Authorization", `${token2}`)
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
  test("It responds with a JSON - Page Deleted", () => {
    return request(app)
      .delete(
        "/api/page/" + createdPageID + "/members/" + addMemberID + "/40-8752/"
      )
      .set("Authorization", `${token2}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
        expect(response.body.msg).toBe("Members was deleted successfully");
      });
  });
});
////////////////////////////////////////////////////////////////////
describe("Deleting a Page", () => {
  test("It should require authorization", () => {
    return request(app)
      .delete("/api/page/" + createdPageID)
      .then(response => {
        expect(response.statusCode).toBe(401);
      });
  });
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
