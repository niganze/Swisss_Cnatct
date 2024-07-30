// controllers/projectController.js

import Project from '../models/Project.js';
import { v2 as cloudinary } from 'cloudinary';

export async function getProjects(req, res) {
    try {
        const projects = await Project.find().populate('school');

        res.json(projects);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

export async function addProject(req, res) {
    const { project_name, project_owner, school } = {...req.body};
let project_file;
    try {
        // if (!req.file) {
        //     return res.status(400).json({ message: 'Project file is required' });
        // }

     
        if (req.files && req.files.project_file) {
            console.log("-------------------------------------------------")
        project_file = (await cloudinary.uploader.upload(
              req.files.project_file[0].path
            )).secure_url
            console.log( (await cloudinary.uploader.upload(
              req.files.project_file[0].path
            )).secure_url)
          }
        const project = new Project({
            project_name,
            project_owner,
            project_file,
            school
        });

        await project.save();
        res.json(project);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

export async function editProject(req, res) {
    const { id } = req.params;
    const { project_name, project_owner, school_id } = req.body;
    try {
        let project = await Project.findById(id);
        if (!project) return res.status(404).json({ msg: 'Project not found' });

        project.project_name = project_name || project.project_name;
        project.project_owner = project_owner || project.project_owner;
        project.school_id = school_id || project.school_id;

     
        if (req.files && req.files.project_file) {
            project.project_file = (await cloudinary.uploader.upload(
              req.files.project_file[0].path
            )).secure_url
            console.log( (await cloudinary.uploader.upload(
              req.files.project_file[0].path
            )).secure_url)
          }

        await project.save();
        res.json(project);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

export async function deleteProject(req, res) {
    const { id } = req.params;
    try {
        let project = await Project.findById(id);
        if (!project) return res.status(404).json({ msg: 'Project not found' });

        await project.remove();
        res.json({ msg: 'Project removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

export async function setProjectStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;
    try {
        let project = await Project.findById(id);
        if (!project) return res.status(404).json({ msg: 'Project not found' });

        project.status = status;
        await project.save();
        res.json(project);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

export async function downloadProjectFile(req, res) {
    const { id } = req.params;
    try {
        let project = await Project.findById(id);
        if (!project) return res.status(404).json({ msg: 'Project not found' });

        res.redirect(project.project_file);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}
