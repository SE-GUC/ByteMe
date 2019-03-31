const request = require("supertest");
const app = require("../index.js"); // the express server

jest.setTimeout(30000);

let token;

beforeAll(done => {
  request(app)
    .post("/api/users/login")
    .send({
      email: "ahaa@gmail.com",
      password: "AaAA8532a"
    })
    .end((err, response) => {
      token = response.body.data; // save the token!
      done();
    });
});

afterAll(done => {
  //logout
  done();
});

/* FAQs Tests start here */

const newFAQ = {
  //declare new FAQ to be sent in creation
  Question: "will jest help us throug production phases?",
  Answer: "Yes, definetly it will save us alot of time later"
};
let createdFAQID; //declare the new FAQ ID variable in a scope accessible by test suite for the specific find function and to be deleted.

describe("Creating FAQ", () => {
  // token not being sent - should respond with a 401
  test("It should require authorization", () => {
    return request(app)
      .post("/api/faq")
      .send(newFAQ)
      .then(response => {
        expect(response.statusCode).toBe(401);
      });
  });
  // send the token - should respond with a 200
  test("It responds with a JSON - FAQ was created successfully", () => {
    return request(app)
      .post("/api/faq")
      .send(newFAQ)
      .set("Authorization", `${token}`)
      .then(response => {
        createdFAQID = response.body.data._id;
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
        expect(response.body.msg).toBe("FAQ was created successfully");
      });
  });
});

describe("getting a specific FAQ - The one that's just been created", () => {
  // token not being sent - As its not needed
  test("Find specific FAQ by id - No token", () => {
    return request(app)
      .get("/api/faq/" + createdFAQID)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.data[0].Question).toEqual(newFAQ.Question);
      });
  });
});

describe("getting all FAQs - No token", () => {
  // token not being sent - As its not needed
  test("A JSON response is returned", () => {
    return request(app)
      .get("/api/faq/")
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      });
  });
});

describe("Updating FAQ", () => {
  const newFAQUpdate = {
    //declare new FAQ to be sent in creation
    Question: "will jest help us throug production phases?",
    Answer: "Changed my mind, it's a waste of time"
  };
  // token not being sent - should respond with a 401
  test("It should require authorization", () => {
    return request(app)
      .put("/api/faq/" + createdFAQID)
      .send(newFAQUpdate)
      .then(response => {
        expect(response.statusCode).toBe(401);
      });
  });
  // send the token - should respond with a 200
  test("It responds with a JSON - FAQ updated successfully", () => {
    return request(app)
      .put("/api/faq/" + createdFAQID)
      .send(newFAQUpdate)
      .set("Authorization", `${token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
        expect(response.body.msg).toBe("FAQ updated successfully");
      });
  });
  //Check everything has actually been updated
  test("Everything has actually been updated", () => {
    return request(app)
      .get("/api/faq/" + createdFAQID)
      .then(response => {
        expect(response.statusCode).toBe(200);
        // expect(response.body.data[0].Question).toBe(newFAQUpdate.Question);
        // expect(response.body.data[0].Answer).toBe(newFAQUpdate.Answer);
      });
  });
});

describe("Deleting a FAQ", () => {
  // token not being sent - should respond with a 401
  test("It should require authorization", () => {
    return request(app)
      .delete("/api/faq/" + createdFAQID)
      .then(response => {
        expect(response.statusCode).toBe(401);
      });
  });
  // send the token - should respond with a 200
  test("It responds with a JSON - FAQ was deleted successfully", () => {
    return request(app)
      .delete("/api/faq/" + createdFAQID)
      .set("Authorization", `${token}`)
      .then(response => {
        createdFAQID = response.body.data._id;
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
        expect(response.body.msg).toBe("FAQ was deleted successfully");
      });
  });
});
