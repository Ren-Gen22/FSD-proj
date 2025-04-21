import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const AddEmployee = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      //eslint-disable-next-line
      const response = await axios.post(
        "https://fsd-proj.onrender.com/employees",
        data,
      );
      alert("Employee added successfully!");
      reset();
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto" }}>
      <h2>Add Employee</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Name:</label>
          <input
            {...register("name", { required: "Name is required" })}
            placeholder="Enter full name"
          />
          <p>{errors.name?.message}</p>
        </div>

        <div>
          <label>Employee ID:</label>
          <input
            {...register("employee_id", {
              required: "Employee ID is required",
              maxLength: { value: 10, message: "Max 10 characters" },
            })}
            placeholder="Enter unique ID"
          />
          <p>{errors.employee_id?.message}</p>
        </div>

        <div>
          <label>Email:</label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^@]+@[^@]+\.[^@]+$/,
                message: "Invalid email format",
              },
            })}
            placeholder="Enter email address"
          />
          <p>{errors.email?.message}</p>
        </div>

        <div>
          <label>Phone Number:</label>
          <input
            {...register("phone_number", {
              required: "Phone number is required",
              pattern: {
                value: /^\d{10}$/,
                message: "Phone number must be 10 digits",
              },
            })}
            placeholder="Enter 10-digit phone number"
          />
          <p>{errors.phone_number?.message}</p>
        </div>

        <div>
          <label>Department:</label>
          <select
            {...register("department", { required: "Department is required" })}
          >
            <option value="">Select</option>
            <option value="HR">HR</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
          </select>
          <p>{errors.department?.message}</p>
        </div>

        <div>
          <label>Date of Joining:</label>
          <input
            type="date"
            {...register("date_of_joining", {
              required: "Date of Joining is required",
              validate: {
                notFutureDate: (value) =>
                  new Date(value) <= new Date() ||
                  "Date cannot be in the future",
              },
            })}
          />
          <p>{errors.date_of_joining?.message}</p>
        </div>

        <div>
          <label>Role:</label>
          <input
            {...register("role", { required: "Role is required" })}
            placeholder="Enter role (e.g., Manager, Developer)"
          />
          <p>{errors.role?.message}</p>
        </div>

        <button type="submit">Submit</button>
        <button type="button" onClick={() => reset()}>
          Reset
        </button>
      </form>
    </div>
  );
};

export default AddEmployee;
