const request = require("supertest");
const app = require("../index.js");

jest.setTimeout(30000);

let token;

beforeAll(done => {
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

const newLibrary = {
  name: "maannn",
  date: "2019-09-08T00:00:00.000Z",
  link: "http://sadsa.com",
  year: 2019
};
let createdLibraryID;

describe("Creating a Library", () => {
  // token not being sent - should respond with a 401
  test("It should require authorization", () => {
    return request(app)
      .post("/api/Library")
      .send(newLibrary)
      .then(response => {
        expect(response.statusCode).toBe(401);
      });
  });
  test("It responds with a JSON - Created successfully", () => {
    return request(app)
      .post("/api/Library")
      .send(newLibrary)
      .set("Authorization", `${token}`)
      .then(response => {
        createdLibraryID = response.body.data._id;
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
        expect(response.body.msg).toBe("Entry was created successfully");
      });
  });
});
describe("getting a specific Library - The one that's just been created", () => {
  // token not being sent - As its not needed
  test("Find specific Library by name - No token", () => {
    return request(app)
      .get("/api/library/" + newLibrary.name)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.data[0].name).toBe(newLibrary.name);
      });
  });
});
describe("getting all libraries - No token", () => {
  // token not being sent - As its not needed
  test("A JSON response is returned", () => {
    return request(app)
      .get("/api/library/")
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      });
  });
});
describe("Updating the library", () => {
  const newLibraryUpdate = {
    name: "maannn",
    date: "2019-06-08T00:00:00.000Z",
    link: "http://sadsa.com",
    year: 2020
  };
  test("It should require authorization", () => {
    return request(app)
      .put("/api/library/" + createdLibraryID)
      .send(newLibraryUpdate)
      .then(response => {
        expect(response.statusCode).toBe(401);
      });
  });
  test("It responds with a JSON - library updated", () => {
    return request(app)
      .put("/api/library/" + createdLibraryID)
      .send(newLibraryUpdate)
      .set("Authorization", `${token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
        expect(response.body.msg).toBe("Entry updated successfully");
      });
  });
  test("Everything has actually been updated", () => {
    return request(app)
      .get("/api/library/" + newLibraryUpdate.name)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.data[0].name).toBe(newLibraryUpdate.name);
        expect(response.body.data[0].year).toBe(newLibraryUpdate.year);
        expect(response.body.data[0].date).toBe(newLibraryUpdate.date);
        expect(response.body.data[0].link).toBe(newLibraryUpdate.link);
      });
  });
});
describe("Deleting a library", () => {
  // token not being sent - should respond with a 401
  test("It should require authorization", () => {
    return request(app)
      .delete("/api/library/" + createdLibraryID)
      .then(response => {
        expect(response.statusCode).toBe(401);
      });
  });
  // send the token - should respond with a 200
  test("It responds with a JSON - library Deleted", () => {
    return request(app)
      .delete("/api/library/" + createdLibraryID)
      .set("Authorization", `${token}`)
      .then(response => {
        createdLibraryID = response.body.data._id;
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
        expect(response.body.msg).toBe(
          "Academic paper was deleted successfully"
        );
      });
  });
});
