"use strict";
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const { version } = require("chai");
const conn = process.env.db_connection;
mongoose.connect(conn);

const issueSchema = mongoose.Schema(
  {
    issue_title: String,
    issue_text: String,
    created_on: Date,
    updated_on: Date,
    created_by: String,
    assigned_to: String,
    open: Boolean,
    status_text: String,
  },
  { collection: "issues" }
);

const issues = mongoose.model("issues", issueSchema);
module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(async function (req, res) {
      let project = req.params.project;
      const documnets = await issues.find().select("-__v");
      res.json(documnets);
    })

    .post(async function (req, res) {
      let project = req.params.project;
      const input = req.body;
      if (input.issue_title && input.issue_text && input.created_by) {
        const issue = new issues({
          issue_title: input.issue_title,
          issue_text: input.issue_text,
          created_on: new Date().toISOString(),
          updated_on: new Date().toISOString(),
          created_by: input.created_by || "",
          assigned_to: input.assigned_to || "",
          open: false,
          status_text: input.status_text || "",
        });
        await issue.save();
        res.json({
          issue_title: input.issue_title,
          issue_text: input.issue_text,
          created_on: new Date().toISOString(),
          updated_on: new Date().toISOString(),
          created_by: input.created_by || "",
          assigned_to: input.assigned_to || "",
          open: false,
          status_text: input.status_text || "",
        });
      } else {
        res.json({ error: "required field(s) missing" });
      }
    })

    .put(async function (req, res) {
      let project = req.params.project;
      const input = req.body;
      if (!input._id) {
        return res.json({ error: "missing _id" });
      }
      if (
        !input.issue_title &&
        !input.issue_text &&
        !input.created_by &&
        !input.assigned_to &&
        !input.open &&
        !input.status_text
      ) {
        return res.json({ error: "no update field(s) sent", _id: input._id });
      }
      issues
        .findByIdAndUpdate(
          { _id: input._id },
          {
            issue_title: input.issue_title,
            issue_text: input.issue_text,
            updated_on: new Date().toISOString(),
            created_by: input.created_by,
            assigned_to: input.assigned_to,
            open: input.open,
            status_text: input.status_text,
          }
        )
        .select("-__v")
        .then((updated) => {
          if (updated) {
            res.json({ result: "successfully updated", _id: input._id });
          }
        })
        .catch((err) => {
          res.json({ error: "could not update", _id: input._id });
        });
    })

    .delete(async function (req, res) {
      let project = req.params.project;
      const input = req.body;
      if (!input._id) {
        return res.json({ error: "missing _id" });
      }
      issues
        .findByIdAndDelete(input._id)
        .then((deleted) => {
          if (deleted) {
            res.json({ result: 'successfully deleted', '_id': input._id });
          }
        })
        .catch((err) => {
          res.json({ error: "could not delete", _id: input._id });
        });
    });
};
