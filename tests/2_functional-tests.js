const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  suite("POST", function () {
    test("Create an issue with every field", function (done) {
      chai
        .request(server)
        .post("/api/issues/testing")
        .send({
          issue_title: "first test",
          issue_text: "test",
          created_by: "tester",
          assigned_to: "another tester",
          status_text: "works??",
        })
        .end(function (err, res) {
          assert.equal(res.body.issue_title, "first test");
          assert.equal(res.body.issue_text, "test");
          assert.equal(res.body.created_by, "tester");
          assert.equal(res.body.assigned_to, "another tester");
          assert.equal(res.body.status_text, "works??");
          assert.equal(res.status, 200);
          done();
        });
    });

    test("Create an issue with only required fields", function (done) {
      chai
        .request(server)
        .post("/api/issues/testing")
        .send({
          issue_title: "first test",
          issue_text: "test",
          created_by: "tester",
        })
        .end(function (err, res) {
          assert.equal(res.body.issue_title, "first test");
          assert.equal(res.body.issue_text, "test");
          assert.equal(res.body.created_by, "tester");
          assert.equal(res.status, 200);
          done();
        });
    });

    test("Create an issue with missing required fields", function (done) {
      chai
        .request(server)
        .post("/api/issues/testing")
        .send({
          issue_title: "",
          issue_text: "",
          created_by: "",
        })
        .end(function (err, res) {
          assert.equal(res.body.error, "required field(s) missing");
          assert.equal(res.status, 200);
          done();
        });
    });
  });
  suite("GET", function () {
    test("View issues on a project", function (done) {
      chai
        .request(server)
        .get("/api/issues/testing")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          done();
        });
    });

    test("View issues on a project with one filter", function (done) {
      chai
        .request(server)
        .get("/api/issues/testing?open=true")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          done();
        });
    });

    test("View issues on a project with multiple filters", function (done) {
      chai
        .request(server)
        .get("/api/issues/testing?open=true&assigned_to=another tester")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          done();
        });
    });
  });
  suite("PUT", function () {
    test("Update one field on an issue", function (done) {
      chai
        .request(server)
        .put("/api/issues/testing")
        .send({
          _id: "6796c7cfa8e7fff04d7e3e6f",
          issue_title: "first test",
        })
        .end(function (err, res) {
          assert.equal(res.body.result, "successfully updated",);
          assert.equal(res.status, 200);
          done();
        });
    });

    test("Update multiple fields on an issue", function (done) {
      chai
        .request(server)
        .put("/api/issues/testing")
        .send({
          _id: "6796c7cfa8e7fff04d7e3e6f",
          issue_title: "first test",
          issue_text: "test",
        })
        .end(function (err, res) {
          assert.equal(res.body.result, "successfully updated");
          assert.equal(res.status, 200);
          done();
        });
    });

    test("Update an issue with missing _id", function (done) {
      chai
        .request(server)
        .put("/api/issues/testing")
        .send({
          issue_title: "first test",
        })
        .end(function (err, res) {
          assert.equal(res.body.error, "missing _id");
          assert.equal(res.status, 200);
          done();
        });
    });

    test("Update an issue with no fields to update", function (done) {
      // Added done parameter
      chai
        .request(server)
        .put("/api/issues/testing")
        .send({
          _id: "6796cadfb6548fdf758cc233",
        })
        .end(function (err, res) {
          assert.equal(res.body.error, "no update field(s) sent" );
          assert.equal(res.status, 200);
          done(); // Call done to signal the end of the test
        });
    });

    test("Update an issue with an invalid _id", function (done) {
      // Added done parameter
      chai
        .request(server)
        .put("/api/issues/testing")
        .send({
          _id: "invalid_id",
          issue_title: "first test",
        })
        .end(function (err, res) {
          assert.equal(res.body.error, "could not update");
          assert.equal(res.status, 200);
          done(); // Call done to signal the end of the test
        });
    });
  });
  suite("DELETE", function () {
    test("Delete an issue", function (done) {
      // Added done parameter
      chai
        .request(server)
        .delete("/api/issues/testing")
        .send({
          _id: "6796d3b2e72f69c3a3d0a3dd",
        })
        .end(function (err, res) {
          assert.equal(res.body.result, "successfully deleted");
          assert.equal(res.status, 200);
          done(); // Call done to signal the end of the test
        });
    });

    test("Delete an issue with an invalid _id", function (done) {
      // Added done parameter
      chai
        .request(server)
        .delete("/api/issues/testing")
        .send({
          _id: "invalid_id",
        })
        .end(function (err, res) {
          assert.equal(res.body.error, "could not delete");
          assert.equal(res.status, 200);
          done(); // Call done to signal the end of the test
        });
    });

    test("Delete an issue with missing _id", function (done) {
      chai
        .request(server)
        .delete("/api/issues/testing")
        .send({})
        .end(function (err, res) {
          assert.equal(res.body.error, "missing _id");
          assert.equal(res.status, 200);
          done();
        });
    });
  });
});
