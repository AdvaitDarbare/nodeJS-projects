const fs = require('fs');

// Load the tours data from the JSON file
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')
);

exports.checkID = (req, res, next, val) => {
    console.log(`Tour id is: ${val}`);

    if(req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }
    next();
}

exports.checkBody = (req, res, next) => {
    if(!req.body.name || !req.body.price){
        return res.status(400).json({
            status: 'failed',
            message: 'Missing name or price'
        })
    }
    next();
}

// Route Handlers

// Handler function to get all tours
exports.getAllTours = (req, res) => {
    console.log(req.requestTime);
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        result: tours.length,
        data: {
            tours
        }
    });
};

// Handler function to get a single tour by ID
exports.getTour = (req, res) => {
    console.log(req.params);

    const id = req.params.id * 1; // Convert id to a number

    // Find the tour with the matching id
    const tour = tours.find(el => el.id === id);



    // If tour is found, return the tour data
    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    }); 
};

// Handler function to create a new tour
exports.createTour = (req, res) => { 
    const newId = tours[tours.length - 1].id + 1; // Generate a new ID based on the last tour's ID
    const newTour = Object.assign({ id: newId }, req.body); // Create a new tour object by merging the new ID with the request body

    tours.push(newTour); // Add the new tour to the array

    // Write the updated tours array back to the JSON file (asynchronously)
    fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        if (err) {
            return res.status(500).json({
                status: 'error',
                message: 'Failed to save the new tour'
            });
        }
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        }); 
    });
};

// Handler function to update an existing tour
exports.updateTour = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here...>'
        }
    });
};

// Handler function to delete a tour
exports.deleteTour = (req, res) => {
   res.status(204).json({
    status: 'success',
    data: null
   });
};