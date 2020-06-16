const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const Author = mongoose.model('Author', new mongoose.Schema({
  name: String,
  bio: String,
  website: String
}));

const Course = mongoose.model('Course', new mongoose.Schema({
  name: String,
/*
    - We are creating a reference here to the author collection by storing authorId to the course database
    - Although we are creating a reference here,If we store authorId which is invalid mongodb doesnt care. It will sotre anyway
    - Whereas in relational database we can there must be a same referwence in both table
*/
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  }
}));

async function createAuthor(name, bio, website) { 
  const author = new Author({
    name, 
    bio, 
    website 
  });

  const result = await author.save();
  console.log(result);
}

async function createCourse(name, author) {
  const course = new Course({
    name, 
    author
  }); 
  
  const result = await course.save();
  console.log(result);
}

async function listCourses() { 
  const courses = await Course
    .find()
    /*
        - When we created the database we made a relation to author collection
        - So mongoose can automatically retrieve the information from the referenced author table if we use populate method
        - populate(collection_name, 'col_name col_name -(col_name we want to skip)')
    */
    .populate('author','name bio -_id')
    .select('name author');
  console.log(courses);
}

// createAuthor('Mosh', 'My bio', 'My Website');

// createCourse('Node Course', '5ee8993b083f7b2f6cbf7109')

// listCourses();