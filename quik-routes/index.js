const Joi = require('joi');
const express = require('express');
const app = express();

// use json parsing in the request handling pipeline
app.use(express.json());


const courses = [
	{id: 1, name: 'course1'},
	{id: 2, name: 'course2'},
	{id: 3, name: 'course3'},
	{id: 4, name: 'course4'},
];
app.get('/', (req, res) => {
	res.send('hello world!!!');
});

app.get('/api/courses', (req, res) => {
	res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
	// res.send(req.params);
	// find course
	let course = courses.find(course => course.id === parseInt(req.params.id));
	// if its not there, give a 404
	if (!course) {
		res.status(404).send('course with the given ID was not found');
		return;
	}
	res.send(course)
});


app.post('/api/courses', (req, res) => {


	const result = validateCourse(req.body);
	if(result.error) {
		res.status(400).send(result.error.details[0].message);
		return;
	}
	// vvv this is a manual validation
	// if (!req.body.name || req.body.name.length < 3) {
	// 	// return a 400 in this case
	// 	res.status(400).send('Name is required and should be at least 3 characters long');
	// 	return;
	// }

	let course = {
		id: courses.length + 1,
		name: req.body.name,
	};
	courses.push(course);
	res.send(course);
});


app.put('/api/courses/:id', (req, res) => {
	// search for course
	 // if it does not exist, return 404
	 let course = courses.find(course => course.id === parseInt(req.params.id));
	 if (!course) {
	 	res.status(404).send('The course with the provided ID was not found');
	 	return;
	 }
	 // validate request using validateCourse method
	 // if invalid, return 400
	 const result = validateCourse(req.body);
	 if (result.error) {
	 	res.status(400).send(result.error.details[0].message);
	 	return; 
	 }
	 // update course
	 // return updated course
	 course.name = req.body.name;
	 res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
	// find course
	// not existing return 404
	const course = courses.find(course => course.id === parseInt(req.params.id));
	if (!course) {
		res.status(404).send('the course with the given ID was not found')
		return;
	}
	// delete
	const index = courses.indexOf(course);
	// look in the courses array, remove one object from the array given the index position
	courses.splice(index, 1);
	// return deleted course
	res.send(course);
});
// Production Environment has an ENV variable PORT which you could use instead of 3001
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`listening on port ${port}`));


function validateCourse(course) {
	// joi validation. call the joi class and give it the validation specifications
	// call joi, pass the body of the request and compare it against the schema
	const schema = {
		name: Joi.string().min(3).required()
	}
	return Joi.validate(course, schema);
}