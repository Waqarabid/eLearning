import AWS from "aws-sdk";
import { nanoid } from "nanoid";
import Course from "../models/course";
import slugify from "slugify";
import { readFileSync } from "fs";

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  apiVersion: process.env.AWS_API_VERSION,
};

const S3 = new AWS.S3(awsConfig);

export const uploadImage = async (req, res) => {
  // console.log(req.body);
  try {
    const { image } = req.body;
    if (!image) return res.status(400).send("Image is required");

    // prepare the image to upload to S3
    const base64Data = new Buffer.from(
      image.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );

    const type = image.split(";")[0].split("/")[1];

    // image params
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `${nanoid()}.${type}`,
      Body: base64Data,
      ACL: "public-read",
      ContentEncoding: "base64",
      ContentType: `image/${type}`,
    };

    // upload image to S3
    S3.upload(params, async (err, data) => {
      if (err) {
        console.log(err);
        return res.status(400).send("Image upload failed. Try later.");
      }

      console.log(data);
      return res.status(200).send(data);
    });
  } catch (err) {
    console.log(err);
  }
};

export const removeImage = async (req, res) => {
  try {
    const { image } = req.body;
    // image params
    const params = {
      Bucket: image.bucket,
      Key: image.key,
    };

    // send remove request to S3
    S3.deleteObject(params, async (err, data) => {
      if (err) {
        console.log(err);
        return res.status(400).send("Image remove failed. Try later.");
      }

      // console.log(data);
      return res.status(200).send(data);
    });
  } catch (err) {
    console.log(err);
  }
};

export const create = async (req, res) => {
  // console.log("CREATE COURSE", req.body);
  // return;

  try {
    const alreadyExist = await Course.findOne({
      slug: slugify(req.body.name.toLowerCase()),
    });
    if (alreadyExist) {
      return res.status(400).send("Title is taken");
    }

    const course = await new Course({
      slug: slugify(req.body.name),
      instructor: req.user._id,
      ...req.body,
    }).save();

    res.json(course);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Course create failed. Try again.");
  }
};

export const read = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug })
      .populate("instructor", "_id name")
      .exec();
    res.json(course);
  } catch (err) {
    console.log(err);
  }
};

export const uploadVideo = async (req, res) => {
  try {
    // console.log("req.user._id", req.user._id);
    // console.log("req.params.instructorId", req.params.instructorId);
    if (req.user._id != req.params.instructorIdß) {
      return res.status(400).send("Unauthorized");
    }

    const { video } = req.files;
    // console.log(video);
    if (!video) return res.status(400).send("No video");

    // video params
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `${nanoid()}.${video.type.split("/")[1]}`,
      Body: readFileSync(video.path),
      ACL: "public-read",
      ContentType: video.type,
    };

    // upload to s3
    S3.upload(params, (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(400);
      }
      console.log(data);
      res.send(data);
    });
  } catch (err) {
    console.log(err);
  }
};

export const removeVideo = async (req, res) => {
  try {
    if (req.user._id != req.params.instructorIdß) {
      return res.status(400).send("Unauthorized");
    }

    const { Bucket, Key } = req.body;
    // console.log("VIDEO REMOVE =====> ", req.body);

    // video params
    const params = {
      Bucket,
      Key,
    };

    // upload to s3
    S3.deleteObject(params, (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(400);
      }
      console.log(data);
      res.send({ ok: true });
    });
  } catch (err) {
    console.log(err);
  }
};

export const addLesson = async (req, re) => {
  try {
    const { slug, instructorId } = req.params;
    const { title, content, video } = req.body;

    if (req.user._id != req.params.instructorId) {
      return res.status(400).send("Unauthorized");
    }

    const updated = await Course.findOneAndUpdate(
      { slug },
      {
        $push: { lessons: { title, content, video, slug: slugify(title) } },
      },
      { new: true }
    )
      .populate("instructor", "_id name")
      .exec();
    res.json(updated);
  } catch (error) {
    console.log(err);
    return res.status(400).send("Add lesson failed");
  }
};
