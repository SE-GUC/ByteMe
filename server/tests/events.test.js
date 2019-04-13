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

/* Event Tests start here */

const newEvent = {
  title: "Free Stickers from stickville",
  brief: "free stickers for everyone",
  location: "GUC",
  dateTime: "2019-04-04T00:00:00.000Z",
  description: "Stickers for free at stickville booth",
  creator: "Moaz Kassab"
};
let createdEventID;

describe("Creating an Event", () => {
  test("It should require authorization", () => {
    return request(app)
      .post("/api/events/addevent")
      .send(newEvent)
      .then(response => {
        expect(response.statusCode).toBe(401);
      });
  });
  test("It responds with a JSON - Event was created successfully", () => {
    return request(app)
      .post("/api/events/addevent")
      .send(newEvent)
      .set("Authorization", `${token}`)
      .then(response => {
        createdEventID = response.body.data._id;
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
        expect(response.body.msg).toBe("Event was created successfully");
      });
  });
});

describe("getting a specific Event - The one that's just been created", () => {
  test("Find specific Event by id - No token", () => {
    return request(app)
      .get("/api/events/" + createdEventID)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.data.title).toEqual(newEvent.title);
      });
  });
});

describe("getting all events - No token", () => {
  test("A JSON response is returned", () => {
    return request(app)
      .get("/api/events/")
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      });
  });
});
describe("full text search events - No token", () => {
  const key = {
    //declare new club to be sent in creation
    searchkey: `blablala 1233 ${newEvent.title} aa jsd ${
      newEvent.description
    } jdsj ${newEvent.brief} vcdvsjkbkjbs ${newEvent.location}`
  };
  // token not being sent - As its not needed
  test("A JSON response is returned", () => {
    return request(app)
      .post("/api/search")
      .send(key)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
        expect(response.body.events[0].title).toBe(newEvent.title);
        expect(response.body.events[0].description).toBe(newEvent.description);
        expect(response.body.events[0].brief).toBe(newEvent.brief);
        expect(response.body.events[0].description).toBe(newEvent.description);
      });
  });
});

describe("Updating an event", () => {
  const newEventUpdate = {
    title: "Free Stickers from stickville2",
    brief: "free stickers for everyone2",
    location: "GUC2",
    dateTime: "2019-04-05T00:00:00.000Z",
    description: "Stickers for free at stickville booth2",
    creator: "Moaz Kassab2"
  };
  test("It should require authorization", () => {
    return request(app)
      .put("/api/events/" + createdEventID)
      .send(newEventUpdate)
      .then(response => {
        expect(response.statusCode).toBe(401);
      });
  });
  test("It responds with a JSON - Event updated", () => {
    return request(app)
      .put("/api/events/" + createdEventID)
      .send(newEventUpdate)
      .set("Authorization", `${token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
        expect(response.body.msg).toBe("Event updated successfully");
      });
  });
  test("Everything has actually been updated", () => {
    return request(app)
      .get("/api/events/" + createdEventID)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.data._id).toBe(createdEventID);
        expect(response.body.data.title).toBe(newEventUpdate.title);
        expect(response.body.data.brief).toBe(newEventUpdate.brief);
        expect(response.body.data.location).toBe(newEventUpdate.location);
        expect(response.body.data.dateTime).toBe(newEventUpdate.dateTime);
        expect(response.body.data.description).toBe(newEventUpdate.description);
        expect(response.body.data.creator).toBe(newEventUpdate.creator);
      });
  });
});

describe("Adding a photo to existing event - The one just created, and getting it in event photos, then deleting it", () => {
  const photoToBeAdded = {
    link: "omar.com"
  };
  var photoAddedID;
  test("Adding a photo should require authorization", () => {
    return request(app)
      .post("/api/events/" + createdEventID + "/addphoto")
      .send(photoToBeAdded)
      .then(response => {
        expect(response.statusCode).toBe(401);
      });
  });
  test("Worked with Authorization - Photo Added", () => {
    return request(app)
      .post("/api/events/" + createdEventID + "/addphoto")
      .send(photoToBeAdded)
      .set("Authorization", `${token}`)
      .then(response => {
        expect(response.body.data.photos[0].link).toBe(photoToBeAdded.link);
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
        expect(response.body.msg).toBe("Photo added successfully");
      });
  });
  test("Photo exists when getting photos of the event - no token", () => {
    return request(app)
      .get("/api/events/" + createdEventID + "/viewphotos")
      .set("Authorization", `${token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
        expect(response.body.data[0].link).toBe(photoToBeAdded.link);
        photoAddedID = response.body.data[0]._id;
      });
  });
  test("Deleting photo should require authorization", () => {
    return request(app)
      .delete(
        "/api/events/" + createdEventID + "/" + photoAddedID + "/deletephoto"
      )
      .then(response => {
        expect(response.statusCode).toBe(401);
      });
  });
  test("Worked with authorization - Photo deleted", () => {
    return request(app)
      .delete(
        "/api/events/" + createdEventID + "/" + photoAddedID + "/deletephoto"
      )
      .set("Authorization", `${token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
        expect(response.body.msg).toBe("Photo was deleted successfully");
      });
  });
});

describe("Adding Feedback to existing event - The one just created, and getting it in event feedback, then deleting it", () => {
  const feedbackToBeAdded = {
    content: "omar.test",
    rating: 4
  };
  var feedbackAddedID;
  test("Adding feedback to event- no token", () => {
    return request(app)
      .post("/api/events/" + createdEventID + "/addfeedback")
      .send(feedbackToBeAdded)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
        expect(response.body.msg).toBe("Feedback was created successfully");
      });
  });

  test("Feedback exists when getting feedback of the event - no token", () => {
    return request(app)
      .get("/api/events/" + createdEventID + "/viewfeedback")
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
        expect(response.body.data[0].content).toBe(feedbackToBeAdded.content);
        expect(response.body.data[0].rating).toBe(feedbackToBeAdded.rating);
        feedbackAddedID = response.body.data[0]._id;
      });
  });

  test("Deleting photo should require authorization", () => {
    return request(app)
      .delete(
        "/api/events/" +
          createdEventID +
          "/" +
          feedbackAddedID +
          "/deletefeedback"
      )
      .then(response => {
        expect(response.statusCode).toBe(401);
      });
  });
  test("Worked with authorization - Photo deleted", () => {
    return request(app)
      .delete(
        "/api/events/" +
          createdEventID +
          "/" +
          feedbackAddedID +
          "/deletefeedback"
      )
      .set("Authorization", `${token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
        expect(response.body.msg).toBe("Feedback was deleted successfully");
      });
  });
});

describe("Deleting an event", () => {
  test("It should require authorization", () => {
    return request(app)
      .delete("/api/events/" + createdEventID)
      .then(response => {
        expect(response.statusCode).toBe(401);
      });
  });
  test("It responds with a JSON - Event Deleted", () => {
    return request(app)
      .delete("/api/events/" + createdEventID)
      .set("Authorization", `${token}`)
      .then(response => {
        expect(createdEventID).toBe(response.body.data._id);
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
        expect(response.body.msg).toBe("Event was deleted successfully");
      });
  });
});
