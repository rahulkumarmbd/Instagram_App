import { Checkbox } from "antd";

export const EventCart = ({ event }) => {
  return (
    <div className="cart">
      <h2>{event.title.toUpperCase()}</h2>
      <p>
        {event.description.slice(0, 1).toUpperCase() +
          event.description.slice(1)}
      </p>
      <div>Category:{event.category}</div>
      <div>Date: {String(event.date).slice(0, 10)}</div>
      <div>
      <Checkbox checked={event.isVirtual} /> : IsVirtual
      </div>
      <div>Address: {event.address}</div>
    </div>
  );
};
