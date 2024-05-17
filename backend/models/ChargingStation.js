import mongoose from 'mongoose';

const ChargerInfoSchema = new mongoose.Schema({
  vehicleType: { type: String },
  socketType: { type: String },
  outputPower: { type: Number },
  rateUnit: { type: String },
});

const ChargingStationSchema = new mongoose.Schema(
  {
    stationName: {
      type: String,
      required: true,
    },
    location: {
      address: {
        type: String,
        required: true,
      },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      coordinates: {
        longitude: { type: Number },
        latitude: { type: Number },
      },
      mapUrl: { type: String },
    },
    amenities: {
      restRoom: { type: Boolean, default: false },
      restaurant: { type: Boolean, default: false },
      hotel: { type: Boolean, default: false },
      cafe: { type: Boolean, default: false },
      mall: { type: Boolean, default: false },
    },
    goecOnly: {
      type: Boolean,
      default: true,
    },

    images: [Object],

    coverImage: [Object],

    chargers: [ChargerInfoSchema],
    nearbyStations: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'ChargingStation' },
    ],
    rating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model('ChargingStation', ChargingStationSchema);
