import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { EventCart } from "./EventCart";
import { Button, Input, Pagination } from "antd";
import { Paginate } from "./Paginate";
import { Select } from "antd";
const { Option } = Select;

const helper = (obj) => {
  
};

const initFilterState = {
  title: "",
  address: "",
  isVirtual: null,
  category: null,
};

export const Home = () => {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [{ title, address, isVirtual, category }, setFilter] =
    useState(initFilterState);

  const searchResults = () => {
    const obj = helper({ title, address, isVirtual, category });
    const result = new URLSearchParams(obj).toString();
    axios
      .get(`http://localhost:2001/events?limit=2&page=${page}&${result}`)
      .then(({ data }) => {
        setEvents(data.events);
        setTotalPages(data.totalPages);
        setCategories(data.categories);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    searchResults();
  }, [page]);

  return (
    <>
      <div className="filter-container">
        <Input
          size="large"
          placeholder="Filter by Title"
          name="title"
          value={title}
          onChange={(e) => {
            setFilter((prev) => {
              return { ...prev, title: e.target.value };
            });
          }}
        />
        <Input
          size="large"
          placeholder="Filter by address"
          name="address"
          value={address}
          onChange={(e) => {
            setFilter((prev) => {
              return { ...prev, address: e.target.value };
            });
          }}
        />
        <Select
          style={{
            width: 520,
          }}
          size="large"
          placeholder="Filter by mode"
          name="isVirtual"
          value={isVirtual}
          onChange={(value) => {
            setFilter((prev) => {
              return { ...prev, isVirtual: value };
            });
          }}
        >
          <Option value={true}>Virtual</Option>
          <Option value={false}>Physical</Option>
        </Select>
        <Select
          style={{
            width: 520,
          }}
          size="large"
          placeholder="Filter by category"
          value={category}
          onChange={(value) => {
            setFilter((prev) => {
              return { ...prev, category: value };
            });
          }}
        >
          {categories.map((categoryObj) => {
            return (
              <option value={categoryObj.category} key={categoryObj.id}>
                {categoryObj.category}
              </option>
            );
          })}
        </Select>
        <Button type="primary" size="large" onClick={searchResults}>
          Filter
        </Button>
      </div>
      <div className="cart-container">
        {events.map((event) => {
          return <EventCart key={event._id} event={event} />;
        })}
      </div>
      <div style={{ margin: "20px" }}>
        <Paginate pageCount={totalPages} getFunction={setPage} />
      </div>
    </>
  );
};
