const Project = require("../models/Project");
const projectValidator = require("../validators/projectValidator");

exports.createProject = async (req, res) => {
  try {
    const { error } = projectValidator.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { name, members } = req.body;

    let project = await Project.findOne({ where: { name } });
    if (project)
      return res
        .status(400)
        .json({ error: `Project with name '${name}' already exists` });

    // TODO: check if all members in the list are valid
    project = await Project.create({
      name,
      members,
    });

    res
      .status(201)
      .json({ message: "Project created successfully!", data: project });
  } catch (error) {
    res.status(500).json({ error });
  }
};
