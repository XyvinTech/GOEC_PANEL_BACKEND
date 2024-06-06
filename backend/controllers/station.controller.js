import getRandomFileName from '../helpers/filename.helper.js';
import getFileFromUrl from '../helpers/getfilefromurl.helper.js';
import asyncHandler from '../middlewares/async.middleware.js';
import ChargingStation from '../models/ChargingStation.js';
import { uploadFile } from '../utils/file.upload.js';
import xlsx from 'xlsx';

export const AddChargingStation = asyncHandler(async (req, res, next) => {
  let imageUrl = '';
  let coverImageUrl = '';
  try {
    const {
      stationName,
      goecOnly,
      location,
      amenities,
      chargers,
      nearbyStations,
      rating,
    } = req.body;

    // Convert stringified location, amenities, and chargers to objects
    const parsedLocation = JSON.parse(location);
    const parsedAmenities = JSON.parse(amenities);
    const parsedChargers = JSON.parse(chargers);

    if (req?.files && req.files['file'] && req.files['file'].length > 0)
      imageUrl = await uploadFile(
        req.files['file'][0],
        'stations',
        getRandomFileName(`${stationName}-`)
      );

    // Upload image for 'coverImage' field and get their URLs

    if (
      req?.files &&
      req.files['coverImage'] &&
      req.files['coverImage'].length > 0
    )
      coverImageUrl = await uploadFile(
        req.files['coverImage'][0],
        'stations',
        getRandomFileName(`${stationName}-cover-`)
      );

    // Map nearby station names to their corresponding IDs
    const nearbyStationIds = JSON.parse(nearbyStations);

    const chargingStationData = {
      stationName,
      location: parsedLocation,
      amenities: parsedAmenities,
      goecOnly,
      chargers: parsedChargers,
      images: [imageUrl],
      coverImage: [coverImageUrl],
      nearbyStations: nearbyStationIds,
      rating: rating,
    };

    const chargingStation = new ChargingStation(chargingStationData);

    await chargingStation.save();

    res.status(201).send({
      success: true,
      data: chargingStation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: 'Server error while creating charging station',
    });
  }
});

export const GetAllChargingStation = asyncHandler(async (req, res, next) => {
  try {
    // Pagination settings
    const page = parseInt(req.query.page, 10) || 1; // page number
    const limit = parseInt(req.query.limit, 10) || 10; // limit per page
    const skip = (page - 1) * limit; // documents to skip

    // Filters
    let query = {};

    query['goecOnly'] = req.query.goecOnly ?? false;

    if (req.query.city) {
      query['location.city'] = { $regex: new RegExp(req.query.city, 'i') };
    }

    if (req.query.state) {
      query['location.state'] = { $regex: new RegExp(req.query.state, 'i') };
    }

    if (req.query.country) {
      query['location.country'] = {
        $regex: new RegExp(req.query.country, 'i'),
      };
    }

    // Fetch paginated charging stations from the database
    const chargingStations = await ChargingStation.find(query)
      .skip(skip)
      .limit(limit);

    // Modify the response to include only the 'public' property of images in the media object
    // const modifiedChargingStations = chargingStations.map((station) => ({
    //   ...station.toJSON(),
    //   media: {
    //     images: station.images.map((image) => image.public),
    //   },
    // }));

    const modifiedChargingStations = await Promise.all(
      chargingStations.map(async (station) => {
        return {
          ...station.toJSON(),
          nearbyStations: station.nearbyStations,
          media: {
            images: station.images.map((image) => image?.public),
            coverImage: station.coverImage.map((image) => image?.public),
          },
        };
      })
    );
    // Get the total number of documents
    const total = await ChargingStation.countDocuments(query);

    // Calculate the total number of pages
    const pages = Math.ceil(total / limit);

    // Send back the paginated list of charging stations
    res.status(200).send({
      success: true,
      count: chargingStations.length,
      page,
      pages,
      data: modifiedChargingStations,
    });
  } catch (error) {
    console.error(error);
    // Send back an error response
    res.status(500).send({
      success: false,
      message: 'Server error while retrieving charging stations',
    });
  }
});

export const GetAllChargingStationForMap = asyncHandler(async (req, res, next) => {
  try {
    let query = {};

    query['goecOnly'] = req.query.goecOnly ?? false;

    if (req.query.city) {
      query['location.city'] = { $regex: new RegExp(req.query.city, 'i') };
    }

    if (req.query.state) {
      query['location.state'] = { $regex: new RegExp(req.query.state, 'i') };
    }

    const chargingStations = await ChargingStation.find(query)

    const modifiedChargingStations = await Promise.all(
      chargingStations.map(async (station) => {
        return {
          ...station.toJSON(),
          nearbyStations: station.nearbyStations,
          media: {
            images: station.images.map((image) => image?.public),
            coverImage: station.coverImage.map((image) => image?.public),
          },
        };
      })
    );

    res.status(200).send({
      success: true,
      data: modifiedChargingStations,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: 'Server error while retrieving charging stations',
    });
  }
});

