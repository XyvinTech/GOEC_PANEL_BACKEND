'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Checkbox } from './ui/checkbox';
import {
  getCitiesNames,
  getStateNames,
} from '@/lib/functions/country-names-api';
import type { CityType, StateType } from '@/types/country-types';
import { socket_types as socketData } from '@/data/socket-types';
import { Button } from './ui/button';
import ImageDropzone from './image-dropzone';
import ComboBox from './combobox';
import ChargerForm from '@/app/(protected-layout)/add/components/charger-form';
import {
  Charger,
  Station,
  addNewStation,
  getAllStationsWOFilter,
  selectNearByStation,
  selectStatus,
} from '@/lib/features/chargingStations/stationSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import RatingComponent from './rating-star';
import MultiSelectComponent from './multiselect';

type Items = {
  value: string;
  label: string;
};

const socket_types = socketData.map((socket) => ({
  value: socket,
  label: socket,
}));

const InputStationData: React.FC = () => {
  const initialStationData: Station = {
    // _id: '',
    stationName: '',
    goecOnly: false,
    location: {
      address: '',
      city: '',
      state: '',
      country: 'India',
      mapUrl: '',
      coordinates: {
        longitude: 0,
        latitude: 0,
      },
    },
    amenities: {
      restRoom: false,
      restaurant: false,
      hotel: false,
      cafe: false,
      mall: false,
    },
    media: {
      images: [],
      coverImage: [],
    },
    chargers: [
      {
        vehicleType: '',
        socketType: '',
        outputPower: 0,
        rateUnit: '',
      },
    ],
    nearbyStations: [],
    rating: 0,
  };
  const [states, setStates] = useState<Items[]>([]);
  const [cities, setCities] = useState<Items[]>([]);

  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedStations, setSelectedStations] = useState<Items[]>([]);

  const [data, setData] = useState<Station>(initialStationData);
  const apiStatus = useAppSelector(selectStatus);
  const prevStations = useAppSelector(selectNearByStation);
  const dispatch = useAppDispatch();


  const setImage = (file: File) => {
    setData((prevData) => ({
      ...prevData,
      media: {
        ...prevData.media,
        images: [file],
      },
    }));
  };
  const setCoverImage = (file: File) => {
    setData((prevData) => ({
      ...prevData,
      media: {
        ...prevData.media,
        coverImage: [file],
      },
    }));
  };
  const clearImage = () => {
    setData((prevData) => ({
      ...prevData,
      media: {
        ...prevData.media,
        images: [],
      },
    }));
  };

  const clearCoverImage = () => {
    setData((prevData) => ({
      ...prevData,
      media: {
        ...prevData.media,
        coverImage: [],
      },
    }));
  };
  const handleStationNameChange = (e: any) => {
    setData((prevState) => ({
      ...prevState,
      stationName: e.target.value,
    }));
  };

  const handleLocationChange = (e: any) => {
    const { value } = e.target;
    setData((prevState) => ({
      ...prevState,
      location: {
        ...prevState.location,
        address: value,
      },
    }));
  };

  const handleCancel = () => {
    setData(initialStationData);
  };

  const handleGoecOnlyToggleButton = () => {
    setData((prevState) => ({
      ...prevState,
      goecOnly: !prevState.goecOnly,
    }));
  };

  const handleRating = (newRating: number) => {
    setData((prevState) => ({
      ...prevState,
      rating: newRating,
    }));
  };


  const handleRestRoomToggle = () => {
    setData((prevState) => ({
      ...prevState,
      amenities: {
        ...prevState.amenities,
        restRoom: !prevState.amenities.restRoom,
      },
    }));
  };

  const handleRestaurantToggle = () => {
    setData((prevState) => ({
      ...prevState,
      amenities: {
        ...prevState.amenities,
        restaurant: !prevState.amenities.restaurant,
      },
    }));
  };

  const handleHotelToggle = () => {
    setData((prevState) => ({
      ...prevState,
      amenities: {
        ...prevState.amenities,
        hotel: !prevState.amenities.hotel,
      },
    }));
  };

  const handleCafeToggle = () => {
    setData((prevState) => ({
      ...prevState,
      amenities: {
        ...prevState.amenities,
        cafe: !prevState.amenities.cafe,
      },
    }));
  };

  const handleMallToggle = () => {
    setData((prevState) => ({
      ...prevState,
      amenities: {
        ...prevState.amenities,
        mall: !prevState.amenities.mall,
      },
    }));
  };

  const handleLongitudeChange = (e: any) => {
    setData((prevState) => ({
      ...prevState,
      location: {
        ...prevState.location,
        coordinates: {
          ...prevState.location.coordinates,
          longitude: e.target.value,
        },
      },
    }));
  };

  const handleLatitudeChange = (e: any) => {
    setData((prevState) => ({
      ...prevState,
      location: {
        ...prevState.location,
        coordinates: {
          ...prevState.location.coordinates,
          latitude: e.target.value,
        },
      },
    }));
  };

  const handleMapUrlChange = (e: any) => {
    setData((prevState) => ({
      ...prevState,
      location: {
        ...prevState.location,
        mapUrl: e.target.value,
      },
    }));
  };

  const handleStateChange = (state: string) => {
    setData((prevState) => ({
      ...prevState,
      location: {
        ...prevState.location,
        state: state,
      },
    }));

    setSelectedState(state);
  };

  const handleCityChange = (city: string) => {
    setData((prevState) => ({
      ...prevState,
      location: {
        ...prevState.location,
        city: city,
      },
    }));
  };

  const handleNearByChange = (stations: Items[]) => {
    setSelectedStations(stations);

    const selectedStationIds = stations.map(station => station.value);
    setData(prevState => ({
      ...prevState,
      nearbyStations: selectedStationIds,
    }));
  };
  const addCharger = () => {
    setData((prevData) => ({
      ...prevData,
      chargers: [
        ...prevData.chargers,
        { vehicleType: '', socketType: '', outputPower: 0, rateUnit: '' },
      ],
    }));
  };

  const handleChargerChange = (
    chargerIndex: number,
    field: keyof Charger,
    value: string | number
  ) => {
    setData((prevState) => ({
      ...prevState,
      chargers: prevState.chargers.map((charger, index) => {
        if (index === chargerIndex) {
          return { ...charger, [field]: value };
        }
        return charger;
      }),
    }));
  };

  useEffect(() => {
    dispatch(getAllStationsWOFilter(undefined));
  }, [dispatch]);

  useEffect(() => {
    const getStates = async () => {
      const data: StateType[] = await getStateNames('India');
      const modifiedData = data.map((state) => ({
        value: state.state_name,
        label: state.state_name,
      }));
      setStates(modifiedData);
    };

    getStates();
  }, []);

  useEffect(() => {
    const getCities = async () => {
      const data: CityType[] = await getCitiesNames(selectedState);
      const modifiedData = data.map((city) => ({
        value: city.city_name,
        label: city.city_name,
      }));
      setCities(modifiedData);
    };
    getCities();
  }, [data.location.state]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("data--->", data);
    dispatch(addNewStation(data));


  };
  useEffect(() => {
    if (apiStatus === 'idle') {
      setData(initialStationData);
      setSelectedStations([]);
      handleRating(0);

    }
  }, [apiStatus]);

  return (
    <div className='relative w-full overflow-auto'>
      {apiStatus === 'loading' && <p>Loading...</p>}
      <form onSubmit={handleSubmit}>
        <div className='bg-white px-7 py-5 rounded-md shadow-sm'>
          <p className='font-semibold text-base text-[#202223] mb-5'>Media</p>

          <ImageDropzone
            clearImage={clearImage}
            image={
              typeof data.media.images[0] === 'string'
                ? null
                : (data.media.images[0] as File)
            }
            setImage={setImage}
          />
        </div>
        <div className='bg-white px-7 py-5 rounded-md shadow-sm'>
          <p className='font-semibold text-base text-[#202223] mb-5'>
            Cover Image
          </p>

          <ImageDropzone
            clearImage={clearCoverImage}
            image={
              typeof data.media.coverImage[0] === 'string'
                ? null
                : (data.media.coverImage[0] as File)
            }
            setImage={setCoverImage}
          />
        </div>
        <div className='bg-white px-7 py-5 rounded-md shadow-sm mt-5'>
          <p className='font-semibold text-base text-[#202223] mb-5'>General</p>

          <div className='flex flex-col gap-5'>
            <div>
              <label className='text-sm text-[#202223]'>Station name</label>
              <Input
                value={data.stationName}
                onChange={handleStationNameChange}
                placeholder='Enter station name'
              />
            </div>

            <div>
              <label className='text-sm text-[#202223]'>Location</label>
              <Textarea
                value={data.location.address}
                onChange={handleLocationChange}
                className='resize-none'
                placeholder='Enter description'
              />
            </div>

            <div className=' flex justify-between gap-5'>
              <div className='flex-1'>
                <label className='text-sm text-[#202223]'>Country</label>
                <Input value='India' placeholder='Enter coupon code' />
              </div>
              <div className='flex-1 flex flex-col gap-1'>
                <label className='text-sm text-[#202223]'>State</label>
                {/* select */}
                <ComboBox
                  placeholder='Choose State'
                  value={data.location.state}
                  items={states}
                  onChange={(val) => handleStateChange(val)}
                />
              </div>
              <div className='flex-1 flex flex-col gap-1'>
                <label className='text-sm text-[#202223]'>City</label>
                <ComboBox
                  disabled={data.location.state === ''}
                  placeholder='Choose City'
                  value={data.location.city}
                  items={cities}
                  onChange={(val) => handleCityChange(val)}
                />
              </div>
            </div>

            <div className='flex items-center gap-20'>
              <div className=' h-fit flex items-center gap-2'>
                <label className='text-sm text-[#202223]'>Goec only</label>
                <Switch
                  checked={data.goecOnly}
                  onCheckedChange={handleGoecOnlyToggleButton}
                />
              </div>
              <div className=' h-fit flex items-center gap-2'>
                <label className='text-sm text-[#202223]'>Rating</label>
                <RatingComponent
                  maxRating={5}
                  initialRating={data.rating}
                  onRatingChange={(rating) => handleRating(rating)}
                />
              </div>
            </div>
            <div className=' flex justify-between gap-5'>
              <div className='flex-1'>
                <label className='text-sm text-[#202223]'>Longitude</label>
                <Input
                  value={data.location.coordinates.longitude}
                  onChange={handleLongitudeChange}
                  type='text'
                  placeholder='Enter longitude'
                />
              </div>
              <div className='flex-1'>
                <label className='text-sm text-[#202223]'>Latitude</label>
                <Input
                  value={data.location.coordinates.latitude}
                  onChange={handleLatitudeChange}
                  typeof='text'
                  type='text'
                  placeholder='Enter latitude'
                />
              </div>

              <div className='flex-1'>
                <label className='text-sm text-[#202223]'>Map url</label>
                <Input
                  onChange={handleMapUrlChange}
                  value={data.location.mapUrl}
                  type='url'
                  placeholder='  enter your  map url'
                />
              </div>
            </div>

            <div className=' h-fit flex items-center gap-8'>
              <div className=' h-fit flex items-center gap-1'>
                <Checkbox
                  checked={data.amenities.restRoom}
                  onCheckedChange={handleRestRoomToggle}
                  id='restRoom'
                  className='border-[#C9CCCF]'
                />
                <label className='text-sm text-[#202223]' htmlFor='restRoom'>
                  Rest room
                </label>
              </div>
              <div className=' h-fit flex items-center gap-1'>
                <Checkbox
                  checked={data.amenities.restaurant}
                  onCheckedChange={handleRestaurantToggle}
                  className='border-[#C9CCCF]'
                />
                <label
                  id='restaurant'
                  className='text-sm text-[#202223]'
                  htmlFor='restaurant'
                >
                  Restaurant
                </label>
              </div>
              <div className=' h-fit flex items-center gap-1'>
                <Checkbox
                  checked={data.amenities.hotel}
                  onCheckedChange={handleHotelToggle}
                  id='hotel'
                  className='border-[#C9CCCF]'
                />
                <label className='text-sm text-[#202223]' htmlFor='hotel'>
                  Hotel
                </label>
              </div>
              <div className=' h-fit flex items-center gap-1'>
                <Checkbox
                  checked={data.amenities.cafe}
                  onCheckedChange={handleCafeToggle}
                  id='cafe'
                  className='border-[#C9CCCF]'
                />
                <label className='text-sm text-[#202223]' htmlFor='cafe'>
                  Cafe
                </label>
              </div>
              <div className=' h-fit flex items-center gap-1'>
                <Checkbox
                  checked={data.amenities.mall}
                  onCheckedChange={handleMallToggle}
                  id='mall'
                  className='border-[#C9CCCF]'
                />
                <label className='text-sm text-[#202223]' htmlFor='mall'>
                  Mall
                </label>
              </div>
            </div>
          </div>
        </div>
        <ChargerForm
          chargers={data.chargers}
          onChargerChange={handleChargerChange}
          addCharger={addCharger}
        // setChargers={setChargers}
        />
        <p className='font-semibold text-base text-[#202223] my-8 ml-4'>
          Nearby Stations
        </p>

        <div className='bg-white w-fit px-7 py-5 rounded-md shadow-sm mt-5'>
          <p className='font-semibold text-base text-[#202223] mb-5'>
            Select Stations
          </p>

          <MultiSelectComponent
            options={
              Array.isArray(prevStations)
                ? prevStations.map((station) => ({
                  value: station._id!,
                  label: station.stationName,
                }))
                : []
            }
            onChange={
              handleNearByChange
            }
            value={selectedStations}
            placeholder='nearby stations'
          />
        </div>

        <div className='my-8'>
          <hr />
        </div>

        <div className='flex justify-between'>
          <Button
            variant='outline'
            className='bg-transparent border-2 border-red-500 text-red-500'
            type='button'
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button type='submit'>Save</Button>
        </div>
      </form>
    </div>
  );
};

export default InputStationData;
