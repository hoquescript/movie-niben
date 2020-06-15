const genres = require("./routes/genres");
const mongoose = require("mongoose");
const express = require("express");
// const app = express();

// app.use(express.json());
// app.use('/api/genres', genres);

// const port = process.env.PORT || 3000;
// app.listen(port, () => console.log(`Listening on port ${port}...`));

mongoose
    .connect("mongodb://localhost/playground")
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log(err);
    });

//Schema creation
//Shapes of Document
//Logical representation
const courseSchema = new mongoose.Schema({
    //This validation is done by mongoose,MongoDB doesnt handle validation
    name: {
        type: 'String', 
        required: true,
        minlength: 5,
        maxlength: 30,
        match: /.*/,
    },
    category: {
        type: String,
        enum: ['web', 'data'],
        //! Arrow function cant be used here,Because it will refer to the mongoose object as it a callback
        required: function() {return this.isPublished} 
    },
    author: String,
    tags: {
        type: 'Array',
        required: true, 
        isAsync: false,
        validate: {
            validator: function(v){
                /*
                    *! We can perform async task here
                    *! isAsync should be set to true
                    *! 
                */
                return v && v.length > 0
            },
            message: 'There should be atleast one tag'
        }
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    isPublished: Boolean,
});

//Model Creation
//We are creating a class based on the above schema.
//This will return a class or prototypal function
const Course = mongoose.model("Course", courseSchema);

async function createCourse() {
    //Creating an instance of the object Course
    const course = new Course({
        // name: "VUEJS Course",
        author: "Rakib",
        category: 'web',
        tags: [],
        isPublished: true,
    });

    //Saving data to the database
    //Saving data is a asycn operation
    try{
        const result = await course.save();
        // console.log(result);
    }
    catch(e){
        //? If required field is not provided
        console.log(e)
    }

    //*Another Way

    // try{
    //     //It doesnt returens boolean instead a callback is required to pass
    //     await course.validate((err) => {
    //         if(err){ }
    //     })
    // }
    // catch(e){
    //     //? If required field is not provided
    //     console.log(e)
    // }

    
}

createCourse()

async function getCourse() {
    const data = await Course.find({ author: { $eq: "Rakib" }, name: /^VUE/ }) //! $eq, neq, in, nin, gt, gte, lt, lte
        // .or([{ author: "Wahid" }, { name: "VUEJS Course" }]) //! or, and
        .sort({ name: 1 })
        .limit(2)
        .select({ name: 1, tags: 1 })
        .count();
    console.log(data);
}

// getCourse();

async function updateCourse(id) {
    /**
     *? Approach: Query first
     *? findById()
     *? Modify its properties
     *? save()
     */
    // const data = await Course.findById(id)

    // // data.author = 'Wakil';
    // data.set({
    //     author: 'Suvashini'
    // })
    // data.save()

    /**
     *? Approach: Update first
     *? Update Directly
     *? Optional: Get the updated documents
     */
    //*To update the result only
    // const result = await Course.update(
    //     { _id: id },
    //     {
    //         $set: {
    //             author: "Wakil Hoque",
    //         },
    //     }
    // );
    // console.log(result);

    //* Update the data as well as retrieve document
    const data = await Course.findByIdAndUpdate(
        id,
        {
            $set: {
                author: "Wahid Hoque",
            },
        },
        { new: true } //? To return the updated document.
    );
    console.log(data);
}

// updateCourse("5ee4c817a10f9e32ac7b1706");


async function removeCourse(id){
    // await Course.deleteOne({_id: id}) //! It deletes one
    // await Course.findByIdAndRemove(id) //! It performs same task as the upper one
    // Course.deleteOne({isPublished: 'false'}) //! It deletes the first one of being isPublished- false
    // Course.deleteMany({isPublished: 'false'}) //! It deletes many
}

// removeCourse("5ee4c817a10f9e32ac7b1706");