export const GetAllChargingStationWOFilter = asyncHandler(
  async (req, res, next) => {
    let chargingStations;
    console.log("adsaddsadsa")
    const { id } = req.query;
    try {
      if (id) {
        chargingStations = await ChargingStation.findById({ _id: id });
      } else {
        chargingStations = await ChargingStation.find();
      }

      res.status(200).send({
        success: true,
        data: chargingStations,
      });
    } catch (error) {
      console.error(error);
      // Send back an error response
      res.status(500).send({
        success: false,
        message: 'Server error while retrieving charging stations',
      });
    }
  }
);

export const DeleteChargingStations = async (req, res) => {
  try {
    const { ids } = req.body;
    // Check if the IDs array is provided
    if (!ids || !Array.isArray(ids)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid request body' });
    }
    // Delete charging stations based on the provided IDs
    await ChargingStation.deleteMany({ _id: { $in: ids } });
    res.status(200).json({
      success: true,
      message: 'Charging stations deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting charging stations',
    });
  }
};

export const UpdateChargingStation = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      stationName,
      goecOnly,
      location,
      amenities,
      chargers,
      nearbyStations,
      rating,
    } = req.body;

    // Convert stringified location, amenities, and chargers to objects
    const parsedLocation = JSON.parse(location);
    const parsedAmenities = JSON.parse(amenities);
    const parsedChargers = JSON.parse(chargers);

    // Find the charging station by ID
    const chargingStation = await ChargingStation.findById(id);

    if (!chargingStation) {
      // If the charging station with the given ID is not found, return a 404 error
      res
        .status(404)
        .json({ success: false, message: 'Charging station not found' });
      return;
    }

    console.log('Found charging station', req.files)


    let imageUrl = chargingStation.images[0];
    let coverImageUrl = chargingStation.coverImage[0];

    if (req?.files && req.files['file']) {
      // If a new image is provided in the request, upload it
      imageUrl = await uploadFile(
        req.files['file'][0],
        'stations',
        getRandomFileName(`${stationName}-`)
      );
      chargingStation.images = [imageUrl];
    }

    if (req?.files && req.files['coverImage']) {
      // If a new image is provided in the request, upload it
      coverImageUrl = await uploadFile(
        req.files['coverImage'][0],
        'stations',
        getRandomFileName(`${stationName}-cover`)
      );
      chargingStation.coverImage = [coverImageUrl];
    }
    // Map nearby station names to their corresponding IDs
    const nearbyStationIds = JSON.parse(nearbyStations);
console.log()
    // Remove any null values (stations not found) from the array

    // Update the charging station with the new data
    chargingStation.stationName = stationName;
    chargingStation.goecOnly = goecOnly;
    chargingStation.location = parsedLocation;
    chargingStation.amenities = parsedAmenities;
    chargingStation.chargers = parsedChargers;
    chargingStation.nearbyStations = nearbyStationIds;
    chargingStation.rating = rating;

    // Save the updated charging station
    await chargingStation.save();

    res.status(200).json({
      success: true,
      data: chargingStation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating charging station',
    });
  }
});

export const bulkUploadChargingStations = asyncHandler(async (req, res) => {
  try {
    const url = req.body.url;

    let workbook;
    //CHECK IF THE URL IS THERE FOR LINK UPLOAD
    if (url) {
      const domain = new URL(url).hostname;
      if (
        !ALLOWED_DOMAINS.some((allowedDomain) => domain.endsWith(allowedDomain))
      ) {
        throw new Error(`Invalid URL domain: ${domain}`);
      }
      const file = await getFileFromUrl(url);
      // Parse the spreadsheet data
      workbook = xlsx.read(file, { type: 'buffer' });
    } else {
      workbook = xlsx.readFile(req.file.path);
    }

    const sheetName = workbook.SheetNames[0];

    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    // Iterate over each row in the Excel sheet and create a charging station
    for (const row of data) {
      const chargers = [];
      for (let i = 0; i <= 5; i++) {
        if (row[`VehicleType${i}`]) {
          chargers.push({
            vehicleType: row[`VehicleType${i}`],
            socketType: row[`SocketType${i}`],
            outputPower: row[`OutputPower${i}`],
            rateUnit: row[`RateUnit${i}`],
          });
        }
      }
      const chargingStation = new ChargingStation({
        stationName: row.StationName,
        goecOnly: row.Goec,
        location: {
          address: row.Address,
          city: row.City,
          state: row.State,
          country: row.Country,
          mapUrl: row.Map_url,
          coordinates: {
            longitude: row.Longitude,
            latitude: row.Latitude,
          },
        },
        amenities: {
          restRoom: row.Restroom,
          restaurant: row.Restaurant,
          hotel: row.Hotel,
          cafe: row.Caf_e,
          mall: row.Mall,
        },
        chargers: chargers,
        nearbyStations: [],
        rating: row.Rating,
      });

      await chargingStation.save();
    }

    res.status(201).json({
      success: true,
      message: 'Charging stations created successfully.',
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: 'Failed to create charging stations.' });
  }
});
