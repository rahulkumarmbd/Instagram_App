const { Router } = require("express");
const Event = require("../models/event.model");
const router = Router();

const helper = (rest) => {
  const findObj = {};
  for (let key in rest) {
    if (rest[key] && rest[key] != "null") {
      if (key === "isVirtual") {
        findObj[key] = rest[key];
      } else {
        findObj[key] = new RegExp(rest[key], "i");
      }
    }
  }
  return findObj;
};

router.post("", async (req, res) => {
  try {
    const event = await Event.create(req.body);
    return res.status(201).send(event);
  } catch (err) {
    console.log(err);
  }
});

router.get("", async (req, res) => {
  try {
    const { page, limit, ...rest } = req.query;
    const findObj = helper(rest);
    console.log(findObj);
    const skip = (page - 1) * limit;
    const events = await Event.find(findObj)
      .limit(limit)
      .skip(skip)
      .lean()
      .exec();
    const categories = await Event.find({}, { category: 1, _id: 0 })
      .lean()
      .exec();
    const count = await Event.countDocuments(findObj);
    return res.status(200).send({
      events,
      totalPages: Math.ceil(count / limit),
      categories,
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).lean().exec();
    return res.status(200).send(event);
  } catch (err) {
    console.log(err);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const event = await Event.findByIdAndRemove(req.params.id, req.body, {
      new: true,
    })
      .lean()
      .exec();
    return res.status(200).send(event);
  } catch (err) {
    console.log(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id).lean().exec();
    return res.status(200).send(event);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
