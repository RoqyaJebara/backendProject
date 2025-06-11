import * as moduleModel from '../models/moduleModel.js';

export const getModules = async (req, res) => {
  const modules = await moduleModel.getModulesByCourseId(req.params.courseId);
  res.json(modules);
};
// moduleController.js

export const getModule=async(req, res)=> {
  const { Id } = req.params;

  try {
    console.log("controller"
      +Id
    );
    
    const moduleData = await moduleModel.getModuleById(parseInt(Id));

    if (!moduleData) {
      return res.status(404).json({ message: "Module not found" });
    }

    res.json(moduleData);
  } catch (error) {
    console.error("Error getting module:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export const createModule = async (req, res) => {
  const module = await moduleModel.createModule(req.params.courseId, req.body);
  res.status(201).json(module);
};

export const updateModule = async (req, res) => {
  const module = await moduleModel.updateModule(req.params.id, req.body);
  res.json(module);
};

export const deleteModule = async (req, res) => {
  await moduleModel.deleteModule(req.params.id);
  res.status(204).send();
};
