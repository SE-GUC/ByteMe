const request = require("supertest");
const app = require("../index.js");

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
      token = response.body.data;
      done();
    });
});

afterAll(done => {
  //logout
  done();
});

/* Announcements Tests start here */

const newAnnouncement = {
  //declare new Announcement to be sent in creation
  date: "2019-09-08",
  info: "here's my Announcement test"
};
let createdAnnouncementID; //declare the new Announcement ID variable in a scope accessible by test suite for the specific find function and to be deleted.

describe("Creating an Announcement", () => {
  // token not being sent - should respond with a 401
  test("It should require authorization", () => {
    return request(app)
      .post("/api/announcements")
      .send(newAnnouncement)
      .then(response => {
        expect(response.statusCode).toBe(401);
      });
  });
  // send the token - should respond with a 200
  test("It responds with a JSON - Announcement was created successfully", () => {
    return request(app)
      .post("/api/announcements")
      .send(newAnnouncement)
      .set("Authorization", `${token}`)
      .then(response => {
        createdAnnouncementID = response.body.data._id;
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
        expect(response.body.msg).toBe("Announcement was created successfully");
      });
  });
});

describe("getting a specific Announcement - The one that's just been created", () => {
  // token not being sent - As its not needed
  test("Find specific Announcement by id - No token", () => {
    return request(app)
      .get("/api/announcements/" + createdAnnouncementID)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.data[0].info).toEqual(newAnnouncement.info);
      });
  });
});

describe("getting all Announcements - No token", () => {
  // token not being sent - As its not needed
  test("A JSON response is returned", () => {
    return request(app)
      .get("/api/announcements/")
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      });
  });
});

describe("Updating the Announcement", () => {
  const newAnnouncementUpdate = {
    //declare new Announcement to be sent in creation
    date: "2018-09-08",
    info: "here's my updated Announcement test"
  };
  // token not being sent - should respond with a 401
  test("It should require authorization", () => {
    return request(app)
      .put("/api/announcements/" + createdAnnouncementID)
      .send(newAnnouncementUpdate)
      .then(response => {
        expect(response.statusCode).toBe(401);
      });
  });
  // send the token - should respond with a 200
  test("It responds with a JSON - Announcement updated successfully", () => {
    return request(app)
      .put("/api/announcements/" + createdAnnouncementID)
      .send(newAnnouncementUpdate)
      .set("Authorization", `${token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
        expect(response.body.msg).toBe("Announcement updated successfully");
      });
  });
  //Can be restored if test DB is implemented and not testing on prod

  //Check everything has actually been updated
  //   test("Everything has actually been updated", () => {
  //     return request(app)
  //       .get("/api/announcements/" + createdAnnouncementID)
  //       .then(response => {
  //         expect(response.statusCode).toBe(200);
  //         expect(response.body.data[0].info).toEqual(newAnnouncementUpdate.info);
  //         expect(response.body.data[0].date).toEqual(newAnnouncementUpdate.date);
  //       });
  //   });
});

describe("Deleting an Announcement", () => {
  // token not being sent - should respond with a 401
  test("It should require authorization", () => {
    return request(app)
      .delete("/api/announcements/" + createdAnnouncementID)
      .then(response => {
        expect(response.statusCode).toBe(401);
      });
  });
  // send the token - should respond with a 200
  test("It responds with a JSON - Announcement was deleted successfully", () => {
    return request(app)
      .delete("/api/announcements/" + createdAnnouncementID)
      .set("Authorization", `${token}`)
      .then(response => {
        createdProductID = response.body.data._id;
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
        expect(response.body.msg).toBe("Announcement was deleted successfully");
      });
  });
});
