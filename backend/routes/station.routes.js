import express from 'express';
import * as stationController from '../controllers/station.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import multer from 'multer';

const stationRouter = express.Router({ mergeParams: true });

// Multer initialisation
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 170 * 1024 * 1024, // no larger than 170mb, you can change as needed.
    fieldSize: 3 * 1024 * 1024,
  },
});

// Multer initialisation for excel
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const excel = multer({ storage:storage });

stationRouter.route('/add').post(
  protect,
  upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
  ]),
  stationController.AddChargingStation
);

//? Add token from frontend

stationRouter
  .route('/getall')
  .get( stationController.GetAllChargingStation);



stationRouter
  // Get single station by querying id or get all stations
  .route('/getall-stations')
  .get( stationController.GetAllChargingStationWOFilter);


  
stationRouter
  .route('/delete')
  .delete(protect, stationController.DeleteChargingStations);
stationRouter.route('/edit/:id').put(
  protect,
  upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
  ]),
  stationController.UpdateChargingStation
);

stationRouter
  .route('/upload')
  .post(
    protect,
    excel.single('file'),
    stationController.bulkUploadChargingStations
  );

export default stationRouter;
