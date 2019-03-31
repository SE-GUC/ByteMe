const request = require("supertest");
const app = require("../index.js");

jest.setTimeout(30000);

let token;

beforeAll(done => {
  request(app)
    .post("/api/users/login")
    .send({
      email: "testadmin@mail.com",
      password: "admin123"
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

/* Clubs Tests start here */

const newClub = {
  //declare new club to be sent in creation
  name: "3point",
  description: "7afalat w bta3 bla bla bla",
  banner: "efsel ba bla bla baa",
  link: "3point.com"
};
let createdClubID; //declare the new club ID variable in a scope accessible by test suite for the specific find function and to be deleted.

describe("Creating a Club", () => {
  // token not being sent - should respond with a 401
  test("It should require authorization", () => {
    return request(app)
      .post("/api/clubs/addclub")
      .send(newClub)
      .then(response => {
        expect(response.statusCode).toBe(401);
      });
  });
  // send the token - should respond with a 200
  test("It responds with a JSON - Club was created successfully", () => {
    return request(app)
      .post("/api/clubs/addclub")
      .send(newClub)
      .set("Authorization", `${token}`)
      .then(response => {
        createdClubID = response.body.data._id;
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
        expect(response.body.msg).toBe("Club was created successfully");
      });
  });
});

describe("getting a specific Club - The one that's just been created", () => {
  // token not being sent - As its not needed
  test("Find specific club by id - No token", () => {
    return request(app)
      .get("/api/clubs/" + createdClubID)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.data[0].name).toBe(newClub.name);
      });
  });
});

describe("getting all clubs - No token", () => {
  // token not being sent - As its not needed
  test("A JSON response is returned", () => {
    return request(app)
      .get("/api/clubs/")
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      });
  });
});

describe("Updating the club", () => {
  const newClubUpdate = {
    //declare new club to be sent in creation
    name: "3point",
    description: "7afalat etla3'et",
    banner: "rakez",
    link: "3point.com"
  };
  // token not being sent - should respond with a 401
  test("It should require authorization", () => {
    return request(app)
      .put("/api/clubs/" + createdClubID)
      .send(newClubUpdate)
      .then(response => {
        expect(response.statusCode).toBe(401);
      });
  });
  // send the token - should respond with a 200
  test("It responds with a JSON - Club updated successfully", () => {
    return request(app)
      .put("/api/clubs/" + createdClubID)
      .send(newClubUpdate)
      .set("Authorization", `${token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
        expect(response.body.msg).toBe("Club updated successfully");
      });
  });
  //Check everything has actually been updated
  test("Everything has actually been updated", () => {
    return request(app)
      .get("/api/clubs/" + createdClubID)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.data[0].name).toBe(newClubUpdate.name);
        expect(response.body.data[0].description).toBe(
          newClubUpdate.description
        );
        expect(response.body.data[0].banner).toBe(newClubUpdate.banner);
        expect(response.body.data[0].link).toBe(newClubUpdate.link);
      });
  });
});

describe("Deleting a Club", () => {
  // token not being sent - should respond with a 401
  test("It should require authorization", () => {
    return request(app)
      .delete("/api/clubs/" + createdClubID)
      .then(response => {
        expect(response.statusCode).toBe(401);
      });
  });
  // send the token - should respond with a 200
  test("It responds with a JSON - Club was deleted successfully", () => {
    return request(app)
      .delete("/api/clubs/" + createdClubID)
      .set("Authorization", `${token}`)
      .then(response => {
        createdClubID = response.body.data._id;
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
        expect(response.body.msg).toBe("Club was deleted successfully");
      });
  });
});
