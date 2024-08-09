const fs = require('fs');
const express = require('express');

const app = express();  // create an express app

app.use(express.json()); // Middleware to parse the body of the request

// Load the tours data from the JSON file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8'));

// Handler function to get all tours
const getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        result: tours.length,
        data: {
            tours
        }
    });
};

// Handler function to get a single tour by ID
const getTour = (req, res) => {
    console.log(req.params);

    const id = req.params.id * 1; // Convert id to a number

    // Find the tour with the matching id
    const tour = tours.find(el => el.id === id);

    // If no tour is found, return a 404 response
    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    // If tour is found, return the tour data
    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    }); 
};

// Handler function to create a new tour
const createTour = (req, res) => { 
    // console.log(req.body);

    const newId = tours[tours.length - 1].id + 1; // Generate a new ID based on the last tour's ID
    const newTour = Object.assign({ id: newId }, req.body); // Create a new tour object by merging the new ID with the request body

    tours.push(newTour); // Add the new tour to the array

    // Write the updated tours array back to the JSON file (asynchronously)
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
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
const updateTour = (req, res) => {
    const id = req.params.id * 1; // Convert id to a number
    const tour = tours.find(el => el.id === id); // Find the tour by ID

    // If no tour is found, return a 404 response
    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    const updatedTour = Object.assign(tour, req.body); // Update the tour data

    // Write the updated tours array back to the JSON file (asynchronously)
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        if (err) {
            return res.status(500).json({
                status: 'error',
                message: 'Failed to update the tour'
            });
        }
        res.status(200).json({
            status: 'success',
            data: {
                tour: updatedTour
            }
        });
    });
};

// Handler function to delete a tour
const deleteTour = (req, res) => {
    const id = req.params.id * 1; // Convert id to a number
    const tour = tours.find(el => el.id === id); // Find the tour by ID

    // If no tour is found, return a 404 response
    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    const remainingTours = tours.filter(el => el.id !== id); // Filter out the tour to be deleted

    // Write the updated tours array back to the JSON file (asynchronously)
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(remainingTours), err => {
        if (err) {
            return res.status(500).json({
                status: 'error',
                message: 'Failed to delete the tour'
            });
        }
        res.status(204).json({
            status: 'success',
            data: null
        });
    });
};

// Define routes using the app.route method
app.route('/api/v1/tours')
    .get(getAllTours)
    .post(createTour);

app.route('/api/v1/tours/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);

const port = 3000;  // port to listen on  http://localhost:3000

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});  // listen for requests
