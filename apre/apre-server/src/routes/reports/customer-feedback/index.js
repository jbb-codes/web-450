/**
 * Author: Professor Krasso
 * Date: 8/14/24
 * Modified: Jarren Bess, 6/24/2026
 * File: index.js
 * Description: Apre customer feedback API for the customer feedback reports
 *
 * Changes (Jarren Bess, 6/24/2026):
 * - Added GET /feedback-by-channel so the client can display a report showing all
 *   support channels (Email, Phone, Chat, etc.) side by side. Returning every
 *   channel in one response means the user sees the full picture immediately
 *   without having to select a channel first. Average ratings are rounded to two
 *   decimal places inside the database query so the browser always receives
 *   clean values without needing any additional formatting code. Results are
 *   sorted A–Z by channel name so the order is always consistent, regardless
 *   of the order documents happen to be stored in the database.
 */

"use strict";

const express = require("express");
const { mongo } = require("../../../utils/mongo");
const createError = require("http-errors");

const router = express.Router();

/**
 * @description
 *
 * GET /channel-rating-by-month
 *
 * Fetches average customer feedback ratings by channel for a specified month.
 *
 * Example:
 * fetch('/channel-rating-by-month?month=1')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get("/channel-rating-by-month", (req, res, next) => {
  try {
    const { month } = req.query;

    if (!month) {
      return next(createError(400, "month and channel are required"));
    }

    mongo(async (db) => {
      const data = await db
        .collection("customerFeedback")
        .aggregate([
          {
            $addFields: {
              date: { $toDate: "$date" },
            },
          },
          {
            $group: {
              _id: {
                channel: "$channel",
                month: { $month: "$date" },
              },
              ratingAvg: { $avg: "$rating" },
            },
          },
          {
            $match: {
              "_id.month": Number(month),
            },
          },
          {
            $group: {
              _id: "$_id.channel",
              ratingAvg: { $push: "$ratingAvg" },
            },
          },
          {
            $project: {
              _id: 0,
              channel: "$_id",
              ratingAvg: 1,
            },
          },
          {
            $group: {
              _id: null,
              channels: { $push: "$channel" },
              ratingAvg: { $push: "$ratingAvg" },
            },
          },
          {
            $project: {
              _id: 0,
              channels: 1,
              ratingAvg: 1,
            },
          },
        ])
        .toArray();

      res.send(data);
    }, next);
  } catch (err) {
    console.error("Error in /rating-by-date-range-and-channel", err);
    next(err);
  }
});

/**
 * @description
 *
 * GET /feedback-by-channel
 *
 * Fetches total feedback count and average rating grouped by channel.
 *
 * Example:
 * fetch('/feedback-by-channel')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get("/feedback-by-channel", (req, res, next) => {
  try {
    mongo(async (db) => {
      const data = await db
        .collection("customerFeedback")
        .aggregate([
          {
            $group: {
              _id: "$channel",
              feedbackCount: { $sum: 1 },
              ratingAvg: { $avg: "$rating" },
            },
          },
          {
            $project: {
              _id: 0,
              channel: "$_id",
              feedbackCount: 1,
              // Two decimal places keeps values readable in table cells without extra formatting in the client.
              ratingAvg: { $round: ["$ratingAvg", 2] },
            },
          },
          // Alphabetical order makes the table consistent across requests
          // regardless of document insertion order in the collection.
          {
            $sort: { channel: 1 },
          },
        ])
        .toArray();

      res.send(data);
    }, next);
  } catch (err) {
    console.error("Error in /feedback-by-channel", err);
    next(err);
  }
});

module.exports = router;
