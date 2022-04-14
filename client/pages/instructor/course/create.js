import { useState, useEffect } from "react";
import InstructorRoute from "../../../components/routes/InstructorRoute";

import CourseCreateForm from "../../../components/forms/CourseCreateForm";

const CourseCreate = () => {
  // state
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "9.99",
    uploading: false,
    paid: true,
    category: "",
    loading: false,
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleImage = () => {
    setPreview(window.URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(values);
  };

  return (
    <InstructorRoute>
      <h1 className="jumbotron text-center square">Create Course</h1>
      <div className="pt-3 pb-3">
        <CourseCreateForm
          handleSubmit={handleSubmit}
          handleImage={handleImage}
          handleChange={handleChange}
          values={values}
          setValues={setValues}
          preview={preview}
        />
      </div>
    </InstructorRoute>
  );
};

export default CourseCreate;
