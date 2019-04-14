const request = require("supertest");
const app = require("../index.js");
const User = require("../models/User").model;

jest.setTimeout(30000);

describe("Registration", async () => {
  test("bad request", () => {
    newUser = {
      email: "testuser@mail.com", //duplicate email
      password: "testuser123"
    };

    return request(app)
      .post("/api/users/register")
      .send(newUser)
      .then(response => {
        expect(response.status).toEqual(400);
      });
  });
  test("duplicate email", () => {
    newUser = {
      email: "testuser@mail.com", //duplicate email
      password: "testuser123",
      first_name: "test",
      last_name: "user",
      birth_date: "10/10/2010",
      guc_id: "00-0002",
      is_private: false
    };

    return request(app)
      .post("/api/users/register")
      .send(newUser)
      .then(response => {
        expect(response.body.error).toEqual(
          "An account with this email already exists"
        );
      });
  });
  test("duplicate GUC ID", () => {
    newUser = {
      email: "testuser2@mail.com",
      password: "testuser123",
      first_name: "test",
      last_name: "user",
      birth_date: "10/10/2010",
      guc_id: "00-0001", //duplicate guc id
      is_private: false
    };

    return request(app)
      .post("/api/users/register")
      .send(newUser)
      .then(response => {
        expect(response.body.error).toEqual(
          "An account with this guc id already exists"
        );
      });
  });
  describe("successes", async () => {
    afterAll(async done => {
      try {
        await User.findOneAndRemove({ email: "jestuser@mail.com" }); //remove user just created
      } catch (err) {
        console.log(err);
      }
      done();
    });
    test("created successfully", async () => {
      newUser = {
        email: "jestuser@mail.com",
        password: "jestuser123",
        first_name: "jest",
        last_name: "user",
        birth_date: "10/10/2010",
        guc_id: "00-0100",
        is_private: false
      };

      return request(app)
        .post("/api/users/register")
        .send(newUser)
        .then(response => {
          expect(response.status).toEqual(200);
        });
    });
  });
});

describe("Login", () => {
  test("bad request", () => {
    return request(app)
      .post("/api/users/login")
      .then(res => {
        expect(res.status).toEqual(400);
      });
  });
  test("wrong email", () => {
    return request(app)
      .post("/api/users/login")
      .send({
        email: "wrongmail@mail.com",
        password: "admin123"
      })
      .then(res => {
        expect(res.body.error).toEqual("No user with this email");
      });
  });
  test("wrong password", () => {
    return request(app)
      .post("/api/users/login")
      .send({
        email: "testadmin@mail.com",
        password: "wrongpassword"
      })
      .then(res => {
        expect(res.body.error).toEqual("wrong password");
      });
  });
  test("success", () => {
    return request(app)
      .post("/api/users/login")
      .send({
        email: "testadmin@mail.com",
        password: "admin123"
      })
      .then(res => {
        expect(res.status).toEqual(200);
      });
  });
});

describe("Profile viewing", () => {
  describe("not logged in", () => {
    test("wrong guc id", () => {
      return request(app)
        .get("/api/users/00-0000")
        .then(res => {
          expect(res.body.error).toEqual("No user with this guc id");
        });
    });
    test("view public user", () => {
      return request(app)
        .get("/api/users/00-0001")
        .then(res => {
          expect(res.body.data.guc_id).toEqual("00-0001");
        });
    });
    test("view private user", () => {
      return request(app)
        .get("/api/users/00-0002")
        .then(res => {
          expect(res.body.message).toEqual("this user is private");
        });
    });
    test("search for users", () => {
      //todo
    });
  });
  describe("logged in", () => {
    var token; //public admin
    var token2; //private user two
    var token3; //public user one
    beforeAll(done => {
      request(app)
        .post("/api/users/login")
        .send({
          email: "testadmin@mail.com",
          password: "admin123"
        })
        .end((err, response) => {
          token = response.body.data; // save the token!
          done();
        });
    });
    beforeAll(done => {
      request(app)
        .post("/api/users/login")
        .send({
          email: "testusertwo@mail.com",
          password: "usertwo123"
        })
        .end((err, response) => {
          token2 = response.body.data; // save the token!
          done();
        });
    });
    beforeAll(done => {
      request(app)
        .post("/api/users/login")
        .send({
          email: "testuser@mail.com",
          password: "testuser123"
        })
        .end((err, response) => {
          token3 = response.body.data; // save the token!
          done();
        });
    });
    test("view profile while logged out", () => {
      return request(app)
        .get("/api/users/profile")
        .then(res => {
          expect(res.status).toEqual(401);
        });
    });
    test("view profile while logged in", () => {
      return request(app)
        .get("/api/users/profile")
        .set("Authorization", `${token2}`)
        .then(res => {
          expect(res.body.data.guc_id).toEqual("00-0002");
        });
    });
    test("view public user that is not me", () => {
      return request(app)
        .get("/api/users/asAdmin/00-0001")
        .set("Authorization", `${token2}`)
        .then(res => {
          expect(res.body.data.guc_id).toEqual("00-0001");
        });
    });
    test("view private user as admin", () => {
      return request(app)
        .get("/api/users/asAdmin/00-0002")
        .set("Authorization", `${token}`)
        .then(res => {
          expect(res.body.data.guc_id).toEqual("00-0002");
        });
    });
    test("view private user that is me", () => {
      return request(app)
        .get("/api/users/asAdmin/00-0002")
        .set("Authorization", `${token2}`)
        .then(res => {
          expect(res.body.data.guc_id).toEqual("00-0002");
        });
    });
    test("view private user that is not me", () => {
      return request(app)
        .get("/api/users/asAdmin/00-0002")
        .set("Authorization", `${token3}`)
        .then(res => {
          expect(res.body.message).toEqual("this user is private");
        });
    });
  });
});

