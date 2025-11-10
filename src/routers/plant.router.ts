import express from "express";

import { getAllPlants, getPlant, getPlantsByUserId, createNewPlant, deletePlant, updatePlant } from '../controllers/plant.controller.js';
import { isLoggedIn, isOwner, upload } from "../middleware/index.js";

const router = express.Router();

router.route('/getPlants').get(isLoggedIn, getAllPlants);
router.route('/getPlant/:id').get(isLoggedIn, getPlant);
router.route('/getPlantsByUserId/:id').get(isLoggedIn, isOwner, getPlantsByUserId);
router.route('/createNewPlant').post(isLoggedIn, upload.single('image') , createNewPlant);
router.route('/deletePlant/:id').delete(isLoggedIn, isOwner, deletePlant);
router.route('/updatePlant/:id').patch(isLoggedIn, isOwner, updatePlant);

export default router;