import { Notification, toaster } from "rsuite";

const Notific = (type, header, message) => {
  toaster.push(
    <Notification type={type} header={header}>
      {message}
    </Notification>,
    { placement: "topEnd" } // You can adjust the placement as needed
  );
};

export { Notific };