describe("Profile management", async () => {
  describe("own profile", async () => {
    var token;
    beforeAll(done => {
      request(app)
        .post("/api/users/login")
        .send({
          email: "testuser@mail.com",
          password: "testuser123"
        })
        .end((err, response) => {
          token = response.body.data; // save the token!
          done();
        });
    });

    test("not logged in", () => {
      return request(app)
        .put("/api/users/")
        .send({ first_name: "firstname" })
        .then(res => {
          expect(res.status).toEqual(401);
        });
    });
    test("bad request", () => {
      return request(app)
        .put("/api/users/")
        .send({ extra: "extra" })
        .set("Authorization", `${token}`)
        .then(res => {
          expect(res.status).toEqual(400);
        });
    });
    test("duplicate email", () => {
      return request(app)
        .put("/api/users/")
        .send({ email: "testadmin@mail.com" })
        .set("Authorization", `${token}`)
        .then(res => {
          expect(res.body.error).toEqual(
            "An account with the requested email already exists"
          );
        });
    });
    describe("successes", async () => {
      afterAll(async done => {
        try {
          await User.findOneAndUpdate(
            { guc_id: "00-0001" },
            { first_name: "test" },
            { upsert: false }
          );
        } catch (err) {
          console.log(err);
        }
        done();
      });
      test("edited successfully", () => {
        const randName = "name" + Math.random() * 10;
        return request(app)
          .put("/api/users/")
          .send({ first_name: randName })
          .set("Authorization", `${token}`)
          .then(res => {
            expect(res.body["updated user"].first_name).toEqual(randName);
          });
      });
    });
  });

  describe("other profile", async () => {
    var token;
    var token2;
    beforeAll(done => {
      request(app)
        .post("/api/users/login")
        .send({
          email: "testadmin@mail.com",
          password: "admin123"
        })
        .end((err, response) => {
          token = response.body.data; // save the token!
          done();
        });
    });
    beforeAll(done => {
      request(app)
        .post("/api/users/login")
        .send({
          email: "testuser@mail.com",
          password: "testuser123"
        })
        .end((err, response) => {
          token2 = response.body.data; // save the token!
          done();
        });
    });

    describe("edit profile", async () => {
      test("not an admin", () => {
        return request(app)
          .put("/api/users/?gucid=00-0001")
          .send({ first_name: "firstname" })
          .set("Authorization", `${token2}`)
          .then(res => {
            expect(res.status).toEqual(403);
          });
      });
      test("user not found", () => {
        return request(app)
          .put("/api/users/?gucid=00-0000")
          .send({ first_name: "firstname" })
          .set("Authorization", `${token}`)
          .then(res => {
            expect(res.body.error).toEqual("No user with this guc id");
          });
      });
      describe("successes", async () => {
        afterAll(async done => {
          try {
            await User.findOneAndUpdate(
              { guc_id: "00-0001" },
              { first_name: "test" },
              { upsert: false }
            );
          } catch (err) {
            console.log(err);
          }
          done();
        });
        test("edited successfully", () => {
          const randName = "name" + Math.random() * 10;
          return request(app)
            .put("/api/users/?gucid=00-0001")
            .send({ first_name: randName })
            .set("Authorization", `${token}`)
            .then(res => {
              expect(res.body["updated user"].first_name).toEqual(randName);
            });
        });
      });
    });

    describe("edit misc", async () => {
      describe("give admin", async () => {
        test("not an admin", () => {
          return request(app)
            .put("/api/users/giveAdmin")
            .send({
              guc_id: "00-0001"
            })
            .set("Authorization", `${token2}`)
            .then(res => {
              expect(res.status).toEqual(403);
            });
        });
        test("user not found", () => {
          return request(app)
            .put("/api/users/giveAdmin")
            .send({
              guc_id: "00-0000"
            })
            .set("Authorization", `${token}`)
            .then(res => {
              expect(res.body.error).toEqual("No user with this guc id");
            });
        });
        describe("successes", async () => {
          afterAll(async done => {
            try {
              await User.findOneAndUpdate(
                { guc_id: "00-0001" },
                { is_admin: false },
                { upsert: false }
              );
            } catch (err) {
              console.log(err);
            }
            done();
          });
          test("give admin successfully", () => {
            return request(app)
              .put("/api/users/giveAdmin")
              .send({
                guc_id: "00-0001"
              })
              .set("Authorization", `${token}`)
              .then(res => {
                expect(res.body.user.is_admin).toEqual(true);
              });
          });
        });
      });
      describe("give awg admin", async () => {
        test("this user not an awg admin", () => {
          return request(app)
            .put("/api/users/give_awgAdmin")
            .send({
              guc_id: "00-0001"
            })
            .set("Authorization", `${token2}`)
            .then(res => {
              expect(res.body.error).toEqual(
                "this user is not an admin of any AWG"
              );
            });
        });
        test("user not found", () => {
          return request(app)
            .put("/api/users/give_awgAdmin")
            .send({
              guc_id: "00-0000"
            })
            .set("Authorization", `${token}`)
            .then(res => {
              expect(res.body.error).toEqual("No user with this guc id");
            });
        });
        test("other user is an awg admin", () => {
          return request(app)
            .put("/api/users/give_awgAdmin")
            .send({
              guc_id: "00-1000"
            })
            .set("Authorization", `${token}`)
            .then(res => {
              expect(res.body.error).toEqual("that user is an admin of an AWG");
            });
        });
        describe("successes", async () => {
          afterAll(async done => {
            try {
              await User.findOneAndUpdate(
                { guc_id: "00-0001" },
                { awg_admin: "none" },
                { upsert: false }
              );
            } catch (err) {
              console.log(err);
            }
            done();
          });
          test("give admin successfully", () => {
            return request(app)
              .put("/api/users/give_awgAdmin")
              .send({
                guc_id: "00-0001"
              })
              .set("Authorization", `${token}`)
              .then(res => {
                expect(res.body.user.awg_admin).toEqual("mun");
              });
          });
        });
      });
    });
  });

  var token;
  describe("forefit", async () => {
    beforeAll(async done => {
      request(app)
        .post("/api/users/login")
        .send({
          email: "testuser@mail.com",
          password: "testuser123"
        })
        .end((err, response) => {
          token = response.body.data; // save the token!
          done();
        });
      await User.findOneAndUpdate(
        { guc_id: "00-0001" },
        {
          awg_admin: "test",
          is_admin: true
        },
        { upsert: true }
      );
    });
    afterAll(async done => {
      await User.findOneAndUpdate(
        { guc_id: "00-0001" },
        {
          awg_admin: "none",
          is_admin: false
        },
        { upsert: true }
      );
      done();
    });
    test("forefit AWG admin", () => {
      return request(app)
        .put("/api/users/forefit_awgAdmin")
        .set("Authorization", `${token}`)
        .then(res => {
          expect(res.body.message).toEqual("you are no longer an admin!");
        });
    });
    test("forefit admin", () => {
      return request(app)
        .put("/api/users/forefitAdmin")
        .set("Authorization", `${token}`)
        .then(res => {
          expect(res.body.message).toEqual("you are no longer an admin!");
        });
    });
  });
});

