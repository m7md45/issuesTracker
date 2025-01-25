const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  test("Create an issue with every field", function () {
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
        assert.equal(res.body.status, "works??");
        assert.equal(res.status, 200);
        done();
      });
  });

  test("Create an issue with only required fields", function () {
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

  test("Create an issue with missing required fields", function () {
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

  test("View issues on a project", function () {
    chai
      .request(server)
      .get("/api/issues/testing")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        done();
      });
  });

  test("View issues on a project with one filter", function () {
    chai
      .request(server)
      .get("/api/issues/testing?open=true")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        done();
      });
  });

  test("View issues on a project with multiple filters", function () {
    chai
      .request(server)
      .get("/api/issues/testing?open=true&assigned_to=another tester")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        done();
      });
  });

    test("Update one field on an issue", function () {
      chai
        .request(server)
        .put("/api/issues/testing")
        .send({
          _id: "679019181fb28f10c829a9a3",
          issue_title: "first test",
        })
        .end(function (err, res) {
          assert.equal(res.body.result, "successfully updated");
          assert.equal(res.status, 200);
          done();
        });
    });

    test("Update multiple fields on an issue", function () {
      chai
        .request(server)
        .put("/api/issues/testing")
        .send({
          _id: "679019181fb28f10c829a9a3",
          issue_title: "first test",
          issue_text: "test",
        })
        .end(function (err, res) {
          assert.equal(res.body.result, "successfully updated");
          assert.equal(res.status, 200);
          done();
        });
    });

    test("Update an issue with missing _id", function () {
      chai
        .request(server)
        .put("/api/issues/testing")
        .send({
          issue_title: "first test",
        })
        .end(function (err, res) {
          assert.equal(res.body.error, "could not update");
          assert.equal(res.status, 200);
        });
    });

    test("Update an issue with no fields to update", function () {
      chai
        .request(server)
        .put("/api/issues/testing")
        .send({
          _id: "679019181fb28f10c829a9a3",
        })
        .end(function (err, res) {
          assert.equal(res.body.error, "no update field(s) sent");
          assert.equal(res.status, 200);
          done();
        });
    });

    test("Update an issue with an invalid _id", function () {
      chai
        .request(server)
        .put("/api/issues/testing")
        .send({
          _id: "679019181fb28f10c829a9a",
          issue_title: "first test",
        })
        .end(function (err, res) {
          assert.equal(res.body.error, "could not update");
          assert.equal(res.status, 200);
        });
    });

    test("Delete an issue", function () {
      chai
        .request(server)
        .delete("/api/issues/testing")
        .send({
          _id: "679019181fb28f10c829a9a3",
        })
        .end(function (err, res) {
          assert.equal(res.body.result, "successfully deleted");
          assert.equal(res.status, 200);
          done();
        });
    });

    test("Delete an issue with an invalid _id", function () {
      chai
        .request(server)
        .delete("/api/issues/testing")
        .send({
          _id: "679019181fb28f10c829a9a",
        })
        .end(function (err, res) {
          assert.equal(res.body.error, "could not delete");
          assert.equal(res.status, 200);
        });
    });

    test("Delete an issue with missing _id", function () {
      chai
        .request(server)
        .delete("/api/issues/testing")
        .send({})
        .end(function (err, res) {
          assert.equal(res.body.error, "could not delete");
          assert.equal(res.status, 200);
          done();
        });
    });
});
