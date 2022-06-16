import { DatePicker, Input, Checkbox, Button } from "antd";
import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
const initState = {
  title: "",
  description: "",
  category: "",
  date: "",
  isVirtual: false,
  address: "",
};

export const CreateEvent = () => {
  const [event, setEvent] = useState(initState);
  const navigate = useNavigate();

  const handleChange = (e) => {
    let { name, value, checked } = e.target;
    value = name === "isVirtual" ? checked : value;
    setEvent({ ...event, [name]: value });
  };

  const handleSubmit = async () => {
    if (
      !event.address ||
      !event.isVirtual ||
      !event.date ||
      !event.description ||
      !event.category ||
      !event.title
    ) {
      toast.error("Please enter required fields");
    }
    try {
      const { data } = await axios.post("http://localhost:2001/events", event);
      toast.success("Event created successfully");
      setEvent(initState);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="createCart">
      <Input
        placeholder="Enter title"
        value={event.title}
        onChange={handleChange}
        size="large"
        name="title"
      />
      <Input
        placeholder="Enter description"
        value={event.description}
        onChange={handleChange}
        size="large"
        name="description"
      />
      <Input
        placeholder="Enter category"
        value={event.category}
        onChange={handleChange}
        size="large"
        name="category"
      />
      <DatePicker
        size="large"
        onChange={(e, date) => {
          setEvent({ ...event, date });
        }}
      />
      <Checkbox
        checked={event.isVirtual}
        onChange={handleChange}
        size="large"
        name="isVirtual"
      >
        is Virtual
      </Checkbox>
      <Input
        placeholder="Enter address"
        value={event.address}
        onChange={handleChange}
        size="large"
        name="address"
      />
      <Button type="primary" size="large" onClick={handleSubmit}>
        Create
      </Button>
    </div>
  );
};