describe("Delete profile", async () => {
  var token;
  beforeAll(async done => {
    newUser = {
      email: "jestuser@mail.com",
      password: "jestuser123",
      first_name: "jest",
      last_name: "user",
      birth_date: "10/10/2010",
      guc_id: "00-0009",
      is_private: false
    };
    newUser2 = {
      email: "jestuser2@mail.com",
      password: "jestuser123",
      first_name: "jest",
      last_name: "user",
      birth_date: "10/10/2010",
      guc_id: "00-0008",
      is_private: false
    };

    request(app)
      .post("/api/users/register")
      .send(newUser)
      .end((err, response) => {
        request(app)
          .post("/api/users/register")
          .send(newUser2)
          .end((err, response) => {
            request(app)
              .post("/api/users/login")
              .send({
                email: "jestuser@mail.com",
                password: "jestuser123"
              })
              .end((err, response) => {
                token = response.body.data; // save the token!
                done();
              });
          });
      });
    var token2;
    var token3;
  });
  beforeAll(done => {
    request(app)
      .post("/api/users/login")
      .send({
        email: "testadmin@mail.com",
        password: "admin123"
      })
      .end((err, response) => {
        token2 = response.body.data; // save the token!
        done();
      });
  });
  beforeAll(done => {
    request(app)
      .post("/api/users/login")
      .send({
        email: "testuser@mail.com",
        password: "testuser123"
      })
      .end((err, response) => {
        token3 = response.body.data; // save the token!
        done();
      });
  });
  afterAll(async done => {
    await User.findOneAndDelete({ guc_id: "00-0009" });
    await User.findOneAndDelete({ guc_id: "00-0008" });
  });
  test("not logged in", () => {
    return request(app)
      .delete("/api/users/")
      .then(res => {
        expect(res.status).toEqual(401);
      });
  });

  test("successfully delete my profile", () => {
    return request(app)
      .delete("/api/users/")
      .set("Authorization", `${token}`)
      .then(res => {
        return expect(res.body.message).toEqual("User deleted!");
      });
  });
  describe("as admin", () => {
    test("not an admin", () => {
      return request(app)
        .delete("/api/users/?gucid=00-0009")
        .set("Authorization", `${token3}`)
        .then(res => {
          return expect(res.body.error).toEqual("User is not an Admin");
        });
    });
    test("no user with this id", () => {
      return request(app)
        .delete("/api/users/?gucid=00-0000")
        .set("Authorization", `${token2}`)
        .then(res => {
          return expect(res.body.error).toEqual("No user with this guc id");
        });
    });
    test("successfully deleted user profile", () => {
      return request(app)
        .delete("/api/users/?gucid=00-0008")
        .set("Authorization", `${token2}`)
        .then(res => {
          return expect(res.body.message).toEqual("User deleted!");
        });
    });
  });
});

