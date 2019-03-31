const request = require("supertest");
const app = require("../index.js"); // the express server

jest.setTimeout(30000); //setting timeout to 30 seconds instead of the 5 default 3shan el net 5ara fel gam3a

const newPage = {
  //declare new product to be sent in creation
  name: "commitee",
  role_to_control: "commitees",
  description: "shshsh"
};

let createdPageID;
let addMemberID;

describe("getting a specific Page - The one that's just been created", () => {
  // token not being sent - As its not needed
  test("Find specific product by name - No token", () => {
    return request(app)
      .get("/api/page/5c92c3bbed27c105bcda5966/")
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
      .get("/api/page/5c92c3bbed27c105bcda5966/events/")
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
      .get("/api/page/5c92c3bbed27c105bcda5966/members/")
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
        expect(response.body.data.length).toEqual(0);
      });
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////
describe("Creating Page", () => {
  // token not being sent - should respond with a 401
  var token;
  beforeAll(done => {
    request(app)
      .post("/api/users/login")
      .send({
        email: "ahabaa@gmail.com",
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

describe("Updating the page", () => {
  var token;
  beforeAll(done => {
    request(app)
      .post("/api/users/login")
      .send({
        email: "ahabaa@gmail.com",
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

  const newPageUpdate = {
    //declare new product to be sent in creation
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
  beforeAll(done => {
    request(app)
      .post("/api/users/login")
      .send({
        email: "ahabaa@gmail.com",
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
  beforeAll(done => {
    request(app)
      .post("/api/users/login")
      .send({
        email: "ahnad@gmail.com",
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

  const newID = {
    //declare new product to be sent in creation
    guc_id: "40-8752"
  };

  test("It should require authorization", () => {
    return request(app)
      .post("/api/page/5c92c3bbed27c105bcda5966/members")
      .send(newID)
      .then(response => {
        expect(response.statusCode).toBe(401);
      });
  });
  // send the token - should respond with a 200
  test("It responds with a JSON - Created successfully", () => {
    return request(app)
      .post("/api/page/5c92c3bbed27c105bcda5966/members")
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
      .put("/api/page/5c92c3bbed27c105bcda5966/members/set_role")
      .send(newID)
      .then(response => {
        expect(response.statusCode).toBe(401);
      });
  });
  // send the token - should respond with a 200
  test("It responds with a JSON - Created successfully", () => {
    return request(app)
      .put("/api/page/5c92c3bbed27c105bcda5966/members/set_role")
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
        "/api/page/5c92c3bbed27c105bcda5966/members/" +
          addMemberID +
          "/40-8752/"
      )
      .then(response => {
        expect(response.statusCode).toBe(401);
      });
  });
  // send the token - should respond with a 200
  test("It responds with a JSON - Page Deleted", () => {
    return request(app)
      .delete(
        "/api/page/5c92c3bbed27c105bcda5966/members/" +
          addMemberID +
          "/40-8752/"
      )
      .set("Authorization", `${token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
        expect(response.body.msg).toBe("Members was deleted successfully");
      });
  });
});

/*
let token; //declare the token variable in a scope accessible by the entire test suite

beforeAll(done => {
  request(app)
    .post("/api/users/login")
    .send({
      email: "ahabaa@gmail.com",
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

/Product Tests start here 

const newProduct = {
  //declare new product to be sent in creation
  price: 500,
  description: "description",
  pic_ref: "http://sadsa.com",
  name: "mannn"
};
let createdProductID; //declare the new product ID variable in a scope accessible by test suite for the specific find function and to be deleted.

describe("Creating a Product", () => {
  // token not being sent - should respond with a 401
  test("It should require authorization", () => {
    return request(app)
      .post("/api/products")
      .send(newProduct)
      .then(response => {
        expect(response.statusCode).toBe(401);
      });
  });
  // send the token - should respond with a 200
  test("It responds with a JSON - Created successfully", () => {
    return request(app)
      .post("/api/products")
      .send(newProduct)
      .set("Authorization", `${token}`)
      .then(response => {
        createdProductID = response.body.data._id;
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
        expect(response.body.msg).toBe("Product was created successfully");
      });
  });
});

describe("getting a specific Product - The one that's just been created", () => {
  // token not being sent - As its not needed
  test("Find specific product by name - No token", () => {
    return request(app)
      .get("/api/products/" + newProduct.name)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.data[0].name).toBe(newProduct.name);
      });
  });
});

describe("getting all products - No token", () => {
  // token not being sent - As its not needed
  test("A JSON response is returned", () => {
    return request(app)
      .get("/api/products/")
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      });
  });
});

describe("Updating the product", () => {
  const newProductUpdate = {
    //declare new product to be sent in creation
    price: 6969,
    description: "updatedDescription",
    pic_ref: "http://updatedSite.com",
    name: "updatedName"
  };
  // token not being sent - should respond with a 401
  test("It should require authorization", () => {
    return request(app)
      .put("/api/products/" + createdProductID)
      .send(newProductUpdate)
      .then(response => {
        expect(response.statusCode).toBe(401);
      });
  });
  // send the token - should respond with a 200
  test("It responds with a JSON - Product updated", () => {
    return request(app)
      .put("/api/products/" + createdProductID)
      .send(newProductUpdate)
      .set("Authorization", `${token}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
        expect(response.body.msg).toBe("Product updated successfully");
      });
  });
  //Check everything has actually been updated
  test("Everything has actually been updated", () => {
    return request(app)
      .get("/api/products/" + newProductUpdate.name)
      .then(response => {
        expect(response.statusCode).toBe(200);
        //expect(response.body.data[0]._id).toBe(createdProductID);  //Can be restored if test DB is implemented and not testing on prod
        expect(response.body.data[0].name).toBe(newProductUpdate.name);
        expect(response.body.data[0].description).toBe(
          newProductUpdate.description
        );
        expect(response.body.data[0].pic_ref).toBe(newProductUpdate.pic_ref);
        expect(response.body.data[0].price).toBe(newProductUpdate.price);
      });
  });
});

describe("Deleting a Product", () => {
  // token not being sent - should respond with a 401
  test("It should require authorization", () => {
    return request(app)
      .delete("/api/products/" + createdProductID)
      .then(response => {
        expect(response.statusCode).toBe(401);
      });
  });
  // send the token - should respond with a 200
  test("It responds with a JSON - Product Deleted", () => {
    return request(app)
      .delete("/api/products/" + createdProductID)
      .set("Authorization", `${token}`)
      .then(response => {
        createdProductID = response.body.data._id;
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
        expect(response.body.msg).toBe("Product was deleted successfully");
      });
  });
});
*/
