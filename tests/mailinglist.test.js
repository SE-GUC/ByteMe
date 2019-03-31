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

/* Mailing list Tests start here */

const newMail = {
  //declare new mail to be sent in creation
  email: "testing@jest.com"
};
let createdMailID; //declare the new mail ID variable in a scope accessible by test suite for the specific find function and to be deleted.

describe("Creating a subscription", () => {
  // token not needed- should respond with a 200
  test("It responds with a JSON - Subscribed successfully", () => {
    return request(app)
      .post("/api/mailing_list")
      .send(newMail)
      .then(response => {
        createdMailID = response.body.data._id;
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
        expect(response.body.msg).toBe("Subscribed successfully");
      });
  });
});

describe("getting the whole mailing list - The one that's just been created", () => {
  // token not being sent - should respond with a 401
  test("It should require authorization", () => {
    return request(app)
      .get("/api/mailing_list/")
      .then(response => {
        expect(response.statusCode).toBe(401);
      });
  });

  // send the token - should respond with a 200
  test("A JSON response is returned", () => {
    return request(app)
      .get("/api/mailing_list")
      .set("Authorization", `${token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      });
  });
});

describe("Deleting a subscription by id", () => {
  // token not being sent - should respond with a 401
  test("It should require authorization", () => {
    return request(app)
      .delete("/api/mailing_list/" + createdMailID)
      .then(response => {
        expect(response.statusCode).toBe(401);
      });
  });
  // send the token - should respond with a 200
  test("It responds with a JSON - Mail was deleted successfully", () => {
    return request(app)
      .delete("/api/mailing_list/" + createdMailID)
      .set("Authorization", `${token}`)
      .then(response => {
        createdMailID = response.body.data._id;
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
        expect(response.body.msg).toBe("Mail was deleted successfully");
      });
  });
});