describe("User find with role", async () => {
  beforeAll(async done => {
    await User.findOneAndUpdate(
      { guc_id: "00-0001" },
      { mun_role: "specialjestrole" }
    );
    done();
  });
  afterAll(async done => {
    await User.findOneAndUpdate({ guc_id: "00-0001" }, { mun_role: "none" });
    done();
  });
  test("Searching for role: 'none'", async () => {
    return request(app)
      .get("/api/users/role/none")
      .then(res => {
        expect(res.body.error).toEqual("You can't look for this role!");
        expect(res.status).toEqual(400);
      });
  });
  test("Searching for role that has no users", async () => {
    return request(app)
      .get("/api/users/role/zzzzzz")
      .then(res => {
        expect(res.body.message).toEqual("No users assigned to this role");
      });
  });
  test("Searching for test role", async () => {
    return request(app)
      .get("/api/users/role/specialjestrole")
      .then(res => {
        expect(res.body.data[0].guc_id).toEqual("00-0001");
      });
  });
});

describe("User Search", () => {
  test("bad request", () => {
    return request(app)
      .post("/api/search")
      .send({ rrrrrr: "00-0001" })
      .then(res => {
        return expect(res.status).toEqual(400);
      });
  });
  test("Search with name", () => {
    return request(app)
      .post("/api/search")
      .send({ searchkey: "test user" })
      .then(res => {
        return expect(res.body.users[0].guc_id).toEqual("00-0001");
      });
  });
  test("Search with email", () => {
    return request(app)
      .post("/api/search")
      .send({ searchkey: "testuser@mail.com" })
      .then(res => {
        return expect(res.body.users[0].guc_id).toEqual("00-0001");
      });
  });
  test("Search for private user", () => {
    return request(app)
      .post("/api/search")
      .send({ searchkey: "two" })
      .then(res => {
        var flag =
          res.body.message ==
            "No relevant data. Try searching with another keyword" ||
          (res.body.users && res.body.users.length === 0);
        return expect(flag).toEqual(true);
      });
  });
});
