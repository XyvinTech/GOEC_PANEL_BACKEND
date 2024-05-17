/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/v1/auth/signup:
 *   post:
 *     summary: Register a new admin
 *     description: This endpoint registers a new admin.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Admin's email
 *               password:
 *                 type: string
 *                 description: Admin's password
 *     responses:
 *       201:
 *         description: Admin successfully registered.
 *       400:
 *         description: Bad request.
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login an existing user
 *     description: This endpoint allows a user to log in.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email
 *               password:
 *                 type: string
 *                 description: User's password
 *     responses:
 *       200:
 *         description: User successfully logged in.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Authentication token
 *       401:
 *         description: Unauthorized.
 */

/**
 * @swagger
 * paths:
 *   /api/v1/station/add:
 *     post:
 *       summary: Add a new charging station
 *       description: This endpoint is for adding a new charging station with its details and image.
 *       tags: [Charging Station]
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 stationName:
 *                   type: string
 *                   description: Name of the charging station
 *                 goecOnly:
 *                   type: boolean
 *                   description: Indicates if the station is GOEC only
 *                 location:
 *                   type: string
 *                   description: JSON string of the location object
 *                 amenities:
 *                   type: string
 *                   description: JSON string of amenities available at the station
 *                 chargers:
 *                   type: string
 *                   description: JSON string of chargers available at the station
 *                 nearbyStations:
 *                   type: string
 *                   description: JSON string array of nearby station names
 *                 file:
 *                   type: string
 *                   format: binary
 *                   description: Image file for the charging station
 *       responses:
 *         201:
 *           description: Charging station successfully added.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                   data:
 *                     $ref: '#/components/schemas/ChargingStation'
 *         400:
 *           description: Bad request, invalid input data.
 *         401:
 *           description: Unauthorized, token missing or invalid.
 *         500:
 *           description: Server error while creating charging station.
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     ChargingStation:
 *       type: object
 *       required:
 *         - stationName
 *         - location
 *       properties:
 *         stationName:
 *           type: string
 *         goecOnly:
 *           type: boolean
 *         location:
 *           type: object
 *           properties:
 *             lat:
 *               type: number
 *               format: float
 *             lng:
 *               type: number
 *               format: float
 *         amenities:
 *           type: array
 *           items:
 *             type: string
 *         chargers:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Charger'
 *         nearbyStations:
 *           type: array
 *           items:
 *             type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *             format: uri
 *     Charger:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *         count:
 *           type: integer
 */

/**
 * @swagger
 * /api/v1/station/getall:
 *   get:
 *     summary: Get all charging stations with optional filtering and pagination
 *     description: Retrieves a paginated list of charging stations based on filter criteria.
 *     tags: [Charging Station]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: goecOnly
 *         schema:
 *           type: boolean
 *         description: Filter by stations exclusively for GOEC members
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city location of the stations
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *         description: Filter by state location of the stations
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: Filter by country location of the stations
 *     responses:
 *       200:
 *         description: List of charging stations fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 pages:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ChargingStation'
 *       400:
 *         description: Bad request due to invalid query parameters.
 *       401:
 *         description: Unauthorized, token missing or invalid.
 *       500:
 *         description: Server error while retrieving charging stations.
 *
 * components:
 *   schemas:
 *     ChargingStation:
 *       type: object
 *       required:
 *         - stationName
 *         - location
 *       properties:
 *         stationName:
 *           type: string
 *         goecOnly:
 *           type: boolean
 *         location:
 *           type: object
 *           properties:
 *             city:
 *               type: string
 *             state:
 *               type: string
 *             country:
 *               type: string
 *             lat:
 *               type: number
 *               format: float
 *             lng:
 *               type: number
 *               format: float
 *         amenities:
 *           type: array
 *           items:
 *             type: string
 *         chargers:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Charger'
 *         nearbyStations:
 *           type: array
 *           items:
 *             type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *             format: uri
 *     Charger:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *         count:
 *           type: integer
 */
/**
 * @swagger
 * /api/v1/station/getall-stations:
 *   get:
 *     summary: Get all charging stations
 *     description: Retrieves a list of all charging stations without any filters.
 *     tags: [Charging Station]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all charging stations fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ChargingStation'
 *       500:
 *         description: Server error while retrieving charging stations.
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     ChargingStation:
 *       type: object
 *       properties:
 *         stationName:
 *           type: string
 *         location:
 *           type: object
 *           properties:
 *             city:
 *               type: string
 *             state:
 *               type: string
 *             country:
 *               type: string
 *             lat:
 *               type: number
 *               format: float
 *             lng:
 *               type: number
 *               format: float
 *         amenities:
 *           type: array
 *           items:
 *             type: string
 *         chargers:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               count:
 *                 type: integer
 *         nearbyStations:
 *           type: array
 *           items:
 *             type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *             format: uri
 */

/**
 * @swagger
 * /api/v1/station/delete:
 *   delete:
 *     summary: Delete multiple charging stations
 *     description: Deletes charging stations based on a list of IDs provided in the request body.
 *     tags: [Charging Station]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of charging station IDs to delete
 *     responses:
 *       200:
 *         description: Charging stations deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid request body. Requires an array of IDs.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error while deleting charging stations.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/v1/station/edit/{id}:
 *   put:
 *     summary: Update a charging station
 *     description: Updates an existing charging station with new details and an optional image upload.
 *     tags: [Charging Station]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the charging station to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               stationName:
 *                 type: string
 *                 description: Name of the charging station
 *               goecOnly:
 *                 type: boolean
 *                 description: Indicates if the station is exclusive to GOEC members
 *               location:
 *                 type: string
 *                 description: JSON string of the location object (lat, lng, city, state, country)
 *               amenities:
 *                 type: string
 *                 description: JSON string of amenities available at the station
 *               chargers:
 *                 type: string
 *                 description: JSON string of chargers available at the station
 *               nearbyStations:
 *                 type: string
 *                 description: JSON string array of nearby station names to be mapped to IDs
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Optional image file for the charging station
 *     responses:
 *       200:
 *         description: Charging station updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/ChargingStation'
 *       404:
 *         description: Charging station not found.
 *       500:
 *         description: Server error while updating the charging station.
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     ChargingStation:
 *       type: object
 *       properties:
 *         stationName:
 *           type: string
 *         goecOnly:
 *           type: boolean
 *         location:
 *           type: object
 *           properties:
 *             lat:
 *               type: number
 *               format: float
 *             lng:
 *               type: number
 *               format: float
 *             city:
 *               type: string
 *             state:
 *               type: string
 *             country:
 *               type: string
 *         amenities:
 *           type: array
 *           items:
 *             type: string
 *         chargers:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               count:
 *                 type: integer
 *         nearbyStations:
 *           type: array
 *           items:
 *             type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *             format: uri
 */
