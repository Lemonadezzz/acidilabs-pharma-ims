import { Button, message, Popconfirm, Spin, Table } from "antd";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import {
  useDeleteVendorMutation,
  useGetVendorsQuery,
} from "../app/features/api/vendorsApiSlice";
import VendorsHeader from "../Components/Vendors/VendorsHeader";

const Vendors = () => {
  const auth = useSelector((state) => state.auth);

  const { data, isLoading } = useGetVendorsQuery();
  const [deleteVendor] = useDeleteVendorMutation();

  if (!auth.permissions.suppliers.includes("R"))
    return (
      <h1 className="text-center mt-24 text-red-300 uppercase">
        You are not authorized to view this page
      </h1>
    );

  // handles
  const handleDelete = (id) => {
    deleteVendor({ id }).then((res) => {
      if (res.data?.success) {
        message.success("Vendor deleted successfully!");
      } else {
        message.error("Something went wrong!");
      }
    });
  };

  // columns for table
  const columns = [
    {
      title: "Name",
      dataIndex: "display_name",
      key: "display_name",
    },
    {
      title: "Company Name",
      dataIndex: "company_name",
      key: "company_name",
      responsive: ["md"],
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Website",
      dataIndex: "website",
      key: "website",
      responsive: ["md"],
    },
    {
      title: "Contact",
      dataIndex: "contact",
      key: "contact",
      responsive: ["md"],
    },
    {
      title: "Action",
      key: "action",
      render: (_, item) => (
        <div>
          <Popconfirm
            placement="bottomRight"
            title={"Are you sure to delete this record?"}
            onConfirm={() => handleDelete(item._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              danger
              className="ml-2"
              disabled={!auth.permissions.suppliers.includes("D")}
            >
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
      responsive: ["md"],
    },
  ];

  return (
    <main className="mt-14 p-2 md:p-4 max-w-[1800px] mx-auto">
      <VendorsHeader />

      {isLoading && (
        <div className="mt-8 mx-auto flex justify-center items-center min-h-[500px]">
          <Spin size="large" />
        </div>
      )}
      {!isLoading && (
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={data.vendors}
          className="mt-4 md:mt-8"
          pagination={false}
          key={(item) => item._id}
        />
      )}
    </main>
  );
};

export default Vendors;
