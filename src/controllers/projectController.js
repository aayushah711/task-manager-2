// @ts-nocheck
const Project = require("../models/Project");
const User = require("../models/User");
const projectValidator = require("../validators/projectValidator");

exports.createProject = async (req, res) => {
  try {
    const { error } = projectValidator.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { name, description, userIds } = req.body;

    let project = await Project.findOne({ where: { name } });
    if (project)
      return res
        .status(400)
        .json({ error: `Project with name '${name}' already exists` });

    project = await Project.create({
      name,
      description,
    });

    if (userIds) {
      const users = await User.findAll({
        where: {
          id: userIds,
        },
      });

      await project.addUsers(users);
    }

    res
      .status(201)
      .json({ message: "Project created successfully!", data: project });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.fetchUserProjects = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId, { include: "projects" });

    res
      .status(200)
      .json({ message: "fetchUserProjects!", data: user.projects });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.fetchProjectById = async (req, res) => {
  try {
    res.status(200).json({ message: "fetchProjectById!" });
  } catch (error) {
    res.status(500).json({ error });
  }
};
